from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from models.database import get_db, Contact, About, Experience, Stat, Testimonial, Project, ContactInfo, Hero, Award, Education, Certification, Skill, SectionConfig, SectionTitle
from models.models import (
    ContactForm, ContactResponse,
    AboutCreate, AboutUpdate, AboutResponse,
    ExperienceCreate, ExperienceUpdate, ExperienceResponse,
    StatCreate, StatUpdate, StatResponse,
    TestimonialCreate, TestimonialUpdate, TestimonialResponse,
    ProjectCreate, ProjectUpdate, ProjectResponse,
    ContactInfoCreate, ContactInfoUpdate, ContactInfoResponse,
    HeroCreate, HeroUpdate, HeroResponse,
    OrderUpdate,
    AwardCreate, AwardUpdate, AwardResponse,
    EducationCreate, EducationUpdate, EducationResponse,
    CertificationCreate, CertificationUpdate, CertificationResponse,
    SkillCreate, SkillUpdate, SkillResponse,
    SectionConfig as SectionConfigModel, SectionConfigResponse,
    SectionTitleCreate, SectionTitleUpdate, SectionTitleResponse
)
from api.auth import authenticate_user, create_access_token, get_current_active_user, ACCESS_TOKEN_EXPIRE_MINUTES
from api.upload import upload_image, upload_multiple_images, delete_image, get_image_info
from datetime import datetime, timedelta
from typing import List, Optional
from config import settings
import json
import os
from pathlib import Path

# Create FastAPI app
app = FastAPI(
    title="Portfolio API",
    description="Backend API for personal portfolio website",
    version="1.0.0"
)

# Mount static files for uploaded images
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

# Add CORS middleware - Updated for production deployment
print(f"DEBUG: Allowed origins: {settings.allowed_origins}")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove disconnected clients
                self.active_connections.remove(connection)

manager = ConnectionManager()

# Health check endpoint
@app.get("/")
def read_root():
    """Health check endpoint."""
    return {"message": "Backend is running!", "version": "1.0.0"}

# Temporary endpoint to seed database (remove in production)
@app.post("/api/seed-database")
def seed_database_endpoint():
    """Temporary endpoint to seed the database with sample data."""
    try:
        import sqlite3
        from datetime import datetime
        
        # Connect to the database using the configured path
        db_path = "/data/portfolio.db"
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Clear existing data
        tables = ['hero', 'about', 'experiences', 'stats', 'testimonials', 'projects', 'contact_info', 'awards', 'education', 'certifications', 'skills']
        for table in tables:
            cursor.execute(f"DELETE FROM {table}")
        
        # Insert Hero data
        cursor.execute("""
            INSERT INTO hero (title, subtitle, description, badge, badge_emoji, cta_text, cta_style, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "I Am Rahul Raj",
            "AVP Product Manager", 
            "A passionate product manager with a designer's heart, engineer's mind, and diplomat's tongue. I craft digital experiences that users love and businesses value.",
            "Welcome to My Universe",
            "✨",
            "Explore My Work",
            "bordered",
            True,
            datetime.now(),
            datetime.now()
        ))
        
        # Insert About data
        about_data = [
            ("Who I Am", "Passionate Product Manager", "A product manager with a designer's heart, engineer's mind, and diplomat's tongue. I bridge the gap between technology and business to create meaningful solutions.", 0),
            ("What I Do", "Turning Ideas into Reality", "I lead cross-functional teams to deliver innovative products that solve real problems. From concept to launch, I ensure every product delivers exceptional user experiences.", 1),
            ("What Interests Me", "Innovation & Strategy", "Emerging technologies, AI possibilities, and creating solutions that make a real-world impact. I'm passionate about building products that matter.", 2)
        ]
        
        for title, subtitle, description, order_index in about_data:
            cursor.execute("""
                INSERT INTO about (title, subtitle, description, order_index, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (title, subtitle, description, order_index, True, datetime.now(), datetime.now()))
        
        # Insert Experience data (table: experiences)
        experience_data = [
            ("TechCorp Solutions", "AVP Product Manager", "2022 - Present", "Leading product strategy for enterprise SaaS solutions. Managed cross-functional teams of 15+ members and delivered 3 major product launches that increased revenue by 40%.", "Product Strategy, Agile, JIRA, SQL, Python, React, User Research", "Increased user engagement by 40%, Launched 3 major features, Led team of 15 developers, Improved conversion rates by 25%", 0),
            ("InnovationLab", "Senior Product Manager", "2020 - 2022", "Built and scaled mobile applications from concept to market. Collaborated with design and engineering teams to create user-centered solutions.", "Mobile Development, User Experience, Market Research, A/B Testing, Analytics", "Launched 2 successful apps, Grew user base to 100K+, Improved retention by 30%, Reduced churn by 20%", 1),
            ("StartupXYZ", "Product Manager", "2018 - 2020", "Started my product management journey working on web applications and learning the fundamentals of product development.", "Web Development, Product Analytics, Customer Feedback, Prototyping, Figma", "Contributed to 5 product launches, Improved conversion rates by 15%, Mentored 3 junior PMs, Increased customer satisfaction by 35%", 2)
        ]
        
        for company, position, duration, description, technologies, achievements, order_index in experience_data:
            cursor.execute("""
                INSERT INTO experiences (company, position, duration, description, technologies, achievements, order_index, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (company, position, duration, description, technologies, achievements, order_index, True, datetime.now(), datetime.now()))
        
        # Insert Stats data (table: stats)
        stats_data = [
            ("Projects Completed", "50", "+", "🚀", 0),
            ("Happy Clients", "25", "+", "😊", 1),
            ("Years Experience", "6", "+", "⏰", 2),
            ("Success Rate", "98", "%", "📈", 3)
        ]
        
        for label, value, suffix, icon, order_index in stats_data:
            cursor.execute("""
                INSERT INTO stats (label, value, suffix, icon, order_index, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (label, value, suffix, icon, order_index, True, datetime.now(), datetime.now()))
        
        # Insert Contact Info data
        contact_data = [
            ("email", "rahul.raj@example.com", "Email", 0),
            ("phone", "+1 (555) 123-4567", "Phone", 1),
            ("linkedin", "linkedin.com/in/rahulraj", "LinkedIn", 2),
            ("github", "github.com/rahulraj", "GitHub", 3),
            ("website", "rahulraj.dev", "Website", 4)
        ]
        
        for type_val, value, label, order_index in contact_data:
            cursor.execute("""
                INSERT INTO contact_info (type, value, label, order_index, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (type_val, value, label, order_index, True, datetime.now(), datetime.now()))
        
        # Insert Skills data (table: skills)
        skills_data = [
            ("Product Management", "Product Strategy, User Research, Data Analysis, Agile, Scrum, A/B Testing, Roadmapping", 0),
            ("Technical Skills", "Python, JavaScript, React, Node.js, SQL, AWS, Docker, Git", 1),
            ("Design & UX", "Figma, User Experience Design, Wireframing, Prototyping, Design Systems", 2),
            ("Analytics & Tools", "Google Analytics, Mixpanel, JIRA, Confluence, Notion, Slack", 3)
        ]
        
        for category, skills, order_index in skills_data:
            cursor.execute("""
                INSERT INTO skills (category, skills, order_index, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (category, skills, order_index, True, datetime.now(), datetime.now()))
        
        # Insert Testimonials data (table: testimonials)
        testimonials_data = [
            ("Sarah Johnson", "CEO", "TechCorp Solutions", "Former Manager", "Rahul is an exceptional product manager who consistently delivers outstanding results. His strategic thinking and ability to lead cross-functional teams make him invaluable to any organization.", 0),
            ("Michael Chen", "CTO", "InnovationLab", "Peer", "Working with Rahul was a game-changer for our product development process. His attention to detail and user-centric approach resulted in products that our customers love.", 1),
            ("Emily Rodriguez", "Product Director", "StartupXYZ", "Client", "Rahul's ability to understand complex business requirements and translate them into successful products is remarkable. He's a true professional who delivers on his promises.", 2)
        ]
        
        for name, position, company, relation, message, order_index in testimonials_data:
            cursor.execute("""
                INSERT INTO testimonials (name, position, company, relation, message, order_index, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (name, position, company, relation, message, order_index, True, datetime.now(), datetime.now()))
        
        # Insert Projects data (table: projects)
        projects_data = [
            ("E-Commerce Platform", "A modern, scalable e-commerce solution with advanced features including AI-powered recommendations, real-time inventory management, and seamless payment processing.", "Modern E-commerce Solution", "🛍️", "https://example-ecommerce.com", "https://github.com/rahul/ecommerce-platform", "React, Node.js, MongoDB, Stripe, AWS", "web", True, 0),
            ("AI Voice Assistant", "A witty conversational AI assistant powered by advanced NLP and machine learning. Features voice-to-voice interaction with natural language processing.", "Voice-to-Voice AI Chatbot", "🤖", "https://example-ai-assistant.com", "https://github.com/rahul/ai-voice-assistant", "Python, TensorFlow, React, WebRTC, OpenAI", "ai", True, 1),
            ("Analytics Dashboard", "Comprehensive business intelligence platform with real-time data visualization, custom reporting, and predictive analytics capabilities.", "Business Intelligence Platform", "📊", "https://example-analytics.com", "https://github.com/rahul/analytics-dashboard", "Vue.js, D3.js, Python, PostgreSQL, Redis", "data", False, 2),
            ("Mobile Fitness App", "Cross-platform mobile application for fitness tracking and workout planning with social features and personalized recommendations.", "Fitness Tracking App", "💪", "https://example-fitness-app.com", "https://github.com/rahul/fitness-app", "React Native, Firebase, Redux, HealthKit", "mobile", False, 3)
        ]
        
        for title, description, short_description, image_url, live_url, github_url, technologies, category, is_featured, order_index in projects_data:
            cursor.execute("""
                INSERT INTO projects (title, description, short_description, image_url, live_url, github_url, technologies, category, is_featured, order_index, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (title, description, short_description, image_url, live_url, github_url, technologies, category, is_featured, order_index, True, datetime.now(), datetime.now()))
        
        # Insert Awards data (table: awards)
        awards_data = [
            ("Best Product Manager 2023", "Tech Awards Association", "2023", "🏆", 0),
            ("Innovation Excellence Award", "Product Management Institute", "2022", "🌟", 1),
            ("Customer Success Champion", "SaaS Growth Awards", "2021", "👑", 2)
        ]
        
        for title, organization, year, icon, order_index in awards_data:
            cursor.execute("""
                INSERT INTO awards (title, organization, year, icon, order_index, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (title, organization, year, icon, order_index, True, datetime.now(), datetime.now()))
        
        # Insert Education data (table: education)
        education_data = [
            ("Master of Business Administration", "Stanford University", "2020", "🎓", 0),
            ("Bachelor of Computer Science", "MIT", "2018", "💻", 1),
            ("Product Management Certification", "Harvard Business School", "2019", "📚", 2)
        ]
        
        for degree, institution, year, icon, order_index in education_data:
            cursor.execute("""
                INSERT INTO education (degree, institution, year, icon, order_index, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (degree, institution, year, icon, order_index, True, datetime.now(), datetime.now()))
        
        # Insert Certifications data (table: certifications)
        certifications_data = [
            ("Certified Scrum Master (CSM)", "Scrum Alliance", "2022", "📜", 0),
            ("AWS Solutions Architect", "Amazon Web Services", "2021", "☁️", 1),
            ("Google Cloud Professional", "Google Cloud", "2020", "🌐", 2)
        ]
        
        for name, issuer, year, icon, order_index in certifications_data:
            cursor.execute("""
                INSERT INTO certifications (name, issuer, year, icon, order_index, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (name, issuer, year, icon, order_index, True, datetime.now(), datetime.now()))
        
        conn.commit()
        conn.close()
        
        return {"message": "Database seeded successfully with sample data!"}
        
    except Exception as e:
        return {"error": f"Failed to seed database: {str(e)}"}

# Temporary endpoint to initialize database (remove in production)
@app.post("/api/init-database")
def init_database_endpoint():
    """Temporary endpoint to initialize the database schema."""
    try:
        # Import models - this will trigger Base.metadata.create_all(bind=engine)
        from models.database import Base, engine
        
        # Force table creation
        Base.metadata.create_all(bind=engine)
        
        return {
            "message": "Database initialized successfully!",
            "tables_created": list(Base.metadata.tables.keys())
        }
        
    except Exception as e:
        return {"error": f"Failed to initialize database: {str(e)}"}

# Authentication endpoints
@app.post("/api/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """User login endpoint."""
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Image upload endpoints
@app.post("/api/upload/image")
async def upload_single_image(
    file: UploadFile = File(...),
    current_user = Depends(get_current_active_user)
):
    """Upload a single image."""
    try:
        image_url = await upload_image(file)
        return {"url": image_url, "filename": file.filename}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}"
        )

@app.post("/api/upload/images")
async def upload_multiple_image_files(
    files: List[UploadFile] = File(...),
    current_user = Depends(get_current_active_user)
):
    """Upload multiple images."""
    try:
        image_urls = await upload_multiple_images(files)
        return {"urls": image_urls, "count": len(image_urls)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}"
        )

@app.delete("/api/upload/image")
async def delete_uploaded_image(
    image_url: str,
    current_user = Depends(get_current_active_user)
):
    """Delete an uploaded image."""
    success = delete_image(image_url)
    if success:
        return {"message": "Image deleted successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found or could not be deleted"
        )

@app.get("/api/upload/image/info")
async def get_uploaded_image_info(
    image_url: str,
    current_user = Depends(get_current_active_user)
):
    """Get information about an uploaded image."""
    info = get_image_info(image_url)
    if info:
        return info
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )

# Contact endpoints
@app.post("/api/contact", response_model=ContactResponse)
def submit_contact(form: ContactForm, db: Session = Depends(get_db)):
    """Submit contact form."""
    try:
        db_contact = Contact(
            name=form.name,
            email=form.email,
            message=form.message
        )
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)
        return db_contact
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save contact form")

@app.get("/api/contacts", response_model=List[ContactResponse])
def get_contacts(db: Session = Depends(get_db)):
    """Get all contact submissions (admin only)."""
    contacts = db.query(Contact).order_by(Contact.created_at.desc()).all()
    return contacts

# About endpoints
@app.get("/api/about", response_model=List[AboutResponse])
def get_about(db: Session = Depends(get_db)):
    """Get active about items."""
    about_items = db.query(About).filter(About.is_active == True).order_by(About.order_index).all()
    return about_items

@app.post("/api/about", response_model=AboutResponse)
def create_about(about: AboutCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Create new about item."""
    db_about = About(**about.model_dump())
    db.add(db_about)
    db.commit()
    db.refresh(db_about)
    return db_about

@app.put("/api/about/{about_id}", response_model=AboutResponse)
def update_about(about_id: int, about: AboutUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Update about item."""
    db_about = db.query(About).filter(About.id == about_id).first()
    if not db_about:
        raise HTTPException(status_code=404, detail="About item not found")
    
    for field, value in about.model_dump(exclude_unset=True).items():
        setattr(db_about, field, value)
    
    db.commit()
    db.refresh(db_about)
    return db_about

@app.delete("/api/about/{about_id}")
def delete_about(about_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Delete about item."""
    db_about = db.query(About).filter(About.id == about_id).first()
    if not db_about:
        raise HTTPException(status_code=404, detail="About item not found")
    
    db.delete(db_about)
    db.commit()
    return {"message": "About item deleted"}

@app.put("/api/about/order", response_model=List[AboutResponse])
def update_about_order(order_updates: List[OrderUpdate], db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Update about items order."""
    for update in order_updates:
        db_item = db.query(About).filter(About.id == update.id).first()
        if db_item:
            db_item.order_index = update.order_index
    db.commit()
    
    updated_items = db.query(About).order_by(About.order_index).all()
    return updated_items

# Experience endpoints
@app.get("/api/experiences", response_model=List[ExperienceResponse])
def get_experiences(db: Session = Depends(get_db)):
    """Get active experiences."""
    experiences = db.query(Experience).filter(Experience.is_active == True).order_by(Experience.order_index).all()
    return experiences

@app.post("/api/experiences", response_model=ExperienceResponse)
def create_experience(experience: ExperienceCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Create new experience."""
    db_experience = Experience(**experience.model_dump())
    db.add(db_experience)
    db.commit()
    db.refresh(db_experience)
    return db_experience

@app.put("/api/experiences/{experience_id}", response_model=ExperienceResponse)
def update_experience(experience_id: int, experience: ExperienceUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Update experience."""
    db_experience = db.query(Experience).filter(Experience.id == experience_id).first()
    if not db_experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    for field, value in experience.model_dump(exclude_unset=True).items():
        setattr(db_experience, field, value)
    
    db.commit()
    db.refresh(db_experience)
    return db_experience

@app.delete("/api/experiences/{experience_id}")
def delete_experience(experience_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Delete experience."""
    db_experience = db.query(Experience).filter(Experience.id == experience_id).first()
    if not db_experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    db.delete(db_experience)
    db.commit()
    return {"message": "Experience deleted"}

# Stats endpoints
@app.get("/api/stats", response_model=List[StatResponse])
def get_stats(db: Session = Depends(get_db)):
    """Get active stats."""
    stats = db.query(Stat).filter(Stat.is_active == True).order_by(Stat.order_index).all()
    return stats

@app.post("/api/stats", response_model=StatResponse)
def create_stat(stat: StatCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Create new stat."""
    db_stat = Stat(**stat.model_dump())
    db.add(db_stat)
    db.commit()
    db.refresh(db_stat)
    return db_stat

@app.put("/api/stats/{stat_id}", response_model=StatResponse)
def update_stat(stat_id: int, stat: StatUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Update stat."""
    db_stat = db.query(Stat).filter(Stat.id == stat_id).first()
    if not db_stat:
        raise HTTPException(status_code=404, detail="Stat not found")
    
    for field, value in stat.model_dump(exclude_unset=True).items():
        setattr(db_stat, field, value)
    
    db.commit()
    db.refresh(db_stat)
    return db_stat

@app.delete("/api/stats/{stat_id}")
def delete_stat(stat_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Delete stat."""
    db_stat = db.query(Stat).filter(Stat.id == stat_id).first()
    if not db_stat:
        raise HTTPException(status_code=404, detail="Stat not found")
    
    db.delete(db_stat)
    db.commit()
    return {"message": "Stat deleted"}

# Testimonials endpoints
@app.get("/api/testimonials")
def get_testimonials(db: Session = Depends(get_db)):
    """Get active testimonials."""
    try:
        testimonials = db.query(Testimonial).filter(Testimonial.is_active == True).order_by(Testimonial.order_index).all()
        result = []
        for t in testimonials:
            result.append({
                "id": t.id,
                "name": t.name,
                "position": t.position,
                "company": t.company,
                "relation": t.relation,
                "message": t.message,
                "is_active": t.is_active,
                "order_index": t.order_index,
                "created_at": t.created_at.isoformat() if t.created_at else None,
                "updated_at": t.updated_at.isoformat() if t.updated_at else None
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching testimonials: {str(e)}")

@app.post("/api/testimonials", response_model=TestimonialResponse)
def create_testimonial(testimonial: TestimonialCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Create new testimonial."""
    db_testimonial = Testimonial(**testimonial.model_dump())
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial

@app.put("/api/testimonials/{testimonial_id}", response_model=TestimonialResponse)
def update_testimonial(testimonial_id: int, testimonial: TestimonialUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Update testimonial."""
    db_testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not db_testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    for field, value in testimonial.model_dump(exclude_unset=True).items():
        setattr(db_testimonial, field, value)
    
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial

@app.delete("/api/testimonials/{testimonial_id}")
def delete_testimonial(testimonial_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Delete testimonial."""
    db_testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not db_testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    db.delete(db_testimonial)
    db.commit()
    return {"message": "Testimonial deleted"}

# Projects endpoints
@app.get("/api/projects", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    """Get all active projects."""
    projects = db.query(Project).filter(Project.is_active == True).order_by(Project.order_index).all()
    return projects

@app.get("/api/projects/{category}", response_model=List[ProjectResponse])
def get_projects_by_category(category: str, db: Session = Depends(get_db)):
    """Get projects by category."""
    projects = db.query(Project).filter(
        Project.category == category,
        Project.is_active == True
    ).order_by(Project.order_index).all()
    return projects

@app.post("/api/projects", response_model=ProjectResponse)
def create_project(project: ProjectCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Create new project."""
    db_project = Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.put("/api/projects/{project_id}", response_model=ProjectResponse)
def update_project(project_id: int, project: ProjectUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Update project."""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    for field, value in project.model_dump(exclude_unset=True).items():
        setattr(db_project, field, value)
    
    db.commit()
    db.refresh(db_project)
    return db_project

@app.delete("/api/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Delete project."""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted"}

# Admin endpoints for viewing all data
@app.get("/api/admin/contacts")
def admin_get_contacts(db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Get all contacts (admin only)."""
    contacts = db.query(Contact).order_by(Contact.created_at.desc()).all()
    return contacts

@app.get("/api/admin/about")
def admin_get_about(db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Get all about items (admin only)."""
    about_items = db.query(About).order_by(About.order_index).all()
    return about_items

@app.get("/api/admin/experiences")
def admin_get_experiences(db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Get all experiences (admin only)."""
    experiences = db.query(Experience).order_by(Experience.order_index).all()
    return experiences

@app.get("/api/admin/stats")
def admin_get_stats(db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Get all stats (admin only)."""
    stats = db.query(Stat).order_by(Stat.order_index).all()
    return stats

@app.get("/api/admin/testimonials")
def admin_get_testimonials(db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Get all testimonials (admin only)."""
    try:
        testimonials = db.query(Testimonial).order_by(Testimonial.order_index).all()
        result = []
        for t in testimonials:
            result.append({
                "id": t.id,
                "name": t.name,
                "position": t.position,
                "company": t.company,
                "relation": t.relation,
                "message": t.message,
                "is_active": t.is_active,
                "order_index": t.order_index,
                "created_at": t.created_at.isoformat() if t.created_at else None,
                "updated_at": t.updated_at.isoformat() if t.updated_at else None
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching testimonials: {str(e)}")

@app.get("/api/admin/projects")
def admin_get_projects(db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Get all projects (admin only)."""
    projects = db.query(Project).order_by(Project.order_index).all()
    return projects

# Contact info endpoints
@app.get("/api/contact-info", response_model=List[ContactInfoResponse])
def get_contact_info(db: Session = Depends(get_db)):
    """Get active contact info."""
    contact_info = db.query(ContactInfo).filter(ContactInfo.is_active == True).order_by(ContactInfo.order_index).all()
    return contact_info

@app.get("/api/admin/contact-info")
def admin_get_contact_info(db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Get all contact info (admin only)."""
    contact_info = db.query(ContactInfo).order_by(ContactInfo.order_index).all()
    return contact_info

@app.post("/api/admin/contact-info", response_model=ContactInfoResponse)
def create_contact_info(contact_info: ContactInfoCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Create new contact info."""
    db_contact_info = ContactInfo(**contact_info.model_dump())
    db.add(db_contact_info)
    db.commit()
    db.refresh(db_contact_info)
    return db_contact_info

@app.put("/api/admin/contact-info/{contact_info_id}", response_model=ContactInfoResponse)
def update_contact_info(contact_info_id: int, contact_info: ContactInfoUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Update contact info."""
    db_contact_info = db.query(ContactInfo).filter(ContactInfo.id == contact_info_id).first()
    if not db_contact_info:
        raise HTTPException(status_code=404, detail="Contact info not found")
    
    for field, value in contact_info.model_dump(exclude_unset=True).items():
        setattr(db_contact_info, field, value)
    
    db.commit()
    db.refresh(db_contact_info)
    return db_contact_info

@app.delete("/api/admin/contact-info/{contact_info_id}")
def delete_contact_info(contact_info_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Delete contact info."""
    db_contact_info = db.query(ContactInfo).filter(ContactInfo.id == contact_info_id).first()
    if not db_contact_info:
        raise HTTPException(status_code=404, detail="Contact info not found")
    
    db.delete(db_contact_info)
    db.commit()
    return {"message": "Contact info deleted"}

# Hero endpoints
@app.get("/api/hero", response_model=HeroResponse)
def get_hero(db: Session = Depends(get_db)):
    """Get active hero content."""
    hero = db.query(Hero).filter(Hero.is_active == True).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero content not found")
    return hero

@app.post("/api/hero", response_model=HeroResponse)
def create_hero(hero: HeroCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Create new hero content."""
    # Deactivate any existing active hero
    existing_hero = db.query(Hero).filter(Hero.is_active == True).first()
    if existing_hero:
        existing_hero.is_active = False
        db.commit()
    
    db_hero = Hero(**hero.model_dump())
    db.add(db_hero)
    db.commit()
    db.refresh(db_hero)
    return db_hero

@app.put("/api/hero/{hero_id}", response_model=HeroResponse)
def update_hero(hero_id: int, hero: HeroUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Update hero content."""
    db_hero = db.query(Hero).filter(Hero.id == hero_id).first()
    if not db_hero:
        raise HTTPException(status_code=404, detail="Hero content not found")
    
    for field, value in hero.model_dump(exclude_unset=True).items():
        setattr(db_hero, field, value)
    
    db.commit()
    db.refresh(db_hero)
    return db_hero

@app.delete("/api/hero/{hero_id}")
def delete_hero(hero_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Delete hero content."""
    db_hero = db.query(Hero).filter(Hero.id == hero_id).first()
    if not db_hero:
        raise HTTPException(status_code=404, detail="Hero content not found")
    
    db.delete(db_hero)
    db.commit()
    return {"message": "Hero content deleted"}

@app.get("/api/admin/hero")
def admin_get_hero(db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Get active hero content (admin only)."""
    hero = db.query(Hero).filter(Hero.is_active == True).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero content not found")
    return hero

# Awards endpoints
@app.get("/api/awards", response_model=List[AwardResponse])
def get_awards(db: Session = Depends(get_db)):
    """Get active awards."""
    awards = db.query(Award).filter(Award.is_active == True).order_by(Award.order_index).all()
    return awards

@app.post("/api/awards", response_model=AwardResponse)
def create_award(award: AwardCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Create new award."""
    db_award = Award(**award.model_dump())
    db.add(db_award)
    db.commit()
    db.refresh(db_award)
    return db_award

@app.put("/api/awards/{award_id}", response_model=AwardResponse)
def update_award(award_id: int, award: AwardUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Update award."""
    db_award = db.query(Award).filter(Award.id == award_id).first()
    if not db_award:
        raise HTTPException(status_code=404, detail="Award not found")
    
    for field, value in award.model_dump(exclude_unset=True).items():
        setattr(db_award, field, value)
    
    db.commit()
    db.refresh(db_award)
    return db_award

@app.delete("/api/awards/{award_id}")
def delete_award(award_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Delete award."""
    db_award = db.query(Award).filter(Award.id == award_id).first()
    if not db_award:
        raise HTTPException(status_code=404, detail="Award not found")
    
    db.delete(db_award)
    db.commit()
    return {"message": "Award deleted"}

# Education endpoints
@app.get("/api/education", response_model=List[EducationResponse])
def get_education(db: Session = Depends(get_db)):
    """Get active education."""
    education = db.query(Education).filter(Education.is_active == True).order_by(Education.order_index).all()
    return education

@app.post("/api/education", response_model=EducationResponse)
def create_education(education: EducationCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Create new education."""
    db_education = Education(**education.model_dump())
    db.add(db_education)
    db.commit()
    db.refresh(db_education)
    return db_education

@app.put("/api/education/{education_id}", response_model=EducationResponse)
def update_education(education_id: int, education: EducationUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Update education."""
    db_education = db.query(Education).filter(Education.id == education_id).first()
    if not db_education:
        raise HTTPException(status_code=404, detail="Education not found")
    
    for field, value in education.model_dump(exclude_unset=True).items():
        setattr(db_education, field, value)
    
    db.commit()
    db.refresh(db_education)
    return db_education

@app.delete("/api/education/{education_id}")
def delete_education(education_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Delete education."""
    db_education = db.query(Education).filter(Education.id == education_id).first()
    if not db_education:
        raise HTTPException(status_code=404, detail="Education not found")
    
    db.delete(db_education)
    db.commit()
    return {"message": "Education deleted"}

# Certifications endpoints
@app.get("/api/certifications", response_model=List[CertificationResponse])
def get_certifications(db: Session = Depends(get_db)):
    """Get active certifications."""
    certifications = db.query(Certification).filter(Certification.is_active == True).order_by(Certification.order_index).all()
    return certifications

@app.post("/api/certifications", response_model=CertificationResponse)
def create_certification(certification: CertificationCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Create new certification."""
    db_certification = Certification(**certification.model_dump())
    db.add(db_certification)
    db.commit()
    db.refresh(db_certification)
    return db_certification

@app.put("/api/certifications/{certification_id}", response_model=CertificationResponse)
def update_certification(certification_id: int, certification: CertificationUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Update certification."""
    db_certification = db.query(Certification).filter(Certification.id == certification_id).first()
    if not db_certification:
        raise HTTPException(status_code=404, detail="Certification not found")
    
    for field, value in certification.model_dump(exclude_unset=True).items():
        setattr(db_certification, field, value)
    
    db.commit()
    db.refresh(db_certification)
    return db_certification

@app.delete("/api/certifications/{certification_id}")
def delete_certification(certification_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Delete certification."""
    db_certification = db.query(Certification).filter(Certification.id == certification_id).first()
    if not db_certification:
        raise HTTPException(status_code=404, detail="Certification not found")
    
    db.delete(db_certification)
    db.commit()
    return {"message": "Certification deleted"}

# Skills endpoints
@app.get("/api/skills", response_model=List[SkillResponse])
def get_skills(db: Session = Depends(get_db)):
    """Get active skills."""
    skills = db.query(Skill).filter(Skill.is_active == True).order_by(Skill.order_index).all()
    return skills

@app.post("/api/skills", response_model=SkillResponse)
def create_skill(skill: SkillCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Create new skill."""
    db_skill = Skill(**skill.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@app.put("/api/skills/{skill_id}", response_model=SkillResponse)
def update_skill(skill_id: int, skill: SkillUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Update skill."""
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    for field, value in skill.model_dump(exclude_unset=True).items():
        setattr(db_skill, field, value)
    
    db.commit()
    db.refresh(db_skill)
    return db_skill

@app.delete("/api/skills/{skill_id}")
def delete_skill(skill_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Delete skill."""
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    db.delete(db_skill)
    db.commit()
    return {"message": "Skill deleted"}

# Section titles endpoints (new structure)
@app.get("/api/section-titles", response_model=List[SectionTitleResponse])
def get_section_titles(db: Session = Depends(get_db)):
    """Get all active section titles."""
    section_titles = db.query(SectionTitle).filter(SectionTitle.is_active == True).order_by(SectionTitle.order_index).all()
    return section_titles

@app.get("/api/section-titles/{section_name}", response_model=SectionTitleResponse)
def get_section_title(section_name: str, db: Session = Depends(get_db)):
    """Get section title by section name."""
    section_title = db.query(SectionTitle).filter(
        SectionTitle.section_name == section_name,
        SectionTitle.is_active == True
    ).first()
    if not section_title:
        raise HTTPException(status_code=404, detail="Section title not found")
    return section_title

@app.post("/api/section-titles", response_model=SectionTitleResponse)
def create_section_title(section_title: SectionTitleCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Create new section title."""
    db_section_title = SectionTitle(**section_title.model_dump())
    db.add(db_section_title)
    db.commit()
    db.refresh(db_section_title)
    return db_section_title

@app.put("/api/section-titles/{section_title_id}", response_model=SectionTitleResponse)
def update_section_title(section_title_id: int, section_title: SectionTitleUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Update section title."""
    db_section_title = db.query(SectionTitle).filter(SectionTitle.id == section_title_id).first()
    if not db_section_title:
        raise HTTPException(status_code=404, detail="Section title not found")
    
    for field, value in section_title.model_dump(exclude_unset=True).items():
        setattr(db_section_title, field, value)
    
    db.commit()
    db.refresh(db_section_title)
    return db_section_title

@app.delete("/api/section-titles/{section_title_id}")
def delete_section_title(section_title_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Delete section title."""
    db_section_title = db.query(SectionTitle).filter(SectionTitle.id == section_title_id).first()
    if not db_section_title:
        raise HTTPException(status_code=404, detail="Section title not found")
    
    db.delete(db_section_title)
    db.commit()
    return {"message": "Section title deleted"}

@app.get("/api/admin/section-titles")
def admin_get_section_titles(db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Get all section titles (admin only)."""
    section_titles = db.query(SectionTitle).order_by(SectionTitle.order_index).all()
    return section_titles

# WebSocket endpoint for real-time updates
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            # Echo back for testing (optional)
            await manager.send_personal_message(f"Message received: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Test endpoint to broadcast a test message
@app.post("/api/test-websocket")
async def test_websocket():
    """Test WebSocket broadcast functionality."""
    await manager.broadcast(json.dumps({
        "type": "test",
        "message": "This is a test WebSocket message",
        "timestamp": datetime.utcnow().isoformat()
    }))
    return {"message": "Test message broadcasted"}

# Section configuration endpoints
@app.get("/api/section-config", response_model=SectionConfigResponse)
def get_section_config(db: Session = Depends(get_db)):
    """Get section configuration."""
    config = db.query(SectionConfig).first()
    if not config:
        # Return comprehensive default configuration that matches frontend expectations
        default_config = {
            "hero": {
                "title": "I Am Rahul Raj",
                "subtitle": "AVP Product",
                "description": "Software Alchemist crafting digital experiences that users love & businesses value",
                "badge": "Welcome to My Universe",
                "badgeEmoji": "✨"
            },
            "about": {
                "title": "Get to Know Me",
                "description": "A glimpse into my world of innovation and creativity",
                "whoIAm": {
                    "title": "Who I Am",
                    "description": "Product manager with designer's heart, diplomat's tongue & engineer's brain"
                },
                "whatIDo": {
                    "title": "What I Do",
                    "description": "Craft digital experiences that users love & businesses value"
                },
                "whatInterestsMe": {
                    "title": "What Interests Me",
                    "description": "Emerging tech, AI possibilities & real-world impact solutions"
                }
            },
            "stats": {
                "title": "My Journey",
                "mainTitle": "Achievements & Skills",
                "description": "A glimpse into my professional journey and expertise"
            },
            "projects": {
                "title": "My Creations",
                "mainTitle": "Amazing Projects",
                "description": "Check out some of my favorite projects and creations! 🚀"
            },
            "experience": {
                "title": "My Journey",
                "mainTitle": "My Adventure So Far",
                "description": "A colorful journey through the world of product management and innovation! 🌈"
            },
            "testimonials": {
                "title": "What People Say",
                "mainTitle": "Lovely Testimonials",
                "description": "Hear what amazing people have to say about working with me! 💬"
            },
            "contact": {
                "title": "Get In Touch",
                "mainTitle": "Let's Connect",
                "description": "Ready to work together? Let's create something amazing! 🚀"
            },
            "thankYou": {
                "title": "Thank You",
                "mainTitle": "Thanks for Reaching Out!",
                "description": "I'll get back to you as soon as possible. In the meantime, feel free to explore more of my work!",
                "emoji": "🎉"
            },
            "awards": {
                "title": "Awards",
                "description": "My awards and recognition"
            },
            "education": {
                "title": "Education",
                "description": "My educational background"
            },
            "certifications": {
                "title": "Certifications",
                "description": "My certifications"
            },
            "skills": {
                "title": "Skills",
                "description": "My technical skills"
            }
        }
        return SectionConfigResponse(
            id=0,
            config=default_config,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
    return config

@app.post("/api/section-config", response_model=SectionConfigResponse)
async def create_section_config(config_data: SectionConfigModel, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Create or update section configuration."""
    existing_config = db.query(SectionConfig).first()
    
    if existing_config:
        # Update existing config
        existing_config.config = config_data.config
        existing_config.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_config)
        
        # Broadcast the update to all connected WebSocket clients
        await manager.broadcast(json.dumps({
            "type": "section_config_updated",
            "message": "Section configuration has been updated",
            "timestamp": datetime.utcnow().isoformat()
        }))
        
        return existing_config
    else:
        # Create new config
        db_config = SectionConfig(config=config_data.config)
        db.add(db_config)
        db.commit()
        db.refresh(db_config)
        
        # Broadcast the update to all connected WebSocket clients
        await manager.broadcast(json.dumps({
            "type": "section_config_updated",
            "message": "Section configuration has been created",
            "timestamp": datetime.utcnow().isoformat()
        }))
        
        return db_config

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080) 