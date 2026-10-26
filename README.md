# HeyCounsel: Independent Counsel Hub & Hive Mind

A full-stack prototype engineered specifically for **HeyCounsel**, demonstrating the exact tech stack and architectural requirements highlighted for the role:

* **Backend**: Python 3.13, FastAPI, SQLAlchemy 2.0 (PostgreSQL compatible), Pydantic v2
* **AI Knowledge Engine**: "The Hive Mind" with zero-cost local semantic search, clause snippet extraction, and AI synthesis
* **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons
* **Protocol Standard**: Model Context Protocol (MCP) server integration (`mcp` SDK) allowing external AI assistants (Cursor, Claude, Antigravity) to query HeyCounsel's legal collective intelligence directly.

---

## Key Features

1. **The Hive Mind (AI Knowledge Base)**:
   - Search peer-reviewed California legal precedents, checklists, and contract clauses.
   - Live semantic vector similarity scoring with snippet extraction.
   - Synthesizes key legal takeaways across community contributions.
   - Preloaded with authentic San Diego Superior Court CMC rules, California non-compete guides (SB 699 & AB 1076), AI vendor indemnification clauses, and Series Seed term sheets.

2. **Lawyer-to-Lawyer Matching & Referrals**:
   - Directory of vetted independent attorneys across San Diego County (La Jolla, Downtown, Mission Valley, Carlsbad).
   - Filter by practice area (Corporate, IP, Employment, Civil Litigation, Health Tech).
   - Dispatch referral and co-counsel requests directly through the UI.

3. **Model Context Protocol (MCP) Server**:
   - Exposes tools `search_hive_mind`, `match_co_counsel`, and `get_legal_template`.
   - Built-in interactive MCP Inspector tab to test JSON-RPC payloads in real time.

---

## Quick Start (Run in 1 Command)

### Single-command Startup:
```bash
./start.sh
```
This runs:
- **FastAPI Backend**: `http://localhost:8000` (Interactive Swagger docs: `http://localhost:8000/docs`)
- **Next.js Frontend**: `http://localhost:3000`

---

## Running MCP Standalone or In Terminal

To test the MCP tools directly:
```bash
./backend/venv/bin/python demo_mcp.py
```

To configure Claude Desktop or Cursor to connect to this server, add to your MCP client configuration:
```json
{
  "mcpServers": {
    "heycounsel": {
      "command": "/Users/sameeksharane/Desktop/heycounsel/backend/venv/bin/python",
      "args": ["/Users/sameeksharane/Desktop/heycounsel/backend/mcp_server.py"]
    }
  }
}
```

---

## Running Automated Tests

```bash
cd backend
PYTHONPATH=. ./venv/bin/pytest tests/
```
All 7 test suites verify:
- API health and environment metadata
- Hive Mind knowledge indexing and retrieval
- Semantic search and synthesis
- Lawyer filtering and co-counsel referral dispatch
- MCP tool definition introspection

---
