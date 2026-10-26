from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict

# Lawyer Schemas
class LawyerBase(BaseModel):
    name: str
    bar_number: str
    firm_name: str
    location: str
    specialties: str
    hourly_rate: int
    bio: str
    years_experience: int
    avatar_url: Optional[str] = None
    verified: bool = True
    rating: float = 4.9

class LawyerCreate(LawyerBase):
    pass

class LawyerResponse(LawyerBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Hive Mind Resource Schemas
class ResourceBase(BaseModel):
    title: str
    practice_area: str
    document_type: str
    summary: str
    content: str
    jurisdiction: str
    tags: str
    author_id: Optional[int] = None

class ResourceCreate(ResourceBase):
    pass

class ResourceResponse(ResourceBase):
    id: int
    downloads_count: int
    upvotes: int
    created_at: datetime
    author: Optional[LawyerResponse] = None
    model_config = ConfigDict(from_attributes=True)

# Search Schemas
class SearchQuery(BaseModel):
    query: str
    practice_area: Optional[str] = None
    jurisdiction: Optional[str] = None
    top_k: int = 5

class SearchResultItem(BaseModel):
    resource: ResourceResponse
    score: float
    relevance_reason: str
    highlight_snippet: str

class SearchResponse(BaseModel):
    query: str
    total_found: int
    ai_synthesis: str
    results: List[SearchResultItem]

# Referral Schemas
class ReferralCreate(BaseModel):
    client_matter: str
    practice_area: str
    jurisdiction: str = "San Diego, CA"
    estimated_value: str = "$10,000 - $25,000"
    notes: Optional[str] = None
    target_lawyer_id: int

class ReferralResponse(BaseModel):
    id: int
    client_matter: str
    practice_area: str
    jurisdiction: str
    estimated_value: str
    notes: Optional[str]
    status: str
    target_lawyer_id: int
    target_lawyer: Optional[LawyerResponse] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
