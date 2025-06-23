#!/usr/bin/env python3
"""
Fix Section Config Script
Update section_config with all missing sections.
"""

import sqlite3
import json
from datetime import datetime

def connect_db():
    """Connect to the SQLite database."""
    return sqlite3.connect('portfolio.db')

def update_section_config():
    """Update section_config with complete configuration."""
    conn = connect_db()
    cursor = conn.cursor()
    
    print("⚙️  Updating Section Config:")
    print("-" * 50)
    
    # Get current config
    cursor.execute("SELECT config FROM section_config LIMIT 1;")
    current_data = cursor.fetchone()
    
    if current_data:
        current_config = json.loads(current_data[0])
        print(f"Current sections: {list(current_config.keys())}")
    else:
        current_config = {}
        print("No current config found.")
    
    # Complete configuration
    complete_config = {
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
    
    # Merge current config with complete config (preserve any custom values)
    for section, config in complete_config.items():
        if section not in current_config:
            current_config[section] = config
            print(f"  Added section: {section}")
        else:
            print(f"  Section exists: {section}")
    
    # Update the database
    cursor.execute(
        "UPDATE section_config SET config = ?, updated_at = datetime('now') WHERE id = 1;",
        (json.dumps(current_config),)
    )
    conn.commit()
    
    print(f"\n✅ Section config updated!")
    print(f"Total sections: {len(current_config)}")
    print("Sections:", list(current_config.keys()))
    
    conn.close()

def main():
    """Main function."""
    print("🔧 Section Config Fix Tool")
    print("=" * 50)
    
    update_section_config()
    
    print("\n✅ Section config fix completed!")

if __name__ == "__main__":
    main() 