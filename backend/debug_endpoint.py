#!/usr/bin/env python3
"""
Debug script to test the exact same logic as the FastAPI endpoint
"""

from models.database import get_db, Testimonial
from models.models import TestimonialResponse
from sqlalchemy.orm import Session

def debug_testimonials_endpoint():
    """Debug the exact same logic as the FastAPI endpoint"""
    try:
        print("🔍 Starting debug...")
        
        # Get database session (same as FastAPI dependency)
        db = next(get_db())
        print("✅ Database session created")
        
        # Query testimonials (same as FastAPI endpoint)
        print("🔍 Querying testimonials...")
        testimonials = db.query(Testimonial).filter(Testimonial.is_active == True).order_by(Testimonial.order_index).all()
        print(f"✅ Query successful: {len(testimonials)} testimonials found")
        
        # Convert to Pydantic models (same as FastAPI response_model)
        print("🔍 Converting to Pydantic models...")
        response_models = []
        for testimonial in testimonials:
            response_model = TestimonialResponse.model_validate(testimonial)
            response_models.append(response_model)
        print(f"✅ Pydantic conversion successful: {len(response_models)} models created")
        
        # Convert to dict (same as FastAPI JSON response)
        print("🔍 Converting to dict...")
        result = [model.model_dump() for model in response_models]
        print(f"✅ Dict conversion successful: {len(result)} items")
        
        # Print first item
        if result:
            print(f"✅ First item: {result[0]['name']} - {result[0]['position']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("Debugging testimonials endpoint logic...")
    success = debug_testimonials_endpoint()
    if success:
        print("✅ Debug successful!")
    else:
        print("❌ Debug failed!") 