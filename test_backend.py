#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.database import SessionLocal, Testimonial
from sqlalchemy import text

def test_database():
    """Test database connection and basic operations"""
    try:
        db = SessionLocal()
        
        # Test basic query
        result = db.execute(text("SELECT COUNT(*) FROM testimonials"))
        count = result.scalar()
        print(f"✅ Database connection successful. Testimonials count: {count}")
        
        # Test SQLAlchemy ORM
        testimonials = db.query(Testimonial).all()
        print(f"✅ ORM query successful. Found {len(testimonials)} testimonials")
        
        db.close()
        return True
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False

def test_models():
    """Test model imports"""
    try:
        from models.models import TestimonialResponse
        print("✅ Model imports successful")
        return True
    except Exception as e:
        print(f"❌ Model import error: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing backend components...")
    
    if test_models():
        if test_database():
            print("✅ All tests passed!")
        else:
            print("❌ Database test failed")
    else:
        print("❌ Model test failed") 