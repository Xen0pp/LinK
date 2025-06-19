# 🌟 LinK Accessibility Platform

Making digital content accessible for everyone through AI-powered tools and sign language learning.

## ✨ Features

- 🧏‍♀️ **Sign Language Learning**: Interactive ASL alphabet and dictionary
- 🔍 **AI-Powered Accessibility**: Image recognition and text extraction
- 🎨 **Beautiful Dark/Light Themes**: Accessible design for all users
- 🔐 **Firebase Authentication**: Secure user management
- 📱 **Responsive Design**: Works on all devices
- ♿ **WCAG Compliant**: Built with accessibility in mind

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Material-UI
- **Backend**: Node.js, Express, TypeScript
- **AI Services**: Google Gemini, ElevenLabs, Hugging Face
- **Authentication**: Firebase Auth
- **Database**: Firestore (NoSQL)
- **Deployment**: Vercel, Railway, Netlify ready

## 🏃‍♂️ Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pixelx-1/LinK.git
   cd LinK
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install --legacy-peer-deps
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy .env.example to .env and fill in your API keys
   cp .env.example .env
   ```

4. **Start development servers**
   ```bash
   # Backend (Terminal 1)
   cd backend && npm run dev
   
   # Frontend (Terminal 2)
   cd frontend && npm start
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Using the Deploy Script

Run the automated deployment script:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🌐 Deployment Options

### Vercel (Recommended)
- Perfect for React + API routes
- Free tier with global CDN
- Automatic deployments from GitHub

### Railway
- Full-stack hosting with database
- Simple pricing and scaling
- Great for production applications

### Netlify
- Excellent for static sites + functions
- Free tier with form handling
- Great developer experience

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=8000
NODE_ENV=development

# AI Service API Keys
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Authentication
JWT_SECRET=your_super_secure_jwt_secret
JWT_EXPIRES_IN=7d

# Firebase Configuration (already configured)
# API keys are included for demo purposes
```

## 📁 Project Structure

```
LinK/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── config/        # Firebase config
│   └── public/        # Static assets
├── backend/           # Express API server
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Data models
│   │   └── utils/         # Utility functions
│   └── uploads/       # File uploads
├── deploy.sh          # Deployment script
├── vercel.json        # Vercel configuration
└── DEPLOYMENT_GUIDE.md # Detailed deployment guide
```

## 🎯 Usage

### For Deaf/Hard of Hearing Users
- **Alphabet Learning**: Interactive ASL alphabet with visual feedback
- **Dictionary**: Comprehensive sign language dictionary
- **Flashcards**: Practice with spaced repetition
- **Progress Tracking**: Monitor your learning journey

### For Blind/Visually Impaired Users
- **Image Description**: AI-powered image analysis
- **Text Extraction**: OCR from images
- **Voice Navigation**: Speech-enabled interface
- **Screen Reader Optimized**: Full ARIA support

## 🔐 Authentication

The platform includes Firebase Authentication with:
- Email/password registration and login
- Google OAuth integration
- User profile management
- Progress tracking across sessions

## 🎨 Accessibility Features

- **WCAG 2.1 AA Compliant**: Meets accessibility standards
- **High Contrast Themes**: Dark and light modes
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Comprehensive ARIA labels
- **Responsive Design**: Works on all devices and screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for authentication and database
- Google Gemini for AI capabilities
- ElevenLabs for voice synthesis
- Hugging Face for machine learning models
- The accessibility community for guidance and feedback

---

**Made with ❤️ for accessibility and inclusion** 
# Li-nK
