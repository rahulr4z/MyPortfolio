#!/usr/bin/env python3
"""
Script to update backend and frontend default values with current custom values.
This script will help you synchronize the defaults with what you've set in the admin panel.
"""

import json
import os
import re

# Current custom values (update these with your actual values from admin panel)
CUSTOM_VALUES = {
    "hero": {
        "title": "I Am Rahul Raj",
        "subtitle": "AVP Product", 
        "description": "A passionate product manager with a designer's heart, engineer's mind, and diplomat's tongue. I craft digital experiences to create value for customers.",
        "badge": "Welcome to My Universe",
        "badgeEmoji": "✨"
    },
    "about": {
        "title": "Get to Know Me",
        "mainTitle": "Get to Know Me",
        "description": "A glimpse into my world of innovation and creativity",
        "whoIAm": {
            "title": "Who I Am",
            "description": "Product manager with designer's heart, diplomat's tongue & engineer's brain"
        },
        "whatIDo": {
            "title": "What I Do",
            "description": "Craft digital experiences that users love & businesses value"
        },
        "whatInterestsMe": {
            "title": "What Interests Me",
            "description": "Emerging tech, AI possibilities & real-world impact solutions"
        }
    },
    "stats": {
        "title": "My Journey",
        "mainTitle": "Achievements & Skills",
        "description": "A glimpse into my professional journey and expertise"
    },
    "projects": {
        "title": "My Creations",
        "mainTitle": "Amazing Projects",
        "description": "Check out some of my favorite projects and creations! 🚀"
    },
    "experience": {
        "title": "My Journey",
        "mainTitle": "My Adventure So Far",
        "description": "A colorful journey through the world of product management and innovation! 🌈"
    },
    "testimonials": {
        "title": "What People Say",
        "mainTitle": "Lovely Testimonials",
        "description": "Hear what amazing people have to say about working with me! 💬"
    },
    "contact": {
        "title": "Get In Touch",
        "mainTitle": "Let's Connect",
        "description": "Ready to work together? Let's create something amazing! 🚀"
    },
    "thankYou": {
        "title": "Thank You",
        "mainTitle": "Thanks for Reaching Out!",
        "description": "I'll get back to you as soon as possible. In the meantime, feel free to explore more of my work!",
        "emoji": "🎉"
    }
}

def update_backend_defaults():
    """Update the backend main.py file with new default values."""
    
    backend_file = "main.py"
    if not os.path.exists(backend_file):
        print(f"❌ Backend file {backend_file} not found!")
        return False
    
    try:
        with open(backend_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find the default_config section
        pattern = r'default_config\s*=\s*\{[^}]*\}'
        
        # Create the new default_config string
        new_default_config = "default_config = {\n"
        for section, values in CUSTOM_VALUES.items():
            new_default_config += f'        "{section}": {{\n'
            for key, value in values.items():
                if isinstance(value, dict):
                    new_default_config += f'            "{key}": {{\n'
                    for subkey, subvalue in value.items():
                        new_default_config += f'                "{subkey}": "{subvalue}"\n'
                    new_default_config += '            }\n'
                else:
                    new_default_config += f'            "{key}": "{value}"\n'
            new_default_config += '        },\n'
        new_default_config += '    }'
        
        # Replace the old default_config with the new one
        new_content = re.sub(pattern, new_default_config, content, flags=re.DOTALL)
        
        # Write the updated content back
        with open(backend_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("✅ Backend defaults updated successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error updating backend: {e}")
        return False

def update_frontend_defaults():
    """Update the frontend SectionConfigContext.jsx file with new default values."""
    
    frontend_file = "../frontend/src/contexts/SectionConfigContext.jsx"
    if not os.path.exists(frontend_file):
        print(f"❌ Frontend file {frontend_file} not found!")
        return False
    
    try:
        with open(frontend_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find the defaultConfig section
        pattern = r'const defaultConfig\s*=\s*\{[^}]*\}'
        
        # Create the new defaultConfig string
        new_default_config = "const defaultConfig = {\n"
        for section, values in CUSTOM_VALUES.items():
            new_default_config += f'  {section}: {{\n'
            for key, value in values.items():
                if isinstance(value, dict):
                    new_default_config += f'    {key}: {{\n'
                    for subkey, subvalue in value.items():
                        new_default_config += f'      {subkey}: "{subvalue}"\n'
                    new_default_config += '    }\n'
                else:
                    new_default_config += f'    {key}: "{value}"\n'
            new_default_config += '  },\n'
        new_default_config += '};'
        
        # Replace the old defaultConfig with the new one
        new_content = re.sub(pattern, new_default_config, content, flags=re.DOTALL)
        
        # Write the updated content back
        with open(frontend_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("✅ Frontend defaults updated successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error updating frontend: {e}")
        return False

def main():
    """Main function to update both backend and frontend defaults."""
    
    print("🔄 Updating default values with current custom values...")
    print("\n📋 Custom values to be applied:")
    print(json.dumps(CUSTOM_VALUES, indent=2))
    
    print("\n" + "="*50)
    
    # Update backend
    print("\n🔧 Updating backend defaults...")
    backend_success = update_backend_defaults()
    
    # Update frontend
    print("\n🎨 Updating frontend defaults...")
    frontend_success = update_frontend_defaults()
    
    print("\n" + "="*50)
    
    if backend_success and frontend_success:
        print("\n✅ All defaults updated successfully!")
        print("\n📝 Next steps:")
        print("1. Review the changes in the files")
        print("2. Test the website to ensure everything works")
        print("3. Commit and push the changes to git")
    else:
        print("\n❌ Some updates failed. Please check the errors above.")

if __name__ == "__main__":
    main() 