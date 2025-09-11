#!/bin/sh
set -x

while true; do

    random_value=$(shuf -i 1-1000000 -n 1)

    if [ -z "$random_value" ]; then
        random_value=$(($(date +%s) % 1000000 + 1))
    fi

    printf "Contract Address: %s\n" "${CONTRACT_ADDRESS}"
    echo "Generated Random Value: $random_value"

    value_u128=$(printf '%064x' ${random_value})
    method="c7281403" # Keccak4("submitTransactionByRofl(uint128)")
    data="${method}${value_u128}"

    echo "Method signature: $method"
    echo "Formatted value: $value_u128"
    echo "Full calldata: $data"

    response=$(curl -s \
      --json '{"tx": {"kind": "eth", "data": {"gas_limit": 200000, "to": "'${CONTRACT_ADDRESS}'", "value": 0, "data": "'${data}'"}}}' \
      --unix-socket /run/rofl-appd.sock \
      http://localhost/rofl/v1/tx/sign-submit)

    echo "Submit Response: $response"

    tx_hash=$(echo "$response" | jq -r '.tx_hash // empty')
    if [ -n "$tx_hash" ]; then
        echo "[OK] Transaction submitted successfully. TxHash: $tx_hash"
    else
        echo "[FAIL] No tx_hash in response!"
        error=$(echo "$response" | jq -r '.error // empty')
        if [ -n "$error" ]; then
            echo "Error: $error"
        fi
    fi

    sleep 30
done