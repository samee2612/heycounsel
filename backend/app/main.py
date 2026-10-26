from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, SessionLocal, get_db
from .models import Lawyer, Resource, Referral
from .schemas import (
    LawyerResponse,
    LawyerCreate,
    ResourceResponse,
    ResourceCreate,
    SearchQuery,
    SearchResponse,
    SearchResultItem,
    ReferralResponse,
    ReferralCreate
)
from .search_engine import search_engine
from .seed_data import seed_database

# Initialize database schema
Base.metadata.create_all(bind=engine)

def init_app_state():
    db = SessionLocal()
    try:
        seed_database(db)
        all_resources = db.query(Resource).all()
        search_engine.index_resources(all_resources)
    finally:
        db.close()

# Ensure data is loaded on import as well
init_app_state()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_app_state()
    yield

app = FastAPI(
    title="HeyCounsel Platform API",
    description="Backend services for independent lawyers: Hive Mind AI knowledge base, co-counsel matching, and MCP integration.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "HeyCounsel Platform API",
        "environment": "San Diego, CA (Independent Counsel Hub)",
        "features": ["Hive Mind Knowledge Base", "Lawyer Matching", "MCP Protocol"]
    }

# --- Hive Mind Knowledge Base Endpoints ---

@app.get("/api/resources", response_model=List[ResourceResponse])
def get_resources(practice_area: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Resource)
    if practice_area and practice_area != "All":
        query = query.filter(Resource.practice_area.ilike(f"%{practice_area}%"))
    return query.order_by(Resource.downloads_count.desc()).all()

@app.get("/api/resources/{resource_id}", response_model=ResourceResponse)
def get_resource(resource_id: int, db: Session = Depends(get_db)):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found in Hive Mind")
    return resource

@app.post("/api/resources", response_model=ResourceResponse)
def create_resource(resource_in: ResourceCreate, db: Session = Depends(get_db)):
    db_resource = Resource(**resource_in.model_dump())
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    # Refresh search index
    all_resources = db.query(Resource).all()
    search_engine.index_resources(all_resources)
    return db_resource

@app.post("/api/search", response_model=SearchResponse)
def search_hive_mind(search_req: SearchQuery, db: Session = Depends(get_db)):
    results_meta = search_engine.search(
        query=search_req.query,
        practice_area=search_req.practice_area,
        top_k=search_req.top_k
    )

    items: List[SearchResultItem] = []
    matched_resources = []

    for item in results_meta:
        res = db.query(Resource).filter(Resource.id == item["id"]).first()
        if res:
            matched_resources.append(res)
            items.append(SearchResultItem(
                resource=res,
                score=item["score"],
                relevance_reason=item["relevance_reason"],
                highlight_snippet=item["snippet"]
            ))

    synthesis = search_engine.synthesize_answer(search_req.query, matched_resources)

    return SearchResponse(
        query=search_req.query,
        total_found=len(items),
        ai_synthesis=synthesis,
        results=items
    )

# --- Lawyer & Co-Counsel Matching Endpoints ---

@app.get("/api/lawyers", response_model=List[LawyerResponse])
def get_lawyers(
    specialty: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Lawyer)
    if specialty and specialty != "All":
        query = query.filter(Lawyer.specialties.ilike(f"%{specialty}%"))
    if location:
        query = query.filter(Lawyer.location.ilike(f"%{location}%"))
    return query.order_by(Lawyer.rating.desc()).all()

@app.get("/api/lawyers/{lawyer_id}", response_model=LawyerResponse)
def get_lawyer(lawyer_id: int, db: Session = Depends(get_db)):
    lawyer = db.query(Lawyer).filter(Lawyer.id == lawyer_id).first()
    if not lawyer:
        raise HTTPException(status_code=404, detail="Lawyer not found")
    return lawyer

@app.post("/api/referrals", response_model=ReferralResponse)
def create_referral(referral_in: ReferralCreate, db: Session = Depends(get_db)):
    lawyer = db.query(Lawyer).filter(Lawyer.id == referral_in.target_lawyer_id).first()
    if not lawyer:
        raise HTTPException(status_code=404, detail="Target lawyer not found")
    
    db_referral = Referral(**referral_in.model_dump())
    db.add(db_referral)
    db.commit()
    db.refresh(db_referral)
    return db_referral

@app.get("/api/referrals", response_model=List[ReferralResponse])
def list_referrals(db: Session = Depends(get_db)):
    return db.query(Referral).order_by(Referral.created_at.desc()).all()

@app.patch("/api/referrals/{referral_id}/accept", response_model=ReferralResponse)
def accept_referral(referral_id: int, db: Session = Depends(get_db)):
    referral = db.query(Referral).filter(Referral.id == referral_id).first()
    if not referral:
        raise HTTPException(status_code=404, detail="Referral not found")
    referral.status = "accepted"
    db.commit()
    db.refresh(referral)
    return referral

# --- MCP (Model Context Protocol) Introspection ---

@app.get("/api/mcp/info")
def get_mcp_info():
    """Returns available Model Context Protocol tools and schemas for client agents."""
    return {
        "protocol_version": "2024-11-05",
        "server_name": "heycounsel-hive-mind-mcp",
        "description": "Enables external AI agents (e.g. Claude, Cursor, Antigravity) to query HeyCounsel's legal knowledge base and find vetted independent co-counsel.",
        "tools": [
            {
                "name": "search_hive_mind",
                "description": "Semantic search over community-contributed California legal briefs, checklists, and contract clauses in the Hive Mind.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "The legal question, statutory concept, or clause need (e.g., 'California SB 699 non-compete notice')"},
                        "practice_area": {"type": "string", "description": "Optional filter: 'Employment Law', 'Civil Litigation', 'Intellectual Property', 'Corporate'"}
                    },
                    "required": ["query"]
                }
            },
            {
                "name": "match_co_counsel",
                "description": "Find vetted independent attorneys in California / San Diego specializing in specific practice domains.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "practice_area": {"type": "string", "description": "Desired legal specialization"},
                        "location": {"type": "string", "description": "Location filter (defaults to San Diego, CA)"}
                    },
                    "required": ["practice_area"]
                }
            },
            {
                "name": "get_legal_template",
                "description": "Retrieve full text and practice notes for a specific legal resource by ID.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "resource_id": {"type": "integer", "description": "The unique resource ID in the Hive Mind"}
                    },
                    "required": ["resource_id"]
                }
            }
        ]
    }
