#!/usr/bin/env python3
"""
ASL Alphabet Extractor
Crops individual hand signs from the ASL alphabet chart and saves them as separate images.
If no input image is available, creates accurate ASL alphabet SVG representations.
"""

from PIL import Image
import os

def extract_asl_alphabet(input_image_path, output_dir):
    """
    Extract individual ASL alphabet signs from a grid layout image.
    
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
        
        # Define the grid layout
        # Based on the image, it appears to be a 7x4 grid
        cols = 7
        rows = 4
        
        # Calculate cell dimensions
        cell_width = img_width // cols
        cell_height = img_height // rows
        
        print(f"Cell dimensions: {cell_width} x {cell_height}")
        
        # Define the alphabet letters in order as they appear in the grid
        alphabet_grid = [
            ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
            ['O', 'P', 'Q', 'R', 'S', 'T', 'U'],
            ['V', 'W', 'X', 'Y', 'Z', '', '']  # Last two cells might be empty or special signs
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
                        padding = 5
                        left = max(0, left + padding)
                        top = max(0, top + padding)
                        right = min(img_width, right - padding)
                        bottom = min(img_height, bottom - padding)
                        
                        # Crop the image
                        cropped = img.crop((left, top, right, bottom))
                        
                        # Save the cropped image
                        output_path = os.path.join(output_dir, f"{letter.lower()}.png")
                        cropped.save(output_path, "PNG")
                        
                        print(f"Extracted: {letter} -> {output_path}")
        
        print(f"\n✅ Successfully extracted ASL alphabet signs to {output_dir}")
        return True
        
    except Exception as e:
        print(f"❌ Error extracting alphabet signs: {e}")
        return False

def create_realistic_asl_hand_svgs(output_dir):
    """
    Create realistic human hand SVG representations of ASL alphabet letters.
    """
    
    # ASL alphabet data with realistic human hand illustrations
    asl_alphabet = {
        'a': {
            'name': 'A',
            'description': 'Closed fist, thumb alongside index finger',
            'paths': [
                # Hand palm base
                '<ellipse cx="75" cy="100" rx="25" ry="35" fill="#ffdbac" stroke="#d4a574" stroke-width="2"/>',
                # Closed fingers (fist)
                '<path d="M55 85 Q50 80 52 75 Q60 70 65 75 Q70 70 75 75 Q80 70 85 75 Q90 70 95 75 Q98 80 95 85 Q90 90 85 85 Q80 90 75 85 Q70 90 65 85 Q60 90 55 85" fill="#ffdbac" stroke="#d4a574" stroke-width="2"/>',
                # Thumb alongside
                '<ellipse cx="52" cy="90" rx="8" ry="18" fill="#ffdbac" stroke="#d4a574" stroke-width="2"/>',
                # Knuckles
                '<circle cx="65" cy="75" r="2" fill="#d4a574"/>',
                '<circle cx="75" cy="73" r="2" fill="#d4a574"/>',
                '<circle cx="85" cy="75" r="2" fill="#d4a574"/>',
                # Thumb nail
                '<ellipse cx="52" cy="82" rx="3" ry="4" fill="#f4c2a1"/>'
            ]
        },
        'b': {
            'name': 'B',
            'description': 'All fingers straight, thumb folded across palm',
            'paths': [
                # Palm
                '<rect x="55" y="60" width="20" height="50" rx="10" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Four fingers straight up
                '<rect x="50" y="30" width="8" height="35" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                '<rect x="60" y="25" width="8" height="40" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                '<rect x="70" y="25" width="8" height="40" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                '<rect x="80" y="30" width="8" height="35" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Thumb across palm
                '<ellipse cx="65" cy="80" rx="12" ry="6" fill="#f59e0b"/>'
            ]
        },
        'c': {
            'name': 'C',
            'description': 'Curved hand like holding a cup',
            'paths': [
                # C-shaped curve
                '<path d="M 90 50 Q 60 35 45 70 Q 45 90 60 105 Q 90 120 95 100" fill="none" stroke="#fbbf24" stroke-width="15" stroke-linecap="round"/>',
                # Thumb curve
                '<path d="M 50 65 Q 40 75 50 85" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>',
                # Palm backing
                '<ellipse cx="70" cy="85" rx="20" ry="25" fill="#fef3c7" opacity="0.7"/>'
            ]
        },
        'd': {
            'name': 'D',
            'description': 'Index finger up, other fingers touch thumb',
            'paths': [
                # Index finger straight up
                '<rect x="70" y="20" width="8" height="50" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Palm
                '<ellipse cx="65" cy="85" rx="15" ry="20" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Other fingers folded, touching thumb
                '<circle cx="55" cy="75" r="8" fill="#f59e0b"/>',
                '<circle cx="75" cy="75" r="8" fill="#f59e0b"/>',
                # Thumb tip touching middle finger
                '<ellipse cx="60" cy="70" rx="6" ry="10" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>'
            ]
        },
        'e': {
            'name': 'E',
            'description': 'All fingertips touch thumb',
            'paths': [
                # Palm
                '<ellipse cx="75" cy="90" rx="18" ry="25" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Curved fingers meeting thumb
                '<path d="M 58 60 Q 65 50 72 60 Q 78 50 85 60 Q 90 50 95 60" fill="none" stroke="#fbbf24" stroke-width="8" stroke-linecap="round"/>',
                # Thumb
                '<ellipse cx="60" cy="75" rx="8" ry="15" fill="#f59e0b"/>',
                # Fingertips touching
                '<circle cx="72" cy="60" r="4" fill="#f59e0b"/>',
                '<circle cx="78" cy="55" r="4" fill="#f59e0b"/>',
                '<circle cx="85" cy="60" r="4" fill="#f59e0b"/>',
                '<circle cx="90" cy="65" r="4" fill="#f59e0b"/>'
            ]
        },
        'f': {
            'name': 'F',
            'description': 'Index and thumb touch, others extended',
            'paths': [
                # Three fingers extended
                '<rect x="65" y="25" width="8" height="40" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                '<rect x="75" y="20" width="8" height="45" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                '<rect x="85" y="25" width="8" height="40" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Palm
                '<ellipse cx="70" cy="85" rx="15" ry="20" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Index finger folded
                '<ellipse cx="55" cy="70" rx="6" ry="12" fill="#f59e0b"/>',
                # Thumb tip touching index
                '<ellipse cx="50" cy="65" rx="8" ry="12" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                '<circle cx="52" cy="68" r="3" fill="#dc2626"/>'
            ]
        },
        'g': {
            'name': 'G',
            'description': 'Index finger and thumb pointing sideways',
            'paths': [
                # Palm turned sideways
                '<ellipse cx="75" cy="80" rx="12" ry="25" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Index finger pointing sideways
                '<rect x="90" y="65" width="25" height="8" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Thumb pointing forward
                '<rect x="70" y="50" width="8" height="20" rx="4" fill="#f59e0b"/>',
                # Other fingers folded
                '<circle cx="65" cy="90" r="6" fill="#f59e0b"/>',
                '<circle cx="70" cy="95" r="6" fill="#f59e0b"/>',
                '<circle cx="75" cy="95" r="6" fill="#f59e0b"/>'
            ]
        },
        'h': {
            'name': 'H',
            'description': 'Index and middle finger extended sideways',
            'paths': [
                # Palm
                '<ellipse cx="75" cy="85" rx="15" ry="20" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Two fingers horizontal
                '<rect x="90" y="60" width="25" height="8" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                '<rect x="90" y="72" width="25" height="8" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Thumb over other fingers
                '<ellipse cx="70" cy="75" rx="8" ry="12" fill="#f59e0b"/>',
                # Other fingers folded
                '<circle cx="65" cy="90" r="6" fill="#f59e0b"/>',
                '<circle cx="70" cy="95" r="6" fill="#f59e0b"/>'
            ]
        },
        'i': {
            'name': 'I',
            'description': 'Pinky finger extended up',
            'paths': [
                # Palm
                '<ellipse cx="75" cy="85" rx="15" ry="20" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Pinky up
                '<rect x="85" y="20" width="6" height="45" rx="3" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Other fingers folded
                '<circle cx="65" cy="75" r="8" fill="#f59e0b"/>',
                '<circle cx="70" cy="70" r="8" fill="#f59e0b"/>',
                '<circle cx="75" cy="70" r="8" fill="#f59e0b"/>',
                # Thumb across
                '<ellipse cx="60" cy="80" rx="8" ry="12" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>'
            ]
        },
        'j': {
            'name': 'J',
            'description': 'Pinky extended, draw a J in the air',
            'paths': [
                # Palm
                '<ellipse cx="75" cy="85" rx="15" ry="20" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Pinky drawing J motion
                '<path d="M 88 20 L 88 45 Q 88 55 80 55 Q 72 55 72 47" fill="none" stroke="#fbbf24" stroke-width="6" stroke-linecap="round"/>',
                # Motion arrow
                '<path d="M 85 30 Q 90 35 85 40" fill="none" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowhead)"/>',
                # Other fingers folded
                '<circle cx="65" cy="75" r="8" fill="#f59e0b"/>',
                '<circle cx="70" cy="70" r="8" fill="#f59e0b"/>',
                '<circle cx="75" cy="70" r="8" fill="#f59e0b"/>',
                # Arrow marker definition
                '<defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#dc2626"/></marker></defs>'
            ]
        },
        'k': {
            'name': 'K',
            'description': 'Index and middle finger up, thumb between',
            'paths': [
                # Palm
                '<ellipse cx="75" cy="90" rx="15" ry="18" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Index finger up
                '<rect x="65" y="25" width="8" height="45" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Middle finger up
                '<rect x="77" y="20" width="8" height="50" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Thumb between fingers
                '<ellipse cx="71" cy="55" rx="6" ry="15" fill="#f59e0b"/>',
                # Other fingers folded
                '<circle cx="85" cy="80" r="8" fill="#f59e0b"/>',
                '<circle cx="90" cy="85" r="8" fill="#f59e0b"/>'
            ]
        },
        'l': {
            'name': 'L',
            'description': 'Index finger up, thumb out (L shape)',
            'paths': [
                # Palm
                '<ellipse cx="80" cy="85" rx="12" ry="20" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Index finger up
                '<rect x="75" y="20" width="8" height="50" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Thumb out horizontally
                '<rect x="45" y="75" width="25" height="8" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Other fingers folded
                '<circle cx="85" cy="85" r="8" fill="#f59e0b"/>',
                '<circle cx="90" cy="90" r="8" fill="#f59e0b"/>',
                '<circle cx="85" cy="95" r="8" fill="#f59e0b"/>'
            ]
        },
        'm': {
            'name': 'M',
            'description': 'Three fingers over thumb',
            'paths': [
                # Palm
                '<ellipse cx="75" cy="90" rx="18" ry="20" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Three fingers folded over
                '<ellipse cx="65" cy="70" rx="12" ry="8" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                '<ellipse cx="75" cy="65" rx="12" ry="8" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                '<ellipse cx="85" cy="70" rx="12" ry="8" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Thumb underneath
                '<ellipse cx="70" cy="85" rx="15" ry="8" fill="#f59e0b"/>',
                # Pinky folded
                '<circle cx="90" cy="85" r="6" fill="#f59e0b"/>'
            ]
        },
        'n': {
            'name': 'N',
            'description': 'Two fingers over thumb',
            'paths': [
                # Palm
                '<ellipse cx="75" cy="90" rx="18" ry="20" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Two fingers folded over
                '<ellipse cx="68" cy="70" rx="12" ry="8" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                '<ellipse cx="78" cy="65" rx="12" ry="8" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Thumb underneath
                '<ellipse cx="70" cy="85" rx="15" ry="8" fill="#f59e0b"/>',
                # Other fingers folded
                '<circle cx="85" cy="85" r="6" fill="#f59e0b"/>',
                '<circle cx="90" cy="90" r="6" fill="#f59e0b"/>'
            ]
        },
        'o': {
            'name': 'O',
            'description': 'All fingers curved into O shape',
            'paths': [
                # O-shaped circle
                '<circle cx="75" cy="75" r="25" fill="none" stroke="#fbbf24" stroke-width="12"/>',
                # Thumb completing circle
                '<path d="M 52 75 Q 45 65 52 55" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>',
                # Inner shadow
                '<circle cx="75" cy="75" r="15" fill="#fef3c7" opacity="0.5"/>'
            ]
        },
        'p': {
            'name': 'P',
            'description': 'Like K but pointing down',
            'paths': [
                # Palm turned
                '<ellipse cx="75" cy="75" rx="20" ry="15" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Index finger down
                '<rect x="65" y="85" width="8" height="35" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Middle finger forward
                '<rect x="75" y="55" width="25" height="8" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Thumb touching middle finger
                '<ellipse cx="85" cy="59" rx="6" ry="10" fill="#f59e0b"/>',
                # Other fingers folded
                '<circle cx="85" cy="85" r="8" fill="#f59e0b"/>',
                '<circle cx="90" cy="85" r="8" fill="#f59e0b"/>'
            ]
        },
        'q': {
            'name': 'Q',
            'description': 'Index finger and thumb down',
            'paths': [
                # Palm turned
                '<ellipse cx="75" cy="70" rx="15" ry="20" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Index finger pointing down
                '<rect x="70" y="90" width="8" height="25" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Thumb pointing down parallel
                '<rect x="55" y="90" width="8" height="25" rx="4" fill="#f59e0b"/>',
                # Other fingers folded
                '<circle cx="80" cy="75" r="8" fill="#f59e0b"/>',
                '<circle cx="85" cy="80" r="8" fill="#f59e0b"/>',
                '<circle cx="90" cy="85" r="8" fill="#f59e0b"/>'
            ]
        },
        'r': {
            'name': 'R',
            'description': 'Index and middle finger crossed',
            'paths': [
                # Palm
                '<ellipse cx="75" cy="90" rx="15" ry="18" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Index finger up
                '<rect x="68" y="25" width="8" height="50" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Middle finger crossed over
                '<rect x="75" y="20" width="8" height="50" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2" transform="rotate(15 79 45)"/>',
                # Crossing point
                '<circle cx="75" cy="45" r="4" fill="#dc2626"/>',
                # Other fingers folded
                '<circle cx="85" cy="80" r="8" fill="#f59e0b"/>',
                '<circle cx="90" cy="85" r="8" fill="#f59e0b"/>',
                # Thumb holding
                '<ellipse cx="60" cy="85" rx="8" ry="12" fill="#f59e0b"/>'
            ]
        },
        's': {
            'name': 'S',
            'description': 'Fist with thumb over fingers',
            'paths': [
                # Clenched fist
                '<circle cx="75" cy="85" r="25" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Thumb across top
                '<ellipse cx="75" cy="70" rx="18" ry="8" fill="#f59e0b"/>',
                # Knuckle details
                '<circle cx="60" cy="75" r="3" fill="#f59e0b"/>',
                '<circle cx="70" cy="72" r="3" fill="#f59e0b"/>',
                '<circle cx="80" cy="72" r="3" fill="#f59e0b"/>',
                '<circle cx="90" cy="75" r="3" fill="#f59e0b"/>'
            ]
        },
        't': {
            'name': 'T',
            'description': 'Thumb between index and middle finger',
            'paths': [
                # Palm
                '<ellipse cx="75" cy="90" rx="15" ry="18" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Index finger folded
                '<ellipse cx="65" cy="70" rx="8" ry="12" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Thumb between
                '<ellipse cx="70" cy="65" rx="6" ry="15" fill="#f59e0b"/>',
                # Other fingers folded
                '<circle cx="75" cy="75" r="8" fill="#f59e0b"/>',
                '<circle cx="80" cy="80" r="8" fill="#f59e0b"/>',
                '<circle cx="85" cy="85" r="8" fill="#f59e0b"/>'
            ]
        },
        'u': {
            'name': 'U',
            'description': 'Index and middle finger up together',
            'paths': [
                # Palm
                '<ellipse cx="75" cy="90" rx="15" ry="18" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Two fingers up together
                '<rect x="68" y="25" width="8" height="50" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                '<rect x="78" y="25" width="8" height="50" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Other fingers folded
                '<circle cx="85" cy="80" r="8" fill="#f59e0b"/>',
                '<circle cx="90" cy="85" r="8" fill="#f59e0b"/>',
                # Thumb holding
                '<ellipse cx="60" cy="85" rx="8" ry="12" fill="#f59e0b"/>'
            ]
        },
        'v': {
            'name': 'V',
            'description': 'Index and middle finger apart (victory)',
            'paths': [
                # Palm
                '<ellipse cx="75" cy="90" rx="15" ry="18" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Two fingers in V shape
                '<rect x="65" y="25" width="8" height="50" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2" transform="rotate(-10 69 50)"/>',
                '<rect x="80" y="25" width="8" height="50" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2" transform="rotate(10 84 50)"/>',
                # Other fingers folded
                '<circle cx="85" cy="85" r="8" fill="#f59e0b"/>',
                '<circle cx="90" cy="90" r="8" fill="#f59e0b"/>',
                # Thumb holding
                '<ellipse cx="60" cy="85" rx="8" ry="12" fill="#f59e0b"/>'
            ]
        },
        'w': {
            'name': 'W',
            'description': 'Index, middle, and ring finger up',
            'paths': [
                # Palm
                '<ellipse cx="75" cy="90" rx="15" ry="18" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Three fingers up
                '<rect x="63" y="25" width="7" height="50" rx="3" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                '<rect x="73" y="20" width="7" height="55" rx="3" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                '<rect x="83" y="25" width="7" height="50" rx="3" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Pinky folded
                '<circle cx="92" cy="85" r="8" fill="#f59e0b"/>',
                # Thumb holding
                '<ellipse cx="58" cy="85" rx="8" ry="12" fill="#f59e0b"/>'
            ]
        },
        'x': {
            'name': 'X',
            'description': 'Index finger curved like a hook',
            'paths': [
                # Palm
                '<ellipse cx="75" cy="90" rx="15" ry="18" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Hooked index finger
                '<path d="M 70 65 Q 70 45 75 40 Q 80 45 78 55" fill="none" stroke="#fbbf24" stroke-width="8" stroke-linecap="round"/>',
                # Other fingers folded
                '<circle cx="75" cy="75" r="8" fill="#f59e0b"/>',
                '<circle cx="80" cy="80" r="8" fill="#f59e0b"/>',
                '<circle cx="85" cy="85" r="8" fill="#f59e0b"/>',
                # Thumb tucked
                '<ellipse cx="65" cy="85" rx="6" ry="10" fill="#f59e0b"/>'
            ]
        },
        'y': {
            'name': 'Y',
            'description': 'Thumb and pinky extended (hang loose)',
            'paths': [
                # Palm
                '<ellipse cx="75" cy="80" rx="15" ry="20" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Thumb out
                '<rect x="45" y="70" width="25" height="8" rx="4" fill="#f59e0b"/>',
                # Pinky up
                '<rect x="88" y="35" width="6" height="30" rx="3" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Other fingers folded
                '<circle cx="70" cy="75" r="8" fill="#f59e0b"/>',
                '<circle cx="75" cy="70" r="8" fill="#f59e0b"/>',
                '<circle cx="80" cy="75" r="8" fill="#f59e0b"/>'
            ]
        },
        'z': {
            'name': 'Z',
            'description': 'Index finger traces Z in the air',
            'paths': [
                # Palm
                '<ellipse cx="75" cy="90" rx="15" ry="18" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Index finger pointing
                '<rect x="70" y="30" width="8" height="45" rx="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>',
                # Z-pattern motion
                '<path d="M 65 35 L 85 35 L 65 50 L 85 50" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>',
                # Motion arrows
                '<path d="M 75 32 L 85 32" fill="none" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowhead)"/>',
                '<path d="M 75 47 L 65 47" fill="none" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowhead)"/>',
                '<path d="M 75 52 L 85 52" fill="none" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowhead)"/>',
                # Other fingers folded
                '<circle cx="80" cy="80" r="8" fill="#f59e0b"/>',
                '<circle cx="85" cy="85" r="8" fill="#f59e0b"/>',
                '<circle cx="90" cy="90" r="8" fill="#f59e0b"/>',
                # Thumb folded
                '<ellipse cx="65" cy="85" rx="8" ry="12" fill="#f59e0b"/>',
                # Arrow marker definition
                '<defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#dc2626"/></marker></defs>'
            ]
        }
    }
    
    print("Creating accurate ASL alphabet SVGs...")
    
    for letter_key, letter_data in asl_alphabet.items():
        svg_path = os.path.join(output_dir, f"{letter_key}.svg")
        
        svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
    <rect width="150" height="150" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
    
    <!-- ASL {letter_data['name']} - {letter_data['description']} -->
    {chr(10).join(letter_data['paths'])}
    
    <text x="75" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#374151">ASL {letter_data['name']}</text>
</svg>'''
        
        with open(svg_path, 'w') as f:
            f.write(svg_content)
        
        print(f"Created accurate ASL SVG: {letter_data['name']} -> {svg_path}")

if __name__ == "__main__":
    # Default paths - use absolute paths from project root
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    input_image = os.path.join(project_root, "asl_alphabet_chart.png")
    output_directory = os.path.join(project_root, "public/images/signs/alphabet")
    
    print("🔤 ASL Alphabet Extractor")
    print("=" * 50)
    
    if os.path.exists(input_image):
        success = extract_asl_alphabet(input_image, output_directory)
        if not success:
            print("Creating accurate ASL SVGs instead...")
            create_accurate_asl_svgs(output_directory)
    else:
        print(f"❌ Input image not found: {input_image}")
        print("Creating accurate ASL SVGs instead...")
        create_accurate_asl_svgs(output_directory)
    
    print("\n🎉 ASL alphabet extraction complete!")