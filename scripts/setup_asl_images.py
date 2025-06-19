#!/usr/bin/env python3
"""
Setup ASL Images Script
Processes the ASL hand sign PNG files and sets them up for the website.
"""

import os
import shutil
from PIL import Image

def process_asl_images():
    """
    Process all ASL hand sign images and set them up for the website.
    """
    
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Define input and output directories
    input_dir = project_root  # PNG files are in project root
    output_dirs = [
        os.path.join(project_root, "public/images/signs/alphabet"),
        os.path.join(project_root, "frontend/public/images/signs/alphabet")
    ]
    
    # Create output directories
    for output_dir in output_dirs:
        os.makedirs(output_dir, exist_ok=True)
        print(f"Created directory: {output_dir}")
    
    # Process each letter A-Z
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    processed_count = 0
    
    for letter in letters:
        input_file = os.path.join(input_dir, f"{letter}.png")
        
        if os.path.exists(input_file):
            print(f"Processing {letter}.png...")
            
            try:
                # Open and process the image
                with Image.open(input_file) as img:
                    # Convert to RGB if needed (remove transparency)
                    if img.mode in ('RGBA', 'LA', 'P'):
                        # Create white background
                        background = Image.new('RGB', img.size, (255, 255, 255))
                        if img.mode == 'P':
                            img = img.convert('RGBA')
                        if img.mode in ('RGBA', 'LA'):
                            background.paste(img, mask=img.split()[-1])
                        else:
                            background.paste(img)
                        img = background
                    
                    # Resize to standard size while maintaining aspect ratio
                    img.thumbnail((150, 150), Image.Resampling.LANCZOS)
                    
                    # Create a white background and center the image
                    final_img = Image.new('RGB', (150, 150), (255, 255, 255))
                    x = (150 - img.width) // 2
                    y = (150 - img.height) // 2
                    final_img.paste(img, (x, y))
                    
                    # Save to all output directories with lowercase filename
                    lowercase_filename = f"{letter.lower()}.png"
                    
                    for output_dir in output_dirs:
                        output_path = os.path.join(output_dir, lowercase_filename)
                        final_img.save(output_path, "PNG", quality=95, optimize=True)
                        print(f"  ✅ Saved to: {output_path}")
                    
                    processed_count += 1
                    
            except Exception as e:
                print(f"  ❌ Error processing {letter}.png: {e}")
        else:
            print(f"  ⚠️ File not found: {input_file}")
    
    return processed_count

def verify_installation():
    """
    Verify that all images are properly installed and accessible.
    """
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    frontend_dir = os.path.join(project_root, "frontend/public/images/signs/alphabet")
    
    letters = "abcdefghijklmnopqrstuvwxyz"
    missing_files = []
    
    print("\n🔍 Verifying installation...")
    
    for letter in letters:
        file_path = os.path.join(frontend_dir, f"{letter}.png")
        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
            print(f"✅ {letter}.png - {file_size} bytes")
        else:
            missing_files.append(letter)
            print(f"❌ {letter}.png - MISSING")
    
    if missing_files:
        print(f"\n⚠️ Missing files: {', '.join(missing_files)}")
        return False
    else:
        print(f"\n🎉 All 26 ASL hand sign images successfully installed!")
        return True

def cleanup_original_files():
    """
    Ask user if they want to clean up the original PNG files from project root.
    """
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    print("\n🧹 Cleanup Options:")
    print("The original PNG files (A.png, B.png, etc.) are still in the project root.")
    print("They have been copied and processed to the correct directories.")
    print("\nWould you like to:")
    print("1. Keep original files (recommended)")
    print("2. Move them to a backup folder")
    print("3. Delete them (not recommended)")
    
    # For automated script, we'll just move them to a backup folder
    backup_dir = os.path.join(project_root, "original_asl_images")
    os.makedirs(backup_dir, exist_ok=True)
    
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    moved_count = 0
    
    for letter in letters:
        original_file = os.path.join(project_root, f"{letter}.png")
        if os.path.exists(original_file):
            backup_file = os.path.join(backup_dir, f"{letter}.png")
            shutil.move(original_file, backup_file)
            moved_count += 1
            print(f"Moved {letter}.png to backup folder")
    
    if moved_count > 0:
        print(f"\n📁 Moved {moved_count} files to: {backup_dir}")
    
    return moved_count

if __name__ == "__main__":
    print("🖼️ ASL Hand Sign Image Setup")
    print("=" * 50)
    
    # Process all images
    processed = process_asl_images()
    print(f"\n📊 Processed {processed} ASL hand sign images")
    
    # Verify installation
    success = verify_installation()
    
    if success:
        print("\n🌐 Website Integration:")
        print("✅ Images are now ready for the React application")
        print("✅ All images converted to 150x150 PNG format")
        print("✅ Accessible via /images/signs/alphabet/[letter].png")
        print("\n🎯 Next Steps:")
        print("1. Visit http://localhost:3000/deaf/alphabet")
        print("2. Your real ASL hand signs should now be displayed!")
        print("3. Test the Learn and Practice modes")
        
        # Move original files to backup
        cleanup_original_files()
        
        print("\n🎉 ASL Image Setup Complete!")
        print("Your website now uses real ASL hand sign photographs!")
    else:
        print("\n❌ Setup failed. Please check the error messages above.") 