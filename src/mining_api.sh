#!/usr/bin/env bash

trap "exit" INT TERM ERR
trap "kill 0" EXIT

./cleanstate.sh

# Start the nodes.
NODE_PORT=3000
NODE_URL="http://localhost:${NODE_PORT}"

#node ../dist/app.js &

#sleep 2

# Submit 2 transactions to the node.
echo -e && read -n 1 -s -r -p "Submitting transactions. Press any key to continue..." && echo -e

curl -X POST -H "Content-Type: application/json" -d '{
 "senderAddress": "Alice",
 "recipientAddress": "Bob",
 "value": "500"
}' "${NODE_URL}/transactions" -w "\n"

curl -X POST -H "Content-Type: application/json" -d '{
 "senderAddress": "Bob",
 "recipientAddress": "Eve",
 "value": "200"
}' "${NODE_URL}/transactions" -w "\n"

# Mine one block.
echo -e && read -n 1 -s -r -p "Mining first block. Press any key to continue..." && echo -e

curl -X POST -H "Content-Type: application/json" "${NODE_URL}/blocks/mine" -w "\n"

# Mine another block.
echo -e && read -n 1 -s -r -p "Mining second block. Press any key to continue..." && echo -e

curl -X POST -H "Content-Type: application/json" "${NODE_URL}/blocks/mine" -w "\n"

wait
