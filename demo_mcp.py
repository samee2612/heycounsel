#!/usr/bin/env python3
"""HeyCounsel MCP Demo Runner
Demonstrates how external AI models and MCP clients invoke HeyCounsel's legal tools.
"""
import sys
import os

backend_path = os.path.join(os.path.dirname(__file__), "backend")
sys.path.insert(0, backend_path)

import mcp_server

def main():
    print("=" * 65)
    print("HEYCOUNSEL MODEL CONTEXT PROTOCOL (MCP) INTERFACE DEMO")
    print("=" * 65)
    
    print("\n[1] Invoking MCP Tool: search_hive_mind('California non-compete notice')")
    result = mcp_server.search_hive_mind("California non-compete notice", "Employment Law")
    print(result)

    print("\n" + "=" * 65)
    print("[2] Invoking MCP Tool: match_co_counsel('Intellectual Property', 'San Diego, CA')")
    lawyer_match = mcp_server.match_co_counsel("Intellectual Property", "San Diego, CA")
    print(lawyer_match)

    print("\n" + "=" * 65)
    print("MCP Tool invocation completed successfully with zero external API calls!")

if __name__ == "__main__":
    main()
