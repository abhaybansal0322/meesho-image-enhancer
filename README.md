# AI Product Image Enhancer & Validator

A Next.js application that enhances product images and validates them against Meesho e-commerce standards using AI.

## 🚀 Features

- **Multiple Image Upload**: Upload and process multiple product images at once
- **Background Removal**: Remove backgrounds using remove.bg API
- **Image Enhancement**: Adjust brightness and contrast using Sharp
- **AI Validation**: Validate images against Meesho standards using OpenAI Vision
- **Batch Processing**: Enhance and validate all images with single clicks
- **Real-time Preview**: See original and enhanced images side by side
- **Smart Suggestions**: Get AI-powered improvement recommendations

## 🛠️ Tech Stack

- **Frontend**: Next.js 13+, React, TypeScript, Tailwind CSS
- **Image Processing**: Sharp, remove.bg API
- **AI Validation**: OpenAI GPT-4 Vision API
- **File Upload**: Formidable
- **UI Components**: Custom components with Lucide React icons

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- remove.bg API key
- OpenAI API key

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/meesho-image-enhancer.git
cd meesho-image-enhancer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your API keys
```

### 4. Add your API keys to `.env.local`
```env
REMOVEBG_API_KEY=your-removebg-api-key-here
OPENAI_API_KEY=your-openai-api-key-here
```

### 5. Run the development server
```bash
npm run dev
```

### 6. Open your browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

1. **Upload Images**: Drag and drop or click to upload product images
2. **Remove Background** (Optional): Toggle background removal before enhancement
3. **Enhance All**: Click to enhance all images (brightness, contrast, background removal)
4. **Validate All**: Click to validate all images against Meesho standards
5. **View Results**: See enhanced images and AI suggestions

## 🔧 API Endpoints

- `POST /api/enhance` - Enhance images (brightness, contrast, background removal)
- `POST /api/validate` - Validate images using OpenAI Vision

## 📁 Project Structure

```
project/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main UI
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ImageUpload.tsx    # Multi-image upload
│   ├── ImagePreview.tsx   # Image display
│   └── SuggestionsList.tsx # AI suggestions
├── pages/api/            # API routes
│   ├── enhance.ts        # Image enhancement
│   └── validate.ts       # Image validation
└── lib/                  # Utilities
```

## 🔑 API Keys Setup

### Remove.bg API Key
1. Sign up at [remove.bg](https://www.remove.bg/api)
2. Get your API key from the dashboard
3. Add to `.env.local` as `REMOVEBG_API_KEY`

### OpenAI API Key
1. Sign up at [OpenAI](https://platform.openai.com)
2. Get your API key from [API Keys](https://platform.openai.com/account/api-keys)
3. Add to `.env.local` as `OPENAI_API_KEY`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [remove.bg](https://www.remove.bg) for background removal API
- [OpenAI](https://openai.com) for AI validation capabilities
- [Next.js](https://nextjs.org) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for styling 