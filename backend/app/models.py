from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

def utcnow():
    return datetime.now(timezone.utc)

class Lawyer(Base):
    __tablename__ = "lawyers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    bar_number = Column(String(50), nullable=False, unique=True)
    firm_name = Column(String(150), nullable=False)
    location = Column(String(100), default="San Diego, CA", index=True)
    specialties = Column(String(255), nullable=False, index=True)  # Comma-separated or tags
    hourly_rate = Column(Integer, default=450)
    bio = Column(Text, nullable=False)
    years_experience = Column(Integer, default=8)
    avatar_url = Column(String(255), nullable=True)
    verified = Column(Boolean, default=True)
    rating = Column(Float, default=4.9)
    created_at = Column(DateTime, default=utcnow)

    resources = relationship("Resource", back_populates="author", cascade="all, delete-orphan")
    referrals_received = relationship("Referral", foreign_keys="Referral.target_lawyer_id", back_populates="target_lawyer")

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    practice_area = Column(String(100), nullable=False, index=True)
    document_type = Column(String(100), nullable=False) # e.g. "Brief", "Contract Clause", "Guide", "Checklist"
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    jurisdiction = Column(String(100), default="California / San Diego County")
    tags = Column(String(255), default="")
    downloads_count = Column(Integer, default=0)
    upvotes = Column(Integer, default=0)
    author_id = Column(Integer, ForeignKey("lawyers.id"), nullable=True)
    created_at = Column(DateTime, default=utcnow)

    author = relationship("Lawyer", back_populates="resources")

class Referral(Base):
    __tablename__ = "referrals"

    id = Column(Integer, primary_key=True, index=True)
    client_matter = Column(String(255), nullable=False)
    practice_area = Column(String(100), nullable=False)
    jurisdiction = Column(String(100), default="San Diego, CA")
    estimated_value = Column(String(50), default="$10,000 - $25,000")
    notes = Column(Text, nullable=True)
    status = Column(String(50), default="pending")  # pending, accepted, completed
    referring_lawyer_id = Column(Integer, ForeignKey("lawyers.id"), nullable=True)
    target_lawyer_id = Column(Integer, ForeignKey("lawyers.id"), nullable=False)
    created_at = Column(DateTime, default=utcnow)

    target_lawyer = relationship("Lawyer", foreign_keys=[target_lawyer_id], back_populates="referrals_received")
