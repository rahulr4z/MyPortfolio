#!/usr/bin/env python3
import requests
import json
import time

# Backend API URL
BASE_URL = "https://rahul-portfolio-backend.fly.dev"

# Admin credentials
ADMIN_USERNAME = "rahul"
ADMIN_PASSWORD = "blackjack"

def login():
    """Login to get access token"""
    login_data = {
        "username": ADMIN_USERNAME,
        "password": ADMIN_PASSWORD
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data)
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        print(f"Login failed: {response.status_code}")
        return None

def load_backup_data():
    """Load the backup data from file"""
    try:
        with open('custom_data_backup.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Backup file not found!")
        return None

def update_stat(stat_id, data, token):
    """Update a stat"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Remove id from data for update
    update_data = {k: v for k, v in data.items() if k != 'id'}
    
    response = requests.put(f"{BASE_URL}/api/stats/{stat_id}", 
                          headers=headers, 
                          json=update_data)
    
    if response.status_code == 200:
        print(f"✅ Updated stat: {data['label']}")
        return True
    else:
        print(f"❌ Failed to update stat {stat_id}: {response.status_code}")
        return False

def update_about(about_id, data, token):
    """Update an about item"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    update_data = {k: v for k, v in data.items() if k != 'id'}
    
    response = requests.put(f"{BASE_URL}/api/about/{about_id}", 
                          headers=headers, 
                          json=update_data)
    
    if response.status_code == 200:
        print(f"✅ Updated about: {data['title']}")
        return True
    else:
        print(f"❌ Failed to update about {about_id}: {response.status_code}")
        return False

def update_experience(exp_id, data, token):
    """Update an experience item"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    update_data = {k: v for k, v in data.items() if k != 'id'}
    
    response = requests.put(f"{BASE_URL}/api/experiences/{exp_id}", 
                          headers=headers, 
                          json=update_data)
    
    if response.status_code == 200:
        print(f"✅ Updated experience: {data['position']} at {data['company']}")
        return True
    else:
        print(f"❌ Failed to update experience {exp_id}: {response.status_code}")
        return False

def update_project(project_id, data, token):
    """Update a project"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    update_data = {k: v for k, v in data.items() if k != 'id'}
    
    response = requests.put(f"{BASE_URL}/api/projects/{project_id}", 
                          headers=headers, 
                          json=update_data)
    
    if response.status_code == 200:
        print(f"✅ Updated project: {data['title']}")
        return True
    else:
        print(f"❌ Failed to update project {project_id}: {response.status_code}")
        return False

def update_testimonial(testimonial_id, data, token):
    """Update a testimonial"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    update_data = {k: v for k, v in data.items() if k != 'id'}
    
    response = requests.put(f"{BASE_URL}/api/testimonials/{testimonial_id}", 
                          headers=headers, 
                          json=update_data)
    
    if response.status_code == 200:
        print(f"✅ Updated testimonial: {data['name']}")
        return True
    else:
        print(f"❌ Failed to update testimonial {testimonial_id}: {response.status_code}")
        return False

def main():
    print("🔄 Restoring custom data from backup...")
    
    # Login
    token = login()
    if not token:
        print("Failed to login. Please check your credentials.")
        return
    
    # Load backup data
    backup_data = load_backup_data()
    if not backup_data:
        return
    
    success_count = 0
    total_count = 0
    
    # Update stats
    if 'stats' in backup_data:
        print("\n📊 Updating stats...")
        for stat in backup_data['stats']:
            total_count += 1
            if update_stat(stat['id'], stat, token):
                success_count += 1
            time.sleep(0.5)  # Rate limiting
    
    # Update about
    if 'about' in backup_data:
        print("\n👤 Updating about...")
        for about in backup_data['about']:
            total_count += 1
            if update_about(about['id'], about, token):
                success_count += 1
            time.sleep(0.5)
    
    # Update experiences
    if 'experiences' in backup_data:
        print("\n💼 Updating experiences...")
        for exp in backup_data['experiences']:
            total_count += 1
            if update_experience(exp['id'], exp, token):
                success_count += 1
            time.sleep(0.5)
    
    # Update projects
    if 'projects' in backup_data:
        print("\n🚀 Updating projects...")
        for project in backup_data['projects']:
            total_count += 1
            if update_project(project['id'], project, token):
                success_count += 1
            time.sleep(0.5)
    
    # Update testimonials
    if 'testimonials' in backup_data:
        print("\n💬 Updating testimonials...")
        for testimonial in backup_data['testimonials']:
            total_count += 1
            if update_testimonial(testimonial['id'], testimonial, token):
                success_count += 1
            time.sleep(0.5)
    
    print(f"\n🎉 Restoration complete!")
    print(f"✅ Successfully updated: {success_count}/{total_count} items")
    
    if success_count == total_count:
        print("🎯 All custom data has been successfully restored!")
    else:
        print("⚠️ Some items failed to update. Check the logs above.")

if __name__ == "__main__":
    main() 