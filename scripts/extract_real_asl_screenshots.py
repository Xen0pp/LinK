#!/usr/bin/env python3
"""
Real ASL Screenshot Extractor
Extracts individual hand sign screenshots from ASL alphabet chart and creates labeled image files.
"""

from PIL import Image, ImageDraw, ImageFont
import os
import sys

def extract_real_asl_screenshots(input_image_path, output_dir):
    """
    Extract individual ASL alphabet screenshots from a grid layout image.
    
    Args:
        input_image_path (str): Path to the input ASL alphabet chart
        output_dir (str): Directory to save cropped alphabet images
    """
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        # Open the input image
        img = Image.open(input_image_path)
        img_width, img_height = img.size
        
        print(f"Image dimensions: {img_width} x {img_height}")
        
        # Define the grid layout (you may need to adjust based on your image)
        # Common layouts: 6x5, 7x4, 5x6, etc.
        # We'll try to detect or you can specify
        cols = 6  # Adjust based on your image layout
        rows = 5  # Adjust based on your image layout
        
        # Calculate cell dimensions
        cell_width = img_width // cols
        cell_height = img_height // rows
        
        print(f"Cell dimensions: {cell_width} x {cell_height}")
        
        # Define the alphabet letters in order as they appear in the grid
        # Adjust this layout based on how your chart is organized
        alphabet_grid = [
            ['A', 'B', 'C', 'D', 'E', 'F'],
            ['G', 'H', 'I', 'J', 'K', 'L'],
            ['M', 'N', 'O', 'P', 'Q', 'R'],
            ['S', 'T', 'U', 'V', 'W', 'X'],
            ['Y', 'Z', '', '', '', '']  # Last cells might be empty
        ]
        
        # Extract each letter
        for row in range(rows):
            for col in range(cols):
                if row < len(alphabet_grid) and col < len(alphabet_grid[row]):
                    letter = alphabet_grid[row][col]
                    
                    if letter:  # Skip empty cells
                        # Calculate crop coordinates
                        left = col * cell_width
                        top = row * cell_height
                        right = left + cell_width
                        bottom = top + cell_height
                        
                        # Add small padding to avoid border issues
                        padding = 10
                        left = max(0, left + padding)
                        top = max(0, top + padding)
                        right = min(img_width, right - padding)
                        bottom = min(img_height, bottom - padding)
                        
                        # Crop the image
                        cropped = img.crop((left, top, right, bottom))
                        
                        # Resize to standard size (150x150)
                        cropped = cropped.resize((150, 150), Image.Resampling.LANCZOS)
                        
                        # Save the cropped image as PNG
                        output_path = os.path.join(output_dir, f"{letter.lower()}.png")
                        cropped.save(output_path, "PNG")
                        
                        print(f"Extracted: {letter} -> {output_path}")
        
        print(f"\n✅ Successfully extracted ASL alphabet screenshots to {output_dir}")
        return True
        
    except Exception as e:
        print(f"❌ Error extracting alphabet screenshots: {e}")
        return False

def create_labeled_image_html(output_dir):
    """
    Create HTML files that display the images instead of SVGs for React compatibility.
    """
    
    alphabet = 'abcdefghijklmnopqrstuvwxyz'
    
    for letter in alphabet:
        image_path = os.path.join(output_dir, f"{letter}.png")
        html_path = os.path.join(output_dir, f"{letter}.html")
        
        if os.path.exists(image_path):
            # Create a simple HTML wrapper that can be used by React
            html_content = f'''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {{ margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 150px; width: 150px; }}
        img {{ max-width: 100%; max-height: 100%; }}
    </style>
</head>
<body>
    <img src="{letter}.png" alt="ASL {letter.upper()}" />
</body>
</html>'''
            
            with open(html_path, 'w') as f:
                f.write(html_content)
            
            print(f"Created HTML wrapper: {letter.upper()} -> {html_path}")

def detect_grid_layout(img_path):
    """
    Try to automatically detect the grid layout of the ASL chart.
    """
    try:
        img = Image.open(img_path)
        width, height = img.size
        
        # Common ASL chart layouts
        possible_layouts = [
            (6, 5),  # 6 columns, 5 rows (30 cells for 26 letters)
            (7, 4),  # 7 columns, 4 rows (28 cells)
            (5, 6),  # 5 columns, 6 rows (30 cells)
            (4, 7),  # 4 columns, 7 rows (28 cells)
            (13, 2), # 13 columns, 2 rows (26 cells exactly)
            (2, 13), # 2 columns, 13 rows (26 cells exactly)
        ]
        
        print("Possible grid layouts:")
        for i, (cols, rows) in enumerate(possible_layouts):
            cell_w = width // cols
            cell_h = height // rows
            print(f"{i+1}. {cols}x{rows} grid (cell size: {cell_w}x{cell_h})")
        
        return possible_layouts[0]  # Default to first option
        
    except Exception as e:
        print(f"Error detecting layout: {e}")
        return (6, 5)  # Default fallback

if __name__ == "__main__":
    # Default paths
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Look for ASL chart image
    possible_names = [
        "asl_alphabet_chart.png",
        "asl_alphabet.png", 
        "asl_chart.png",
        "alphabet_chart.png",
        "asl_alphabet_chart.jpg",
        "asl_alphabet.jpg"
    ]
    
    input_image = None
    for name in possible_names:
        path = os.path.join(project_root, name)
        if os.path.exists(path):
            input_image = path
            break
    
    if not input_image:
        print("❌ No ASL alphabet chart image found!")
        print("Please add one of these files to the project root:")
        for name in possible_names:
            print(f"  - {name}")
        print("\nOr specify the path as an argument:")
        print(f"  python {sys.argv[0]} <path_to_asl_chart>")
        
        if len(sys.argv) > 1:
            input_image = sys.argv[1]
            if not os.path.exists(input_image):
                print(f"❌ File not found: {input_image}")
                sys.exit(1)
        else:
            sys.exit(1)
    
    output_directory = os.path.join(project_root, "public/images/signs/alphabet")
    
    print("📸 Real ASL Screenshot Extractor")
    print("=" * 50)
    print(f"Input image: {input_image}")
    print(f"Output directory: {output_directory}")
    
    # Detect grid layout
    cols, rows = detect_grid_layout(input_image)
    print(f"Using grid layout: {cols}x{rows}")
    
    success = extract_real_asl_screenshots(input_image, output_directory)
    
    if success:
        # Copy to frontend directory
        frontend_dir = os.path.join(project_root, "frontend/public/images/signs/alphabet")
        os.makedirs(frontend_dir, exist_ok=True)
        
        import shutil
        for letter in 'abcdefghijklmnopqrstuvwxyz':
            src = os.path.join(output_directory, f"{letter}.png")
            dst = os.path.join(frontend_dir, f"{letter}.png")
            if os.path.exists(src):
                shutil.copy2(src, dst)
                print(f"Copied to frontend: {letter}.png")
        
        print("\n🎉 Real ASL alphabet screenshot extraction complete!")
        print("Images are now ready to use in the React application.")
    else:
        print("❌ Extraction failed. Please check the image and try again.") 