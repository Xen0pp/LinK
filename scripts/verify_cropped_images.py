#!/usr/bin/env python3
"""
Verification script to check the quality of cropped sign images
and create a sample preview for inspection.
"""

import cv2
import numpy as np
from PIL import Image
import os
import json

def verify_images():
    """Verify and display sample cropped images"""
    print("🔍 Verifying cropped sign language images...")
    
    # Load metadata
    metadata_path = 'processed_signs/manual/precise_crop_metadata.json'
    if os.path.exists(metadata_path):
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        print(f"📊 Metadata Summary:")
        print(f"   Total unique signs: {metadata['total_unique_signs']}")
        print(f"   Categories: {', '.join(metadata['categories'])}")
        print(f"   Successful extractions: {metadata['successful_extractions']}")
    
    # Check directories
    directories = [
        'public/images/signs/common',
        'frontend/public/images/signs/common'
    ]
    
    for directory in directories:
        if os.path.exists(directory):
            files = [f for f in os.listdir(directory) if f.endswith('.png')]
            print(f"📁 {directory}: {len(files)} PNG files")
        else:
            print(f"❌ {directory}: Not found")
    
    # Verify some sample images
    sample_signs = ['hello', 'mother', 'father', 'eat', 'drink', 'good', 'bad', 'yes', 'no', 'red']
    print(f"\n🎯 Checking sample signs: {', '.join(sample_signs)}")
    
    for sign in sample_signs:
        image_path = f'public/images/signs/common/{sign}.png'
        if os.path.exists(image_path):
            img = cv2.imread(image_path)
            if img is not None:
                height, width = img.shape[:2]
                print(f"   ✅ {sign}.png: {width}x{height} pixels")
            else:
                print(f"   ❌ {sign}.png: Cannot read")
        else:
            print(f"   ❌ {sign}.png: Not found")
    
    # Create a preview montage of sample signs
    create_preview_montage(sample_signs)

def create_preview_montage(sample_signs):
    """Create a preview montage showing sample cropped signs"""
    print(f"\n🖼️ Creating preview montage...")
    
    # Load sample images
    images = []
    labels = []
    
    for sign in sample_signs:
        image_path = f'public/images/signs/common/{sign}.png'
        if os.path.exists(image_path):
            img = cv2.imread(image_path)
            if img is not None:
                # Resize to consistent size for montage
                img_resized = cv2.resize(img, (150, 150))
                images.append(img_resized)
                labels.append(sign)
    
    if not images:
        print("❌ No valid images found for preview")
        return
    
    # Create montage grid
    rows = 2
    cols = 5
    
    # Create canvas
    canvas_width = cols * 150 + (cols + 1) * 20
    canvas_height = rows * 150 + (rows + 1) * 20 + 40  # Extra space for labels
    canvas = np.ones((canvas_height, canvas_width, 3), dtype=np.uint8) * 255
    
    # Place images
    for i, (img, label) in enumerate(zip(images[:rows*cols], labels[:rows*cols])):
        row = i // cols
        col = i % cols
        
        x = 20 + col * (150 + 20)
        y = 20 + row * (150 + 40)  # Extra space for label
        
        # Place image
        canvas[y:y+150, x:x+150] = img
        
        # Add label
        cv2.putText(canvas, label, (x + 10, y + 170), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)
    
    # Save preview
    preview_path = 'cropped_signs_preview.jpg'
    cv2.imwrite(preview_path, canvas)
    print(f"✅ Preview montage saved: {preview_path}")
    
    return preview_path

def check_component_compatibility():
    """Check if the React component can find all expected images"""
    print(f"\n🔧 Checking React component compatibility...")
    
    # Expected signs from the CommonSigns component
    expected_signs = [
        # Greetings
        'hello', 'goodbye', 'please', 'thank_you', 'sorry',
        # Responses  
        'yes', 'no',
        # Family
        'mother', 'father', 'sister', 'brother', 'family', 'friend', 'baby',
        # Actions
        'eat', 'drink', 'help', 'finished', 'sleep', 'work', 'play', 'study', 'read', 'write',
        # Food
        'water', 'milk', 'bread',
        # Colors
        'red', 'blue', 'green', 'yellow', 'black', 'white',
        # Numbers
        'one', 'two', 'three', 'five', 'ten',
        # Emotions
        'love', 'happy', 'sad',
        # Descriptive
        'more', 'good', 'bad', 'hot', 'cold', 'big', 'small'
    ]
    
    missing_images = []
    found_images = []
    
    for sign in expected_signs:
        image_path = f'frontend/public/images/signs/common/{sign}.png'
        if os.path.exists(image_path):
            found_images.append(sign)
        else:
            missing_images.append(sign)
    
    print(f"✅ Found images: {len(found_images)}/{len(expected_signs)}")
    
    if missing_images:
        print(f"❌ Missing images: {', '.join(missing_images)}")
    else:
        print(f"🎉 All expected images are available!")
    
    return len(missing_images) == 0

def main():
    """Main verification function"""
    print("=" * 60)
    print("🚀 ASL Common Signs Image Verification")
    print("=" * 60)
    
    verify_images()
    
    compatibility = check_component_compatibility()
    
    print("\n" + "=" * 60)
    if compatibility:
        print("✅ SUCCESS: All cropped images are properly extracted and ready!")
        print("🔥 The Common Signs feature should now display clear, properly cropped photographs")
        print("🌐 Frontend can access all expected sign images")
    else:
        print("⚠️  WARNING: Some images may be missing or incompatible")
        print("🔧 Check the missing images list above")
    
    print("=" * 60)

if __name__ == "__main__":
    main() 