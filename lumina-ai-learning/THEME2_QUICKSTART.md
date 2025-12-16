# Quick Start: Theme 2 Tools

## Getting Started

### 1. Ensure API Key is Set
In your `.env` file (or environment variables):
```
VITE_GEMINI_API_KEY=sk-your-gemini-api-key-here
```

### 2. Start the Development Server
```bash
npm run dev
# or
npx vite
```

Access the app at `http://localhost:3000`

---

## Tool 1: Dynamic Learning Summary Tool (Document QA)

### What It Does
Analyzes documents and generates 5 complex questions, then evaluates your responses with detailed feedback.

### Step-by-Step Guide

#### Step 1: Upload Document
1. Click the **"Document QA"** tab in the navigation
2. You'll see a large upload area
3. Click or drag-and-drop a text document:
   - Supported formats: `.txt`, `.md`, or any plain text
   - Maximum size: ~20,000 characters recommended
   - Examples: Blog posts, textbooks, research papers, study guides

#### Step 2: Generate Questions
1. After uploading, click the **"Generate 5 Complex Questions"** button
2. Wait for analysis (takes 2-5 seconds)
3. You'll see:
   - Document summary (key insights in 2-3 sentences)
   - Key topics extracted from the document
   - Main themes identified
   - All 5 questions ready for answering

#### Step 3: Answer Questions
The questions appear in progressive difficulty:
- Questions 1-2: **Intermediate** difficulty
- Questions 3-4: **Advanced** difficulty
- Question 5: **Expert** difficulty

For each question:
1. **Read the question** and the source context (excerpt from document)
2. **Type your response** in the text area
3. **Rate the question**:
   - Question Clarity: How well was the question worded? (1 = very unclear, 5 = very clear)
   - Perceived Difficulty: How challenging was it for you? (1 = too easy, 5 = too hard)
4. Click **"Submit for Evaluation"**

#### Step 4: Review Evaluation
After submitting, you receive:
- **Evaluation Text**: Detailed analysis of your response
- **Score**: 0-100 representing quality of your answer
- **Improvement Suggestions**: 3 specific ways to enhance your response

#### Step 5: Repeat or Upload New Document
You can:
- Click question number buttons (1-5) to revisit and re-answer
- Use the **"← Upload Different Document"** link to start fresh
- Green checkmarks show completed questions

---

## Tool 2: Persona-Driven Content Generator

### What It Does
Generates consistent, high-quality content in various formats using an AI persona with a specific writing style, expertise, and values.

### Step-by-Step Guide

#### Step 1: Select or Customize Persona
Available personas:
- **Technical Writer**: For API docs, system architecture, technical guides
- **Marketing Copywriter**: For marketing copy, product descriptions, promotional content
- **Educational Tutor**: For learning materials, explanations, educational content
- **Code Architect**: For code architecture, design patterns, software best practices

If you want a custom persona:
- Click the settings icon next to "Select Persona"
- Define custom tone, values, and constraints

#### Step 2: Choose Content Type
Select what you want to generate:
- **Code Snippet**: Production-ready code implementations
- **Marketing Copy**: Persuasive marketing content
- **Technical Documentation**: API docs, guides, specifications
- **Creative Writing**: Stories, blogs, engaging content
- **Explanation**: Educational or conceptual content
- **Custom**: Any other type of content

#### Step 3: Provide Request Details
Fill in the required fields:

**Topic** (Required):
- What is the content about?
- Example: "Building a React authentication system with JWT tokens"

**Target Audience** (Required):
- Who is this content for?
- Example: "Junior developers with 1-2 years of experience"

**Requirements** (Required - minimum 1):
- What must the content include?
- Click **"+ Add Requirement"** to add more
- Examples:
  - Include code examples for all concepts
  - Focus on practical implementation
  - Explain security best practices
  - Keep it under 500 words

**Additional Context** (Optional):
- Any special instructions or background information
- Example: "Assume React 18+, mention TypeScript patterns"

**Number of Variants**:
- Generate 1-5 versions in a single request
- **1 variant**: Single polished output (1 API call)
- **2-5 variants**: Multiple approaches/angles (1 API call)
- Great for A/B testing without extra cost!

#### Step 4: Generate Content
1. Click **"Generate [X] Variant[s]"** button
2. Wait for generation (1-3 seconds)
3. See quality scores for each variant:
   - **Coherence**: How well does it flow?
   - **Relevance**: How well does it match requirements?
   - **Readability**: How easy is it to understand?

#### Step 5: Use Generated Content
For each variant:
- **Copy**: Click copy button, paste into your document/code editor
- **View Full**: Click to expand and see complete content

---

## Pro Tips & Best Practices

### DLT - Dynamic Learning Summary Tool

**For Better Questions:**
- Upload documents with clear structure (headings, sections)
- Aim for 2,000-15,000 characters for best results
- Documents with specific topics generate more focused questions
- Academic papers work particularly well

**For Better Evaluations:**
- Provide comprehensive answers (3-5 sentences minimum)
- Reference specific concepts from the document
- Be honest with clarity/difficulty feedback - it helps AI understand your learning level

**Document Types That Work Well:**
- Technical articles and tutorials
- Academic papers and textbooks
- Blog posts and guides
- Research summaries
- Study materials

### Persona Generator - Content Creator

**For Better Content:**
- Be specific with requirements (3-5 concrete requirements > 1 vague requirement)
- Define your exact audience (not just "developers" but "junior frontend developers")
- Use different personas for different content types
- Generate multiple variants to compare approaches

**Variant Strategy:**
- **1 variant**: When you know exactly what you want
- **2-3 variants**: For important content, pick the best
- **4-5 variants**: When you want comprehensive options for A/B testing

**Customizing Personas:**
Create a custom persona for:
- Specific brand voice
- Niche audience needs
- Unique writing style requirements
- Domain-specific expertise

Example persona for "SaaS Marketer":
- Tone: Casual, persuasive
- Values: User-centric, transparency, innovation
- Constraints: No hyperbole, no false claims, authentic tone
- Expertise: SaaS marketing, conversion optimization, copywriting

---

## Common Use Cases

### For Students & Educators
**Use DLT to:**
- Create practice questions from study materials
- Get detailed feedback on exam preparation
- Understand your learning gaps

**Use Persona Generator to:**
- Create custom study guides
- Generate explanations in different styles
- Create educational materials for different levels

### For Content Creators & Marketers
**Use Persona Generator to:**
- Generate multiple marketing angles quickly
- Create consistent brand voice content
- A/B test different messaging approaches
- Generate blog post outlines and copy

### For Developers & Technical Writers
**Use Persona Generator to:**
- Generate code snippets for documentation
- Create API documentation
- Generate technical explanations
- Create architecture documentation

**Use DLT to:**
- Create quiz questions from technical docs
- Test your understanding of new frameworks
- Generate exam-style questions

---

## Troubleshooting

### "API key missing" Error
- Ensure `.env` file has `VITE_GEMINI_API_KEY` set
- Restart development server after adding/changing key
- Check key is valid in Gemini API console

### No Response from Gemini
- Check internet connection
- Verify API quota hasn't been exceeded
- Try again (API may be temporarily busy)
- Check browser console (F12) for detailed error

### DLT: Questions are too easy/hard
- Adjust document content (remove/add complexity)
- Rate difficulty in feedback to help system improve
- Try uploading a different section of document

### Persona Generator: Content quality is inconsistent
- Provide more specific requirements
- Use longer requirement descriptions
- Try a different persona for comparison

### Persona Generator: Content takes too long
- Reduce number of variants (generates faster with fewer)
- Reduce requirement count
- Simplify topic description

---

## API Usage & Costs

### Approximate API Calls
- **DLT Session**: 6 API calls (1 for analysis + 5 evaluations)
- **Persona Content**: 1 API call per session
- **Multi-Variant**: 1 API call for 2-5 variants

### Gemini API Pricing (as of 2024)
- Check [https://ai.google.dev/pricing](https://ai.google.dev/pricing) for current rates
- Estimate usage before large batch operations

### Tips to Reduce Costs
1. Use multi-variant feature instead of sequential generations
2. Plan your questions/content before generating
3. Reuse and modify generated content rather than regenerating
4. Start with a single variant, then generate more if needed

---

## Feature Comparison

| Feature | DLT | Persona Generator |
|---------|-----|-------------------|
| **Input** | Large documents | High-level prompt |
| **Output** | 5 questions + evaluations | Polished content |
| **API Calls** | 1-6 | 1+ |
| **Use Case** | Learning, comprehension | Content creation |
| **Best For** | Students, educators | Marketers, developers |
| **Customization** | Limited | High (personas) |

---

## Next Steps

1. **Try DLT**: Upload a study material, generate questions, evaluate yourself
2. **Try Persona Generator**: Create marketing copy, documentation, or code
3. **Compare**: Generate multiple variants and see different approaches
4. **Integrate**: Use generated content in your workflow

---

## Support & Feedback

If you encounter issues:
1. Check the browser console (F12) for error details
2. Review the main README.md for general app information
3. Check THEME2_IMPLEMENTATION.md for technical details
4. Ensure Gemini API key is valid and has sufficient quota

Happy learning and creating! 🚀
