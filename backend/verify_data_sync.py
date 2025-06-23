#!/usr/bin/env python3
"""
Data Sync Verification Script
Verifies that public and admin endpoints return consistent data
"""

import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8000"

def get_auth_token() -> str:
    """Get authentication token for admin endpoints."""
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        data={"username": "admin", "password": "admin123"}
    )
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        raise Exception("Failed to authenticate")

def get_public_hero() -> Dict[str, Any]:
    """Get hero data from public endpoint."""
    response = requests.get(f"{BASE_URL}/api/hero")
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Public hero endpoint failed: {response.status_code}")

def get_admin_hero(token: str) -> Dict[str, Any]:
    """Get hero data from admin endpoint."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/admin/hero", headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Admin hero endpoint failed: {response.status_code}")

def compare_hero_data(public_data: Dict[str, Any], admin_data: Dict[str, Any]) -> bool:
    """Compare hero data from public and admin endpoints."""
    # Fields to compare (excluding timestamps which might differ slightly)
    fields_to_compare = ['id', 'title', 'subtitle', 'description', 'badge', 'badge_emoji', 'cta_text', 'cta_style', 'is_active']
    
    for field in fields_to_compare:
        if public_data.get(field) != admin_data.get(field):
            print(f"❌ Mismatch in {field}:")
            print(f"   Public: {public_data.get(field)}")
            print(f"   Admin:  {admin_data.get(field)}")
            return False
    
    return True

def main():
    """Main verification function."""
    print("🔍 Verifying data sync between public and admin endpoints...")
    
    try:
        # Get authentication token
        print("🔑 Getting authentication token...")
        token = get_auth_token()
        print("✅ Authentication successful")
        
        # Get data from both endpoints
        print("📡 Fetching hero data from public endpoint...")
        public_hero = get_public_hero()
        print("✅ Public endpoint data retrieved")
        
        print("📡 Fetching hero data from admin endpoint...")
        admin_hero = get_admin_hero(token)
        print("✅ Admin endpoint data retrieved")
        
        # Compare the data
        print("🔍 Comparing data...")
        if compare_hero_data(public_hero, admin_hero):
            print("✅ Data sync verification PASSED!")
            print(f"   Hero ID: {public_hero['id']}")
            print(f"   Title: {public_hero['title']}")
            print(f"   Active: {public_hero['is_active']}")
        else:
            print("❌ Data sync verification FAILED!")
            return False
            
    except Exception as e:
        print(f"❌ Verification failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1) 