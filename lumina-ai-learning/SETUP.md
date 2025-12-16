# 🚀 Lumina Setup & Quick Start Guide

## Prerequisites

- **Node.js** 16+ (download from [nodejs.org](https://nodejs.org))
- **npm** or **yarn** package manager
- **Gemini API Key** (free tier available)

---

## Step-by-Step Setup

### 1️⃣ Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"** button
3. Copy the generated key
4. Keep it safe (never share publicly!)

### 2️⃣ Install Dependencies

```bash
# Navigate to project directory
cd lumina-ai-learning

# Install all packages
npm install
```

This installs:
- React 18.2+
- TypeScript 5.0+
- Tailwind CSS 3.3+
- Framer Motion 10.16+
- Lucide React icons
- Vite build tool

### 3️⃣ Configure Environment Variables

Create `.env.local` file in the project root:

```bash
# .env.local (NEVER commit this file)
VITE_GEMINI_API_KEY=paste_your_actual_key_here
```

**✅ Example:**
```
VITE_GEMINI_API_KEY=AIzaSyD1234567890abcdefghij
```

### 4️⃣ Start Development Server

```bash
npm run dev
```

The app will:
- Start on `http://localhost:3000`
- Automatically open in your browser
- Enable hot reload (changes update instantly)

---

## 🎯 Testing the App

1. **Upload an Image**
   - Click the upload area or drag an image
   - Try: diagram, handwritten notes, screenshot, textbook page

2. **Wait for Analysis**
   - Watch the "Scanning image structure..." status
   - Gemini analyzes the content

3. **View Results**
   - Smart Summary with text-to-speech
   - Key concepts you can click for explanations
   - Helpful analogy
   - Interactive quiz with feedback

---

## 🏗️ Build for Production

```bash
# Create optimized production build
npm run build

# Output: dist/ folder (ready to deploy)

# Preview production build locally
npm run preview
```

---

## 🚀 Deploy to the Web

### Option 1: Vercel (Easiest)

```bash
npm install -g vercel
vercel
```

Add environment variable in Vercel dashboard:
- Key: `VITE_GEMINI_API_KEY`
- Value: Your API key

### Option 2: Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

### Option 3: GitHub Pages

1. Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/your-repo-name/'
})
```

2. Push to GitHub and enable Pages

---

## 🐛 Common Issues & Solutions

### ❌ "Cannot find module 'react'"
**Fix:** Run `npm install`

### ❌ "API key not working"
**Fix:** 
- Check `.env.local` has `VITE_GEMINI_API_KEY=...`
- Verify key is valid in [AI Studio](https://aistudio.google.com/app/apikey)
- Restart dev server after changing env

### ❌ "Image upload not working"
**Fix:**
- Check browser console for errors
- Ensure API key is valid
- Try a different image format (JPG, PNG, WEBP)

### ❌ "TTS audio not playing"
**Fix:**
- Check browser volume is not muted
- Try a different browser
- Check console for audio errors

---

## 📝 Key Files

| File | Purpose |
|------|---------|
| `src/LuminaApp.tsx` | Main React component |
| `src/main.tsx` | App entry point |
| `src/index.css` | Global styles |
| `package.json` | Dependencies |
| `tsconfig.json` | TypeScript config |
| `vite.config.ts` | Build config |
| `tailwind.config.js` | Tailwind config |
| `.env.local` | Your API key (not committed) |

---

## 🔐 Security Notes

⚠️ **CRITICAL**: Never expose your API key:
- ❌ Don't commit `.env.local` to Git
- ❌ Don't push to public repositories
- ❌ Don't share in screenshots or messages
- ✅ Use environment variables for secrets
- ✅ Use `.gitignore` to protect local files

---

## 📚 Next Steps

1. **Customize**: Modify prompts in `LuminaApp.tsx` (lines 94-109)
2. **Enhance**: Add more features (progress tracking, saved sessions, etc.)
3. **Deploy**: Push to production using one of the methods above
4. **Share**: Celebrate your AI learning app! 🎉

---

## 💡 Tips

- **Faster Development**: Use Vite's hot reload (instant updates)
- **Better Debugging**: Open browser DevTools (F12)
- **Type Safety**: TypeScript catches errors before runtime
- **Styling**: Tailwind CSS offers rapid UI development

---

## 📞 Help & Support

- **Gemini API Docs**: https://ai.google.dev/docs
- **React Docs**: https://react.dev
- **Vite Guide**: https://vitejs.dev/guide/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**Ready? Let's build! 🚀**
