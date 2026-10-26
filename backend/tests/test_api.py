import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "San Diego" in data["environment"]

def test_get_resources():
    response = client.get("/api/resources")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    assert any("Non-Compete" in r["title"] for r in data)

def test_search_hive_mind():
    payload = {
        "query": "California non-compete SB 699",
        "top_k": 3
    }
    response = client.post("/api/search", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_found"] > 0
    assert "Hive Mind Synthesis" in data["ai_synthesis"]
    assert "Non-Compete" in data["results"][0]["resource"]["title"]

def test_get_lawyers():
    response = client.get("/api/lawyers")
    assert response.status_code == 200
    lawyers = response.json()
    assert len(lawyers) >= 5
    assert any("San Diego" in l["location"] for l in lawyers)

def test_lawyer_filtering():
    response = client.get("/api/lawyers?specialty=Intellectual Property")
    assert response.status_code == 200
    lawyers = response.json()
    assert len(lawyers) >= 1
    assert "Elena Rostova" in [l["name"] for l in lawyers]

def test_create_referral():
    lawyers = client.get("/api/lawyers").json()
    target_id = lawyers[0]["id"]
    payload = {
        "client_matter": "Biotech Series A Advisory",
        "practice_area": "Corporate",
        "jurisdiction": "San Diego, CA",
        "estimated_value": "$20,000",
        "notes": "Fast-track consultation needed",
        "target_lawyer_id": target_id
    }
    response = client.post("/api/referrals", json=payload)
    assert response.status_code == 200
    assert response.json()["client_matter"] == "Biotech Series A Advisory"

def test_mcp_info():
    response = client.get("/api/mcp/info")
    assert response.status_code == 200
    data = response.json()
    assert data["server_name"] == "heycounsel-hive-mind-mcp"
    tool_names = [t["name"] for t in data["tools"]]
    assert "search_hive_mind" in tool_names
    assert "match_co_counsel" in tool_names
