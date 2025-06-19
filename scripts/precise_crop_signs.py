#!/usr/bin/env python3
"""
Precise manual cropping script for sign language images
with proper grid definitions for each uploaded image.
"""

import cv2
import numpy as np
from PIL import Image
import os
import json

def create_directories():
    """Create necessary directories for processed images"""
    directories = [
        'public/images/signs/common',
        'frontend/public/images/signs/common',
        'processed_signs/manual'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"Created directory: {directory}")

def get_sign_mappings():
    """Define manual mappings for each image with proper grid positions"""
    return {
        'sign.jpg': {
            'dimensions': (300, 482),  # width x height
            'grid_layout': (6, 8),  # cols x rows  
            'signs': [
                # Row 1
                ('family', 0, 0), ('hospital', 1, 0), ('operation', 2, 0), ('injection', 3, 0), ('cry', 4, 0), ('yes', 5, 0),
                # Row 2  
                ('doctor', 0, 1), ('jesus', 1, 1), ('pray', 2, 1), ('priest', 3, 1), ('walk', 4, 1), ('help', 5, 1),
                # Row 3
                ('hearing_aid', 0, 2), ('wednesday', 1, 2), ('thursday', 2, 2), ('friday', 3, 2), ('suddenly', 4, 2), ('feel', 5, 2),
                # Row 4
                ('sick', 0, 3), ('drink', 1, 3), ('eat', 2, 3), ('children', 3, 3), ('candy', 4, 3), ('apple', 5, 3),
                # Continue for more rows based on visible signs
                ('mother', 0, 4), ('father', 1, 4), ('sister', 2, 4), ('brother', 3, 4), ('friend', 4, 4), ('love', 5, 4),
                ('good', 0, 5), ('bad', 1, 5), ('happy', 2, 5), ('sad', 3, 5), ('hot', 4, 5), ('cold', 5, 5),
                ('big', 0, 6), ('small', 1, 6), ('more', 2, 6), ('finished', 3, 6), ('water', 4, 6), ('milk', 5, 6),
                ('one', 0, 7), ('two', 1, 7), ('three', 2, 7), ('five', 3, 7), ('ten', 4, 7), ('red', 5, 7)
            ]
        },
        'dict1.jpg': {
            'dimensions': (300, 482),
            'grid_layout': (6, 8),
            'signs': [
                # Similar layout to sign.jpg - these appear to be the same chart
                ('family', 0, 0), ('hospital', 1, 0), ('operation', 2, 0), ('injection', 3, 0), ('cry', 4, 0), ('yes', 5, 0),
                ('doctor', 0, 1), ('jesus', 1, 1), ('pray', 2, 1), ('priest', 3, 1), ('walk', 4, 1), ('help', 5, 1),
                ('hearing_aid', 0, 2), ('wednesday', 1, 2), ('thursday', 2, 2), ('friday', 3, 2), ('suddenly', 4, 2), ('feel', 5, 2),
                ('sick', 0, 3), ('drink', 1, 3), ('eat', 2, 3), ('children', 3, 3), ('candy', 4, 3), ('apple', 5, 3),
                ('mother', 0, 4), ('father', 1, 4), ('sister', 2, 4), ('brother', 3, 4), ('friend', 4, 4), ('love', 5, 4),
                ('good', 0, 5), ('bad', 1, 5), ('happy', 2, 5), ('sad', 3, 5), ('hot', 4, 5), ('cold', 5, 5),
                ('big', 0, 6), ('small', 1, 6), ('more', 2, 6), ('finished', 3, 6), ('water', 4, 6), ('milk', 5, 6),
                ('one', 0, 7), ('two', 1, 7), ('three', 2, 7), ('five', 3, 7), ('ten', 4, 7), ('red', 5, 7)
            ]
        },
        'commonSign.jpeg': {
            'dimensions': (1000, 700),
            'grid_layout': (3, 2),  # 3 cols x 2 rows for illustrated signs
            'signs': [
                # Top row - basic greetings
                ('hello', 0, 0), ('goodbye', 1, 0), ('please', 2, 0),
                # Bottom row - responses and politeness
                ('thank_you', 0, 1), ('yes', 1, 1), ('no', 2, 1)
            ]
        },
        'common sign language.jpg': {
            'dimensions': (492, 351),
            'grid_layout': (8, 6),  # Based on visible grid structure
            'signs': [
                # This appears to be a more comprehensive chart
                # Row 1 - Greetings
                ('hello', 0, 0), ('thank_you', 1, 0), ('please', 2, 0), ('sorry', 3, 0), ('goodbye', 4, 0), ('yes', 5, 0), ('no', 6, 0), ('help', 7, 0),
                # Row 2 - Family
                ('mother', 0, 1), ('father', 1, 1), ('sister', 2, 1), ('brother', 3, 1), ('family', 4, 1), ('friend', 5, 1), ('love', 6, 1), ('baby', 7, 1),
                # Row 3 - Actions
                ('eat', 0, 2), ('drink', 1, 2), ('sleep', 2, 2), ('work', 3, 2), ('play', 4, 2), ('study', 5, 2), ('read', 6, 2), ('write', 7, 2),
                # Row 4 - Descriptive
                ('good', 0, 3), ('bad', 1, 3), ('happy', 2, 3), ('sad', 3, 3), ('hot', 4, 3), ('cold', 5, 3), ('big', 6, 3), ('small', 7, 3),
                # Row 5 - Colors & Numbers
                ('red', 0, 4), ('blue', 1, 4), ('green', 2, 4), ('yellow', 3, 4), ('black', 4, 4), ('white', 5, 4), ('one', 6, 4), ('two', 7, 4),
                # Row 6 - More basics
                ('three', 0, 5), ('five', 1, 5), ('ten', 2, 5), ('water', 3, 5), ('milk', 4, 5), ('bread', 5, 5), ('more', 6, 5), ('finished', 7, 5)
            ]
        }
    }

def crop_sign_from_grid(image, col, row, grid_layout, padding=5):
    """
    Crop a specific sign from a grid layout with proper positioning.
    
    Args:
        image: OpenCV image
        col: Column index (0-based)
        row: Row index (0-based) 
        grid_layout: Tuple of (cols, rows)
        padding: Pixels to crop from edges for cleaner extraction
    """
    height, width = image.shape[:2]
    cols, rows = grid_layout
    
    # Calculate cell dimensions
    cell_width = width // cols
    cell_height = height // rows
    
    # Calculate exact crop coordinates
    x1 = col * cell_width + padding
    y1 = row * cell_height + padding
    x2 = (col + 1) * cell_width - padding
    y2 = (row + 1) * cell_height - padding
    
    # Ensure coordinates are within image bounds
    x1 = max(0, x1)
    y1 = max(0, y1)
    x2 = min(width, x2)
    y2 = min(height, y2)
    
    # Extract the region
    cropped = image[y1:y2, x1:x2]
    
    return cropped

def process_image_with_mapping(image_path, mapping):
    """Process a single image with its specific mapping"""
    print(f"\nProcessing: {image_path}")
    
    # Load image
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: Could not read {image_path}")
        return []
    
    extracted_signs = []
    
    # Process each sign according to the mapping
    for sign_name, col, row in mapping['signs']:
        try:
            # Crop the specific sign
            cropped = crop_sign_from_grid(
                img, col, row, mapping['grid_layout'], padding=8
            )
            
            if cropped.size > 0:
                extracted_signs.append({
                    'name': sign_name,
                    'image': cropped,
                    'source': image_path,
                    'position': (col, row)
                })
                print(f"  Extracted: {sign_name} at ({col}, {row})")
            else:
                print(f"  Warning: Empty crop for {sign_name} at ({col}, {row})")
                
        except Exception as e:
            print(f"  Error cropping {sign_name}: {e}")
    
    return extracted_signs

def save_extracted_sign(sign_data):
    """Save a single extracted sign with proper formatting"""
    name = sign_data['name']
    image = sign_data['image']
    
    # Convert BGR to RGB for PIL
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(image_rgb)
    
    # Resize to standard size with high quality
    pil_image = pil_image.resize((200, 200), Image.Resampling.LANCZOS)
    
    # Create clean white background
    background = Image.new('RGB', (200, 200), 'white')
    
    # Center the image on the background
    bg_w, bg_h = background.size
    img_w, img_h = pil_image.size
    offset = ((bg_w - img_w) // 2, (bg_h - img_h) // 2)
    
    background.paste(pil_image, offset)
    
    # Save to all required locations
    filename = f"{name}.png"
    paths = [
        f"public/images/signs/common/{filename}",
        f"frontend/public/images/signs/common/{filename}",
        f"processed_signs/manual/{filename}"
    ]
    
    saved_count = 0
    for path in paths:
        try:
            background.save(path, 'PNG', quality=95, optimize=True)
            print(f"    Saved: {path}")
            saved_count += 1
        except Exception as e:
            print(f"    Error saving {path}: {e}")
    
    return saved_count > 0

def get_sign_data():
    """Get comprehensive sign data with categories and descriptions"""
    return {
        # Greetings
        'hello': {'category': 'greetings', 'description': 'Flat hand at forehead, move forward', 'difficulty': 'easy', 'usage': 'Standard greeting'},
        'goodbye': {'category': 'greetings', 'description': 'Wave hand or finger wiggle', 'difficulty': 'easy', 'usage': 'Farewell greeting'},
        'please': {'category': 'greetings', 'description': 'Flat hand circles on chest', 'difficulty': 'easy', 'usage': 'Polite request'},
        'thank_you': {'category': 'greetings', 'description': 'Flat hand touches chin, moves forward', 'difficulty': 'easy', 'usage': 'Express gratitude'},
        'sorry': {'category': 'greetings', 'description': 'Fist on chest, circular motion', 'difficulty': 'easy', 'usage': 'Apologize'},
        
        # Responses
        'yes': {'category': 'responses', 'description': 'Fist nods up and down', 'difficulty': 'easy', 'usage': 'Affirmative response'},
        'no': {'category': 'responses', 'description': 'Index and middle finger close on thumb', 'difficulty': 'easy', 'usage': 'Negative response'},
        
        # Family
        'mother': {'category': 'family', 'description': 'Thumb touches chin', 'difficulty': 'easy', 'usage': 'Female parent'},
        'father': {'category': 'family', 'description': 'Thumb touches forehead', 'difficulty': 'easy', 'usage': 'Male parent'},
        'sister': {'category': 'family', 'description': 'L-hand at chin, moves down', 'difficulty': 'medium', 'usage': 'Female sibling'},
        'brother': {'category': 'family', 'description': 'L-hand at forehead, moves down', 'difficulty': 'medium', 'usage': 'Male sibling'},
        'family': {'category': 'family', 'description': 'F-hands form circle', 'difficulty': 'medium', 'usage': 'Related people'},
        'friend': {'category': 'family', 'description': 'Index fingers hook together', 'difficulty': 'medium', 'usage': 'Close companion'},
        'love': {'category': 'emotions', 'description': 'Cross arms over chest', 'difficulty': 'easy', 'usage': 'Deep affection'},
        'baby': {'category': 'family', 'description': 'Cradling motion with arms', 'difficulty': 'easy', 'usage': 'Infant, young child'},
        
        # Actions
        'eat': {'category': 'actions', 'description': 'Fingertips to mouth repeatedly', 'difficulty': 'easy', 'usage': 'Consume food'},
        'drink': {'category': 'actions', 'description': 'C-hand to mouth, tilt up', 'difficulty': 'easy', 'usage': 'Consume liquid'},
        'help': {'category': 'actions', 'description': 'Fist on flat palm, lift together', 'difficulty': 'medium', 'usage': 'Assist someone'},
        'sleep': {'category': 'actions', 'description': 'Hand to side of head, eyes closed', 'difficulty': 'easy', 'usage': 'Rest, sleep'},
        'work': {'category': 'actions', 'description': 'S-hands tap wrists together', 'difficulty': 'medium', 'usage': 'Employment, labor'},
        'play': {'category': 'actions', 'description': 'Y-hands shake alternately', 'difficulty': 'medium', 'usage': 'Recreation, games'},
        'study': {'category': 'actions', 'description': 'Bent hand moves toward open palm', 'difficulty': 'medium', 'usage': 'Learn, study'},
        'read': {'category': 'actions', 'description': 'V-hand moves down open palm', 'difficulty': 'easy', 'usage': 'Read text'},
        'write': {'category': 'actions', 'description': 'Pinch fingers write on palm', 'difficulty': 'easy', 'usage': 'Write text'},
        'finished': {'category': 'actions', 'description': 'Five-hands flip down', 'difficulty': 'medium', 'usage': 'Completed, done'},
        
        # Descriptive/Emotions
        'good': {'category': 'descriptive', 'description': 'Flat hand from chin moves down', 'difficulty': 'easy', 'usage': 'Positive quality'},
        'bad': {'category': 'descriptive', 'description': 'Flat hand flips down from chin', 'difficulty': 'easy', 'usage': 'Negative quality'},
        'happy': {'category': 'emotions', 'description': 'Flat hands brush up chest', 'difficulty': 'easy', 'usage': 'Joyful feeling'},
        'sad': {'category': 'emotions', 'description': 'Five-hands slide down face', 'difficulty': 'easy', 'usage': 'Sorrowful feeling'},
        'hot': {'category': 'descriptive', 'description': 'Claw hand turns away from mouth', 'difficulty': 'medium', 'usage': 'High temperature'},
        'cold': {'category': 'descriptive', 'description': 'S-hands shake (shivering)', 'difficulty': 'easy', 'usage': 'Low temperature'},
        'big': {'category': 'descriptive', 'description': 'L-hands spread apart', 'difficulty': 'easy', 'usage': 'Large size'},
        'small': {'category': 'descriptive', 'description': 'Flat hands close together', 'difficulty': 'easy', 'usage': 'Little size'},
        'beautiful': {'category': 'descriptive', 'description': 'Five-hand circles face, closes to O', 'difficulty': 'medium', 'usage': 'Aesthetically pleasing'},
        'more': {'category': 'descriptive', 'description': 'Fingertips tap together', 'difficulty': 'easy', 'usage': 'Additional amount'},
        
        # Colors
        'red': {'category': 'colors', 'description': 'Index finger brushes lips downward', 'difficulty': 'easy', 'usage': 'Color of blood, fire'},
        'blue': {'category': 'colors', 'description': 'B-hand shakes slightly', 'difficulty': 'easy', 'usage': 'Color of sky, ocean'},
        'green': {'category': 'colors', 'description': 'G-hand shakes slightly', 'difficulty': 'easy', 'usage': 'Color of grass, plants'},
        'yellow': {'category': 'colors', 'description': 'Y-hand shakes slightly', 'difficulty': 'easy', 'usage': 'Color of sun, banana'},
        'black': {'category': 'colors', 'description': 'Index finger across forehead', 'difficulty': 'easy', 'usage': 'Absence of color'},
        'white': {'category': 'colors', 'description': 'Five-hand on chest, pull out', 'difficulty': 'medium', 'usage': 'Color of snow, milk'},
        
        # Numbers
        'one': {'category': 'numbers', 'description': 'Index finger extended up', 'difficulty': 'easy', 'usage': 'Number 1'},
        'two': {'category': 'numbers', 'description': 'Index and middle finger extended', 'difficulty': 'easy', 'usage': 'Number 2'},
        'three': {'category': 'numbers', 'description': 'Thumb, index, middle finger extended', 'difficulty': 'easy', 'usage': 'Number 3'},
        'five': {'category': 'numbers', 'description': 'All five fingers extended', 'difficulty': 'easy', 'usage': 'Number 5'},
        'ten': {'category': 'numbers', 'description': 'Thumb up, shake slightly', 'difficulty': 'easy', 'usage': 'Number 10'},
        
        # Food
        'water': {'category': 'food', 'description': 'W-hand taps chin', 'difficulty': 'easy', 'usage': 'Clear liquid'},
        'milk': {'category': 'food', 'description': 'Squeeze fist alternately', 'difficulty': 'easy', 'usage': 'Dairy beverage'},
        'bread': {'category': 'food', 'description': 'Knife hand slices other hand', 'difficulty': 'medium', 'usage': 'Baked food'}
    }

def main():
    """Main function to process all images with precise manual cropping"""
    print("Starting precise manual cropping of sign language images...")
    
    # Create directories
    create_directories()
    
    # Get sign mappings and data
    mappings = get_sign_mappings()
    sign_data = get_sign_data()
    
    all_processed_signs = []
    successful_extractions = 0
    
    # Process each image with its specific mapping
    for image_path, mapping in mappings.items():
        if os.path.exists(image_path):
            extracted_signs = process_image_with_mapping(image_path, mapping)
            
            # Save each extracted sign
            for sign in extracted_signs:
                if save_extracted_sign(sign):
                    successful_extractions += 1
                    
                    # Add to processed list with metadata
                    sign_name = sign['name']
                    if sign_name in sign_data:
                        all_processed_signs.append({
                            'name': sign_name,
                            'category': sign_data[sign_name]['category'],
                            'description': sign_data[sign_name]['description'],
                            'difficulty': sign_data[sign_name]['difficulty'],
                            'usage': sign_data[sign_name]['usage'],
                            'source_image': image_path,
                            'grid_position': sign['position']
                        })
            
            print(f"Processed {len(extracted_signs)} signs from {image_path}")
        else:
            print(f"Image not found: {image_path}")
    
    # Remove duplicates (keep first occurrence)
    unique_signs = {}
    for sign in all_processed_signs:
        if sign['name'] not in unique_signs:
            unique_signs[sign['name']] = sign
    
    final_signs = list(unique_signs.values())
    
    # Create comprehensive metadata
    metadata = {
        'processing_method': 'manual_precise_cropping',
        'total_unique_signs': len(final_signs),
        'successful_extractions': successful_extractions,
        'categories': list(set([sign['category'] for sign in final_signs])),
        'difficulty_levels': list(set([sign['difficulty'] for sign in final_signs])),
        'signs': {sign['name']: {
            'category': sign['category'],
            'description': sign['description'],
            'difficulty': sign['difficulty'],
            'usage': sign['usage'],
            'source_image': sign['source_image'],
            'grid_position': sign['grid_position']
        } for sign in final_signs}
    }
    
    # Save metadata
    metadata_path = 'processed_signs/manual/precise_crop_metadata.json'
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\n✅ Precise cropping complete!")
    print(f"📊 Total unique signs: {len(final_signs)}")
    print(f"📁 Successful extractions: {successful_extractions}")
    print(f"📋 Categories: {len(metadata['categories'])}")
    print(f"📝 Metadata saved to: {metadata_path}")
    
    # Print summary by category
    category_counts = {}
    for sign in final_signs:
        cat = sign['category']
        category_counts[cat] = category_counts.get(cat, 0) + 1
    
    print("\n📊 Signs by category:")
    for category, count in sorted(category_counts.items()):
        print(f"  {category}: {count} signs")
    
    return final_signs

if __name__ == "__main__":
    main() 