#!/usr/bin/env python3
"""
Simple test to isolate the testimonials endpoint issue
"""

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from models.database import get_db, Testimonial

# Create minimal FastAPI app
app = FastAPI()

@app.get("/simple/testimonials")
def simple_get_testimonials(db: Session = Depends(get_db)):
    """Simple testimonials endpoint without Pydantic"""
    try:
        testimonials = db.query(Testimonial).filter(Testimonial.is_active == True).order_by(Testimonial.order_index).all()
        result = []
        for t in testimonials:
            result.append({
                "id": t.id,
                "name": t.name,
                "position": t.position,
                "company": t.company,
                "relation": t.relation,
                "message": t.message,
                "rating": t.rating,
                "is_active": t.is_active,
                "order_index": t.order_index,
                "created_at": t.created_at.isoformat() if t.created_at else None,
                "updated_at": t.updated_at.isoformat() if t.updated_at else None
            })
        return result
    except Exception as e:
        return {"error": str(e), "type": type(e).__name__}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002) 