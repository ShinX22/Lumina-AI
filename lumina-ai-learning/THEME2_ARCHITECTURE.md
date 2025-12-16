# Theme 2: Technical Architecture & API Optimization

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (TSX)                      │
├──────────────────┬──────────────────┬──────────────────────┤
│ LuminaApp.tsx    │ DLT Component    │ Persona Component    │
│ (Navigation,     │ (Upload, Q&A,    │ (Persona Select,    │
│  State Mgmt)     │  Evaluation)     │  Content Gen)       │
└──────────────────┴──────────────────┴──────────────────────┘
           │                │                    │
           └────────────────┼────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ DLT Module       │ │ Persona Module   │ │ Type Definitions│
│ dynamicLearning  │ │ personaDriven    │ │ (Interfaces)    │
│ SummaryTool.ts   │ │ContentGenerator │ │                 │
└──────────────────┘ └──────────────────┘ └─────────────────┘
        │                   │
        │                   │
        └───────────────────┼───────────────────┬──────────────┐
                            │                   │              │
                            ▼                   ▼              ▼
                    ┌──────────────────────────────────────────────┐
                    │       Gemini API (HTTP REST)                 │
                    │  https://generativelanguage.googleapis.com   │
                    ├──────────────────────────────────────────────┤
                    │ Models:                                      │
                    │ - gemini-2.0-flash (primary)                │
                    │ - gemini-2.5-flash-preview (alternative)    │
                    └──────────────────────────────────────────────┘
```

---

## Dynamic Learning Summary Tool (DLT) Architecture

### Data Flow

```
Document Upload
    │
    ▼
┌──────────────────────────────────┐
│ Chunk & Validate                  │
│ (Max 20K chars)                   │
└──────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────┐
│ analyzeLargeDocument()            │
│ • Build system prompt             │
│ • Send to Gemini 2.0 Flash       │
│ • Parse JSON response             │
└──────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────┐
│ DocumentAnalysis Object           │
│ • Summary                         │
│ • Key Topics (5)                  │
│ • Main Themes                     │
│ • 5 Questions                     │
│   - Intermediate (2)              │
│   - Advanced (2)                  │
│   - Expert (1)                    │
└──────────────────────────────────┘
    │
    ├─── User answers each question
    │
    ▼
┌──────────────────────────────────┐
│ evaluateUserResponse()            │
│ • Include question context        │
│ • Include user response           │
│ • Include user feedback           │
│ • Send to Gemini                 │
│ • Parse evaluation                │
└──────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────┐
│ Evaluation Result                 │
│ • Evaluation text                 │
│ • Score (0-100)                   │
│ • Suggestions (3)                 │
└──────────────────────────────────┘
```

### API Call Sequence

**Call #1: Document Analysis**
```
POST /generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

Request:
{
  "system": [{
    "text": "You are an expert curriculum designer..."
  }],
  "contents": [{
    "parts": [{
      "text": "Analyze this document and generate exactly 5 questions...\n\nDOCUMENT:\n{truncated_text}"
    }]
  }],
  "generationConfig": {
    "responseMimeType": "application/json",
    "temperature": 0.8,
    "maxOutputTokens": 3000
  }
}

Response:
{
  "summary": "...",
  "key_topics": [...],
  "main_themes": [...],
  "questions": [...]
}
```

**Calls #2-6: Per-Question Evaluation (5x)**
```
POST /generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

Request:
{
  "contents": [{
    "parts": [{
      "text": "Evaluate this response...\nQUESTION: {question}\nRESPONSE: {user_response}\nFEEDBACK: {clarity: X, difficulty: Y}"
    }]
  }],
  "generationConfig": {
    "responseMimeType": "application/json",
    "temperature": 0.7,
    "maxOutputTokens": 500
  }
}

Response:
{
  "evaluation": "...",
  "score": 85,
  "suggestions": [...]
}
```

### Key Optimization: System Prompts

**Why it matters**: System prompts ensure consistent, parseable output without using strict JSON schema validation, which can be limiting.

**Example System Prompt Structure**:
```
You are an expert educational curriculum designer.

Your task is to analyze a document and generate exactly 5 unique, complex questions.

Requirements:
1. Questions must progressively increase in complexity
2. Each question targets a different concept
3. Questions must require synthesis, analysis, or application
4. Return ONLY valid JSON with format: {...}

CRITICAL: Return ONLY JSON. No other text.
```

**Benefits**:
- Gemini understands output expectations clearly
- Reduces parsing errors and invalid JSON responses
- Enables consistent quality across multiple calls
- Faster token generation (more predictable output)

---

## Persona-Driven Content Generator Architecture

### Data Flow

```
User Request
    │
    ├─ Select Persona
    ├─ Choose Content Type
    ├─ Set Topic & Audience
    ├─ Add Requirements
    └─ Specify Variant Count
    │
    ▼
┌──────────────────────────────────┐
│ buildPersonaSystemPrompt()        │
│ Converts:                         │
│ • Name & Role                     │
│ • Expertise areas                 │
│ • Tone & Style                    │
│ • Values & Constraints            │
│ Into detailed system prompt       │
└──────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────┐
│ Generate Request                  │
│ If variantCount > 1:              │
│   → generateMultipleVariants()   │
│ Else:                             │
│   → generatePersonaDrivenContent()│
└──────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────┐
│ Single Gemini API Call            │
│ (Uses system prompt + user prompt)│
└──────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────┐
│ Parse & Format Response           │
│ For variants: Split by numbering  │
│ Calculate quality metrics         │
└──────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────┐
│ Return GeneratedContent[]         │
│ Each with:                        │
│ • Complete content                │
│ • Quality scores                  │
│ • Generation timestamp            │
└──────────────────────────────────┘
```

### Single-Call Multi-Variant Generation

**Optimization Technique**: Generate 2-5 variants in ONE API call

```typescript
// Instead of:
const variant1 = await generatePersonaDrivenContent(persona, req, apiKey);
const variant2 = await generatePersonaDrivenContent(persona, req, apiKey);
const variant3 = await generatePersonaDrivenContent(persona, req, apiKey);
// (3 API calls, cost: 3x)

// Do this:
const variants = await generateMultipleVariants(persona, req, 3, apiKey);
// (1 API call, cost: 1x, ~25-30% more tokens)
```

**API Call**:
```
POST /generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

Request:
{
  "system": [{
    "text": "You are TechWriter, a technical documentation specialist...\n\nTone: technical\nStyle: Clear, concise, precise...\nValues: Accuracy, Clarity, Completeness...\nConstraints: No marketing language..."
  }],
  "contents": [{
    "parts": [{
      "text": "Generate 3 DISTINCT VARIANTS of code snippet content for:\nTOPIC: Building React Authentication\nAUDIENCE: Junior Developers\nREQUIREMENTS:\n- Include JWT token handling\n- Show error handling\n- Add security best practices\n\nFormat as numbered list. Each variant should be complete and standalone."
    }]
  }],
  "generationConfig": {
    "temperature": 0.9,  // Higher temp for variant diversity
    "maxOutputTokens": 4000,
    "topP": 0.95,
    "topK": 40
  }
}

Response:
1. {First complete variant}
2. {Second complete variant}
3. {Third complete variant}
```

### Persona System Prompt Template

```
You are {name}, {role}.

EXPERTISE: {expertise_areas.join(', ')}

TONE: Communicate in a {tone} tone.

STYLE: {detailed_style_description}

CORE VALUES: {values.join(', ')}

CONSTRAINTS:
- {constraint_1}
- {constraint_2}
- {constraint_3}

{optionally: STYLE EXAMPLES:\n- {example_1}\n- {example_2}}

You must maintain consistency with this persona in ALL responses. 
Generate high-quality, polished content on the first attempt to minimize revisions.
```

**Example for MarketingPro**:
```
You are MarketingPro, a creative marketing copywriter.

EXPERTISE: persuasive writing, brand voice, emotional engagement, conversion optimization

TONE: Communicate in a creative tone.

STYLE: Compelling, engaging, benefit-focused. Use power words. Tell stories. 
Create urgency. Speak directly to the reader.

CORE VALUES: Impact, Authenticity, Customer-centricity, Creativity

CONSTRAINTS:
- No false claims
- No spam language
- Maintain brand consistency

You must maintain consistency with this persona in ALL responses. 
Generate high-quality, polished content on the first attempt to minimize revisions.
```

---

## API Optimization Strategies

### 1. System Prompt Engineering

**Goal**: Ensure consistent, high-quality output that requires minimal post-processing

**Techniques**:
- Detailed role definition
- Clear output format specifications
- Explicit constraints
- Value statements for consistency

**Result**: 
- Higher first-attempt success rate
- Reduced need for regeneration
- Better parsing of structured output

### 2. Temperature & Sampling Parameters

| Scenario | Temperature | topP | topK | Use Case |
|----------|------------|------|------|----------|
| DLT Analysis | 0.8 | 0.95 | 40 | Questions should be diverse but structured |
| DLT Evaluation | 0.7 | 0.95 | 40 | Evaluations should be consistent, less creative |
| Persona Single | 0.8 | 0.95 | 40 | Balance creativity and consistency |
| Persona Variants | 0.9 | 0.95 | 40 | Higher temp for more distinct variants |

### 3. Batch Operations

**Multi-Variant Strategy**:
- Single API call for 2-5 variants
- Gemini generates different approaches to same request
- Saves 4+ API calls vs sequential generation

**Cost Benefit**:
```
Sequential: 5 calls × $cost_per_call = 5x cost
Batch: 1 call × $cost_per_call ≈ 1.2x cost (slightly longer)
Savings: ~80% API call reduction
```

### 4. Context Management

**DLT Context Strategy**:
- Include document excerpts in evaluation prompt
- Helps Gemini provide accurate, contextual feedback
- Prevents hallucination

**Persona Context Strategy**:
- System prompt serves as persistent context
- Reused across all calls with same persona
- Requirements embedded in user prompt

### 5. Structured Output

**JSON Response Format**:
```
{
  "field1": "value",
  "field2": ["array", "of", "items"],
  "field3": {
    "nested": "object"
  }
}
```

**Benefits**:
- Predictable parsing
- Type-safe in TypeScript
- Validation possible
- Easy JSON schema enforcement

---

## Performance Metrics

### API Call Count Comparison

| Scenario | DLT | Persona | Notes |
|----------|-----|---------|-------|
| Single Operation | 6 calls | 1 call | DLT = 1 analysis + 5 evaluations |
| 3-Variant Gen | N/A | 1 call | Persona batch generation |
| 5-Variant Gen | N/A | 1 call | Single API call for 5 variants |

### Token Estimation

| Operation | Input Tokens | Output Tokens | Total |
|-----------|-------------|---------------|-------|
| DLT Analysis (5K doc) | 600-800 | 400-600 | 1000-1400 |
| DLT Evaluation (Q&A) | 300-400 | 100-200 | 400-600 |
| Persona Content | 200-300 | 300-800 | 500-1100 |
| Persona Variants (3x) | 300-400 | 700-1200 | 1000-1600 |

### Response Time

| Operation | Typical Time |
|-----------|--------------|
| DLT Analysis | 2-5 seconds |
| DLT Evaluation | 1-3 seconds |
| Persona Generation | 1-3 seconds |
| Persona Variants (3x) | 1-3 seconds |

---

## Error Handling & Retry Logic

### DLT Error Handling

```typescript
try {
  const analysis = await analyzeLargeDocument(text, title, apiKey);
} catch (error) {
  if (error.message.includes('overload')) {
    // Exponential backoff: 1s, 2s, 4s
    await retry(attemptCount);
  } else if (error.message.includes('API key')) {
    // User action required
    showErrorMessage("Invalid API key");
  } else {
    // Generic error
    showErrorMessage("Analysis failed");
  }
}
```

### JSON Parsing Fallback

```typescript
try {
  parsed = JSON.parse(cleanJson);
} catch (e) {
  // Try to extract JSON from response
  const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    parsed = JSON.parse(jsonMatch[0]);
  } else {
    throw new Error('Invalid JSON in response');
  }
}
```

---

## Security Considerations

### API Key Management
- Never expose in frontend code
- Use environment variables (VITE_GEMINI_API_KEY)
- Implement rate limiting if exposed to public
- Rotate keys regularly

### Input Validation
- Validate document size before upload
- Sanitize text input
- Validate persona definitions
- Check content type selections

### Output Validation
- Validate JSON structure before parsing
- Verify response format matches schema
- Handle malformed responses gracefully

---

## Scalability Notes

### Current Limitations
- Document size: 20,000 characters (adjustable)
- Max output tokens: 4,000 (configurable)
- Max variants: 5 (arbitrary limit)

### Future Scaling
- Implement document chunking for larger files
- Add streaming response handling
- Implement response caching
- Add request queuing system
- Implement rate limiting

---

## Conclusion

Theme 2 achieves:
1. **Minimal API Calls**: Strategic use of system prompts and batch operations
2. **High Quality Output**: First-attempt success reduces need for regeneration
3. **Scalable Architecture**: Tools are modular and independently extensible
4. **Cost Efficiency**: Optimized token usage and operation batching

The combination of sophisticated prompt engineering with intelligent API usage patterns creates a system that maximizes Gemini's capabilities while minimizing operational costs.
