from models.database import SessionLocal, About
from models.models import AboutCreate

def add_about_data():
    db = SessionLocal()
    
    try:
        # Clear existing about data
        db.query(About).delete()
        db.commit()
        
        # Add about data
        about_data = [
            AboutCreate(
                title="About Me",
                subtitle="Passionate Product Manager",
                description="I'm a passionate product manager with a love for creating amazing user experiences. I believe in the power of user-centered design and data-driven decision making. With over 5 years of experience in product management, I've helped companies build products that users love and businesses value.",
                image_url="🚀",
                order_index=0
            ),
            AboutCreate(
                title="My Skills",
                subtitle="Core Competencies",
                description="Product Strategy, User Research, Agile Development, Data Analysis, A/B Testing, Market Research, User Experience Design, Stakeholder Management, Cross-functional Leadership, Product Analytics",
                image_url="⭐",
                order_index=1
            ),
            AboutCreate(
                title="My Approach",
                subtitle="How I Work",
                description="I believe in a user-centered approach to product development. I start by understanding user needs through research and data analysis, then work closely with design and engineering teams to create solutions that are both beautiful and functional. I'm passionate about continuous learning and staying up-to-date with the latest product management methodologies and tools.",
                image_url="💡",
                order_index=2
            )
        ]
        
        for about_item in about_data:
            db_about = About(**about_item.model_dump())
            db.add(db_about)
        
        db.commit()
        print("✅ About data added successfully!")
        print(f"📊 Added {len(about_data)} about items")
        
    except Exception as e:
        print(f"❌ Error adding about data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_about_data() 