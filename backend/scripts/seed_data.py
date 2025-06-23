import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.database import SessionLocal, About, Experience, Stat, Testimonial, Project, ContactInfo, Hero, Award, Education, Certification, Skill
from models.models import AboutCreate, ExperienceCreate, StatCreate, TestimonialCreate, ProjectCreate, ContactInfoCreate, HeroCreate, AwardCreate, EducationCreate, CertificationCreate, SkillCreate

def seed_database():
    db = SessionLocal()
    
    try:
        # Clear all existing data
        db.query(About).delete()
        db.query(Experience).delete()
        db.query(Stat).delete()
        db.query(Testimonial).delete()
        db.query(Project).delete()
        db.query(ContactInfo).delete()
        db.query(Hero).delete()
        db.query(Award).delete()
        db.query(Education).delete()
        db.query(Certification).delete()
        db.query(Skill).delete()
        db.commit()
        
        # Seed Hero data
        hero_data = HeroCreate(
            title="I Am Rahul Raj",
            subtitle="AVP Product Manager",
            description="A passionate product manager with a designer's heart, engineer's mind, and diplomat's tongue. I craft digital experiences that users love and businesses value.",
            badge="Welcome to My Universe",
            badge_emoji="✨",
            cta_text="Explore My Work",
            cta_style="bordered"
        )
        db_hero = Hero(**hero_data.model_dump())
        db.add(db_hero)
        
        # Seed About data
        about_data = [
            AboutCreate(
                title="Who I Am",
                subtitle="Passionate Product Manager",
                description="A product manager with a designer's heart, engineer's mind, and diplomat's tongue. I bridge the gap between technology and business to create meaningful solutions.",
                order_index=0
            ),
            AboutCreate(
                title="What I Do",
                subtitle="Turning Ideas into Reality",
                description="I lead cross-functional teams to deliver innovative products that solve real problems. From concept to launch, I ensure every product delivers exceptional user experiences.",
                order_index=1
            ),
            AboutCreate(
                title="What Interests Me",
                subtitle="Innovation & Strategy",
                description="Emerging technologies, AI possibilities, and creating solutions that make a real-world impact. I'm passionate about building products that matter.",
                order_index=2
            )
        ]
        
        for about_item in about_data:
            db_about = About(**about_item.model_dump())
            db.add(db_about)
        
        # Seed Experience data
        experience_data = [
            ExperienceCreate(
                company="TechCorp Solutions",
                position="AVP Product Manager",
                duration="2022 - Present",
                description="Leading product strategy for enterprise SaaS solutions. Managed cross-functional teams of 15+ members and delivered 3 major product launches that increased revenue by 40%.",
                technologies="Product Strategy, Agile, JIRA, SQL, Python, React, User Research",
                achievements="Increased user engagement by 40%, Launched 3 major features, Led team of 15 developers, Improved conversion rates by 25%",
                order_index=0
            ),
            ExperienceCreate(
                company="InnovationLab",
                position="Senior Product Manager",
                duration="2020 - 2022",
                description="Built and scaled mobile applications from concept to market. Collaborated with design and engineering teams to create user-centered solutions.",
                technologies="Mobile Development, User Experience, Market Research, A/B Testing, Analytics",
                achievements="Launched 2 successful apps, Grew user base to 100K+, Improved retention by 30%, Reduced churn by 20%",
                order_index=1
            ),
            ExperienceCreate(
                company="StartupXYZ",
                position="Product Manager",
                duration="2018 - 2020",
                description="Started my product management journey working on web applications and learning the fundamentals of product development.",
                technologies="Web Development, Product Analytics, Customer Feedback, Prototyping, Figma",
                achievements="Contributed to 5 product launches, Improved conversion rates by 15%, Mentored 3 junior PMs, Increased customer satisfaction by 35%",
                order_index=2
            )
        ]
        
        for exp in experience_data:
            db_exp = Experience(**exp.model_dump())
            db.add(db_exp)
        
        # Seed Stats data
        stats_data = [
            StatCreate(
                label="Projects Completed",
                value="50",
                suffix="+",
                icon="🚀",
                order_index=0
            ),
            StatCreate(
                label="Happy Clients",
                value="25",
                suffix="+",
                icon="😊",
                order_index=1
            ),
            StatCreate(
                label="Years Experience",
                value="6",
                suffix="+",
                icon="⏰",
                order_index=2
            ),
            StatCreate(
                label="Success Rate",
                value="98",
                suffix="%",
                icon="📈",
                order_index=3
            )
        ]
        
        for stat in stats_data:
            db_stat = Stat(**stat.model_dump())
            db.add(db_stat)
        
        # Seed Testimonials data
        testimonials_data = [
            TestimonialCreate(
                name="Sarah Johnson",
                position="CEO",
                company="TechCorp Solutions",
                relation="Former Manager",
                message="Rahul is an exceptional product manager who consistently delivers outstanding results. His strategic thinking and ability to lead cross-functional teams make him invaluable to any organization.",
                rating=5,
                order_index=0
            ),
            TestimonialCreate(
                name="Michael Chen",
                position="CTO",
                company="InnovationLab",
                relation="Peer",
                message="Working with Rahul was a game-changer for our product development process. His attention to detail and user-centric approach resulted in products that our customers love.",
                rating=5,
                order_index=1
            ),
            TestimonialCreate(
                name="Emily Rodriguez",
                position="Product Director",
                company="StartupXYZ",
                relation="Client",
                message="Rahul's ability to understand complex business requirements and translate them into successful products is remarkable. He's a true professional who delivers on his promises.",
                rating=5,
                order_index=2
            )
        ]
        
        for testimonial in testimonials_data:
            db_testimonial = Testimonial(**testimonial.model_dump())
            db.add(db_testimonial)
        
        # Seed Projects data
        projects_data = [
            ProjectCreate(
                title="E-Commerce Platform",
                description="A modern, scalable e-commerce solution with advanced features including AI-powered recommendations, real-time inventory management, and seamless payment processing.",
                short_description="Modern E-commerce Solution",
                image_url="🛍️",
                live_url="https://example-ecommerce.com",
                github_url="https://github.com/rahul/ecommerce-platform",
                technologies="React, Node.js, MongoDB, Stripe, AWS",
                category="web",
                is_featured=True,
                order_index=0
            ),
            ProjectCreate(
                title="AI Voice Assistant",
                description="A witty conversational AI assistant powered by advanced NLP and machine learning. Features voice-to-voice interaction with natural language processing.",
                short_description="Voice-to-Voice AI Chatbot",
                image_url="🤖",
                live_url="https://example-ai-assistant.com",
                github_url="https://github.com/rahul/ai-voice-assistant",
                technologies="Python, TensorFlow, React, WebRTC, OpenAI",
                category="ai",
                is_featured=True,
                order_index=1
            ),
            ProjectCreate(
                title="Analytics Dashboard",
                description="Comprehensive business intelligence platform with real-time data visualization, custom reporting, and predictive analytics capabilities.",
                short_description="Business Intelligence Platform",
                image_url="📊",
                live_url="https://example-analytics.com",
                github_url="https://github.com/rahul/analytics-dashboard",
                technologies="Vue.js, D3.js, Python, PostgreSQL, Redis",
                category="data",
                is_featured=False,
                order_index=2
            ),
            ProjectCreate(
                title="Mobile Fitness App",
                description="Cross-platform mobile application for fitness tracking and workout planning with social features and personalized recommendations.",
                short_description="Fitness Tracking App",
                image_url="💪",
                live_url="https://example-fitness-app.com",
                github_url="https://github.com/rahul/fitness-app",
                technologies="React Native, Firebase, Redux, HealthKit",
                category="mobile",
                is_featured=False,
                order_index=3
            )
        ]
        
        for project in projects_data:
            db_project = Project(**project.model_dump())
            db.add(db_project)
        
        # Seed Contact Info data
        contact_data = [
            ContactInfoCreate(
                type="email",
                value="rahul.raj@example.com",
                label="Email",
                order_index=0
            ),
            ContactInfoCreate(
                type="phone",
                value="+1 (555) 123-4567",
                label="Phone",
                order_index=1
            ),
            ContactInfoCreate(
                type="linkedin",
                value="linkedin.com/in/rahulraj",
                label="LinkedIn",
                order_index=2
            ),
            ContactInfoCreate(
                type="github",
                value="github.com/rahulraj",
                label="GitHub",
                order_index=3
            ),
            ContactInfoCreate(
                type="website",
                value="rahulraj.dev",
                label="Website",
                order_index=4
            )
        ]
        
        for contact in contact_data:
            db_contact = ContactInfo(**contact.model_dump())
            db.add(db_contact)
        
        # Seed Awards data
        awards_data = [
            AwardCreate(
                title="Best Product Manager 2023",
                organization="Tech Awards Association",
                year="2023",
                icon="🏆",
                order_index=0
            ),
            AwardCreate(
                title="Innovation Excellence Award",
                organization="Product Management Institute",
                year="2022",
                icon="🌟",
                order_index=1
            ),
            AwardCreate(
                title="Customer Success Champion",
                organization="SaaS Growth Awards",
                year="2021",
                icon="👑",
                order_index=2
            )
        ]
        
        for award in awards_data:
            db_award = Award(**award.model_dump())
            db.add(db_award)
        
        # Seed Education data
        education_data = [
            EducationCreate(
                degree="Master of Business Administration",
                institution="Stanford University",
                year="2020",
                icon="🎓",
                order_index=0
            ),
            EducationCreate(
                degree="Bachelor of Computer Science",
                institution="MIT",
                year="2018",
                icon="💻",
                order_index=1
            ),
            EducationCreate(
                degree="Product Management Certification",
                institution="Harvard Business School",
                year="2019",
                icon="📚",
                order_index=2
            )
        ]
        
        for education in education_data:
            db_education = Education(**education.model_dump())
            db.add(db_education)
        
        # Seed Certifications data
        certifications_data = [
            CertificationCreate(
                name="Certified Scrum Master (CSM)",
                issuer="Scrum Alliance",
                year="2022",
                icon="📜",
                order_index=0
            ),
            CertificationCreate(
                name="AWS Solutions Architect",
                issuer="Amazon Web Services",
                year="2021",
                icon="☁️",
                order_index=1
            ),
            CertificationCreate(
                name="Google Cloud Professional",
                issuer="Google Cloud",
                year="2020",
                icon="🌐",
                order_index=2
            )
        ]
        
        for certification in certifications_data:
            db_certification = Certification(**certification.model_dump())
            db.add(db_certification)
        
        # Seed Skills data
        skills_data = [
            SkillCreate(
                category="Product Management",
                skills="Product Strategy, User Research, Data Analysis, Agile, Scrum, A/B Testing, Roadmapping",
                color="from-blue-400 to-cyan-400",
                order_index=0
            ),
            SkillCreate(
                category="Technical Skills",
                skills="Python, JavaScript, React, Node.js, SQL, AWS, Docker, Git",
                color="from-green-400 to-emerald-400",
                order_index=1
            ),
            SkillCreate(
                category="Design & UX",
                skills="Figma, User Experience Design, Wireframing, Prototyping, Design Systems",
                color="from-purple-400 to-pink-400",
                order_index=2
            ),
            SkillCreate(
                category="Analytics & Tools",
                skills="Google Analytics, Mixpanel, JIRA, Confluence, Notion, Slack",
                color="from-orange-400 to-red-400",
                order_index=3
            )
        ]
        
        for skill in skills_data:
            db_skill = Skill(**skill.model_dump())
            db.add(db_skill)
        
        db.commit()
        print("Database seeded successfully with comprehensive sample data!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database() 