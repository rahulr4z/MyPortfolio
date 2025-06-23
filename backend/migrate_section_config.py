#!/usr/bin/env python3
"""
Section Config Migration Script
Convert section_config JSON to individual section_titles records.
"""

import sqlite3
import json
from datetime import datetime

def connect_db():
    """Connect to the SQLite database."""
    return sqlite3.connect('portfolio.db')

def create_section_titles_table():
    """Create the new section_titles table."""
    conn = connect_db()
    cursor = conn.cursor()
    
    print("🏗️  Creating section_titles table...")
    
    # Create the new table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS section_titles (
            id INTEGER NOT NULL,
            section_name VARCHAR(100) NOT NULL,
            title VARCHAR(255) NOT NULL,
            subtitle VARCHAR(255),
            description TEXT,
            main_title VARCHAR(255),
            emoji VARCHAR(10),
            is_active BOOLEAN DEFAULT 1,
            order_index INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        );
    """)
    
    # Create index
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS ix_section_titles_section_name 
        ON section_titles (section_name);
    """)
    
    conn.commit()
    print("✅ section_titles table created!")
    conn.close()

def migrate_section_config_data():
    """Migrate data from section_config to section_titles."""
    conn = connect_db()
    cursor = conn.cursor()
    
    print("\n🔄 Migrating section config data...")
    
    # Get current section_config data
    cursor.execute("SELECT config FROM section_config LIMIT 1;")
    config_data = cursor.fetchone()
    
    if not config_data:
        print("❌ No section_config data found!")
        return
    
    config = json.loads(config_data[0])
    print(f"Found {len(config)} sections to migrate:")
    
    # Define the order for sections
    section_order = [
        'hero', 'about', 'stats', 'projects', 'experience', 
        'testimonials', 'contact', 'thankYou', 'awards', 
        'education', 'certifications', 'skills'
    ]
    
    # Migrate each section
    for order_index, section_name in enumerate(section_order):
        if section_name in config:
            section_data = config[section_name]
            
            # Extract fields based on section type
            title = section_data.get('title', '')
            subtitle = section_data.get('subtitle', None)
            description = section_data.get('description', None)
            main_title = section_data.get('mainTitle', None)
            emoji = section_data.get('emoji', None)
            
            # Insert into section_titles
            cursor.execute("""
                INSERT INTO section_titles 
                (section_name, title, subtitle, description, main_title, emoji, order_index, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            """, (section_name, title, subtitle, description, main_title, emoji, order_index))
            
            print(f"  ✅ Migrated: {section_name}")
        else:
            print(f"  ⚠️  Section not found: {section_name}")
    
    conn.commit()
    print("✅ Migration completed!")
    conn.close()

def verify_migration():
    """Verify the migration was successful."""
    conn = connect_db()
    cursor = conn.cursor()
    
    print("\n🔍 Verifying migration...")
    
    # Count records
    cursor.execute("SELECT COUNT(*) FROM section_titles;")
    count = cursor.fetchone()[0]
    print(f"Total section_titles records: {count}")
    
    # Show all sections
    cursor.execute("SELECT section_name, title, order_index FROM section_titles ORDER BY order_index;")
    sections = cursor.fetchall()
    
    print("\nMigrated sections:")
    for section in sections:
        print(f"  {section[2]:2d}. {section[0]:15} - {section[1]}")
    
    conn.close()

def backup_old_table():
    """Backup the old section_config table."""
    conn = connect_db()
    cursor = conn.cursor()
    
    print("\n💾 Backing up old section_config table...")
    
    # Rename old table
    cursor.execute("ALTER TABLE section_config RENAME TO section_config_backup;")
    conn.commit()
    
    print("✅ Old table backed up as 'section_config_backup'")
    conn.close()

def main():
    """Main migration function."""
    print("🔄 Section Config Migration Tool")
    print("=" * 50)
    
    # Create new table
    create_section_titles_table()
    
    # Migrate data
    migrate_section_config_data()
    
    # Verify migration
    verify_migration()
    
    # Ask if user wants to backup old table
    response = input("\nDo you want to backup the old section_config table? (Y/n): ").strip().lower()
    if response != 'n':
        backup_old_table()
    
    print("\n✅ Migration completed successfully!")
    print("\nNext steps:")
    print("1. Update your API endpoints to use section_titles")
    print("2. Update your frontend to work with the new structure")
    print("3. Test the new section titles functionality")

if __name__ == "__main__":
    main() 