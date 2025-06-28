#!/usr/bin/env python3
"""
Add Single ASL Letter Image
Helper script to add individual ASL letter images to the correct directories.
"""

import os
import sys
import shutil
from PIL import Image

def add_single_asl_letter(input_image_path, letter, output_dirs):
    """
    Add a single ASL letter image to the alphabet directories.
    
    Args:
        input_image_path (str): Path to the input image
        letter (str): The letter this image represents (A-Z)
        output_dirs (list): List of output directories
    """
    
    if not os.path.exists(input_image_path):
        print(f"❌ Input image not found: {input_image_path}")
        return False
    
    if len(letter) != 1 or not letter.isalpha():
        print(f"❌ Invalid letter: {letter}. Must be a single letter A-Z.")
        return False
    
    letter = letter.upper()
    filename = f"{letter.lower()}.png"
    
    try:
        # Open and process the image
        with Image.open(input_image_path) as img:
            # Convert to RGB if needed
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Resize to standard size while maintaining aspect ratio
            img.thumbnail((150, 150), Image.Resampling.LANCZOS)
            
            # Create a white background and center the image
            final_img = Image.new('RGB', (150, 150), (255, 255, 255))
            x = (150 - img.width) // 2
            y = (150 - img.height) // 2
            final_img.paste(img, (x, y))
            
            # Save to all output directories
            for output_dir in output_dirs:
                os.makedirs(output_dir, exist_ok=True)
                output_path = os.path.join(output_dir, filename)
                final_img.save(output_path, "PNG", quality=95)
                print(f"✅ Saved ASL {letter} -> {output_path}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error processing image: {e}")
        return False

def main():
    if len(sys.argv) < 3:
        print("Usage: python add_single_asl_letter.py <image_path> <letter>")
        print("Example: python add_single_asl_letter.py /path/to/a_sign.png A")
        return
    
    input_image = sys.argv[1]
    letter = sys.argv[2]
    
    # Project directories
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_directories = [
        os.path.join(project_root, "public/images/signs/alphabet"),
        os.path.join(project_root, "frontend/public/images/signs/alphabet")
    ]
    
    print(f"📸 Adding ASL Letter {letter.upper()}")
    print("=" * 40)
    print(f"Input: {input_image}")
    print(f"Letter: {letter.upper()}")
    
    success = add_single_asl_letter(input_image, letter, output_directories)
    
    if success:
        print(f"\n🎉 ASL letter {letter.upper()} added successfully!")
        print("The image is now ready to use in the React application.")
        
        # Test that the file exists and is accessible
        test_url = f"http://localhost:3000/images/signs/alphabet/{letter.lower()}.png"
        print(f"\nTest URL: {test_url}")
        print("You can verify it's working by visiting the ASL Alphabet page.")
    else:
        print("\n❌ Failed to add ASL letter. Please check the image and try again.")

if __name__ == "__main__":
    main() 