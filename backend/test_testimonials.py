#!/usr/bin/env python3
"""
Test script to verify testimonial model functionality
"""

from models.database import get_db, Testimonial
from sqlalchemy.orm import Session

def test_testimonials():
    """Test testimonial model functionality"""
    try:
        # Get database session
        db = next(get_db())
        
        # Query testimonials
        testimonials = db.query(Testimonial).filter(Testimonial.is_active == True).order_by(Testimonial.order_index).all()
        
        print(f"✅ Found {len(testimonials)} active testimonials")
        
        # Print first testimonial details
        if testimonials:
            first = testimonials[0]
            print(f"✅ First testimonial: {first.name} - {first.position}")
            print(f"   Company: {first.company}")
            print(f"   Relation: {first.relation}")
            print(f"   Message: {first.message[:50]}...")
            print(f"   Rating: {first.rating}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("Testing testimonial model...")
    success = test_testimonials()
    if success:
        print("✅ Test passed!")
    else:
        print("❌ Test failed!") 