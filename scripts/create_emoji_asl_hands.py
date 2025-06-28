#!/usr/bin/env python3
"""
Emoji ASL Hand Generator
Creates ASL alphabet cards using actual hand sign emojis instead of SVG illustrations, mapping each letter to its corresponding emoji.
"""

import os

def create_emoji_asl_hands(output_dir):
    """
    Create ASL alphabet cards using hand sign emojis for each letter.
    """
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # ASL alphabet mapped to corresponding hand sign emojis
    asl_emoji_hands = {
        'a': {
            'name': 'A',
            'description': 'Closed fist, thumb alongside index finger',
            'emoji': '✊',  # Raised fist
        },
        'b': {
            'name': 'B',
            'description': 'All fingers straight, thumb folded across palm',
            'emoji': '🤚',  # Raised hand
        },
        'c': {
            'name': 'C',
            'description': 'Curved hand like holding a cup',
            'emoji': '🤏',  # Pinching hand (C-like curve)
        },
        'd': {
            'name': 'D',
            'description': 'Index finger up, other fingers touch thumb',
            'emoji': '👆',  # Index pointing up
        },
        'e': {
            'name': 'E',
            'description': 'All fingertips touch thumb',
            'emoji': '🤏',  # Pinching hand
        },
        'f': {
            'name': 'F',
            'description': 'Index and thumb touch, others extended',
            'emoji': '👌',  # OK hand
        },
        'g': {
            'name': 'G',
            'description': 'Index finger and thumb pointing sideways',
            'emoji': '👈',  # Backhand index pointing left
        },
        'h': {
            'name': 'H',
            'description': 'Index and middle finger extended sideways',
            'emoji': '✌️',  # Victory hand
        },
        'i': {
            'name': 'I',
            'description': 'Pinky finger extended up',
            'emoji': '🤟',  # Love-you gesture (close to pinky up)
        },
        'j': {
            'name': 'J',
            'description': 'Pinky extended, draw a J in the air',
            'emoji': '🤟',  # Love-you gesture
        },
        'k': {
            'name': 'K',
            'description': 'Index and middle finger up, thumb between',
            'emoji': '✌️',  # Victory hand
        },
        'l': {
            'name': 'L',
            'description': 'Index finger up, thumb out (L shape)',
            'emoji': '👆',  # Index pointing up
        },
        'm': {
            'name': 'M',
            'description': 'Three fingers over thumb',
            'emoji': '✊',  # Raised fist
        },
        'n': {
            'name': 'N',
            'description': 'Two fingers over thumb',
            'emoji': '✊',  # Raised fist
        },
        'o': {
            'name': 'O',
            'description': 'All fingers curved into O shape',
            'emoji': '👌',  # OK hand (perfect O shape)
        },
        'p': {
            'name': 'P',
            'description': 'Like K but pointing down',
            'emoji': '👇',  # Backhand index pointing down
        },
        'q': {
            'name': 'Q',
            'description': 'Index finger and thumb down',
            'emoji': '👇',  # Backhand index pointing down
        },
        'r': {
            'name': 'R',
            'description': 'Index and middle finger crossed',
            'emoji': '🤞',  # Crossed fingers
        },
        's': {
            'name': 'S',
            'description': 'Fist with thumb over fingers',
            'emoji': '✊',  # Raised fist
        },
        't': {
            'name': 'T',
            'description': 'Thumb between index and middle finger',
            'emoji': '👍',  # Thumbs up
        },
        'u': {
            'name': 'U',
            'description': 'Index and middle finger up together',
            'emoji': '✌️',  # Victory hand
        },
        'v': {
            'name': 'V',
            'description': 'Index and middle finger apart (victory)',
            'emoji': '✌️',  # Victory hand
        },
        'w': {
            'name': 'W',
            'description': 'Index, middle, and ring finger up',
            'emoji': '🤟',  # Love-you gesture
        },
        'x': {
            'name': 'X',
            'description': 'Index finger curved like a hook',
            'emoji': '👆',  # Index pointing up
        },
        'y': {
            'name': 'Y',
            'description': 'Thumb and pinky extended (hang loose)',
            'emoji': '🤟',  # Love-you gesture (hang loose)
        },
        'z': {
            'name': 'Z',
            'description': 'Index finger traces Z in the air',
            'emoji': '👆',  # Index pointing up
        }
    }
    
    print("Creating ASL alphabet with hand sign emojis...")
    
    for letter_key, letter_data in asl_emoji_hands.items():
        svg_path = os.path.join(output_dir, f"{letter_key}.svg")
        
        svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
    <rect width="150" height="150" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
    
    <!-- ASL {letter_data['name']} - {letter_data['description']} -->
    <text x="75" y="85" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" fill="#000">{letter_data['emoji']}</text>
    
    <text x="75" y="145" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#374151">ASL {letter_data['name']}</text>
</svg>'''
        
        with open(svg_path, 'w') as f:
            f.write(svg_content)
        
        print(f"Created emoji ASL hand: {letter_data['name']} ({letter_data['emoji']}) -> {svg_path}")

if __name__ == "__main__":
    # Default paths
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_directory = os.path.join(project_root, "public/images/signs/alphabet")
    
    print("🤟 Emoji ASL Hand Generator")
    print("=" * 50)
    
    create_emoji_asl_hands(output_directory)
    
    print("\n🎉 All 26 emoji ASL hand signs complete!") 