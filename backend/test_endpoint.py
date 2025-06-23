#!/usr/bin/env python3
"""
Test script to verify testimonials endpoint functionality
"""

import requests
import json

def test_testimonials_endpoint():
    """Test the testimonials endpoint directly"""
    try:
        # Test the endpoint
        response = requests.get("http://localhost:8000/api/testimonials")
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Found {len(data)} testimonials")
            if data:
                print(f"First testimonial: {data[0]['name']}")
        else:
            print(f"❌ Error: {response.text}")
            
        return response.status_code == 200
        
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return False

if __name__ == "__main__":
    print("Testing testimonials endpoint...")
    success = test_testimonials_endpoint()
    if success:
        print("✅ Endpoint test passed!")
    else:
        print("❌ Endpoint test failed!") 