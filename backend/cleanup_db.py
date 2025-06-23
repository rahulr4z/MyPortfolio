#!/usr/bin/env python3
"""
Database Cleanup Script
Clean up duplicate records and unused tables.
"""

import sqlite3
import json

def connect_db():
    """Connect to the SQLite database."""
    return sqlite3.connect('portfolio.db')

def check_hero_records():
    """Check and clean up hero records."""
    conn = connect_db()
    cursor = conn.cursor()
    
    print("🔍 Checking Hero Records:")
    print("-" * 50)
    
    # Get all hero records
    cursor.execute("SELECT id, title, subtitle, is_active, created_at FROM hero;")
    records = cursor.fetchall()
    
    print(f"Found {len(records)} hero records:")
    for record in records:
        print(f"  ID: {record[0]}, Title: {record[1]}, Active: {record[3]}, Created: {record[4]}")
    
    if len(records) > 1:
        print("\n⚠️  Multiple hero records found!")
        
        # Find active record
        active_records = [r for r in records if r[3]]
        inactive_records = [r for r in records if not r[3]]
        
        if len(active_records) > 1:
            print("❌ Multiple active hero records found!")
            print("Keeping the most recent active record...")
            
            # Keep the most recent active record
            most_recent = max(active_records, key=lambda x: x[4])
            records_to_delete = [r for r in active_records if r[0] != most_recent[0]]
            
            for record in records_to_delete:
                cursor.execute("DELETE FROM hero WHERE id = ?;", (record[0],))
                print(f"  Deleted hero record ID: {record[0]}")
        
        # Delete all inactive records
        for record in inactive_records:
            cursor.execute("DELETE FROM hero WHERE id = ?;", (record[0],))
            print(f"  Deleted inactive hero record ID: {record[0]}")
        
        conn.commit()
        print("✅ Hero records cleaned up!")
    else:
        print("✅ Only one hero record found - no cleanup needed.")
    
    conn.close()

def check_section_config():
    """Check section_config table."""
    conn = connect_db()
    cursor = conn.cursor()
    
    print("\n⚙️  Checking Section Config:")
    print("-" * 50)
    
    cursor.execute("SELECT COUNT(*) FROM section_config;")
    count = cursor.fetchone()[0]
    
    if count == 0:
        print("❌ No section config found!")
        print("Creating default section config...")
        
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
        
        cursor.execute(
            "INSERT INTO section_config (config, created_at, updated_at) VALUES (?, datetime('now'), datetime('now'));",
            (json.dumps(default_config),)
        )
        conn.commit()
        print("✅ Default section config created!")
    else:
        print(f"✅ Section config found ({count} record(s))")
        
        # Show current config
        cursor.execute("SELECT config FROM section_config LIMIT 1;")
        config_data = cursor.fetchone()
        if config_data:
            config = json.loads(config_data[0])
            print("Current config sections:")
            for section in config.keys():
                print(f"  - {section}")
    
    conn.close()

def check_unused_tables():
    """Check for unused tables."""
    conn = connect_db()
    cursor = conn.cursor()
    
    print("\n🗑️  Checking for Unused Tables:")
    print("-" * 50)
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]
    
    # Define which tables should exist
    expected_tables = {
        'hero', 'about', 'experiences', 'projects', 'stats', 'testimonials',
        'contact_info', 'awards', 'education', 'certifications', 'skills', 'section_config'
    }
    
    unused_tables = set(tables) - expected_tables
    
    if unused_tables:
        print(f"Found {len(unused_tables)} unused table(s):")
        for table in unused_tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table};")
            count = cursor.fetchone()[0]
            print(f"  - {table} ({count} records)")
        
        response = input("\nDo you want to delete these unused tables? (y/N): ").strip().lower()
        if response == 'y':
            for table in unused_tables:
                cursor.execute(f"DROP TABLE {table};")
                print(f"  Deleted table: {table}")
            conn.commit()
            print("✅ Unused tables deleted!")
        else:
            print("❌ Unused tables kept.")
    else:
        print("✅ No unused tables found.")
    
    conn.close()

def show_database_summary():
    """Show a summary of the database."""
    conn = connect_db()
    cursor = conn.cursor()
    
    print("\n📊 Database Summary:")
    print("-" * 50)
    
    tables = ['hero', 'about', 'experiences', 'projects', 'stats', 'testimonials',
              'contact_info', 'awards', 'education', 'certifications', 'skills', 'section_config']
    
    for table in tables:
        try:
            cursor.execute(f"SELECT COUNT(*) FROM {table};")
            count = cursor.fetchone()[0]
            print(f"{table:15}: {count:3} records")
        except sqlite3.OperationalError:
            print(f"{table:15}: table not found")
    
    conn.close()

def main():
    """Main cleanup function."""
    print("🧹 Database Cleanup Tool")
    print("=" * 50)
    
    # Check hero records
    check_hero_records()
    
    # Check section config
    check_section_config()
    
    # Check unused tables
    check_unused_tables()
    
    # Show summary
    show_database_summary()
    
    print("\n✅ Database cleanup completed!")

if __name__ == "__main__":
    main() 