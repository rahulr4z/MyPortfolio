#!/usr/bin/env python3
"""
Database Access Script
Use this script to easily query and manage your portfolio database.
"""

import sqlite3
import json
from datetime import datetime

def connect_db():
    """Connect to the SQLite database."""
    return sqlite3.connect('portfolio.db')

def view_tables():
    """Show all tables in the database."""
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("📋 Available tables:")
    for table in tables:
        print(f"  - {table[0]}")
    conn.close()

def view_table_structure(table_name):
    """Show the structure of a specific table."""
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(f"PRAGMA table_info({table_name});")
    columns = cursor.fetchall()
    print(f"📊 Structure of '{table_name}' table:")
    for col in columns:
        print(f"  - {col[1]} ({col[2]}) {'NOT NULL' if col[3] else ''}")
    conn.close()

def query_table(table_name, limit=10):
    """Query all data from a table."""
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table_name} LIMIT {limit};")
    rows = cursor.fetchall()
    
    # Get column names
    cursor.execute(f"PRAGMA table_info({table_name});")
    columns = [col[1] for col in cursor.fetchall()]
    
    print(f"📄 Data from '{table_name}' table (showing {len(rows)} rows):")
    print("-" * 80)
    
    for i, row in enumerate(rows, 1):
        print(f"Row {i}:")
        for col_name, value in zip(columns, row):
            print(f"  {col_name}: {value}")
        print()
    
    conn.close()

def view_hero_data():
    """View hero section data."""
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM hero;")
    rows = cursor.fetchall()
    
    cursor.execute("PRAGMA table_info(hero);")
    columns = [col[1] for col in cursor.fetchall()]
    
    print("👑 Hero Section Data:")
    print("-" * 80)
    
    for row in rows:
        for col_name, value in zip(columns, row):
            print(f"{col_name}: {value}")
        print()
    
    conn.close()

def view_section_config():
    """View section configuration data."""
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM section_config;")
    rows = cursor.fetchall()
    
    print("⚙️ Section Configuration:")
    print("-" * 80)
    
    for row in rows:
        print(f"ID: {row[0]}")
        print(f"Config: {json.dumps(json.loads(row[1]), indent=2)}")
        print(f"Created: {row[2]}")
        print(f"Updated: {row[3]}")
        print()
    
    conn.close()

def count_records():
    """Count records in each table."""
    conn = connect_db()
    cursor = conn.cursor()
    
    tables = ['hero', 'about', 'experiences', 'projects', 'stats', 'testimonials', 
              'contacts', 'contact_info', 'awards', 'education', 'certifications', 
              'skills', 'section_config']
    
    print("📊 Record counts:")
    print("-" * 40)
    
    for table in tables:
        try:
            cursor.execute(f"SELECT COUNT(*) FROM {table};")
            count = cursor.fetchone()[0]
            print(f"{table:15}: {count:3} records")
        except sqlite3.OperationalError:
            print(f"{table:15}: table not found")
    
    conn.close()

def main():
    """Main function with menu."""
    while True:
        print("\n" + "="*60)
        print("🗄️  Portfolio Database Access Tool")
        print("="*60)
        print("1. View all tables")
        print("2. View table structure")
        print("3. Query table data")
        print("4. View hero data")
        print("5. View section config")
        print("6. Count records")
        print("7. Exit")
        print("-"*60)
        
        choice = input("Enter your choice (1-7): ").strip()
        
        if choice == '1':
            view_tables()
        elif choice == '2':
            table = input("Enter table name: ").strip()
            view_table_structure(table)
        elif choice == '3':
            table = input("Enter table name: ").strip()
            limit = input("Enter limit (default 10): ").strip()
            limit = int(limit) if limit.isdigit() else 10
            query_table(table, limit)
        elif choice == '4':
            view_hero_data()
        elif choice == '5':
            view_section_config()
        elif choice == '6':
            count_records()
        elif choice == '7':
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice. Please try again.")

if __name__ == "__main__":
    main() 