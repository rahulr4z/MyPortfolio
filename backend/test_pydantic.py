#!/usr/bin/env python3
"""
Test script to verify Pydantic testimonial response model
"""

from models.database import get_db, Testimonial
from models.models import TestimonialResponse

def test_pydantic_response():
    """Test Pydantic testimonial response model"""
    try:
        # Get database session
        db = next(get_db())
        
        # Query testimonials
        testimonials = db.query(Testimonial).filter(Testimonial.is_active == True).order_by(Testimonial.order_index).all()
        
        print(f"✅ Found {len(testimonials)} active testimonials")
        
        # Test Pydantic response model
        if testimonials:
            first = testimonials[0]
            print(f"✅ Testing Pydantic response for: {first.name}")
            
            # Convert to Pydantic model
            response = TestimonialResponse.model_validate(first)
            print(f"✅ Pydantic conversion successful")
            print(f"   Response: {response.model_dump()}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("Testing Pydantic testimonial response model...")
    success = test_pydantic_response()
    if success:
        print("✅ Test passed!")
    else:
        print("❌ Test failed!") 