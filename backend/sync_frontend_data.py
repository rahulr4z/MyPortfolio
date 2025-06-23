#!/usr/bin/env python3
"""
Script to sync frontend default data to backend database.
This ensures the admin panel shows only the data that's actually displayed on the frontend.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.database import SessionLocal, About, Experience, Stat, Testimonial, Project
from models.models import AboutCreate, ExperienceCreate, StatCreate, TestimonialCreate, ProjectCreate

def sync_frontend_data():
    db = SessionLocal()
    try:
        # Clear all tables
        db.query(About).delete()
        db.query(Experience).delete()
        db.query(Stat).delete()
        db.query(Testimonial).delete()
        db.query(Project).delete()
        db.commit()

        # About section (frontend default)
        about_data = [
            AboutCreate(
                title="About Me",
                subtitle="Passionate Product Manager",
                description="I'm a passionate product manager with a love for creating amazing user experiences. I believe in the power of user-centered design and data-driven decision making.",
                image_url="🚀",
                order_index=0
            ),
            AboutCreate(
                title="My Skills",
                subtitle="Core Competencies",
                description="Product Strategy, User Research, Agile Development, Data Analysis",
                image_url="⭐",
                order_index=1
            )
        ]
        for about_item in about_data:
            db_about = About(**about_item.model_dump())
            db.add(db_about)

        # Experiences section (frontend default)
        experiences_data = [
            ExperienceCreate(
                company="TechCorp",
                position="Senior Product Manager",
                duration="2022 - Present",
                description="Leading product strategy and development for enterprise SaaS solutions. Managed cross-functional teams and delivered innovative features that increased user engagement by 40%.",
                technologies="Product Strategy, Agile, User Research, Data Analysis",
                order_index=0
            ),
            ExperienceCreate(
                company="StartupXYZ",
                position="Product Manager",
                duration="2020 - 2022",
                description="Built and scaled mobile applications from concept to market. Collaborated with design and engineering teams to create user-centered solutions.",
                technologies="Mobile Development, User Experience, Market Research, A/B Testing",
                order_index=1
            ),
            ExperienceCreate(
                company="InnovationLab",
                position="Associate Product Manager",
                duration="2018 - 2020",
                description="Started my product management journey working on web applications and learning the fundamentals of product development.",
                technologies="Web Development, Product Analytics, Customer Feedback, Prototyping",
                order_index=2
            )
        ]
        for exp in experiences_data:
            db_exp = Experience(**exp.model_dump())
            db.add(db_exp)

        # Stats section (frontend default)
        stats_data = [
            StatCreate(label="Years Experience", value="5+", suffix="", icon="⭐", order_index=0),
            StatCreate(label="Projects Delivered", value="50+", suffix="", icon="🚀", order_index=1),
            StatCreate(label="Client Satisfaction", value="100", suffix="%", icon="💯", order_index=2),
            StatCreate(label="Problem Solver", value="24/7", suffix="", icon="🛠️", order_index=3)
        ]
        for stat in stats_data:
            db_stat = Stat(**stat.model_dump())
            db.add(db_stat)

        # Projects section (frontend default)
        projects_data = [
            ProjectCreate(
                title="E-Commerce Platform",
                description="A modern e-commerce solution with advanced features and beautiful UI",
                short_description="Modern e-commerce solution",
                image_url="🛍️",
                live_url="#",
                github_url="#",
                technologies="React, Node.js, MongoDB",
                category="web",
                is_featured=True,
                order_index=0
            ),
            ProjectCreate(
                title="Mobile App",
                description="Cross-platform mobile application for productivity and task management",
                short_description="Productivity mobile app",
                image_url="📱",
                live_url="#",
                github_url="#",
                technologies="React Native, Firebase, Redux",
                category="mobile",
                is_featured=False,
                order_index=1
            ),
            ProjectCreate(
                title="Dashboard Analytics",
                description="Real-time analytics dashboard with beautiful charts and insights",
                short_description="Analytics dashboard",
                image_url="📊",
                live_url="#",
                github_url="#",
                technologies="Vue.js, D3.js, Express",
                category="web",
                is_featured=False,
                order_index=2
            ),
            ProjectCreate(
                title="Design System",
                description="Comprehensive design system for consistent user experiences",
                short_description="Design system",
                image_url="🎨",
                live_url="#",
                github_url="#",
                technologies="Figma, Storybook, CSS",
                category="design",
                is_featured=False,
                order_index=3
            )
        ]
        for proj in projects_data:
            db_proj = Project(**proj.model_dump())
            db.add(db_proj)

        # Testimonials section (frontend default)
        testimonials_data = [
            TestimonialCreate(
                name="Sarah J.",
                position="Product Manager",
                company="TechCorp",
                relation="Former Manager",
                message="Rahul brings creativity and innovation to every project.",
                rating=5,
                order_index=0
            ),
            TestimonialCreate(
                name="Mike C.",
                position="CEO",
                company="StartupXYZ",
                relation="Client",
                message="A game-changer for our company. Truly impressive strategic thinking.",
                rating=5,
                order_index=1
            ),
            TestimonialCreate(
                name="Emily D.",
                position="Lead Designer",
                company="CreativeStudio",
                relation="Peer Collaborator",
                message="His collaborative spirit made our project a huge success!",
                rating=5,
                order_index=2
            ),
            TestimonialCreate(
                name="David W.",
                position="Tech Lead",
                company="InnovateLab",
                relation="Direct Report",
                message="A perfect balance of technical understanding and product vision.",
                rating=5,
                order_index=3
            ),
            TestimonialCreate(
                name="Lisa P.",
                position="UX Designer",
                company="DesignHub",
                relation="Peer Collaborator",
                message="Collaborating with Rahul is always a pleasure. He puts users first.",
                rating=5,
                order_index=4
            ),
            TestimonialCreate(
                name="Alex R.",
                position="Marketing Director",
                company="GrowthCo",
                relation="Stakeholder",
                message="Rahul's strategic thinking helped us achieve amazing results.",
                rating=5,
                order_index=5
            )
        ]
        for t in testimonials_data:
            db_t = Testimonial(**t.model_dump())
            db.add(db_t)

        db.commit()
        print("✅ Synced only frontend-used data for all sections!")
        print(f"About: {len(about_data)} | Experiences: {len(experiences_data)} | Stats: {len(stats_data)} | Projects: {len(projects_data)} | Testimonials: {len(testimonials_data)}")
    except Exception as e:
        print(f"❌ Error syncing frontend data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    sync_frontend_data() 