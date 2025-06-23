#!/usr/bin/env python3
"""
Minimal test server to verify testimonials endpoint
"""

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from models.database import get_db, Testimonial
from models.models import TestimonialResponse

# Create minimal FastAPI app
app = FastAPI()

@app.get("/test/testimonials")
def test_get_testimonials(db: Session = Depends(get_db)):
    """Test testimonials endpoint"""
    try:
        testimonials = db.query(Testimonial).filter(Testimonial.is_active == True).order_by(Testimonial.order_index).all()
        return [TestimonialResponse.model_validate(t) for t in testimonials]
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001) 