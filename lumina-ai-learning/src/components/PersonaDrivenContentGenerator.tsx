import React, { useState } from 'react';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Copy,
  Sparkles,
  Settings,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generatePersonaDrivenContent,
  generateMultipleVariants,
  PRESET_PERSONAS,
  SystemPersona,
  ContentRequest,
  GeneratedContent,
} from '../tools/personaDrivenContentGenerator';

interface PersonaDrivenGeneratorProps {
  apiKey: string;
}

type ContentType = 'code-snippet' | 'marketing-copy' | 'technical-doc' | 'creative-writing' | 'explanation' | 'custom';

const CONTENT_TYPES: { id: ContentType; label: string; description: string }[] =
  [
    {
      id: 'code-snippet',
      label: 'Code Snippet',
      description: 'Production-ready code implementation',
    },
    {
      id: 'marketing-copy',
      label: 'Marketing Copy',
      description: 'Persuasive marketing content',
    },
    {
      id: 'technical-doc',
      label: 'Technical Documentation',
      description: 'API docs, guides, specifications',
    },
    {
      id: 'creative-writing',
      label: 'Creative Writing',
      description: 'Stories, blogs, engaging content',
    },
    {
      id: 'explanation',
      label: 'Explanation',
      description: 'Educational or conceptual content',
    },
    {
      id: 'custom',
      label: 'Custom',
      description: 'Any other type of content',
    },
  ];

export default function PersonaDrivenContentGenerator({
  apiKey,
}: PersonaDrivenGeneratorProps) {
  const [selectedPersona, setSelectedPersona] = useState<SystemPersona>(
    PRESET_PERSONAS.technicalWriter
  );
  const [contentType, setContentType] = useState<ContentType>('code-snippet');
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [customContext, setCustomContext] = useState('');
  const [variantCount, setVariantCount] = useState(1);

  const [generatedContents, setGeneratedContents] = useState<GeneratedContent[]>(
    []
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [showPersonaSettings, setShowPersonaSettings] = useState(false);
  const [customPersonaValues, setCustomPersonaValues] = useState<Partial<SystemPersona>>({});

  const handleAddRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleUpdateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const handleGenerateContent = async () => {
    if (!topic.trim() || !targetAudience.trim()) {
      setError('Please fill in topic and target audience');
      return;
    }

    const filteredRequirements = requirements.filter((r) => r.trim());
    if (filteredRequirements.length === 0) {
      setError('Please add at least one requirement');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedContents([]);

    try {
      const request: ContentRequest = {
        contentType,
        topic: topic.trim(),
        targetAudience: targetAudience.trim(),
        requirements: filteredRequirements,
        customContext: customContext.trim() || undefined,
      };

      let results: GeneratedContent[];

      if (variantCount > 1) {
        results = await generateMultipleVariants(
          selectedPersona,
          request,
          variantCount,
          apiKey
        );
      } else {
        const result = await generatePersonaDrivenContent(
          selectedPersona,
          request,
          apiKey
        );
        results = [result];
      }

      setGeneratedContents(results);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Content generation failed. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyContent = (index: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const personaOptions = [
    { label: 'Technical Writer', value: PRESET_PERSONAS.technicalWriter },
    { label: 'Marketing Copywriter', value: PRESET_PERSONAS.marketingCopywriter },
    { label: 'Educational Tutor', value: PRESET_PERSONAS.educationalTutor },
    { label: 'Code Architect', value: PRESET_PERSONAS.codeArchitect },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="bg-gradient-to-r from-orange-900 via-pink-900 to-rose-900 rounded-lg p-6 mb-6 border border-orange-500">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white">
            Persona-Driven Content Generator
          </h2>
        </div>
        <p className="text-orange-200">
          Generate consistent, high-quality content with a persistent AI persona
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Panel - Configuration */}
        <div className="col-span-2 space-y-6">
          {/* Persona Selection */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Select Persona
              </h3>
              <button
                onClick={() => setShowPersonaSettings(!showPersonaSettings)}
                className="p-2 hover:bg-slate-800 rounded transition"
                title="Customize Persona"
              >
                <Settings className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {personaOptions.map((option) => (
                <button
                  key={option.value.name}
                  onClick={() => setSelectedPersona(option.value)}
                  className={`p-4 rounded-lg border transition text-left ${
                    selectedPersona.name === option.value.name
                      ? 'bg-blue-900 border-blue-500 text-blue-100'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <p className="font-bold text-sm mb-1">{option.label}</p>
                  <p className="text-xs opacity-75">{option.value.role}</p>
                </button>
              ))}
            </div>

            {/* Persona Details */}
            {selectedPersona && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-slate-800/50 rounded border border-slate-700"
              >
                <p className="text-slate-300 text-sm mb-3">
                  <span className="font-bold text-white">Tone:</span>{' '}
                  {selectedPersona.tone}
                </p>
                <p className="text-slate-300 text-sm">
                  <span className="font-bold text-white">Expertise:</span>{' '}
                  {selectedPersona.expertise.join(', ')}
                </p>
              </motion.div>
            )}
          </div>

          {/* Content Configuration */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-white">Content Request</h3>

            {/* Content Type Selection */}
            <div>
              <label className="block text-slate-300 font-medium mb-3">
                Content Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CONTENT_TYPES.map((ct) => (
                  <button
                    key={ct.id}
                    onClick={() => setContentType(ct.id)}
                    className={`p-3 rounded border transition text-left text-sm ${
                      contentType === ct.id
                        ? 'bg-cyan-900 border-cyan-500 text-cyan-100'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <p className="font-bold">{ct.label}</p>
                    <p className="text-xs opacity-75">{ct.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Building a React authentication system"
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Junior developers, product managers, etc."
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Requirements
              </label>
              <div className="space-y-2">
                {requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) =>
                        handleUpdateRequirement(index, e.target.value)
                      }
                      placeholder={`Requirement ${index + 1}`}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                    />
                    {requirements.length > 1 && (
                      <button
                        onClick={() => handleRemoveRequirement(index)}
                        className="px-3 py-2 bg-red-900/20 border border-red-700 text-red-400 rounded hover:bg-red-900/40 transition"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddRequirement}
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                >
                  + Add Requirement
                </button>
              </div>
            </div>

            {/* Variant Count */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Number of Variants
              </label>
              <select
                value={variantCount}
                onChange={(e) => setVariantCount(parseInt(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2 text-white"
              >
                <option value="1">1 (Single generation)</option>
                <option value="2">2 (A/B variants)</option>
                <option value="3">3 (Multiple approaches)</option>
                <option value="4">4 (Comprehensive set)</option>
                <option value="5">5 (Maximum variants)</option>
              </select>
              <p className="text-slate-400 text-xs mt-1">
                Generates multiple content variants in a single API call
              </p>
            </div>

            {/* Custom Context */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Additional Context (Optional)
              </label>
              <textarea
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                placeholder="Any specific instructions or context for this content..."
                className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                rows={3}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500 rounded flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerateContent}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate {variantCount > 1 ? `${variantCount} Variants` : 'Content'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="col-span-1">
          {generatedContents.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 sticky top-6"
            >
              <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <h4 className="text-lg font-bold text-green-200">
                    Generated!
                  </h4>
                </div>
                <p className="text-green-100 text-sm">
                  {generatedContents.length} variant{generatedContents.length > 1 ? 's' : ''} ready
                </p>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {generatedContents.map((content, index) => (
                  <div
                    key={index}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-white text-sm">
                        Variant {index + 1}
                      </h5>
                      <button
                        onClick={() =>
                          handleCopyContent(index, content.content)
                        }
                        className={`p-2 rounded transition ${
                          copiedIndex === index
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-slate-300 text-xs mb-3 line-clamp-3">
                      {content.content.substring(0, 150)}...
                    </p>

                    {content.qualityMetrics && (
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Quality</span>
                          <span className="text-cyan-400 font-bold">
                            {Math.round(
                              (content.qualityMetrics.coherence +
                                content.qualityMetrics.relevance +
                                content.qualityMetrics.readability) /
                                3
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1">
                          <div
                            className="bg-cyan-500 h-1 rounded-full"
                            style={{
                              width: `${
                                (content.qualityMetrics.coherence +
                                  content.qualityMetrics.relevance +
                                  content.qualityMetrics.readability) /
                                3
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Full Content Modal - Expandable */}
              <details className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <summary className="text-white font-bold cursor-pointer hover:text-cyan-400">
                  View Full Content
                </summary>
                <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto">
                  {generatedContents.map((content, index) => (
                    <div key={index} className="bg-slate-800 p-3 rounded">
                      <p className="text-slate-300 font-mono text-xs whitespace-pre-wrap">
                        {content.content}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            </motion.div>
          ) : (
            <div className="bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg p-6 text-center text-slate-400">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Generate content to see results here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
