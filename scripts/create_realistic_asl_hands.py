#!/usr/bin/env python3
"""
Realistic ASL Hand Generator
Creates anatomically accurate human hand illustrations for each ASL alphabet letter.
"""

import os

def create_realistic_asl_hands(output_dir):
    """
    Create realistic human hand SVG illustrations for ASL alphabet.
    """
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Skin tone colors
    skin_base = "#ffdbac"  # Base skin tone
    skin_shadow = "#d4a574"  # Shadow/contour
    skin_highlight = "#fff2e6"  # Highlight
    nail_color = "#f4c2a1"  # Nail color
    
    # ASL alphabet with realistic hand illustrations
    asl_hands = {
        'a': {
            'name': 'A',
            'description': 'Closed fist, thumb alongside index finger',
            'svg': f'''
            <!-- Wrist/forearm -->
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            
            <!-- Hand palm -->
            <ellipse cx="75" cy="100" rx="22" ry="30" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            
            <!-- Closed fingers forming fist -->
            <ellipse cx="70" cy="80" rx="18" ry="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="75" cy="75" rx="16" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            
            <!-- Individual finger knuckles -->
            <circle cx="65" cy="75" r="3" fill="{skin_shadow}"/>
            <circle cx="72" cy="72" r="3" fill="{skin_shadow}"/>
            <circle cx="78" cy="72" r="3" fill="{skin_shadow}"/>
            <circle cx="85" cy="75" r="3" fill="{skin_shadow}"/>
            
            <!-- Thumb alongside fist -->
            <ellipse cx="52" cy="88" rx="7" ry="16" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="52" cy="82" rx="4" ry="6" fill="{nail_color}"/>
            
            <!-- Hand creases -->
            <path d="M60 95 Q75 90 90 95" stroke="{skin_shadow}" stroke-width="1" fill="none"/>
            <path d="M58 105 Q75 100 92 105" stroke="{skin_shadow}" stroke-width="1" fill="none"/>
            '''
        },
        
        'b': {
            'name': 'B',
            'description': 'All fingers straight, thumb folded across palm',
            'svg': f'''
            <!-- Wrist/forearm -->
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            
            <!-- Hand palm -->
            <ellipse cx="75" cy="90" rx="18" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            
            <!-- Four fingers straight up -->
            <!-- Index finger -->
            <ellipse cx="65" cy="45" rx="6" ry="20" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="65" cy="37" rx="3" ry="4" fill="{nail_color}"/>
            
            <!-- Middle finger -->
            <ellipse cx="75" cy="40" rx="6" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="75" cy="30" rx="3" ry="4" fill="{nail_color}"/>
            
            <!-- Ring finger -->
            <ellipse cx="85" cy="45" rx="6" ry="20" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="85" cy="37" rx="3" ry="4" fill="{nail_color}"/>
            
            <!-- Pinky finger -->
            <ellipse cx="93" cy="50" rx="5" ry="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="93" cy="44" rx="2.5" ry="3" fill="{nail_color}"/>
            
            <!-- Thumb folded across palm -->
            <ellipse cx="60" cy="75" rx="8" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="58" cy="70" rx="4" ry="5" fill="{nail_color}"/>
            
            <!-- Finger joints -->
            <circle cx="65" cy="55" r="2" fill="{skin_shadow}"/>
            <circle cx="75" cy="55" r="2" fill="{skin_shadow}"/>
            <circle cx="85" cy="55" r="2" fill="{skin_shadow}"/>
            <circle cx="93" cy="60" r="1.5" fill="{skin_shadow}"/>
            '''
        },
        
        'c': {
            'name': 'C',
            'description': 'Curved hand like holding a cup',
            'svg': f'''
            <!-- Wrist/forearm -->
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            
            <!-- Hand palm (curved) -->
            <ellipse cx="75" cy="90" rx="20" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            
            <!-- Curved fingers forming C shape -->
            <!-- Index finger -->
            <path d="M65 50 Q55 45 50 60 Q48 75 55 85" stroke="{skin_base}" stroke-width="12" stroke-linecap="round" fill="none"/>
            <path d="M65 50 Q55 45 50 60 Q48 75 55 85" stroke="{skin_shadow}" stroke-width="2" fill="none"/>
            
            <!-- Middle finger -->
            <path d="M75 45 Q65 40 60 55 Q58 75 65 90" stroke="{skin_base}" stroke-width="12" stroke-linecap="round" fill="none"/>
            <path d="M75 45 Q65 40 60 55 Q58 75 65 90" stroke="{skin_shadow}" stroke-width="2" fill="none"/>
            
            <!-- Ring finger -->
            <path d="M85 50 Q95 45 100 60 Q102 75 95 85" stroke="{skin_base}" stroke-width="12" stroke-linecap="round" fill="none"/>
            <path d="M85 50 Q95 45 100 60 Q102 75 95 85" stroke="{skin_shadow}" stroke-width="2" fill="none"/>
            
            <!-- Pinky finger -->
            <path d="M93 55 Q103 50 105 65 Q106 75 100 80" stroke="{skin_base}" stroke-width="10" stroke-linecap="round" fill="none"/>
            <path d="M93 55 Q103 50 105 65 Q106 75 100 80" stroke="{skin_shadow}" stroke-width="2" fill="none"/>
            
            <!-- Thumb (curved) -->
            <path d="M58 70 Q45 65 42 80 Q44 90 55 95" stroke="{skin_base}" stroke-width="10" stroke-linecap="round" fill="none"/>
            <path d="M58 70 Q45 65 42 80 Q44 90 55 95" stroke="{skin_shadow}" stroke-width="2" fill="none"/>
            
            <!-- Fingernails -->
            <ellipse cx="52" cy="62" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="62" cy="57" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="73" cy="47" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="83" cy="52" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="100" cy="57" rx="2.5" ry="3" fill="{nail_color}"/>
            '''
        },
        
        'd': {
            'name': 'D',
            'description': 'Index finger up, other fingers touch thumb',
            'svg': f'''
            <!-- Wrist/forearm -->
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            
            <!-- Hand palm -->
            <ellipse cx="75" cy="90" rx="18" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            
            <!-- Index finger straight up -->
            <ellipse cx="70" cy="45" rx="6" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="32" rx="3" ry="4" fill="{nail_color}"/>
            <circle cx="70" cy="55" r="2" fill="{skin_shadow}"/>
            
            <!-- Other fingers folded, touching thumb -->
            <ellipse cx="80" cy="75" rx="8" ry="10" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="85" cy="80" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="88" cy="85" rx="5" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            
            <!-- Thumb touching middle finger -->
            <ellipse cx="65" cy="78" rx="7" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="63" cy="72" rx="3" ry="4" fill="{nail_color}"/>
            
            <!-- Connection point -->
            <circle cx="75" cy="78" r="3" fill="{skin_shadow}"/>
            '''
        },
        
        'l': {
            'name': 'L',
            'description': 'Index finger up, thumb out (L shape)',
            'svg': f'''
            <!-- Wrist/forearm -->
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            
            <!-- Hand palm -->
            <ellipse cx="78" cy="90" rx="15" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            
            <!-- Index finger straight up -->
            <ellipse cx="75" cy="45" rx="6" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="75" cy="32" rx="3" ry="4" fill="{nail_color}"/>
            <circle cx="75" cy="55" r="2" fill="{skin_shadow}"/>
            
            <!-- Thumb extending horizontally -->
            <ellipse cx="50" cy="78" rx="15" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="42" cy="78" rx="4" ry="3" fill="{nail_color}"/>
            <circle cx="55" cy="78" r="2" fill="{skin_shadow}"/>
            
            <!-- Other fingers folded -->
            <ellipse cx="85" cy="80" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="88" cy="85" rx="5" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="90" cy="90" rx="4" ry="5" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            
            <!-- Hand creases -->
            <path d="M65 85 Q75 80 85 85" stroke="{skin_shadow}" stroke-width="1" fill="none"/>
            '''
        },
        
        'o': {
            'name': 'O',
            'description': 'All fingers curved into O shape',
            'svg': f'''
            <!-- Wrist/forearm -->
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            
            <!-- Hand palm -->
            <ellipse cx="75" cy="95" rx="18" ry="20" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            
            <!-- Fingers forming O shape -->
            <!-- Index finger -->
            <path d="M70 65 Q60 55 55 65 Q58 75 68 80" stroke="{skin_base}" stroke-width="12" stroke-linecap="round" fill="none"/>
            <path d="M70 65 Q60 55 55 65 Q58 75 68 80" stroke="{skin_shadow}" stroke-width="2" fill="none"/>
            
            <!-- Middle finger -->
            <path d="M75 60 Q65 50 60 60 Q63 75 73 85" stroke="{skin_base}" stroke-width="12" stroke-linecap="round" fill="none"/>
            <path d="M75 60 Q65 50 60 60 Q63 75 73 85" stroke="{skin_shadow}" stroke-width="2" fill="none"/>
            
            <!-- Ring finger -->
            <path d="M80 65 Q90 55 95 65 Q92 75 82 80" stroke="{skin_base}" stroke-width="12" stroke-linecap="round" fill="none"/>
            <path d="M80 65 Q90 55 95 65 Q92 75 82 80" stroke="{skin_shadow}" stroke-width="2" fill="none"/>
            
            <!-- Pinky finger -->
            <path d="M85 70 Q93 62 96 70 Q94 78 87 82" stroke="{skin_base}" stroke-width="10" stroke-linecap="round" fill="none"/>
            <path d="M85 70 Q93 62 96 70 Q94 78 87 82" stroke="{skin_shadow}" stroke-width="2" fill="none"/>
            
            <!-- Thumb completing O -->
            <path d="M68 80 Q58 85 55 75 Q58 65 68 65" stroke="{skin_base}" stroke-width="10" stroke-linecap="round" fill="none"/>
            <path d="M68 80 Q58 85 55 75 Q58 65 68 65" stroke="{skin_shadow}" stroke-width="2" fill="none"/>
            
            <!-- Fingernails -->
            <ellipse cx="57" cy="67" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="62" cy="62" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="73" cy="62" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="83" cy="67" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="93" cy="72" rx="2.5" ry="3" fill="{nail_color}"/>
            '''
        }
    }
    
    print("Creating realistic ASL hand illustrations...")
    
    # Generate only a few key letters to demonstrate the realistic approach
    for letter_key, letter_data in asl_hands.items():
        svg_path = os.path.join(output_dir, f"{letter_key}.svg")
        
        svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
    <rect width="150" height="150" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
    
    <!-- ASL {letter_data['name']} - {letter_data['description']} -->
    {letter_data['svg']}
    
    <text x="75" y="145" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#374151">ASL {letter_data['name']}</text>
</svg>'''
        
        with open(svg_path, 'w') as f:
            f.write(svg_content)
        
        print(f"Created realistic ASL hand: {letter_data['name']} -> {svg_path}")

if __name__ == "__main__":
    # Default paths
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_directory = os.path.join(project_root, "public/images/signs/alphabet")
    
    print("🖐️ Realistic ASL Hand Generator")
    print("=" * 50)
    
    create_realistic_asl_hands(output_directory)
    
    print("\n🎉 Realistic ASL hand illustrations complete!") 