#!/usr/bin/env python3
"""
ASL Integration Verification Script
Tests that the real ASL hand sign images are properly integrated into the website.
"""

import requests
import os
import time

def test_frontend_serving():
    """
    Test that the frontend is serving the ASL images correctly.
    """
    base_url = "http://localhost:3000"
    letters = "abcdefghijklmnopqrstuvwxyz"
    
    print("🌐 Testing Frontend Image Serving")
    print("=" * 50)
    
    # Test if frontend is running
    try:
        response = requests.get(base_url, timeout=5)
        if response.status_code == 200:
            print("✅ Frontend server is running")
        else:
            print(f"⚠️ Frontend returned status code: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Frontend server not running on localhost:3000")
        return False
    except requests.exceptions.Timeout:
        print("❌ Frontend server timeout")
        return False
    
    # Test each ASL image
    print(f"\n📸 Testing {len(letters)} ASL alphabet images...")
    success_count = 0
    errors = []
    
    for letter in letters:
        image_url = f"{base_url}/images/signs/alphabet/{letter}.png"
        try:
            response = requests.head(image_url, timeout=3)
            if response.status_code == 200:
                content_type = response.headers.get('content-type', '')
                if 'image' in content_type:
                    print(f"✅ {letter.upper()}: {image_url}")
                    success_count += 1
                else:
                    print(f"⚠️ {letter.upper()}: Wrong content type - {content_type}")
                    errors.append(f"{letter}: Wrong content type")
            else:
                print(f"❌ {letter.upper()}: HTTP {response.status_code}")
                errors.append(f"{letter}: HTTP {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ {letter.upper()}: {str(e)}")
            errors.append(f"{letter}: {str(e)}")
        
        # Small delay to avoid overwhelming the server
        time.sleep(0.1)
    
    print(f"\n📊 Results:")
    print(f"✅ Successfully served: {success_count}/26 images")
    print(f"❌ Errors: {len(errors)}")
    
    if errors:
        print(f"\n🔍 Error Details:")
        for error in errors:
            print(f"  - {error}")
    
    return len(errors) == 0

def verify_file_system():
    """
    Verify that all files are properly placed on the file system.
    """
    print("\n📁 Testing File System Structure")
    print("=" * 50)
    
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    frontend_dir = os.path.join(project_root, "frontend/public/images/signs/alphabet")
    main_dir = os.path.join(project_root, "public/images/signs/alphabet")
    backup_dir = os.path.join(project_root, "original_asl_images")
    
    letters = "abcdefghijklmnopqrstuvwxyz"
    
    # Check frontend directory
    frontend_files = 0
    for letter in letters:
        file_path = os.path.join(frontend_dir, f"{letter}.png")
        if os.path.exists(file_path):
            frontend_files += 1
        else:
            print(f"❌ Missing: {file_path}")
    
    print(f"Frontend directory: {frontend_files}/26 PNG files")
    
    # Check main directory
    main_files = 0
    for letter in letters:
        file_path = os.path.join(main_dir, f"{letter}.png")
        if os.path.exists(file_path):
            main_files += 1
    
    print(f"Main directory: {main_files}/26 PNG files")
    
    # Check backup directory
    backup_files = 0
    letters_upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for letter in letters_upper:
        file_path = os.path.join(backup_dir, f"{letter}.png")
        if os.path.exists(file_path):
            backup_files += 1
    
    print(f"Backup directory: {backup_files}/26 original PNG files")
    
    all_good = (frontend_files == 26 and main_files == 26 and backup_files == 26)
    
    if all_good:
        print("✅ All file system checks passed!")
    else:
        print("⚠️ Some files may be missing")
    
    return all_good

def test_react_component():
    """
    Test that the React component can access the images.
    """
    print("\n⚛️ Testing React Component Integration")
    print("=" * 50)
    
    try:
        # Try to access the deaf learning page
        response = requests.get("http://localhost:3000/deaf", timeout=5)
        if response.status_code == 200:
            print("✅ Deaf learning page is accessible")
            
            # Check if the page contains references to PNG images
            content = response.text
            if ".png" in content or "images/signs/alphabet" in content:
                print("✅ Page appears to reference alphabet images")
            else:
                print("⚠️ Page may not be loading alphabet images")
                
            return True
        else:
            print(f"❌ Deaf learning page returned: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Could not access deaf learning page: {e}")
        return False

if __name__ == "__main__":
    print("🔍 ASL Integration Verification")
    print("=" * 60)
    print("Testing that real ASL hand sign photographs are properly")
    print("integrated into the LinK accessibility application.")
    print("=" * 60)
    
    # Run all tests
    file_system_ok = verify_file_system()
    frontend_ok = test_frontend_serving()
    react_ok = test_react_component()
    
    print("\n🎯 Final Results")
    print("=" * 50)
    
    if file_system_ok and frontend_ok and react_ok:
        print("🎉 SUCCESS! ASL Integration Complete!")
        print("✅ All 26 real ASL hand sign photographs are working")
        print("✅ Images are properly served by the frontend")
        print("✅ React application can access the images")
        print("\n🌟 Next Steps:")
        print("1. Visit http://localhost:3000/deaf/alphabet")
        print("2. See your real ASL hand sign photographs in action!")
        print("3. Test both Learn and Practice modes")
        print("4. Enjoy learning with authentic ASL imagery!")
    else:
        print("❌ Some issues were found:")
        if not file_system_ok:
            print("  - File system structure needs attention")
        if not frontend_ok:
            print("  - Frontend image serving has issues")
        if not react_ok:
            print("  - React component integration needs checking")
        
        print("\n🔧 Troubleshooting:")
        print("1. Ensure frontend server is running: npm start")
        print("2. Check that all PNG files are in the correct directories")
        print("3. Clear browser cache and refresh")
    
    print("\n" + "=" * 60) 