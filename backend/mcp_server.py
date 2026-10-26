#!/usr/bin/env python3
"""HeyCounsel MCP (Model Context Protocol) Server
Exposes the Hive Mind legal knowledge base and co-counsel matching as standard MCP tools
for AI assistants, agents, and IDEs (Cursor, Claude Desktop, Antigravity, etc.).
"""

import sys
import os
import json

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from mcp.server.mcpserver import MCPServer
from app.database import engine, Base, SessionLocal
from app.models import Lawyer, Resource
from app.search_engine import search_engine
from app.seed_data import seed_database

# Ensure database tables exist
Base.metadata.create_all(bind=engine)

# Initialize database connection and warm search engine
db = SessionLocal()
seed_database(db)
all_resources = db.query(Resource).all()
search_engine.index_resources(all_resources)

# Create MCP Server instance
mcp = MCPServer("heycounsel-hive-mind")

@mcp.tool()
def search_hive_mind(query: str, practice_area: str = "") -> str:
    """Search community-contributed California & San Diego legal precedents, checklists, and contract clauses in the HeyCounsel Hive Mind.
    
    Args:
        query: The legal concept, statutory topic, or clause (e.g., 'California non-compete notice' or 'San Diego fast track CMC')
        practice_area: Optional filter like 'Employment Law', 'Civil Litigation', 'Intellectual Property', 'Corporate'
    """
    filter_area = practice_area if practice_area else None
    results = search_engine.search(query=query, practice_area=filter_area, top_k=3)
    
    if not results:
        return f"No matching documents found in HeyCounsel Hive Mind for '{query}'."

    output_lines = [f"=== HeyCounsel Hive Mind Search Results for '{query}' ==="]
    
    for r in results:
        doc = db.query(Resource).filter(Resource.id == r["id"]).first()
        if doc:
            output_lines.append(f"\n[ID: {doc.id}] {doc.title}")
            output_lines.append(f"Practice Area: {doc.practice_area} | Jurisdiction: {doc.jurisdiction}")
            output_lines.append(f"Author: {doc.author.name if doc.author else 'Community Counsel'}")
            output_lines.append(f"Summary: {doc.summary}")
            output_lines.append(f"Key Clause Snippet: \"{r['snippet']}\"")
            output_lines.append("-" * 40)

    return "\n".join(output_lines)

@mcp.tool()
def match_co_counsel(practice_area: str, location: str = "San Diego, CA") -> str:
    """Find vetted independent attorneys in San Diego & California for co-counseling or referral.
    
    Args:
        practice_area: The required legal domain (e.g. 'IP', 'Litigation', 'Corporate', 'Employment')
        location: City/region filter (defaults to 'San Diego, CA')
    """
    query = db.query(Lawyer)
    if practice_area:
        query = query.filter(Lawyer.specialties.ilike(f"%{practice_area}%"))
    if location:
        query = query.filter(Lawyer.location.ilike(f"%{location}%"))
        
    lawyers = query.order_by(Lawyer.rating.desc()).limit(5).all()
    if not lawyers:
        return f"No independent counsel currently matching '{practice_area}' in '{location}'."

    output = [f"=== Matched Co-Counsel in {location} ({practice_area}) ==="]
    for lawyer in lawyers:
        output.append(f"\n* {lawyer.name} ({lawyer.bar_number}) - {lawyer.firm_name}")
        output.append(f"  Location: {lawyer.location}")
        output.append(f"  Specialties: {lawyer.specialties}")
        output.append(f"  Rate: ${lawyer.hourly_rate}/hr | Rating: {lawyer.rating}/5.0 | Exp: {lawyer.years_experience} yrs")
        output.append(f"  Bio: {lawyer.bio}")

    return "\n".join(output)

@mcp.tool()
def get_legal_template(resource_id: int) -> str:
    """Retrieve full text and practice notes for a specific legal template or checklist in the Hive Mind.
    
    Args:
        resource_id: The ID of the legal resource to view
    """
    doc = db.query(Resource).filter(Resource.id == resource_id).first()
    if not doc:
        return f"Resource ID {resource_id} not found in the Hive Mind."

    return f"""=== HEYCOUNSEL HIVE MIND DOCUMENT ===
Title: {doc.title}
Practice Area: {doc.practice_area}
Jurisdiction: {doc.jurisdiction}
Author: {doc.author.name if doc.author else 'Community Contributor'} ({doc.author.firm_name if doc.author else ''})
Downloads: {doc.downloads_count} | Upvotes: {doc.upvotes}

--- CONTENT & CLAUSE TEMPLATE ---
{doc.content}
"""

if __name__ == "__main__":
    print("Starting HeyCounsel MCP Server via standard transport...", file=sys.stderr)
    mcp.run()
