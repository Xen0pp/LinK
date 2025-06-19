#!/usr/bin/env python3
"""
ASL Dictionary Images Generator
Creates a comprehensive set of ASL sign images for dictionary search functionality.
"""

import os
from PIL import Image, ImageDraw, ImageFont

def create_asl_dictionary_images():
    """
    Create ASL dictionary images for common words and phrases.
    """
    
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Define output directories
    output_dirs = [
        os.path.join(project_root, "public/images/signs/dictionary"),
        os.path.join(project_root, "frontend/public/images/signs/dictionary")
    ]
    
    # Create output directories
    for output_dir in output_dirs:
        os.makedirs(output_dir, exist_ok=True)
        print(f"Created directory: {output_dir}")
    
    # ASL Dictionary data with categories
    dictionary_data = {
        # Basic Greetings & Polite Expressions
        'hello': {
            'category': 'greetings',
            'description': 'Flat hand at forehead, move forward slightly',
            'difficulty': 'easy',
            'usage': 'Standard greeting in ASL'
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
            'usage': 'Apologize or express sympathy'
        },
        'goodbye': {
            'category': 'greetings',
            'description': 'Wave hand or finger wiggle',
            'difficulty': 'easy',
            'usage': 'Farewell greeting'
        },
        'nice_to_meet_you': {
            'category': 'greetings',
            'description': 'Complex phrase: NICE + MEET + YOU',
            'difficulty': 'medium',
            'usage': 'First time meeting someone'
        },
        
        # Family & Relationships
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
        'sister': {
            'category': 'family',
            'description': 'L-hand at chin, moves down to meet other L-hand',
            'difficulty': 'medium',
            'usage': 'Female sibling'
        },
        'brother': {
            'category': 'family',
            'description': 'L-hand at forehead, moves down to meet other L-hand',
            'difficulty': 'medium',
            'usage': 'Male sibling'
        },
        'family': {
            'category': 'family',
            'description': 'F-hands form circle',
            'difficulty': 'medium',
            'usage': 'Related people group'
        },
        'friend': {
            'category': 'family',
            'description': 'Index fingers hook together twice',
            'difficulty': 'medium',
            'usage': 'Close companion'
        },
        
        # Food & Drink
        'eat': {
            'category': 'food',
            'description': 'Fingertips to mouth repeatedly',
            'difficulty': 'easy',
            'usage': 'Consume food'
        },
        'drink': {
            'category': 'food',
            'description': 'C-hand to mouth, tilt up',
            'difficulty': 'easy',
            'usage': 'Consume liquid'
        },
        'water': {
            'category': 'food',
            'description': 'W-hand taps chin',
            'difficulty': 'easy',
            'usage': 'Clear liquid, H2O'
        },
        'milk': {
            'category': 'food',
            'description': 'Squeeze fist alternately',
            'difficulty': 'easy',
            'usage': 'Dairy beverage'
        },
        'coffee': {
            'category': 'food',
            'description': 'S-hand grinds on top of other S-hand',
            'difficulty': 'medium',
            'usage': 'Caffeinated beverage'
        },
        'bread': {
            'category': 'food',
            'description': 'Knife hand slices other hand',
            'difficulty': 'medium',
            'usage': 'Baked staple food'
        },
        
        # Colors
        'red': {
            'category': 'colors',
            'description': 'Index finger brushes lips downward',
            'difficulty': 'easy',
            'usage': 'Color of blood, fire'
        },
        'blue': {
            'category': 'colors',
            'description': 'B-hand shakes slightly',
            'difficulty': 'easy',
            'usage': 'Color of sky, ocean'
        },
        'green': {
            'category': 'colors',
            'description': 'G-hand shakes slightly',
            'difficulty': 'easy',
            'usage': 'Color of grass, plants'
        },
        'yellow': {
            'category': 'colors',
            'description': 'Y-hand shakes slightly',
            'difficulty': 'easy',
            'usage': 'Color of sun, banana'
        },
        'black': {
            'category': 'colors',
            'description': 'Index finger across forehead',
            'difficulty': 'easy',
            'usage': 'Absence of color'
        },
        'white': {
            'category': 'colors',
            'description': 'Five-hand on chest, pull out to closed hand',
            'difficulty': 'medium',
            'usage': 'Color of snow, milk'
        },
        
        # Numbers (basic)
        'one': {
            'category': 'numbers',
            'description': 'Index finger extended up',
            'difficulty': 'easy',
            'usage': 'Number 1, single item'
        },
        'two': {
            'category': 'numbers',
            'description': 'Index and middle finger extended',
            'difficulty': 'easy',
            'usage': 'Number 2, pair'
        },
        'three': {
            'category': 'numbers',
            'description': 'Thumb, index, and middle finger extended',
            'difficulty': 'easy',
            'usage': 'Number 3, trio'
        },
        'five': {
            'category': 'numbers',
            'description': 'All five fingers extended',
            'difficulty': 'easy',
            'usage': 'Number 5, hand count'
        },
        'ten': {
            'category': 'numbers',
            'description': 'Thumb up, shake slightly',
            'difficulty': 'easy',
            'usage': 'Number 10, decimal base'
        },
        
        # Time & Calendar
        'today': {
            'category': 'time',
            'description': 'NOW + DAY combination',
            'difficulty': 'medium',
            'usage': 'Current day'
        },
        'tomorrow': {
            'category': 'time',
            'description': 'Thumbs-up moves forward from cheek',
            'difficulty': 'medium',
            'usage': 'Next day'
        },
        'yesterday': {
            'category': 'time',
            'description': 'Thumbs-up moves back from cheek',
            'difficulty': 'medium',
            'usage': 'Previous day'
        },
        'time': {
            'category': 'time',
            'description': 'Index finger taps wrist',
            'difficulty': 'easy',
            'usage': 'Clock time, duration'
        },
        'week': {
            'category': 'time',
            'description': 'One-hand slides across other palm',
            'difficulty': 'medium',
            'usage': 'Seven day period'
        },
        'month': {
            'category': 'time',
            'description': 'One-hand slides down other index finger',
            'difficulty': 'medium',
            'usage': 'Calendar month'
        },
        
        # Common Verbs & Actions
        'go': {
            'category': 'verbs',
            'description': 'Index fingers point and move forward',
            'difficulty': 'easy',
            'usage': 'Move, travel, leave'
        },
        'come': {
            'category': 'verbs',
            'description': 'Index fingers point and move toward body',
            'difficulty': 'easy',
            'usage': 'Move toward speaker'
        },
        'see': {
            'category': 'verbs',
            'description': 'V-hand from eyes moves forward',
            'difficulty': 'easy',
            'usage': 'Visual perception'
        },
        'help': {
            'category': 'verbs',
            'description': 'Fist on flat palm, lift together',
            'difficulty': 'medium',
            'usage': 'Assist, support'
        },
        'work': {
            'category': 'verbs',
            'description': 'S-hands tap wrists together',
            'difficulty': 'medium',
            'usage': 'Employment, labor'
        },
        'play': {
            'category': 'verbs',
            'description': 'Y-hands shake alternately',
            'difficulty': 'medium',
            'usage': 'Recreation, games'
        },
        
        # Questions & Answers
        'what': {
            'category': 'questions',
            'description': 'Index finger shakes side to side',
            'difficulty': 'easy',
            'usage': 'Question word for things'
        },
        'where': {
            'category': 'questions',
            'description': 'Index finger shakes back and forth',
            'difficulty': 'easy',
            'usage': 'Question word for location'
        },
        'when': {
            'category': 'questions',
            'description': 'Index finger circles around other index finger',
            'difficulty': 'medium',
            'usage': 'Question word for time'
        },
        'who': {
            'category': 'questions',
            'description': 'Index finger circles around lips',
            'difficulty': 'medium',
            'usage': 'Question word for person'
        },
        'why': {
            'category': 'questions',
            'description': 'Touch forehead, then Y-hand shakes',
            'difficulty': 'medium',
            'usage': 'Question word for reason'
        },
        'how': {
            'category': 'questions',
            'description': 'Bent hands turn up together',
            'difficulty': 'medium',
            'usage': 'Question word for method'
        },
        
        # Personal Pronouns
        'i': {
            'category': 'pronouns',
            'description': 'Index finger points to chest',
            'difficulty': 'easy',
            'usage': 'First person singular'
        },
        'you': {
            'category': 'pronouns',
            'description': 'Index finger points to person',
            'difficulty': 'easy',
            'usage': 'Second person'
        },
        'he': {
            'category': 'pronouns',
            'description': 'Point to male person or side',
            'difficulty': 'easy',
            'usage': 'Third person masculine'
        },
        'she': {
            'category': 'pronouns',
            'description': 'Point to female person or side',
            'difficulty': 'easy',
            'usage': 'Third person feminine'
        },
        'we': {
            'category': 'pronouns',
            'description': 'Index finger arcs from self to others',
            'difficulty': 'medium',
            'usage': 'First person plural'
        },
        'they': {
            'category': 'pronouns',
            'description': 'Point to multiple people or sweep',
            'difficulty': 'medium',
            'usage': 'Third person plural'
        }
    }
    
    processed_count = 0
    
    for word, data in dictionary_data.items():
        print(f"Creating sign for: {word}")
        
        # Create SVG for the word
        svg_content = create_dictionary_sign_svg(word, data)
        
        # Save to all output directories
        for output_dir in output_dirs:
            output_path = os.path.join(output_dir, f"{word}.svg")
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(svg_content)
            print(f"  ✅ Saved to: {output_path}")
        
        processed_count += 1
    
    # Create dictionary data JSON file
    create_dictionary_data_file(dictionary_data, output_dirs)
    
    return processed_count, len(dictionary_data)

def create_dictionary_sign_svg(word, data):
    """
    Create an SVG representation for a dictionary word sign.
    """
    
    # Color scheme based on category
    category_colors = {
        'greetings': '#10B981',    # Green
        'family': '#F59E0B',       # Yellow
        'food': '#EF4444',         # Red
        'colors': '#8B5CF6',       # Purple
        'numbers': '#3B82F6',      # Blue
        'time': '#06B6D4',         # Cyan
        'verbs': '#F97316',        # Orange
        'questions': '#EC4899',    # Pink
        'pronouns': '#6366F1'      # Indigo
    }
    
    primary_color = category_colors.get(data['category'], '#6B7280')
    
    # Difficulty-based styling
    difficulty_styles = {
        'easy': {'stroke_width': '2', 'opacity': '0.9'},
        'medium': {'stroke_width': '3', 'opacity': '0.8'},
        'hard': {'stroke_width': '4', 'opacity': '0.7'}
    }
    
    style = difficulty_styles.get(data['difficulty'], difficulty_styles['easy'])
    
    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Circle -->
  <circle cx="75" cy="75" r="70" fill="{primary_color}" fill-opacity="0.1" stroke="{primary_color}" stroke-width="2"/>
  
  <!-- Main Hand Illustration -->
  <g transform="translate(75, 75)" opacity="{style['opacity']}">
    <!-- Base hand shape -->
    <path d="M-25,-30 Q-30,-25 -30,-15 L-30,20 Q-25,25 -20,25 L20,25 Q25,20 25,15 L25,-15 Q25,-25 20,-30 Z" 
          fill="#FFDBAC" stroke="#D4A574" stroke-width="{style['stroke_width']}"/>
    
    <!-- Thumb -->
    <ellipse cx="-20" cy="0" rx="8" ry="15" fill="#FFDBAC" stroke="#D4A574" stroke-width="{style['stroke_width']}"/>
    
    <!-- Index finger -->
    <rect x="-10" y="-35" width="6" height="25" rx="3" fill="#FFDBAC" stroke="#D4A574" stroke-width="{style['stroke_width']}"/>
    
    <!-- Middle finger -->
    <rect x="-2" y="-40" width="6" height="30" rx="3" fill="#FFDBAC" stroke="#D4A574" stroke-width="{style['stroke_width']}"/>
    
    <!-- Ring finger -->
    <rect x="6" y="-35" width="6" height="25" rx="3" fill="#FFDBAC" stroke="#D4A574" stroke-width="{style['stroke_width']}"/>
    
    <!-- Pinky finger -->
    <rect x="14" y="-30" width="5" height="20" rx="2.5" fill="#FFDBAC" stroke="#D4A574" stroke-width="{style['stroke_width']}"/>
    
    <!-- Palm details -->
    <path d="M-15,10 Q0,15 15,10" stroke="#D4A574" stroke-width="1" fill="none" opacity="0.6"/>
    <path d="M-10,18 Q0,20 10,18" stroke="#D4A574" stroke-width="1" fill="none" opacity="0.6"/>
  </g>
  
  <!-- Word Label -->
  <text x="75" y="135" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="{primary_color}">
    {word.replace('_', ' ').title()}
  </text>
  
  <!-- Category Badge -->
  <rect x="5" y="5" width="50" height="18" rx="9" fill="{primary_color}" fill-opacity="0.2" stroke="{primary_color}" stroke-width="1"/>
  <text x="30" y="16" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="{primary_color}">
    {data['category'].title()}
  </text>
  
  <!-- Difficulty Indicator -->
  <circle cx="130" cy="20" r="8" fill="{primary_color}" fill-opacity="0.3"/>
  <text x="130" y="24" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="{primary_color}">
    {data['difficulty'][0].upper()}
  </text>
</svg>'''
    
    return svg_content

def create_dictionary_data_file(dictionary_data, output_dirs):
    """
    Create a JSON file with all dictionary data for the React component.
    """
    import json
    
    # Prepare data for JSON export
    export_data = {
        'signs': dictionary_data,
        'categories': list(set(data['category'] for data in dictionary_data.values())),
        'difficulty_levels': ['easy', 'medium', 'hard'],
        'total_signs': len(dictionary_data)
    }
    
    json_content = json.dumps(export_data, indent=2)
    
    # Save to both directories
    for output_dir in output_dirs:
        # Save to parent directory for easier access
        parent_dir = os.path.dirname(output_dir)
        json_path = os.path.join(parent_dir, 'aslDictionaryData.json')
        with open(json_path, 'w', encoding='utf-8') as f:
            f.write(json_content)
        print(f"  📄 Dictionary data saved to: {json_path}")

if __name__ == "__main__":
    print("🔍 ASL Dictionary Images Generator")
    print("=" * 60)
    
    processed, total = create_asl_dictionary_images()
    
    print(f"\n📊 Results:")
    print(f"✅ Created {processed} dictionary sign images")
    print(f"📄 Dictionary data file created")
    print(f"🎯 Total dictionary entries: {total}")
    
    print(f"\n📁 Files created in:")
    print(f"  - public/images/signs/dictionary/")
    print(f"  - frontend/public/images/signs/dictionary/")
    print(f"  - Dictionary data: aslDictionaryData.json")
    
    print(f"\n🎉 ASL Dictionary setup complete!")
    print(f"Ready for searchable dictionary implementation!") 