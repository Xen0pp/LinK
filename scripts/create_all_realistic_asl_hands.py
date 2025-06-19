#!/usr/bin/env python3
"""
Complete Realistic ASL Hand Generator
Creates anatomically accurate human hand illustrations for all 26 ASL alphabet letters.
"""

import os

def create_all_realistic_asl_hands(output_dir):
    """
    Create realistic human hand SVG illustrations for complete ASL alphabet.
    """
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Skin tone colors - natural human skin
    skin_base = "#ffdbac"  # Base skin tone
    skin_shadow = "#d4a574"  # Shadow/contour
    skin_highlight = "#fff2e6"  # Highlight
    nail_color = "#f4c2a1"  # Natural nail color
    
    # Complete ASL alphabet with realistic hand illustrations
    asl_hands = {
        'a': {
            'name': 'A', 'description': 'Closed fist, thumb alongside index finger',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="100" rx="22" ry="30" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="80" rx="18" ry="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="75" cy="75" rx="16" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <circle cx="65" cy="75" r="3" fill="{skin_shadow}"/>
            <circle cx="72" cy="72" r="3" fill="{skin_shadow}"/>
            <circle cx="78" cy="72" r="3" fill="{skin_shadow}"/>
            <circle cx="85" cy="75" r="3" fill="{skin_shadow}"/>
            <ellipse cx="52" cy="88" rx="7" ry="16" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="52" cy="82" rx="4" ry="6" fill="{nail_color}"/>
            <path d="M60 95 Q75 90 90 95" stroke="{skin_shadow}" stroke-width="1" fill="none"/>
            '''
        },
        'b': {
            'name': 'B', 'description': 'All fingers straight, thumb folded across palm',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="90" rx="18" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="65" cy="45" rx="6" ry="20" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="75" cy="40" rx="6" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="85" cy="45" rx="6" ry="20" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="93" cy="50" rx="5" ry="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="60" cy="75" rx="8" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="65" cy="37" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="75" cy="30" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="85" cy="37" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="93" cy="44" rx="2.5" ry="3" fill="{nail_color}"/>
            <ellipse cx="58" cy="70" rx="4" ry="5" fill="{nail_color}"/>
            '''
        },
        'c': {
            'name': 'C', 'description': 'Curved hand like holding a cup',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="90" rx="20" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <path d="M65 50 Q55 45 50 60 Q48 75 55 85" stroke="{skin_base}" stroke-width="12" stroke-linecap="round" fill="none"/>
            <path d="M75 45 Q65 40 60 55 Q58 75 65 90" stroke="{skin_base}" stroke-width="12" stroke-linecap="round" fill="none"/>
            <path d="M85 50 Q95 45 100 60 Q102 75 95 85" stroke="{skin_base}" stroke-width="12" stroke-linecap="round" fill="none"/>
            <path d="M93 55 Q103 50 105 65 Q106 75 100 80" stroke="{skin_base}" stroke-width="10" stroke-linecap="round" fill="none"/>
            <path d="M58 70 Q45 65 42 80 Q44 90 55 95" stroke="{skin_base}" stroke-width="10" stroke-linecap="round" fill="none"/>
            <ellipse cx="52" cy="62" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="62" cy="57" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="73" cy="47" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="83" cy="52" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="100" cy="57" rx="2.5" ry="3" fill="{nail_color}"/>
            '''
        },
        'd': {
            'name': 'D', 'description': 'Index finger up, other fingers touch thumb',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="90" rx="18" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="45" rx="6" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="32" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="80" cy="75" rx="8" ry="10" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="85" cy="80" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="88" cy="85" rx="5" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="65" cy="78" rx="7" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="63" cy="72" rx="3" ry="4" fill="{nail_color}"/>
            <circle cx="75" cy="78" r="3" fill="{skin_shadow}"/>
            '''
        },
        'e': {
            'name': 'E', 'description': 'All fingertips touch thumb',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="90" rx="18" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <path d="M68 60 Q65 50 70 55 Q75 50 80 55 Q85 50 90 60" stroke="{skin_base}" stroke-width="8" stroke-linecap="round" fill="none"/>
            <ellipse cx="58" cy="75" rx="8" ry="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <circle cx="70" cy="58" r="4" fill="{skin_shadow}"/>
            <circle cx="76" cy="55" r="4" fill="{skin_shadow}"/>
            <circle cx="82" cy="58" r="4" fill="{skin_shadow}"/>
            <circle cx="87" cy="62" r="4" fill="{skin_shadow}"/>
            '''
        },
        'f': {
            'name': 'F', 'description': 'Index and thumb touch, others extended',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="90" rx="18" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="75" cy="40" rx="6" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="85" cy="45" rx="6" ry="20" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="93" cy="50" rx="5" ry="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="55" cy="70" rx="6" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="50" cy="65" rx="8" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <circle cx="58" cy="68" r="3" fill="{skin_shadow}"/>
            <ellipse cx="75" cy="30" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="85" cy="37" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="93" cy="44" rx="2.5" ry="3" fill="{nail_color}"/>
            '''
        },
        'g': {
            'name': 'G', 'description': 'Index finger and thumb pointing sideways',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="80" rx="12" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="95" cy="68" rx="12" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="55" rx="6" ry="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="65" cy="90" rx="4" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="95" rx="4" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="75" cy="95" rx="4" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="102" cy="68" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="70" cy="48" rx="3" ry="4" fill="{nail_color}"/>
            '''
        },
        'h': {
            'name': 'H', 'description': 'Index and middle finger extended sideways',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="85" rx="15" ry="20" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="102" cy="64" rx="12" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="102" cy="76" rx="12" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="75" rx="8" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="65" cy="90" rx="4" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="95" rx="4" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="109" cy="64" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="109" cy="76" rx="3" ry="4" fill="{nail_color}"/>
            '''
        },
        'i': {
            'name': 'I', 'description': 'Pinky finger extended up',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="85" rx="15" ry="20" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="88" cy="45" rx="5" ry="20" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="88" cy="35" rx="2.5" ry="3" fill="{nail_color}"/>
            <ellipse cx="65" cy="75" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="70" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="75" cy="70" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="60" cy="80" rx="8" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            '''
        },
        'j': {
            'name': 'J', 'description': 'Pinky extended, draw a J in the air',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="85" rx="15" ry="20" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <path d="M88 35 L88 50 Q88 60 80 60 Q72 60 72 52" stroke="{skin_base}" stroke-width="10" stroke-linecap="round" fill="none"/>
            <path d="M85 40 Q90 45 85 50" stroke="#dc2626" stroke-width="2" fill="none"/>
            <ellipse cx="65" cy="75" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="70" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="75" cy="70" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="60" cy="80" rx="8" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="88" cy="35" rx="3" ry="4" fill="{nail_color}"/>
            '''
        },
        'k': {
            'name': 'K', 'description': 'Index and middle finger up, thumb between',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="90" rx="15" ry="18" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="68" cy="40" rx="6" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="80" cy="35" rx="6" ry="30" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="74" cy="55" rx="5" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="85" cy="80" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="90" cy="85" rx="5" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="68" cy="28" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="80" cy="23" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="74" cy="48" rx="3" ry="4" fill="{nail_color}"/>
            '''
        },
        'l': {
            'name': 'L', 'description': 'Index finger up, thumb out (L shape)',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="78" cy="90" rx="15" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="75" cy="45" rx="6" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="50" cy="78" rx="15" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="85" cy="80" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="88" cy="85" rx="5" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="90" cy="90" rx="4" ry="5" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="75" cy="32" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="42" cy="78" rx="4" ry="3" fill="{nail_color}"/>
            <path d="M65 85 Q75 80 85 85" stroke="{skin_shadow}" stroke-width="1" fill="none"/>
            '''
        },
        'm': {
            'name': 'M', 'description': 'Three fingers over thumb',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="90" rx="18" ry="20" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="65" cy="70" rx="10" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="75" cy="65" rx="10" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="85" cy="70" rx="10" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="85" rx="12" ry="6" fill="{skin_shadow}"/>
            <ellipse cx="90" cy="85" rx="4" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            '''
        },
        'n': {
            'name': 'N', 'description': 'Two fingers over thumb',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="90" rx="18" ry="20" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="68" cy="70" rx="10" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="78" cy="65" rx="10" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="85" rx="12" ry="6" fill="{skin_shadow}"/>
            <ellipse cx="85" cy="85" rx="4" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="90" cy="90" rx="4" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            '''
        },
        'o': {
            'name': 'O', 'description': 'All fingers curved into O shape',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="95" rx="18" ry="20" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <path d="M70 65 Q60 55 55 65 Q58 75 68 80" stroke="{skin_base}" stroke-width="12" stroke-linecap="round" fill="none"/>
            <path d="M75 60 Q65 50 60 60 Q63 75 73 85" stroke="{skin_base}" stroke-width="12" stroke-linecap="round" fill="none"/>
            <path d="M80 65 Q90 55 95 65 Q92 75 82 80" stroke="{skin_base}" stroke-width="12" stroke-linecap="round" fill="none"/>
            <path d="M85 70 Q93 62 96 70 Q94 78 87 82" stroke="{skin_base}" stroke-width="10" stroke-linecap="round" fill="none"/>
            <path d="M68 80 Q58 85 55 75 Q58 65 68 65" stroke="{skin_base}" stroke-width="10" stroke-linecap="round" fill="none"/>
            <ellipse cx="57" cy="67" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="62" cy="62" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="73" cy="62" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="83" cy="67" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="93" cy="72" rx="2.5" ry="3" fill="{nail_color}"/>
            '''
        },
        'p': {
            'name': 'P', 'description': 'Like K but pointing down',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="75" rx="20" ry="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="68" cy="100" rx="6" ry="18" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="85" cy="58" rx="12" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="85" cy="59" rx="5" ry="8" fill="{skin_shadow}"/>
            <ellipse cx="85" cy="85" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="90" cy="85" rx="5" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="68" cy="110" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="92" cy="58" rx="3" ry="4" fill="{nail_color}"/>
            '''
        },
        'q': {
            'name': 'Q', 'description': 'Index finger and thumb down',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="70" rx="15" ry="20" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="74" cy="105" rx="6" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="59" cy="105" rx="6" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="80" cy="75" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="85" cy="80" rx="5" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="90" cy="85" rx="4" ry="5" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="74" cy="113" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="59" cy="113" rx="3" ry="4" fill="{nail_color}"/>
            '''
        },
        'r': {
            'name': 'R', 'description': 'Index and middle finger crossed',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="90" rx="15" ry="18" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="45" rx="6" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="78" cy="40" rx="6" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2" transform="rotate(15 78 45)"/>
            <circle cx="74" cy="45" r="3" fill="{skin_shadow}"/>
            <ellipse cx="85" cy="80" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="90" cy="85" rx="5" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="60" cy="85" rx="8" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="32" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="82" cy="30" rx="3" ry="4" fill="{nail_color}"/>
            '''
        },
        's': {
            'name': 'S', 'description': 'Fist with thumb over fingers',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="85" rx="22" ry="20" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="75" cy="70" rx="16" ry="6" fill="{skin_shadow}"/>
            <circle cx="60" cy="75" r="2" fill="{skin_shadow}"/>
            <circle cx="70" cy="72" r="2" fill="{skin_shadow}"/>
            <circle cx="80" cy="72" r="2" fill="{skin_shadow}"/>
            <circle cx="90" cy="75" r="2" fill="{skin_shadow}"/>
            '''
        },
        't': {
            'name': 'T', 'description': 'Thumb between index and middle finger',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="90" rx="15" ry="18" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="65" cy="70" rx="8" ry="10" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="65" rx="5" ry="12" fill="{skin_shadow}"/>
            <ellipse cx="75" cy="75" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="80" cy="80" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="85" cy="85" rx="5" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            '''
        },
        'u': {
            'name': 'U', 'description': 'Index and middle finger up together',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="90" rx="15" ry="18" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="45" rx="6" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="80" cy="45" rx="6" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="85" cy="80" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="90" cy="85" rx="5" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="60" cy="85" rx="8" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="32" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="80" cy="32" rx="3" ry="4" fill="{nail_color}"/>
            '''
        },
        'v': {
            'name': 'V', 'description': 'Index and middle finger apart (victory)',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="90" rx="15" ry="18" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="68" cy="45" rx="6" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2" transform="rotate(-8 68 50)"/>
            <ellipse cx="82" cy="45" rx="6" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2" transform="rotate(8 82 50)"/>
            <ellipse cx="85" cy="85" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="90" cy="90" rx="5" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="60" cy="85" rx="8" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="66" cy="32" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="84" cy="32" rx="3" ry="4" fill="{nail_color}"/>
            '''
        },
        'w': {
            'name': 'W', 'description': 'Index, middle, and ring finger up',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="90" rx="15" ry="18" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="66" cy="40" rx="5" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="75" cy="35" rx="5" ry="30" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="84" cy="40" rx="5" ry="25" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="92" cy="85" rx="5" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="58" cy="85" rx="8" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="66" cy="28" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="75" cy="23" rx="3" ry="4" fill="{nail_color}"/>
            <ellipse cx="84" cy="28" rx="3" ry="4" fill="{nail_color}"/>
            '''
        },
        'x': {
            'name': 'X', 'description': 'Index finger curved like a hook',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="90" rx="15" ry="18" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <path d="M70 65 Q70 45 75 40 Q80 45 78 55" stroke="{skin_base}" stroke-width="8" stroke-linecap="round" fill="none"/>
            <ellipse cx="75" cy="75" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="80" cy="80" rx="5" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="85" cy="85" rx="4" ry="5" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="65" cy="85" rx="6" ry="10" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="77" cy="42" rx="3" ry="4" fill="{nail_color}"/>
            '''
        },
        'y': {
            'name': 'Y', 'description': 'Thumb and pinky extended (hang loose)',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="80" rx="15" ry="20" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="50" cy="70" rx="12" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="90" cy="50" rx="5" ry="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="70" cy="75" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="75" cy="70" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="80" cy="75" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="42" cy="70" rx="4" ry="3" fill="{nail_color}"/>
            <ellipse cx="90" cy="43" rx="2.5" ry="3" fill="{nail_color}"/>
            '''
        },
        'z': {
            'name': 'Z', 'description': 'Index finger traces Z in the air',
            'svg': f'''
            <rect x="60" y="120" width="30" height="20" rx="15" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="1"/>
            <ellipse cx="75" cy="90" rx="15" ry="18" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="72" cy="45" rx="6" ry="20" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <path d="M65 35 L85 35 L65 50 L85 50" stroke="#dc2626" stroke-width="3" stroke-linecap="round" fill="none"/>
            <ellipse cx="80" cy="80" rx="6" ry="8" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="85" cy="85" rx="5" ry="6" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="90" cy="90" rx="4" ry="5" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="65" cy="85" rx="8" ry="12" fill="{skin_base}" stroke="{skin_shadow}" stroke-width="2"/>
            <ellipse cx="72" cy="32" rx="3" ry="4" fill="{nail_color}"/>
            '''
        }
    }
    
    print("Creating complete realistic ASL hand alphabet...")
    
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
    
    print("🖐️ Complete Realistic ASL Hand Generator")
    print("=" * 50)
    
    create_all_realistic_asl_hands(output_directory)
    
    print("\n🎉 All 26 realistic ASL hand illustrations complete!") 