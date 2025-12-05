from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from config import settings

# Create database engine using settings
engine = create_engine(
    settings.database_url, 
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Database Models
class Contact(Base):
    """Contact form submissions model."""
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    email = Column(String(255), index=True, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class About(Base):
    """About section content model."""
    __tablename__ = "about"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255))
    description = Column(Text, nullable=False)
    image_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    additional_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Experience(Base):
    """Work experience model."""
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(255), nullable=False)
    position = Column(String(255), nullable=False)
    duration = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    technologies = Column(String(500))  # Comma-separated list
    achievements = Column(Text)  # Comma-separated list
    location = Column(String(255))  # Job location
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Stat(Base):
    """Statistics/achievements model."""
    __tablename__ = "stats"

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(255), nullable=False)
    value = Column(String(100), nullable=False)
    suffix = Column(String(50), default="")  # e.g., "+", "%", "K"
    icon = Column(String(100))  # Icon class or emoji
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Testimonial(Base):
    """Testimonials model."""
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    position = Column(String(255))
    company = Column(String(255))
    relation = Column(String(255)) # E.g., "Former Manager", "Client", "Peer"
    message = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Project(Base):
    """Projects model."""
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    short_description = Column(String(500))
    image_url = Column(String(500))
    live_url = Column(String(500))
    github_url = Column(String(500))
    technologies = Column(String(500))  # Comma-separated list
    category = Column(String(100), default="all")  # all, software, data, etc.
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ContactInfo(Base):
    """Contact information model."""
    __tablename__ = "contact_info"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(100), nullable=False)  # email, phone, linkedin, etc.
    value = Column(String(255), nullable=False)
    label = Column(String(255))
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Hero(Base):
    """Hero section model."""
    __tablename__ = "hero"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    badge = Column(String(255), nullable=False)
    badge_emoji = Column(String(50), nullable=False)
    cta_text = Column(String(255), nullable=False)
    cta_style = Column(String(50), default="bordered")  # bordered or filled
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Award(Base):
    """Awards model."""
    __tablename__ = "awards"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    organization = Column(String(255), nullable=False)
    year = Column(String(50), nullable=False)
    icon = Column(String(50), default="🏆")
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Education(Base):
    """Education model."""
    __tablename__ = "education"
    id = Column(Integer, primary_key=True, index=True)
    degree = Column(String(255), nullable=False)
    institution = Column(String(255), nullable=False)
    year = Column(String(50), nullable=False)
    icon = Column(String(50), default="🎓")
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Certification(Base):
    """Certifications model."""
    __tablename__ = "certifications"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    issuer = Column(String(255), nullable=False)
    year = Column(String(50), nullable=False)
    icon = Column(String(50), default="📜")
    certificate_link = Column(String(500))  # Certificate verification URL
    certificate_id = Column(String(255))  # Certificate ID/Number
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Skill(Base):
    """Skills model."""
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(255), nullable=False)
    skills = Column(String(1000), nullable=False) # Comma-separated
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SectionTitle(Base):
    """Section titles model - individual section configurations."""
    __tablename__ = "section_titles"
    
    id = Column(Integer, primary_key=True, index=True)
    section_name = Column(String(100), nullable=False, index=True)  # hero, about, stats, etc.
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255))
    description = Column(Text)
    main_title = Column(String(255))
    emoji = Column(String(10))
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SectionConfig(Base):
    """Section configuration model (legacy)."""
    __tablename__ = "section_config"
    id = Column(Integer, primary_key=True, index=True)
    config = Column(JSON, nullable=False)  # Store all section titles/descriptions as JSON
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Database dependency
def get_db():
    """Database session dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 