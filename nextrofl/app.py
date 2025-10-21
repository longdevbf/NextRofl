#!/usr/bin/env python3
import http.server
import socketserver
import json
import subprocess
import os
import sys
import traceback

PORT = 8080
CONTRACT_ADDRESS = os.environ.get('CONTRACT_ADDRESS', '4B9c329FDF246391849eC0dc65318445FfD2141F')

def get_method_id(signature):
    if signature == "mintNFT(address,string)":
        return "a0712d68"
    return "00000000"

def encode_mint_nft(recipient, metadata_uri):
    method = get_method_id("mintNFT(address,string)")
    recipient_clean = recipient.replace('0x', '').lower()
    recipient_padded = recipient_clean.zfill(64)
    
    # Offset to string data (64 bytes = 0x40)
    offset = "0000000000000000000000000000000000000000000000000000000000000040"
    
    uri_length = format(len(metadata_uri), '064x')
    uri_hex = metadata_uri.encode('utf-8').hex()
    
    # Pad to 32-byte boundary
    remainder = len(uri_hex) % 64
    if remainder != 0:
        padding = 64 - remainder
        uri_hex_padded = uri_hex + ("0" * padding)
    else:
        uri_hex_padded = uri_hex
    
    tx_data = f"{method}{recipient_padded}{offset}{uri_length}{uri_hex_padded}"
    return tx_data

def process_mint(body):
    try:
        data = json.loads(body)
        recipient = data.get('recipient')
        metadata_uri = data.get('metadataUri')
        
        if not recipient or not metadata_uri:
            print("[ERROR] Missing required fields", file=sys.stderr, flush=True)
            return {'status': 'error', 'message': 'Missing required fields'}
        
        print(f"[INFO] Minting for: {recipient}", file=sys.stderr, flush=True)
        print(f"[INFO] Metadata: {metadata_uri}", file=sys.stderr, flush=True)
        
        tx_data = encode_mint_nft(recipient, metadata_uri)
        print(f"[DEBUG] TX Data: 0x{tx_data}", file=sys.stderr, flush=True)
        
        # Check if socket exists first
        socket_path = '/run/rofl-appd.sock'
        if not os.path.exists(socket_path):
            error_msg = f"Socket {socket_path} does not exist!"
            print(f"[FATAL] {error_msg}", file=sys.stderr, flush=True)
            return {
                'status': 'error',
                'message': error_msg,
                'debug': 'ROFL service may not be running'
            }
        
        # Call ROFL API với format request chính xác
        rofl_request = {
            "tx": {
                "kind": "evm",  # Changed from "eth" to "evm"
                "data": {
                    "gas_limit": 500000,  # Increased gas limit
                    "to": f"0x{CONTRACT_ADDRESS}",
                    "value": "0",  # String instead of number
                    "data": f"0x{tx_data}"
                }
            }
        }
        
        print(f"[DEBUG] ROFL request: {json.dumps(rofl_request, indent=2)}", file=sys.stderr, flush=True)
        print(f"[DEBUG] Calling ROFL API...", file=sys.stderr, flush=True)
        
        result = subprocess.run(
            ['curl', '-s', '--unix-socket', socket_path,
             '-H', 'Content-Type: application/json',
             '-d', json.dumps(rofl_request),
             'http://localhost/rofl/v1/tx/sign-submit'],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        print(f"[DEBUG] curl return code: {result.returncode}", file=sys.stderr, flush=True)
        print(f"[DEBUG] stdout: {result.stdout}", file=sys.stderr, flush=True)
        print(f"[DEBUG] stderr: {result.stderr}", file=sys.stderr, flush=True)
        
        if result.returncode != 0:
            return {
                'status': 'error',
                'message': 'Failed to call ROFL API',
                'debug': {
                    'returncode': result.returncode,
                    'stderr': result.stderr,
                    'stdout': result.stdout
                }
            }
        
        # Parse response
        if not result.stdout.strip():
            return {
                'status': 'error',
                'message': 'Empty response from ROFL API',
                'debug': 'Check if ROFL service is running'
            }
        
        try:
            response = json.loads(result.stdout)
            tx_hash = response.get('tx_hash')
            
            if tx_hash:
                print(f"[OK] TX Hash: {tx_hash}", file=sys.stderr, flush=True)
                return {
                    'status': 'success',
                    'txHash': tx_hash,
                    'recipient': recipient
                }
            else:
                error_msg = response.get('error', 'Transaction failed')
                print(f"[FAIL] Error: {error_msg}", file=sys.stderr, flush=True)
                return {
                    'status': 'error',
                    'message': error_msg,
                    'response': response
                }
        except json.JSONDecodeError as e:
            print(f"[ERROR] JSON decode failed: {e}", file=sys.stderr, flush=True)
            print(f"[ERROR] Raw response: {result.stdout}", file=sys.stderr, flush=True)
            
            # Check if it's an HTML error page (422)
            if '422' in result.stdout or 'Unprocessable Entity' in result.stdout:
                return {
                    'status': 'error',
                    'message': 'ROFL API rejected the transaction (422)',
                    'details': 'Check contract address, gas limit, and transaction data encoding',
                    'raw_response': result.stdout[:500]
                }
            
            return {
                'status': 'error',
                'message': 'Invalid ROFL response',
                'raw_response': result.stdout[:500],
                'debug': str(e)
            }
            
    except subprocess.TimeoutExpired:
        print("[ERROR] ROFL API timeout", file=sys.stderr, flush=True)
        return {
            'status': 'error',
            'message': 'Request timeout'
        }
    except Exception as e:
        print(f"[ERROR] Exception: {str(e)}", file=sys.stderr, flush=True)
        traceback.print_exc()
        return {
            'status': 'error',
            'message': str(e),
            'traceback': traceback.format_exc()
        }

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        sys.stderr.write("%s - - [%s] %s\n" %
                        (self.address_string(),
                         self.log_date_time_string(),
                         format%args))
        sys.stderr.flush()
    
    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS, GET')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(b'{"status":"ok"}')
    
    def do_GET(self):
        if self.path == '/' or self.path == '/health':
            socket_exists = os.path.exists('/run/rofl-appd.sock')
            
            self.send_response(200)
            self.send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {
                'status': 'ready',
                'service': 'ROFL NFT Minter',
                'rofl_socket_exists': socket_exists,
                'socket_path': '/run/rofl-appd.sock',
                'contract_address': f'0x{CONTRACT_ADDRESS}'
            }
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status":"error","message":"Not found"}')
    
    def do_POST(self):
        if self.path == '/mint':
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length).decode('utf-8')
                
                print(f"[REQUEST] POST /mint", file=sys.stderr, flush=True)
                print(f"[BODY] {body}", file=sys.stderr, flush=True)
                
                result = process_mint(body)
                
                self.send_response(200)
                self.send_cors_headers()
                self.send_header('Content-Type', 'application/json')
                response_body = json.dumps(result).encode()
                self.send_header('Content-Length', len(response_body))
                self.end_headers()
                self.wfile.write(response_body)
            except Exception as e:
                print(f"[ERROR] Request handling failed: {e}", file=sys.stderr, flush=True)
                traceback.print_exc()
                self.send_response(500)
                self.send_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                error_response = {
                    'status': 'error',
                    'message': 'Internal server error',
                    'debug': str(e)
                }
                self.wfile.write(json.dumps(error_response).encode())
        else:
            self.send_response(404)
            self.send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status":"error","message":"Not found"}')

if __name__ == '__main__':
    try:
        print("[INFO] =====================================", file=sys.stderr, flush=True)
        print("[INFO] ROFL NFT Minter Starting", file=sys.stderr, flush=True)
        print(f"[INFO] Contract: 0x{CONTRACT_ADDRESS}", file=sys.stderr, flush=True)
        print(f"[INFO] Port: {PORT}", file=sys.stderr, flush=True)
        
        socket_path = '/run/rofl-appd.sock'
        if os.path.exists(socket_path):
            print(f"[OK] Socket exists: {socket_path}", file=sys.stderr, flush=True)
        else:
            print(f"[WARN] Socket NOT found: {socket_path}", file=sys.stderr, flush=True)
            print("[WARN] ROFL service may not be running!", file=sys.stderr, flush=True)
        
        print("[INFO] =====================================", file=sys.stderr, flush=True)
        
        socketserver.TCPServer.allow_reuse_address = True
        
        with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
            print(f"[INFO] Server running on port {PORT}", file=sys.stderr, flush=True)
            httpd.serve_forever()
    except Exception as e:
        print(f"[FATAL] Server failed to start: {e}", file=sys.stderr, flush=True)
        traceback.print_exc()
        sys.exit(1)