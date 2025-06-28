#!/usr/bin/env python3
"""
Process uploaded sign language images and crop individual signs
for the Common Signs tab in the LinK application.
"""

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import os
import json
import matplotlib.pyplot as plt

def create_directories():
    """Create necessary directories for processed images"""
    directories = [
        'public/images/signs/common',
        'frontend/public/images/signs/common',
        'processed_signs'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"Created directory: {directory}")

def analyze_grid_structure(image_path):
    """Analyze the grid structure of a sign language chart"""
    print(f"\nAnalyzing: {image_path}")
    
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: Could not read {image_path}")
        return None
    
    height, width = img.shape[:2]
    print(f"Image size: {width}x{height}")
    
    # Convert to grayscale for analysis
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Detect edges to find grid structure
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)
    
    # Find horizontal and vertical lines
    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (25, 1))
    vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 25))
    
    horizontal_lines = cv2.morphologyEx(edges, cv2.MORPH_OPEN, horizontal_kernel)
    vertical_lines = cv2.morphologyEx(edges, cv2.MORPH_OPEN, vertical_kernel)
    
    # Combine lines
    grid_lines = cv2.add(horizontal_lines, vertical_lines)
    
    # Find contours to identify grid cells
    contours, _ = cv2.findContours(grid_lines, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    return {
        'image': img,
        'width': width,
        'height': height,
        'grid_lines': grid_lines,
        'contours': contours
    }

def process_sign_language_chart(image_path, signs_data):
    """Process a sign language chart and extract individual signs"""
    analysis = analyze_grid_structure(image_path)
    if analysis is None:
        return []
    
    img = analysis['image']
    width, height = analysis['width'], analysis['height']
    
    extracted_signs = []
    
    # Process different chart layouts based on filename
    if 'common sign language.jpg' in image_path:
        # This appears to be a grid of common signs
        extracted_signs.extend(process_common_signs_grid(img, signs_data))
    
    elif 'commonSign.jpeg' in image_path:
        # This appears to be an illustrated chart
        extracted_signs.extend(process_illustrated_signs(img, signs_data))
    
    elif 'sign.jpg' in image_path or 'dict1.jpg' in image_path:
        # These appear to be dictionary-style charts
        extracted_signs.extend(process_dictionary_chart(img, signs_data))
    
    return extracted_signs

def process_common_signs_grid(img, signs_data):
    """Process the common sign language grid"""
    height, width = img.shape[:2]
    
    # Common signs visible in typical charts
    common_signs = [
        'hello', 'thank_you', 'please', 'sorry', 'goodbye', 'yes', 'no',
        'mother', 'father', 'family', 'friend', 'help', 'love',
        'eat', 'drink', 'water', 'more', 'finished', 'good', 'bad',
        'happy', 'sad', 'hot', 'cold', 'big', 'small', 'beautiful'
    ]
    
    # Estimate grid layout (assuming roughly 6x5 grid for 30 signs)
    rows = 5
    cols = 6
    
    cell_width = width // cols
    cell_height = height // rows
    
    extracted_signs = []
    
    for row in range(rows):
        for col in range(cols):
            if row * cols + col >= len(common_signs):
                break
                
            sign_name = common_signs[row * cols + col]
            
            # Calculate cell boundaries with some padding
            x1 = col * cell_width + 10
            y1 = row * cell_height + 10
            x2 = (col + 1) * cell_width - 10
            y2 = (row + 1) * cell_height - 10
            
            # Extract the sign region
            sign_region = img[y1:y2, x1:x2]
            
            if sign_region.size > 0:
                extracted_signs.append({
                    'name': sign_name,
                    'image': sign_region,
                    'category': signs_data.get(sign_name, {}).get('category', 'common'),
                    'description': signs_data.get(sign_name, {}).get('description', f'Sign for {sign_name}')
                })
    
    return extracted_signs

def process_illustrated_signs(img, signs_data):
    """Process illustrated sign charts with people demonstrating signs"""
    height, width = img.shape[:2]
    
    # For illustrated charts, we'll extract sections showing different signs
    illustrated_signs = [
        'hello', 'goodbye', 'please', 'thank_you', 'yes', 'no'
    ]
    
    # Divide into sections for illustrated signs
    rows = 2
    cols = 3
    
    cell_width = width // cols
    cell_height = height // rows
    
    extracted_signs = []
    
    for i, sign_name in enumerate(illustrated_signs):
        if i >= rows * cols:
            break
            
        row = i // cols
        col = i % cols
        
        x1 = col * cell_width + 20
        y1 = row * cell_height + 20
        x2 = (col + 1) * cell_width - 20
        y2 = (row + 1) * cell_height - 20
        
        sign_region = img[y1:y2, x1:x2]
        
        if sign_region.size > 0:
            extracted_signs.append({
                'name': sign_name,
                'image': sign_region,
                'category': signs_data.get(sign_name, {}).get('category', 'greetings'),
                'description': signs_data.get(sign_name, {}).get('description', f'Illustrated sign for {sign_name}')
            })
    
    return extracted_signs

def process_dictionary_chart(img, signs_data):
    """Process dictionary-style sign charts"""
    height, width = img.shape[:2]
    
    # Dictionary signs - these often have more detailed layouts
    dictionary_signs = [
        'family', 'mother', 'father', 'sister', 'brother',
        'eat', 'drink', 'water', 'milk', 'bread',
        'red', 'blue', 'green', 'yellow', 'black',
        'one', 'two', 'three', 'five', 'ten'
    ]
    
    # Assume a 4x5 grid layout
    rows = 5
    cols = 4
    
    cell_width = width // cols
    cell_height = height // rows
    
    extracted_signs = []
    
    for i, sign_name in enumerate(dictionary_signs):
        if i >= rows * cols:
            break
            
        row = i // cols
        col = i % cols
        
        x1 = col * cell_width + 15
        y1 = row * cell_height + 15
        x2 = (col + 1) * cell_width - 15
        y2 = (row + 1) * cell_height - 15
        
        sign_region = img[y1:y2, x1:x2]
        
        if sign_region.size > 0:
            extracted_signs.append({
                'name': sign_name,
                'image': sign_region,
                'category': signs_data.get(sign_name, {}).get('category', 'dictionary'),
                'description': signs_data.get(sign_name, {}).get('description', f'Dictionary sign for {sign_name}')
            })
    
    return extracted_signs

def save_extracted_signs(extracted_signs, source_image):
    """Save extracted signs as individual image files"""
    saved_files = []
    
    for sign_data in extracted_signs:
        name = sign_data['name']
        image = sign_data['image']
        category = sign_data['category']
        
        # Convert BGR to RGB for PIL
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(image_rgb)
        
        # Resize to standard size
        pil_image = pil_image.resize((200, 200), Image.Resampling.LANCZOS)
        
        # Create a clean background
        background = Image.new('RGB', (200, 200), 'white')
        
        # Calculate position to center the image
        bg_w, bg_h = background.size
        img_w, img_h = pil_image.size
        offset = ((bg_w - img_w) // 2, (bg_h - img_h) // 2)
        
        background.paste(pil_image, offset)
        
        # Save to multiple locations
        filename = f"{name}.png"
        
        paths = [
            f"public/images/signs/common/{filename}",
            f"frontend/public/images/signs/common/{filename}",
            f"processed_signs/{filename}"
        ]
        
        for path in paths:
            try:
                background.save(path, 'PNG', quality=95)
                print(f"Saved: {path}")
                saved_files.append(path)
            except Exception as e:
                print(f"Error saving {path}: {e}")
    
    return saved_files

def create_common_signs_data():
    """Create comprehensive data structure for common signs"""
    return {
        'hello': {
            'category': 'greetings',
            'description': 'Flat hand at forehead, move forward slightly',
            'difficulty': 'easy',
            'usage': 'Standard greeting'
        },
        'thank_you': {
            'category': 'greetings',
            'description': 'Flat hand touches chin, moves forward',
            'difficulty': 'easy',
            'usage': 'Express gratitude'
        },
        'please': {
            'category': 'greetings',
            'description': 'Flat hand circles on chest',
            'difficulty': 'easy',
            'usage': 'Polite request'
        },
        'sorry': {
            'category': 'greetings',
            'description': 'Fist on chest, circular motion',
            'difficulty': 'easy',
            'usage': 'Apologize'
        },
        'goodbye': {
            'category': 'greetings',
            'description': 'Wave hand or finger wiggle',
            'difficulty': 'easy',
            'usage': 'Farewell'
        },
        'yes': {
            'category': 'responses',
            'description': 'Fist nods up and down',
            'difficulty': 'easy',
            'usage': 'Affirmative response'
        },
        'no': {
            'category': 'responses',
            'description': 'Index and middle finger close on thumb',
            'difficulty': 'easy',
            'usage': 'Negative response'
        },
        'mother': {
            'category': 'family',
            'description': 'Thumb touches chin',
            'difficulty': 'easy',
            'usage': 'Female parent'
        },
        'father': {
            'category': 'family',
            'description': 'Thumb touches forehead',
            'difficulty': 'easy',
            'usage': 'Male parent'
        },
        'family': {
            'category': 'family',
            'description': 'F-hands form circle',
            'difficulty': 'medium',
            'usage': 'Related people'
        },
        'friend': {
            'category': 'family',
            'description': 'Index fingers hook together',
            'difficulty': 'medium',
            'usage': 'Close companion'
        },
        'help': {
            'category': 'actions',
            'description': 'Fist on flat palm, lift together',
            'difficulty': 'medium',
            'usage': 'Assist someone'
        },
        'love': {
            'category': 'emotions',
            'description': 'Cross arms over chest',
            'difficulty': 'easy',
            'usage': 'Deep affection'
        },
        'eat': {
            'category': 'actions',
            'description': 'Fingertips to mouth repeatedly',
            'difficulty': 'easy',
            'usage': 'Consume food'
        },
        'drink': {
            'category': 'actions',
            'description': 'C-hand to mouth, tilt up',
            'difficulty': 'easy',
            'usage': 'Consume liquid'
        },
        'water': {
            'category': 'food',
            'description': 'W-hand taps chin',
            'difficulty': 'easy',
            'usage': 'Clear liquid'
        },
        'more': {
            'category': 'quantity',
            'description': 'Fingertips tap together',
            'difficulty': 'easy',
            'usage': 'Additional amount'
        },
        'finished': {
            'category': 'actions',
            'description': 'Five-hands flip down',
            'difficulty': 'medium',
            'usage': 'Completed, done'
        },
        'good': {
            'category': 'descriptive',
            'description': 'Flat hand from chin moves down',
            'difficulty': 'easy',
            'usage': 'Positive quality'
        },
        'bad': {
            'category': 'descriptive',
            'description': 'Flat hand flips down from chin',
            'difficulty': 'easy',
            'usage': 'Negative quality'
        },
        'happy': {
            'category': 'emotions',
            'description': 'Flat hands brush up chest',
            'difficulty': 'easy',
            'usage': 'Joyful feeling'
        },
        'sad': {
            'category': 'emotions',
            'description': 'Five-hands slide down face',
            'difficulty': 'easy',
            'usage': 'Sorrowful feeling'
        },
        'hot': {
            'category': 'descriptive',
            'description': 'Claw hand turns away from mouth',
            'difficulty': 'medium',
            'usage': 'High temperature'
        },
        'cold': {
            'category': 'descriptive',
            'description': 'S-hands shake (shivering)',
            'difficulty': 'easy',
            'usage': 'Low temperature'
        },
        'big': {
            'category': 'descriptive',
            'description': 'L-hands spread apart',
            'difficulty': 'easy',
            'usage': 'Large size'
        },
        'small': {
            'category': 'descriptive',
            'description': 'Flat hands close together',
            'difficulty': 'easy',
            'usage': 'Little size'
        },
        'beautiful': {
            'category': 'descriptive',
            'description': 'Five-hand circles face, closes to O',
            'difficulty': 'medium',
            'usage': 'Aesthetically pleasing'
        }
    }

def main():
    """Main function to process all uploaded sign language images"""
    print("Processing uploaded sign language images for Common Signs tab...")
    
    # Create directories
    create_directories()
    
    # Load signs data
    signs_data = create_common_signs_data()
    
    # List of uploaded images
    uploaded_images = [
        'sign.jpg',
        'dict1.jpg', 
        'commonSign.jpeg',
        'common sign language.jpg'
    ]
    
    all_extracted_signs = []
    
    # Process each uploaded image
    for image_path in uploaded_images:
        if os.path.exists(image_path):
            print(f"\nProcessing: {image_path}")
            extracted_signs = process_sign_language_chart(image_path, signs_data)
            all_extracted_signs.extend(extracted_signs)
            
            # Save extracted signs
            saved_files = save_extracted_signs(extracted_signs, image_path)
            print(f"Extracted {len(extracted_signs)} signs from {image_path}")
        else:
            print(f"Image not found: {image_path}")
    
    # Create metadata file
    metadata = {
        'total_signs': len(all_extracted_signs),
        'categories': list(set([sign['category'] for sign in all_extracted_signs])),
        'signs': {sign['name']: {
            'category': sign['category'],
            'description': sign['description']
        } for sign in all_extracted_signs}
    }
    
    # Save metadata
    with open('processed_signs/common_signs_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\n✅ Processing complete!")
    print(f"📊 Total signs extracted: {len(all_extracted_signs)}")
    print(f"📁 Images saved to: public/images/signs/common/")
    print(f"📝 Metadata saved to: processed_signs/common_signs_metadata.json")
    
    return all_extracted_signs

if __name__ == "__main__":
    main() 