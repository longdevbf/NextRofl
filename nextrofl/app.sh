#!/bin/sh
# filepath: /home/longdz/nextrofl/app.sh
set -x

# Function để tính method ID
get_method_id() {
    local signature="$1"
    case "$signature" in
        "mintNFT(address,string)")
            echo "a0712d68"  # Keccak256 hash của mintNFT(address,string), lấy 4 bytes đầu
            ;;
        *)
            echo "00000000"
            ;;
    esac
}

# Function để encode ABI cho mintNFT(address,string)
encode_mint_nft() {
    local recipient="$1"
    local metadata_uri="$2"
    
    # Tính method ID chính xác
    method=$(get_method_id "mintNFT(address,string)")
    
    # Clean address (remove 0x prefix và pad to 32 bytes)
    recipient_clean=$(echo "$recipient" | sed 's/^0x//')
    recipient_padded=$(printf '%064s' "$recipient_clean" | tr ' ' '0')
    
    # Offset cho string parameter (0x40 = 64 bytes)
    offset="0000000000000000000000000000000000000000000000000000000000000040"
    
    # String length in hex (padded to 32 bytes)
    uri_length=$(printf '%064x' ${#metadata_uri})
    
    # Convert string to hex
    uri_hex=$(echo -n "$metadata_uri" | xxd -p | tr -d '\n')
    
    # Pad string hex to multiple of 64 characters (32 bytes)
    remainder=$((${#uri_hex} % 64))
    if [ $remainder -ne 0 ]; then
        padding=$((64 - remainder))
        uri_hex_padded="${uri_hex}$(printf '%*s' $padding '' | tr ' ' '0')"
    else
        uri_hex_padded="$uri_hex"
    fi
    
    echo "${method}${recipient_padded}${offset}${uri_length}${uri_hex_padded}"
}

# Function để process mint command
process_mint_command() {
    local command="$1"
    echo "[INFO] Processing mint command: $command"
    
    # Parse JSON
    recipient=$(echo "$command" | jq -r '.recipient // empty')
    metadata_uri=$(echo "$command" | jq -r '.metadataUri // empty')
    
    if [ -z "$recipient" ] || [ -z "$metadata_uri" ]; then
        echo "[ERROR] Missing recipient or metadataUri"
        echo '{"status":"error","message":"Missing required fields"}' > /tmp/last_result
        return 1
    fi
    
    echo "[INFO] Minting NFT for recipient: $recipient with metadata: $metadata_uri"
    
    # Encode transaction data
    tx_data=$(encode_mint_nft "$recipient" "$metadata_uri")
    
    echo "[DEBUG] Transaction data: 0x$tx_data"
    
    # Submit transaction to ROFL
    response=$(curl -s \
      --unix-socket /run/rofl-appd.sock \
      -H "Content-Type: application/json" \
      -d "{\"tx\": {\"kind\": \"eth\", \"data\": {\"gas_limit\": 300000, \"to\": \"${CONTRACT_ADDRESS}\", \"value\": 0, \"data\": \"0x${tx_data}\"}}}" \
      http://localhost/rofl/v1/tx/sign-submit)

    echo "[DEBUG] Submit Response: $response"
    
    tx_hash=$(echo "$response" | jq -r '.tx_hash // empty')
    if [ -n "$tx_hash" ]; then
        echo "[OK] NFT Mint transaction submitted. TxHash: $tx_hash"
        echo "{\"status\":\"success\",\"txHash\":\"$tx_hash\",\"recipient\":\"$recipient\"}" > /tmp/last_result
    else
        echo "[FAIL] NFT Mint transaction failed!"
        error_msg=$(echo "$response" | jq -r '.error // "Transaction failed"')
        echo "{\"status\":\"error\",\"message\":\"$error_msg\"}" > /tmp/last_result
    fi
}

# Function để handle HTTP request
handle_http_request() {
    local request="$1"
    
    # Extract request line
    local request_line=$(echo "$request" | head -n 1)
    local method=$(echo "$request_line" | awk '{print $1}')
    local path=$(echo "$request_line" | awk '{print $2}')
    
    echo "[DEBUG] Method: $method, Path: $path"
    
    # Handle OPTIONS (CORS preflight)
    if [ "$method" = "OPTIONS" ]; then
        echo "HTTP/1.1 204 No Content"
        echo "Access-Control-Allow-Origin: *"
        echo "Access-Control-Allow-Methods: POST, OPTIONS"
        echo "Access-Control-Allow-Headers: Content-Type"
        echo ""
        return
    fi
    
    # Handle POST /mint
    if [ "$method" = "POST" ] && [ "$path" = "/mint" ]; then
        # Extract body (after empty line)
        local body=$(echo "$request" | sed -n '/^$/,${p;/^$/d;}')
        
        echo "[DEBUG] Request body: $body"
        
        if [ -n "$body" ]; then
            process_mint_command "$body"
            
            # Send response with result
            echo "HTTP/1.1 200 OK"
            echo "Content-Type: application/json"
            echo "Access-Control-Allow-Origin: *"
            echo ""
            cat /tmp/last_result 2>/dev/null || echo '{"status":"processing"}'
        else
            # No body error
            echo "HTTP/1.1 400 Bad Request"
            echo "Content-Type: application/json"
            echo "Access-Control-Allow-Origin: *"
            echo ""
            echo '{"status":"error","message":"No request body"}'
        fi
        return
    fi
    
    # Unknown endpoint
    echo "HTTP/1.1 404 Not Found"
    echo "Content-Type: application/json"
    echo "Access-Control-Allow-Origin: *"
    echo ""
    echo '{"status":"error","message":"Invalid endpoint. Use POST /mint"}'
}

# HTTP server với proper request handling
start_http_server() {
    echo "[INFO] Starting HTTP server on port 8080..."
    
    while true; do
        # Listen for connection and capture full request
        {
            # Read request into variable
            request=""
            while IFS= read -r line; do
                request="${request}${line}"$'\n'
                # Break on empty line (end of headers)
                [ -z "$(echo "$line" | tr -d '\r')" ] && break
            done
            
            # Read body if Content-Length present
            content_length=$(echo "$request" | grep -i "Content-Length:" | awk '{print $2}' | tr -d '\r')
            if [ -n "$content_length" ]; then
                body=$(head -c "$content_length")
                request="${request}${body}"
            fi
            
            # Handle request and send response
            handle_http_request "$request"
            
        } | nc -l -p 8080 -q 1
        
        # Small delay before next listen
        sleep 0.1
    done
}

# Initialize
echo '{"status":"ready"}' > /tmp/last_result

echo "[INFO] ====================================="
echo "[INFO] Starting ROFL NFT Minter"
echo "[INFO] Contract Address: ${CONTRACT_ADDRESS}"
echo "[INFO] Listening on port 8080"
echo "[INFO] ====================================="

# Start HTTP server
start_http_server