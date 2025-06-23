#!/usr/bin/env python3
"""
Script to add missing created_at and updated_at columns to skills table.
"""

import sqlite3
from pathlib import Path
from datetime import datetime

def add_missing_columns():
    """Add missing columns to skills table."""
    
    db_path = Path(__file__).parent / "portfolio.db"
    
    if not db_path.exists():
        print(f"Database file not found at {db_path}")
        return
    
    print(f"Adding missing columns to database: {db_path}")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if columns exist
        cursor.execute("PRAGMA table_info(skills)")
        columns = [col[1] for col in cursor.fetchall()]
        
        # If created_at or updated_at don't exist, recreate the table
        if 'created_at' not in columns or 'updated_at' not in columns:
            print("Recreating skills table with missing columns...")
            
            # Create new table with all required columns
            cursor.execute("""
                CREATE TABLE skills_new (
                    id INTEGER PRIMARY KEY,
                    category VARCHAR(255) NOT NULL,
                    skills VARCHAR(1000) NOT NULL,
                    is_active BOOLEAN DEFAULT 1,
                    order_index INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Copy existing data
            cursor.execute("""
                INSERT INTO skills_new (id, category, skills, is_active, order_index)
                SELECT id, category, skills, is_active, order_index
                FROM skills
            """)
            
            # Drop old table and rename new one
            cursor.execute("DROP TABLE skills")
            cursor.execute("ALTER TABLE skills_new RENAME TO skills")
            
            print("✓ Recreated skills table with missing columns")
        else:
            print("✓ All required columns already exist in skills table")
        
        # Commit changes
        conn.commit()
        print("\n✅ Database update completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during update: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    add_missing_columns() 