#!/usr/bin/env python3
"""
Script to add default contact information to the database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.database import SessionLocal, ContactInfo
from sqlalchemy.orm import Session

def add_default_contact_info():
    """Add default contact information to the database"""
    db = SessionLocal()
    try:
        # Check if contact info already exists
        existing_contacts = db.query(ContactInfo).count()
        if existing_contacts > 0:
            print(f"Contact info already exists ({existing_contacts} items). Skipping...")
            return

        # Default contact information
        default_contacts = [
            {
                "type": "email",
                "value": "rahul@example.com",
                "label": "Work Email",
                "is_active": True,
                "order_index": 0
            },
            {
                "type": "phone",
                "value": "+1 (555) 123-4567",
                "label": "Personal Phone",
                "is_active": True,
                "order_index": 1
            },
            {
                "type": "linkedin",
                "value": "linkedin.com/in/rahul-dev",
                "label": "LinkedIn Profile",
                "is_active": True,
                "order_index": 2
            },
            {
                "type": "github",
                "value": "github.com/rahul-dev",
                "label": "GitHub Profile",
                "is_active": True,
                "order_index": 3
            },
            {
                "type": "website",
                "value": "rahul-portfolio.com",
                "label": "Personal Website",
                "is_active": True,
                "order_index": 4
            },
            {
                "type": "address",
                "value": "San Francisco, CA 94102",
                "label": "Location",
                "is_active": True,
                "order_index": 5
            }
        ]

        # Add each contact info item
        for contact_data in default_contacts:
            contact_info = ContactInfo(**contact_data)
            db.add(contact_info)
            print(f"Adding: {contact_data['label']} - {contact_data['value']}")

        db.commit()
        print(f"✅ Successfully added {len(default_contacts)} contact information items!")

    except Exception as e:
        print(f"❌ Error adding contact info: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Adding default contact information...")
    add_default_contact_info()
    print("Done!") 