#!/usr/bin/env python3
"""
Production Database Seeding Script
This script seeds the production database with sample data.
"""

import sqlite3
import os
from datetime import datetime

def seed_production_database():
    """Seed the production database with sample data."""
    
    # Connect to the database
    db_path = "portfolio.db"
    if not os.path.exists(db_path):
        print(f"Database file {db_path} not found!")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
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
        
        # Insert Experience data
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
        
        # Insert Stats data
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
        
        # Insert Skills data
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
        
        # Insert Testimonials data
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
        
        # Insert Projects data
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
        
        # Insert Awards data
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
        
        # Insert Education data
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
        
        # Insert Certifications data
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
        print("✅ Production database seeded successfully with comprehensive sample data!")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Error seeding database: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    seed_production_database() 