# 🔧 LinK Accessibility Tools - Usage Guide

Welcome to LinK! Your comprehensive accessibility toolkit is now fully operational. This guide will help you navigate and use all available features.

## 🚀 Getting Started

### Prerequisites
1. **Backend Server**: Running on `http://localhost:5000`
2. **Frontend Application**: Running on `http://localhost:3000`
3. **Services Available**:
   - ✅ AI Chat Assistant (Google Gemini)
   - ✅ Image Captioning (Hugging Face BLIP)
   - ✅ Text-to-Speech (ElevenLabs)
   - ✅ OCR Text Extraction (Tesseract)
   - ✅ Voice Recognition (Web Speech API)

## 📱 How to Use Each Tool

### 1. 🎙️ Voice-Guided Gateway
**Location**: Appears automatically on first visit

**Features**:
- Voice-guided navigation to choose your accessibility preference
- Supports "Deaf Learning", "Blind Accessibility", or "Manual Browse"
- Automatic redirection to appropriate sections

**How to Use**:
1. Allow microphone permissions when prompted
2. Listen to the welcome message
3. Say your preference: "Deaf Learning", "Blind Accessibility", or "Skip"
4. Get automatically redirected to the appropriate section

### 2. 🤖 AI Chat Assistant
**Location**: `/chat` or "Chat Assistant" in navigation

**Features**:
- Accessibility guidance and best practices
- WCAG compliance assistance
- Real-time Q&A support
- Quick topic buttons for common questions

**How to Use**:
1. Navigate to the Chat page
2. Type your accessibility question or click a quick topic
3. Press Enter or click send
4. Get detailed, helpful responses

**Example Questions**:
- "How do I write good alt text?"
- "What are WCAG color contrast requirements?"
- "How can I make my website keyboard accessible?"

### 3. 🛠️ AI-Powered Tools
**Location**: `/tools` or "Tools" in navigation

#### 📸 Image Captioning
**Purpose**: Generate descriptive alt text for images

**How to Use**:
1. Drag and drop an image or click to select
2. Wait for AI analysis (usually 2-5 seconds)
3. Copy the generated caption for use as alt text
4. Review and edit as needed

**Supported Formats**: PNG, JPG, JPEG, GIF, WebP

#### 🔊 Text-to-Speech
**Purpose**: Convert text to natural-sounding audio

**How to Use**:
1. Type or paste your text in the input area
2. Click "Generate Speech"
3. Use the play/stop controls to listen
4. Download or use the generated audio

**Best For**: Creating audio descriptions, voiceovers, accessibility testing

#### 📄 OCR Text Extraction
**Purpose**: Extract text from images for screen readers

**How to Use**:
1. Upload an image containing text
2. Wait for processing (5-10 seconds depending on image complexity)
3. Copy the extracted text
4. Use for document accessibility or data entry

**Best For**: Making scanned documents accessible, extracting text from screenshots

### 4. 🤟 Deaf Learning Section
**Location**: `/deaf` or "Deaf Learning" in navigation

#### 📚 Flash Cards
**Features**:
- Interactive sign language cards with images
- Study mode and quiz mode
- Progress tracking and badges
- Multiple choice quizzes

**How to Use Study Mode**:
1. Click on cards to flip and see the sign
2. Use Previous/Next buttons to navigate
3. Complete cards to track progress

**How to Use Quiz Mode**:
1. Click "Quiz Mode" button
2. Look at the sign image
3. Select the correct word from 4 options
4. Get immediate feedback and final score

#### 🔤 ASL Alphabet Learning
**Features**:
- Complete A-Z alphabet with accurate ASL hand sign illustrations
- Researched and verified hand positions based on official ASL sources
- Learn mode with detailed descriptions for each letter
- Practice mode with grid view of all letters
- Difficulty levels (easy, medium, hard)
- Text-to-speech descriptions
- Progress tracking for each letter
- Completion celebrations

**How to Use Learn Mode**:
1. Navigate through letters using Previous/Next buttons
2. View the hand sign illustration for each letter
3. Click "Hear Description" for audio explanation
4. Read the detailed signing instructions
5. Mark letters as "Learned" when comfortable
6. Track your progress with the progress bar

**How to Use Practice Mode**:
1. Click "Practice" to see all 26 letters in a grid
2. Click any letter to jump to learning mode
3. Green rings indicate completed letters
4. Difficulty badges show challenge level

**Real ASL Hand Sign Photographs**:
- All 26 hand signs use actual photographs of real ASL hand positions
- Authentic, professional-quality images showing proper finger placement and hand orientation
- Each letter displays the exact hand configuration used in American Sign Language
- Standardized 150x150 pixel format with clean white backgrounds for consistency
- Real human hands demonstrating accurate ASL alphabet signs from A to Z
- Images processed and optimized for fast loading and clear visibility
- Perfect for serious ASL learning with authentic visual references

#### 🔍 Searchable ASL Dictionary
**Features**:
- **Comprehensive Search**: Search by word, description, or usage context
- **Category Filtering**: Filter by greetings, family, food, colors, numbers, time, verbs, questions, pronouns
- **Difficulty Levels**: Easy, medium, and hard difficulty indicators
- **Visual Sign Demonstrations**: SVG illustrations for each sign with category-based color coding
- **Text-to-Speech**: Audio descriptions for proper pronunciation and usage
- **Favorites System**: Save frequently used signs for quick reference
- **Grid and List Views**: Choose your preferred browsing layout
- **Detailed Sign Information**: Complete descriptions, usage examples, and signing instructions

**How to Use the Dictionary**:
1. **Search**: Type any word or phrase in the search bar to find related signs
2. **Filter**: Use category and difficulty filters to narrow your search
3. **Browse**: Switch between grid and list view for different browsing experiences
4. **Learn**: Click on any sign to view detailed information and instructions
5. **Listen**: Use the speaker icon to hear audio descriptions
6. **Save**: Add signs to favorites using the heart icon for quick access
7. **Practice**: Use the detailed modal to learn proper hand positioning

**Available Categories**:
- **Greetings**: Hello, thank you, please, sorry, goodbye
- **Family**: Mother, father, sister, brother, family, friend
- **Food & Drink**: Eat, drink, water, milk, coffee, bread
- **Colors**: Red, blue, green, yellow, black, white
- **Numbers**: One, two, three, five, ten
- **Time**: Today, tomorrow, yesterday, time, week, month
- **Verbs**: Go, come, see, help, work, play
- **Questions**: What, where, when, who, why, how
- **Pronouns**: I, you, he, she, we, they

**Dictionary Features**:
- **53+ Signs**: Comprehensive collection of essential ASL vocabulary
- **Smart Search**: Find signs by partial matches in word, description, or usage
- **Color-Coded Categories**: Each category has its own color for easy identification
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Progressive Loading**: Images load efficiently with fallback options

#### 📸 Common Signs Collection (Real Photographs)
**Features**:
- **Real ASL Photographs**: Actual cropped images from sign language charts and educational materials
- **41 Essential Signs**: Most commonly used signs in everyday ASL communication
- **Dual Learning Modes**: Browse all signs or use structured category-based learning
- **Professional Quality**: High-resolution images processed for optimal clarity
- **Interactive Learning**: Text-to-speech, favorites, and detailed explanations

**Available Categories with Real Photos**:
- **Greetings** (5 signs): hello, goodbye, please, thank_you, sorry
- **Responses** (2 signs): yes, no  
- **Family** (6 signs): mother, father, sister, brother, family, friend
- **Actions** (4 signs): eat, drink, help, finished
- **Food** (3 signs): water, milk, bread
- **Colors** (5 signs): red, blue, green, yellow, black
- **Numbers** (5 signs): one, two, three, five, ten
- **Emotions** (3 signs): love, happy, sad
- **Descriptive** (8 signs): more, good, bad, hot, cold, big, small, beautiful

**How to Use Common Signs**:
1. **Browse Mode**: View all 41 signs in searchable grid or list format
2. **Learning Mode**: Study signs organized by category using tabs
3. **Search**: Find specific signs by word, description, or usage
4. **Filter**: Use category and difficulty filters to focus learning
5. **Interact**: Click signs for detailed descriptions and audio pronunciation
6. **Favorites**: Save frequently used signs for quick reference
7. **Practice**: Use the modal view to study hand positioning in detail

**Real Photo Processing**:
- Images extracted from uploaded ASL educational charts
- Professionally cropped and sized to 200x200 pixels
- Clean white backgrounds for consistent viewing
- Authentic hand positions from qualified ASL resources
- Optimized for web delivery with fallback support

#### 📖 Other Learning Sections
- **Progress Dashboard**: Track learning across all ASL modules
- **Advanced Dictionary**: More specialized vocabulary (expanding)

### 5. 👁️ Blind Accessibility Section
**Location**: `/blind` or "Blind Accessibility" in navigation

**Features**:
- Voice command navigation
- OCR text extraction
- Text-to-speech conversion
- High contrast themes

**Voice Commands**:
- "Go to tools" - Navigate to tools page
- "Go to chat" - Open chat assistant
- "Help" - Show available commands
- "Read text" - Activate text-to-speech

## 🔧 Technical Status Indicators

### Backend Connection Status
Look for status indicators on tool pages:
- 🟢 **Green**: All tools available and functioning
- 🔴 **Red**: Some tools may be unavailable (check backend server)

### Service Health Check
Visit `http://localhost:5000/api/health` to see detailed service status:
```json
{
  "status": "OK",
  "services": {
    "ai": {
      "gemini": true,
      "huggingface": true, 
      "elevenlabs": true,
      "tesseract": true
    }
  }
}
```

## 🎨 Accessibility Features

### Dark Mode
- Toggle using the moon/sun icon in the navigation
- High contrast colors optimized for readability
- Consistent across all pages and components

### Keyboard Navigation
- Full keyboard support with Tab navigation
- Focus indicators on all interactive elements
- Skip links for screen readers

### Screen Reader Support
- Proper ARIA labels and descriptions
- Semantic HTML structure
- Alternative text for all images

## 🚨 Troubleshooting

### Tools Not Working?
1. **Check Backend Status**: Look for connection indicators
2. **Restart Backend**: `cd backend && npm run dev`
3. **Clear Browser Cache**: Hard refresh (Ctrl+F5)
4. **Check Console**: Open Developer Tools for error messages

### Voice Features Not Working?
1. **Allow Microphone**: Grant browser permissions
2. **Use Chrome/Edge**: Voice recognition works best in these browsers
3. **Check Audio**: Ensure speakers/headphones are working

### Chat Assistant Not Responding?
1. **Backend Connection**: Ensure backend server is running
2. **API Keys**: Check that AI services are properly configured
3. **Network**: Verify localhost:5000 is accessible

## 📋 Quick Start Checklist

- [ ] Backend server running (`http://localhost:5000`)
- [ ] Frontend app running (`http://localhost:3000`)
- [ ] Microphone permissions granted
- [ ] All service indicators showing green
- [ ] Dark/light mode preference set
- [ ] Voice gateway completed (if first visit)

## 🆘 Need Help?

1. **Use the Chat Assistant**: Ask questions about accessibility
2. **Check Tool Status**: Look for green/red indicators
3. **Read Error Messages**: Pay attention to toast notifications
4. **Browser Console**: Check for technical error details

---

**🎉 Welcome to LinK!** Your journey toward inclusive and accessible digital content starts here. Every tool is designed to make the web more accessible for everyone. 