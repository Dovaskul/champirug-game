#!/usr/bin/env python3
"""
Simple HTTP Server for Champirug Game
Stable server implementation to serve the game files
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

def start_server(port=8000):
    """Start HTTP server in the current directory"""
    try:
        # Change to the game directory
        game_dir = Path(__file__).parent.absolute()
        os.chdir(game_dir)
        
        # Create handler
        handler = http.server.SimpleHTTPRequestHandler
        
        # Start server
        with socketserver.TCPServer(("", port), handler) as httpd:
            server_url = f"http://localhost:{port}"
            print(f"=== MUSHROOM JUMP 8-BIT SERVER ===")
            print(f"Server running at: {server_url}")
            print(f"Serving from: {game_dir}")
            print(f"Press Ctrl+C to stop the server")
            print("=" * 40)
            
            # Open browser automatically
            try:
                webbrowser.open(server_url)
                print(f"Opening game in browser...")
            except Exception as e:
                print(f"Could not open browser automatically: {e}")
                print(f"Please open {server_url} in your browser")
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except OSError as e:
        if e.errno == 10048:  # Port already in use
            print(f"Port {port} is already in use. Trying port {port + 1}...")
            start_server(port + 1)
        else:
            print(f"Error starting server: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port number: {sys.argv[1]}. Using default port 8000.")
    
    start_server(port)