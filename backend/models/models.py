from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any

# Contact Models
class ContactForm(BaseModel):
    name: str
    email: str
    message: str

class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True

# About Models
class AboutCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    description: str
    image_url: Optional[str] = None
    is_active: bool = True
    order_index: int = 0
    additional_data: Optional[Dict[str, Any]] = None

class AboutUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    order_index: Optional[int] = None
    additional_data: Optional[Dict[str, Any]] = None

class AboutResponse(BaseModel):
    id: int
    title: str
    subtitle: Optional[str]
    description: str
    image_url: Optional[str]
    is_active: bool
    order_index: int
    additional_data: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Experience Models
class ExperienceCreate(BaseModel):
    company: str
    position: str
    duration: str
    description: str
    technologies: Optional[str] = None
    achievements: Optional[str] = None
    is_active: bool = True
    order_index: int = 0

class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    position: Optional[str] = None
    duration: str
    description: Optional[str] = None
    technologies: Optional[str] = None
    achievements: Optional[str] = None
    is_active: Optional[bool] = None
    order_index: Optional[int] = None

class ExperienceResponse(BaseModel):
    id: int
    company: str
    position: str
    duration: str
    description: str
    technologies: Optional[str]
    achievements: Optional[str]
    is_active: bool
    order_index: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Stats Models
class StatCreate(BaseModel):
    label: str
    value: str
    suffix: Optional[str] = ""
    icon: Optional[str] = None
    is_active: bool = True
    order_index: int = 0

class StatUpdate(BaseModel):
    label: Optional[str] = None
    value: Optional[str] = None
    suffix: Optional[str] = None
    icon: Optional[str] = None
    is_active: Optional[bool] = None
    order_index: Optional[int] = None

class StatResponse(BaseModel):
    id: int
    label: str
    value: str
    suffix: str
    icon: Optional[str]
    is_active: bool
    order_index: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Testimonial Models
class TestimonialCreate(BaseModel):
    name: str
    position: Optional[str] = None
    company: Optional[str] = None
    relation: Optional[str] = None
    message: str
    is_active: bool = True
    order_index: int = 0

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    position: Optional[str] = None
    company: Optional[str] = None
    relation: Optional[str] = None
    message: Optional[str] = None
    is_active: Optional[bool] = None
    order_index: Optional[int] = None

class TestimonialResponse(BaseModel):
    id: int
    name: str
    position: Optional[str]
    company: Optional[str]
    relation: Optional[str]
    message: str
    is_active: bool
    order_index: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Project Models
class ProjectCreate(BaseModel):
    title: str
    description: str
    short_description: Optional[str] = None
    image_url: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    technologies: Optional[str] = None
    category: str = "all"
    is_featured: bool = False
    is_active: bool = True
    order_index: int = 0

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    image_url: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    technologies: Optional[str] = None
    category: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    order_index: Optional[int] = None

class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str
    short_description: Optional[str]
    image_url: Optional[str]
    live_url: Optional[str]
    github_url: Optional[str]
    technologies: Optional[str]
    category: str
    is_featured: bool
    is_active: bool
    order_index: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ContactInfo Models (for managing contact information)
class ContactInfoCreate(BaseModel):
    type: str  # email, phone, address, website, linkedin, github, twitter, other
    value: str
    label: str
    is_active: bool = True
    order_index: int = 0

class ContactInfoUpdate(BaseModel):
    type: Optional[str] = None
    value: Optional[str] = None
    label: Optional[str] = None
    is_active: Optional[bool] = None
    order_index: Optional[int] = None

class ContactInfoResponse(BaseModel):
    id: int
    type: str
    value: str
    label: str
    is_active: bool
    order_index: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Hero Models
class HeroCreate(BaseModel):
    title: str
    subtitle: str
    description: str
    badge: str
    badge_emoji: str
    cta_text: str
    cta_style: str = "bordered"  # bordered or filled
    is_active: bool = True

class HeroUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    badge: Optional[str] = None
    badge_emoji: Optional[str] = None
    cta_text: Optional[str] = None
    cta_style: Optional[str] = None
    is_active: Optional[bool] = None

class HeroResponse(BaseModel):
    id: int
    title: str
    subtitle: str
    description: str
    badge: str
    badge_emoji: str
    cta_text: str
    cta_style: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class OrderUpdate(BaseModel):
    id: int
    order_index: int

class AwardCreate(BaseModel):
    title: str
    organization: str
    year: str
    icon: Optional[str] = "🏆"
    order_index: int = 0

class AwardUpdate(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    year: Optional[str] = None
    icon: Optional[str] = None
    order_index: Optional[int] = None

class AwardResponse(BaseModel):
    id: int
    title: str
    organization: str
    year: str
    icon: str
    is_active: bool
    order_index: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Education Models
class EducationCreate(BaseModel):
    degree: str
    institution: str
    year: str
    icon: Optional[str] = "🎓"
    is_active: bool = True
    order_index: int = 0

class EducationUpdate(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    year: Optional[str] = None
    icon: Optional[str] = None
    is_active: Optional[bool] = None
    order_index: Optional[int] = None

class EducationResponse(BaseModel):
    id: int
    degree: str
    institution: str
    year: str
    icon: str
    is_active: bool
    order_index: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Certification Models
class CertificationCreate(BaseModel):
    name: str
    issuer: str
    year: str
    icon: Optional[str] = "📜"
    is_active: bool = True
    order_index: int = 0

class CertificationUpdate(BaseModel):
    name: Optional[str] = None
    issuer: Optional[str] = None
    year: Optional[str] = None
    icon: Optional[str] = None
    is_active: Optional[bool] = None
    order_index: Optional[int] = None

class CertificationResponse(BaseModel):
    id: int
    name: str
    issuer: str
    year: str
    icon: str
    is_active: bool
    order_index: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SkillCreate(BaseModel):
    category: str
    skills: str  # Comma-separated
    order_index: int = 0

class SkillUpdate(BaseModel):
    category: Optional[str] = None
    skills: Optional[str] = None
    order_index: Optional[int] = None

class SkillResponse(BaseModel):
    id: int
    category: str
    skills: str
    order_index: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Section Config Models - Individual section configurations
class SectionTitleCreate(BaseModel):
    section_name: str  # hero, about, stats, projects, etc.
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    main_title: Optional[str] = None
    emoji: Optional[str] = None
    is_active: bool = True
    order_index: int = 0

class SectionTitleUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    main_title: Optional[str] = None
    emoji: Optional[str] = None
    is_active: Optional[bool] = None
    order_index: Optional[int] = None

class SectionTitleResponse(BaseModel):
    id: int
    section_name: str
    title: str
    subtitle: Optional[str]
    description: Optional[str]
    main_title: Optional[str]
    emoji: Optional[str]
    is_active: bool
    order_index: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Legacy SectionConfig Models (for backward compatibility)
class SectionConfig(BaseModel):
    config: Dict[str, Any]

class SectionConfigResponse(BaseModel):
    id: int
    config: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        
class AdminContactResponse(ContactResponse):
    pass

