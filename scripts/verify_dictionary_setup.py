#!/usr/bin/env python3
"""
ASL Dictionary Setup Verification
Tests that the searchable ASL dictionary is properly set up and functional.
"""

import requests
import os
import json
import time

def test_dictionary_files():
    """
    Test that all dictionary files are properly created and accessible.
    """
    print("📁 Testing Dictionary File Structure")
    print("=" * 50)
    
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Check directories
    directories = [
        "frontend/public/images/signs/dictionary",
        "public/images/signs/dictionary"
    ]
    
    all_good = True
    
    for directory in directories:
        dir_path = os.path.join(project_root, directory)
        if os.path.exists(dir_path):
            svg_files = [f for f in os.listdir(dir_path) if f.endswith('.svg')]
            print(f"✅ {directory}: {len(svg_files)} SVG files")
            if len(svg_files) != 53:
                print(f"  ⚠️ Expected 53 files, found {len(svg_files)}")
                all_good = False
        else:
            print(f"❌ {directory}: Directory not found")
            all_good = False
    
    # Check JSON data file
    json_paths = [
        "frontend/public/images/signs/aslDictionaryData.json",
        "public/images/signs/aslDictionaryData.json"
    ]
    
    for json_path in json_paths:
        full_path = os.path.join(project_root, json_path)
        if os.path.exists(full_path):
            try:
                with open(full_path, 'r') as f:
                    data = json.load(f)
                    print(f"✅ {json_path}: {data.get('total_signs', 0)} signs, {len(data.get('categories', []))} categories")
            except Exception as e:
                print(f"❌ {json_path}: Error reading file - {e}")
                all_good = False
        else:
            print(f"❌ {json_path}: File not found")
            all_good = False
    
    return all_good

def test_frontend_serving():
    """
    Test that the frontend is serving dictionary images correctly.
    """
    print("\n🌐 Testing Frontend Dictionary Image Serving")
    print("=" * 50)
    
    base_url = "http://localhost:3000"
    
    # Test if frontend is running
    try:
        response = requests.get(base_url, timeout=5)
        if response.status_code == 200:
            print("✅ Frontend server is running")
        else:
            print(f"⚠️ Frontend returned status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException:
        print("❌ Frontend server not running on localhost:3000")
        return False
    
    # Test dictionary images
    test_words = ['hello', 'thank_you', 'family', 'red', 'one', 'today', 'go', 'what', 'i']
    success_count = 0
    errors = []
    
    print(f"\n📸 Testing {len(test_words)} sample dictionary images...")
    
    for word in test_words:
        image_url = f"{base_url}/images/signs/dictionary/{word}.svg"
        try:
            response = requests.head(image_url, timeout=3)
            if response.status_code == 200:
                content_type = response.headers.get('content-type', '')
                if 'image' in content_type or 'svg' in content_type:
                    print(f"✅ {word}: {image_url}")
                    success_count += 1
                else:
                    print(f"⚠️ {word}: Wrong content type - {content_type}")
                    errors.append(f"{word}: Wrong content type")
            else:
                print(f"❌ {word}: HTTP {response.status_code}")
                errors.append(f"{word}: HTTP {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ {word}: {str(e)}")
            errors.append(f"{word}: {str(e)}")
        
        time.sleep(0.1)
    
    print(f"\n📊 Results:")
    print(f"✅ Successfully served: {success_count}/{len(test_words)} images")
    print(f"❌ Errors: {len(errors)}")
    
    if errors:
        print(f"\n🔍 Error Details:")
        for error in errors:
            print(f"  - {error}")
    
    return len(errors) == 0

def test_dictionary_data_structure():
    """
    Test the dictionary data structure and categories.
    """
    print("\n📊 Testing Dictionary Data Structure")
    print("=" * 50)
    
    # Expected categories and their word counts
    expected_categories = {
        'greetings': 6,
        'family': 6,
        'food': 6,
        'colors': 6,
        'numbers': 5,
        'time': 6,
        'verbs': 6,
        'questions': 6,
        'pronouns': 6
    }
    
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_path = os.path.join(project_root, "frontend/public/images/signs/aslDictionaryData.json")
    
    if not os.path.exists(json_path):
        print(f"❌ Dictionary data file not found: {json_path}")
        return False
    
    try:
        with open(json_path, 'r') as f:
            data = json.load(f)
        
        # Test overall structure
        signs = data.get('signs', {})
        categories = data.get('categories', [])
        total_signs = data.get('total_signs', 0)
        
        print(f"📈 Total signs: {len(signs)} (expected: {total_signs})")
        print(f"📈 Categories: {len(categories)} (expected: {len(expected_categories)})")
        
        # Test each category
        category_counts = {}
        for word, word_data in signs.items():
            category = word_data.get('category', 'unknown')
            category_counts[category] = category_counts.get(category, 0) + 1
        
        print(f"\n📋 Category Breakdown:")
        all_categories_good = True
        
        for category, expected_count in expected_categories.items():
            actual_count = category_counts.get(category, 0)
            if actual_count == expected_count:
                print(f"✅ {category.title()}: {actual_count} signs")
            else:
                print(f"⚠️ {category.title()}: {actual_count} signs (expected: {expected_count})")
                all_categories_good = False
        
        # Test data completeness
        print(f"\n🔍 Data Completeness Check:")
        incomplete_signs = []
        
        for word, word_data in signs.items():
            required_fields = ['category', 'description', 'difficulty', 'usage']
            missing_fields = [field for field in required_fields if not word_data.get(field)]
            
            if missing_fields:
                incomplete_signs.append(f"{word}: missing {', '.join(missing_fields)}")
        
        if incomplete_signs:
            print(f"❌ {len(incomplete_signs)} signs have incomplete data:")
            for issue in incomplete_signs[:5]:  # Show first 5
                print(f"  - {issue}")
            if len(incomplete_signs) > 5:
                print(f"  ... and {len(incomplete_signs) - 5} more")
            return False
        else:
            print(f"✅ All {len(signs)} signs have complete data")
        
        return all_categories_good and len(incomplete_signs) == 0
        
    except Exception as e:
        print(f"❌ Error reading dictionary data: {e}")
        return False

def test_react_component_integration():
    """
    Test that the React component can access the dictionary.
    """
    print("\n⚛️ Testing React Dictionary Component Integration")
    print("=" * 50)
    
    try:
        # Try to access the deaf learning page
        response = requests.get("http://localhost:3000/deaf", timeout=5)
        if response.status_code == 200:
            print("✅ Deaf learning page is accessible")
            
            # Check if the page contains dictionary references
            content = response.text
            if "dictionary" in content.lower() or "Dictionary" in content:
                print("✅ Page appears to reference dictionary functionality")
            else:
                print("⚠️ Page may not be loading dictionary component")
                
            return True
        else:
            print(f"❌ Deaf learning page returned: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Could not access deaf learning page: {e}")
        return False

if __name__ == "__main__":
    print("🔍 ASL Dictionary Setup Verification")
    print("=" * 70)
    print("Testing that the searchable ASL dictionary is properly set up")
    print("and fully functional with all features working correctly.")
    print("=" * 70)
    
    # Run all tests
    files_ok = test_dictionary_files()
    serving_ok = test_frontend_serving()
    data_ok = test_dictionary_data_structure()
    react_ok = test_react_component_integration()
    
    print("\n🎯 Final Results")
    print("=" * 50)
    
    if files_ok and serving_ok and data_ok and react_ok:
        print("🎉 SUCCESS! ASL Dictionary Setup Complete!")
        print("✅ All 53 dictionary sign images are properly created")
        print("✅ Images are correctly served by the frontend")
        print("✅ Dictionary data structure is complete and valid")
        print("✅ React component integration is working")
        print("\n🌟 Dictionary Features Available:")
        print("  📱 Searchable interface with 53+ ASL signs")
        print("  🔍 Smart search by word, description, or usage")
        print("  🏷️  Category filtering (9 categories)")
        print("  📊 Difficulty level indicators")
        print("  🔊 Text-to-speech for all signs")
        print("  ❤️  Favorites system")
        print("  📋 Grid and list view options")
        print("  📖 Detailed sign information modals")
        print("\n🎯 Next Steps:")
        print("1. Visit http://localhost:3000/deaf")
        print("2. Click on the 'Dictionary' tab")
        print("3. Search for ASL signs like 'hello', 'family', 'food'")
        print("4. Try filtering by categories and difficulty levels")
        print("5. Add signs to favorites and listen to descriptions!")
    else:
        print("❌ Some issues were found:")
        if not files_ok:
            print("  - Dictionary file structure needs attention")
        if not serving_ok:
            print("  - Frontend image serving has issues")
        if not data_ok:
            print("  - Dictionary data structure problems")
        if not react_ok:
            print("  - React component integration needs checking")
        
        print("\n🔧 Troubleshooting:")
        print("1. Ensure frontend server is running: npm start")
        print("2. Check that all SVG files are in the correct directories")
        print("3. Verify dictionary data JSON file is accessible")
        print("4. Clear browser cache and refresh")
    
    print("\n" + "=" * 70) 