#!/bin/sh
# filepath: /home/longdz/nextrofl/app.sh
set -x

# Tạo named pipe để communication
mkfifo /tmp/rofl_commands 2>/dev/null || true

# Function để encode ABI cho mintNFT(address,string)
encode_mint_nft() {
    local recipient="$1"
    local metadata_uri="$2"
    
    # Method signature: mintNFT(address,string) -> Keccak4 hash
    method="eacabe14" # Simplified - trong thực tế cần tính chính xác
    
    # Clean address (remove 0x prefix và pad to 32 bytes)
    recipient_clean=$(echo "$recipient" | sed 's/^0x//')
    recipient_padded=$(printf '%064s' "$recipient_clean" | tr ' ' '0')
    
    # Offset cho string parameter (sau address = 0x40 = 64 bytes)
    offset="0000000000000000000000000000000000000000000000000000000000000040"
    
    # String length (simplified encoding)
    uri_length=$(printf '%064x' ${#metadata_uri})
    
    # Convert string to hex và pad
    uri_hex=$(echo -n "$metadata_uri" | xxd -p | tr -d '\n')
    uri_hex_padded=$(printf '%-64s' "$uri_hex" | tr ' ' '0')
    
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
    
    echo "[DEBUG] Transaction data: $tx_data"
    
    # Submit transaction
    response=$(curl -s \
      --json '{"tx": {"kind": "eth", "data": {"gas_limit": 300000, "to": "'${CONTRACT_ADDRESS}'", "value": 0, "data": "'${tx_data}'"}}}' \
      --unix-socket /run/rofl-appd.sock \
      http://localhost/rofl/v1/tx/sign-submit)

    echo "Submit Response: $response"
    
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

# Simple HTTP server để nhận mint requests
start_http_server() {
    while true; do
        echo "Starting HTTP server on port 8080..."
        
        # Sử dụng nc để tạo HTTP server
        request=$(echo -e "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Methods: POST, OPTIONS\r\nAccess-Control-Allow-Headers: Content-Type\r\n\r\n" | nc -l -p 8080 -q 1)
        
        # Check if it's a POST request to /mint
        if echo "$request" | grep -q "POST /mint"; then
            echo "[INFO] Received mint request"
            
            # Extract JSON body từ request
            body=$(echo "$request" | tail -n 1)
            
            if [ -n "$body" ]; then
                process_mint_command "$body"
                
                # Trả response
                cat /tmp/last_result 2>/dev/null || echo '{"status":"processing"}'
            else
                echo '{"status":"error","message":"No request body"}'
            fi
            
        elif echo "$request" | grep -q "OPTIONS"; then
            # Handle CORS preflight
            echo '{"status":"ok"}'
            
        else
            echo '{"status":"error","message":"Invalid endpoint. Use POST /mint"}'
        fi
        
        sleep 1
    done
}

# Initialize result file
echo '{"status":"ready"}' > /tmp/last_result

echo "[INFO] Starting ROFL NFT Minter..."
echo "[INFO] Contract Address: ${CONTRACT_ADDRESS}"

# Start HTTP server in background
start_http_server &

# Main loop
while true; do
    echo "[INFO] NFT Minter ROFL container running..."
    echo "[INFO] Listening for mint requests on port 8080"
    sleep 60
done