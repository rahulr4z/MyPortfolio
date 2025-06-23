#!/usr/bin/env python3
"""
Script to remove avatar_url column from testimonials table
Run this script to update existing database schema
"""

import sqlite3
import os
from pathlib import Path

def remove_avatar_column():
    """Remove avatar_url column from testimonials table"""
    
    # Get the database path
    db_path = Path(__file__).parent / "portfolio.db"
    
    if not db_path.exists():
        print("❌ Database file not found!")
        return
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("🔍 Checking current testimonials table structure...")
        
        # Check if avatar_url column exists
        cursor.execute("PRAGMA table_info(testimonials)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        if 'avatar_url' not in column_names:
            print("✅ avatar_url column already removed or doesn't exist")
            return
        
        print("🗑️ Removing avatar_url column from testimonials table...")
        
        # Create a new table without the avatar_url column
        cursor.execute("""
            CREATE TABLE testimonials_new (
                id INTEGER PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                position VARCHAR(255),
                company VARCHAR(255),
                relation VARCHAR(255),
                message TEXT NOT NULL,
                rating INTEGER DEFAULT 5,
                is_active BOOLEAN DEFAULT 1,
                order_index INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Copy data from old table to new table (excluding avatar_url)
        cursor.execute("""
            INSERT INTO testimonials_new 
            (id, name, position, company, relation, message, rating, is_active, order_index, created_at, updated_at)
            SELECT id, name, position, company, relation, message, rating, is_active, order_index, created_at, updated_at
            FROM testimonials
        """)
        
        # Drop the old table
        cursor.execute("DROP TABLE testimonials")
        
        # Rename new table to original name
        cursor.execute("ALTER TABLE testimonials_new RENAME TO testimonials")
        
        # Commit the changes
        conn.commit()
        
        print("✅ Successfully removed avatar_url column from testimonials table")
        print(f"📊 Updated {cursor.rowcount} testimonial records")
        
    except Exception as e:
        print(f"❌ Error removing avatar_url column: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("🚀 Starting avatar_url column removal...")
    remove_avatar_column()
    print("✨ Process completed!") 