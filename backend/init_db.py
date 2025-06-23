#!/usr/bin/env python3
"""
Database Initialization Script
This script initializes the database by creating all tables defined in the models.
"""

import sys
import os

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def init_database():
    """Initialize the database by importing models."""
    try:
        print("🔧 Initializing database...")
        
        # Import models - this will trigger Base.metadata.create_all(bind=engine)
        from models.database import Base, engine
        
        print("✅ Database tables created successfully!")
        print("📋 Tables created:")
        
        # List all tables
        for table_name in Base.metadata.tables.keys():
            print(f"  - {table_name}")
            
        return True
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        return False

if __name__ == "__main__":
    success = init_database()
    if success:
        print("\n🎉 Database initialization completed!")
    else:
        print("\n💥 Database initialization failed!")
        sys.exit(1) 