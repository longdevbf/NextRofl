#!/bin/sh
# filepath: /home/longdz/nextrofl/app.sh

get_method_id() {
    case "$1" in
        "mintNFT(address,string)") echo "a0712d68" ;;
        *) echo "00000000" ;;
    esac
}

encode_mint_nft() {
    local recipient="$1"
    local metadata_uri="$2"
    
    method=$(get_method_id "mintNFT(address,string)")
    recipient_clean=$(echo "$recipient" | sed 's/^0x//')
    recipient_padded=$(printf '%064s' "$recipient_clean" | tr ' ' '0')
    offset="0000000000000000000000000000000000000000000000000000000000000040"
    uri_length=$(printf '%064x' ${#metadata_uri})
    uri_hex=$(echo -n "$metadata_uri" | xxd -p | tr -d '\n')
    
    remainder=$((${#uri_hex} % 64))
    if [ $remainder -ne 0 ]; then
        padding=$((64 - remainder))
        uri_hex_padded="${uri_hex}$(printf '%*s' $padding '' | tr ' ' '0')"
    else
        uri_hex_padded="$uri_hex"
    fi
    
    echo "${method}${recipient_padded}${offset}${uri_length}${uri_hex_padded}"
}

process_mint() {
    local body="$1"
    
    recipient=$(echo "$body" | jq -r '.recipient // empty')
    metadata_uri=$(echo "$body" | jq -r '.metadataUri // empty')
    
    if [ -z "$recipient" ] || [ -z "$metadata_uri" ]; then
        echo '{"status":"error","message":"Missing required fields"}'
        return
    fi
    
    echo "[INFO] Minting for: $recipient" >&2
    echo "[INFO] Metadata: $metadata_uri" >&2
    
    tx_data=$(encode_mint_nft "$recipient" "$metadata_uri")
    echo "[DEBUG] TX Data: 0x$tx_data" >&2
    
    response=$(curl -s --unix-socket /run/rofl-appd.sock \
      -H "Content-Type: application/json" \
      -d "{\"tx\":{\"kind\":\"eth\",\"data\":{\"gas_limit\":300000,\"to\":\"0x${CONTRACT_ADDRESS}\",\"value\":0,\"data\":\"0x${tx_data}\"}}}" \
      http://localhost/rofl/v1/tx/sign-submit)
    
    echo "[DEBUG] ROFL Response: $response" >&2
    
    tx_hash=$(echo "$response" | jq -r '.tx_hash // empty')
    if [ -n "$tx_hash" ]; then
        echo "[OK] TX Hash: $tx_hash" >&2
        echo "{\"status\":\"success\",\"txHash\":\"$tx_hash\",\"recipient\":\"$recipient\"}"
    else
        error_msg=$(echo "$response" | jq -r '.error // "Transaction failed"')
        echo "[FAIL] Error: $error_msg" >&2
        echo "{\"status\":\"error\",\"message\":\"$error_msg\"}"
    fi
}

echo "[INFO] ====================================="
echo "[INFO] ROFL NFT Minter Starting"
echo "[INFO] Contract: 0x${CONTRACT_ADDRESS}"
echo "[INFO] Port: 8080"
echo "[INFO] ====================================="

while true; do
    nc -l -p 8080 -q 1 | (
        # Read request line
        read method path version
        
        echo "[REQUEST] $method $path" >&2
        
        # Read headers
        content_length=0
        while read header; do
            header=$(echo "$header" | tr -d '\r')
            [ -z "$header" ] && break
            
            case "$header" in
                Content-Length:*)
                    content_length=$(echo "$header" | awk '{print $2}' | tr -d '\r')
                    ;;
            esac
        done
        
        # Read body if present
        body=""
        if [ "$content_length" -gt 0 ]; then
            body=$(dd bs=1 count=$content_length 2>/dev/null)
        fi
        
        # Build response
        response_body=""
        status="404 Not Found"
        
        case "$method:$path" in
            OPTIONS:*)
                status="200 OK"
                response_body='{"status":"ok"}'
                ;;
            POST:/mint)
                status="200 OK"
                if [ -n "$body" ]; then
                    response_body=$(process_mint "$body")
                else
                    response_body='{"status":"error","message":"No body"}'
                fi
                ;;
            GET:/|GET:/health)
                status="200 OK"
                response_body='{"status":"ready","service":"ROFL NFT Minter"}'
                ;;
            GET:/favicon.ico|GET:/robots.txt)
                status="204 No Content"
                response_body=""
                ;;
            *)
                status="404 Not Found"
                response_body='{"status":"error","message":"Not found"}'
                ;;
        esac
        
        # Calculate content length
        content_len=${#response_body}
        
        # Send response
        printf "HTTP/1.1 %s\r\n" "$status"
        printf "Access-Control-Allow-Origin: *\r\n"
        printf "Access-Control-Allow-Methods: POST, OPTIONS, GET\r\n"
        printf "Access-Control-Allow-Headers: Content-Type\r\n"
        printf "Content-Type: application/json\r\n"
        printf "Content-Length: %d\r\n" "$content_len"
        printf "Connection: close\r\n"
        printf "\r\n"
        printf "%s" "$response_body"
    )
    
    sleep 0.1
done