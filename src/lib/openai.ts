import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.warn("Warning: OPENAI_API_KEY is not set. SEO Writer features will not work.");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Website analysis prompt
export async function analyzeWebsite(websiteContent: string, url: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a brand analyst. Analyze the given website content and extract detailed brand information. Return a JSON object with the following structure:
{
  "brandName": "The brand/company name",
  "brandDescription": "A comprehensive description of what the business does (2-3 paragraphs)",
  "tone": "The tone of the content (e.g., 'professional', 'casual', 'enthusiastic', 'authoritative')",
  "targetAudience": "Detailed description of the target audience",
  "contentStyle": "Description of the content/writing style used",
  "brandVoice": "Description of the brand voice characteristics",
  "keyThemes": ["theme1", "theme2", "theme3", "theme4", "theme5"]
}`,
      },
      {
        role: "user",
        content: `Analyze this website (${url}):\n\n${websiteContent}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

// Keyword discovery prompt
export async function discoverKeywords(brandProfile: {
  brandName: string;
  brandDescription: string;
  keyThemes: string[];
  targetAudience: string;
}) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an SEO expert. Based on the brand profile, suggest 15-20 keywords that would drive organic traffic. Focus on:
- Long-tail keywords with lower competition
- Keywords that match search intent
- Keywords relevant to the brand's themes

Return a JSON object with this structure:
{
  "keywords": [
    {
      "keyword": "the keyword phrase",
      "searchVolume": estimated monthly searches (number),
      "difficulty": 1-100 difficulty score,
      "trafficBoost": estimated monthly traffic boost if ranked
    }
  ]
}`,
      },
      {
        role: "user",
        content: `Brand: ${brandProfile.brandName}
Description: ${brandProfile.brandDescription}
Target Audience: ${brandProfile.targetAudience}
Key Themes: ${brandProfile.keyThemes.join(", ")}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  return JSON.parse(response.choices[0].message.content || '{"keywords":[]}');
}

// Article length configurations
// gpt-4o supports up to 16,384 output tokens
const articleLengthConfigs = {
  short: {
    wordCount: "800-1200",
    sections: "3-4",
    maxTokens: 3000,
    description: "Quick read, focused topic",
  },
  medium: {
    wordCount: "1500-2000",
    sections: "5-7",
    maxTokens: 5000,
    description: "Standard blog post",
  },
  long: {
    wordCount: "2500-3500",
    sections: "7-9",
    maxTokens: 8000,
    description: "In-depth coverage",
  },
  guide: {
    wordCount: "3500-4500",
    sections: "8-12",
    maxTokens: 12000,
    description: "Comprehensive guide",
  },
};

// Article generation prompt with variable length
export async function generateArticle(
  keyword: string,
  brandProfile: {
    brandName: string;
    brandDescription: string;
    tone: string;
    brandVoice: string;
    contentStyle: string;
    targetAudience: string;
  },
  options?: {
    articleLength?: "short" | "medium" | "long" | "guide";
    customTitle?: string;
  }
) {
  const lengthConfig = articleLengthConfigs[options?.articleLength || "medium"];

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert SEO content writer who creates engaging, well-structured blog articles.

WRITING STYLE:
- Write in a conversational, engaging tone that feels like advice from a knowledgeable friend
- Use vivid, specific language instead of generic statements
- Include rhetorical questions to engage readers
- Bold important phrases and brand names using <strong> tags
- Create smooth transitions between sections

STRUCTURE REQUIREMENTS:
- Start with a compelling hook paragraph (no heading for intro)
- Use <h2> for main section headings (${lengthConfig.sections} sections)
- Use <h3> for sub-sections when listing items (e.g., "1) First item title")
- Each paragraph should be 2-4 sentences, wrapped in <p> tags
- Include ${lengthConfig.wordCount} words total

CONTENT GUIDELINES:
- Match the brand's tone: ${brandProfile.tone}
- Match the brand's voice: ${brandProfile.brandVoice}
- Match the content style: ${brandProfile.contentStyle}
- Target audience: ${brandProfile.targetAudience}
- Add internal links using <a href="[INTERNAL_LINK]">anchor text</a> where relevant (2-3 links)
- End with a clear call-to-action or closing thought

HTML FORMAT EXAMPLE:
<p>Opening hook paragraph that draws readers in...</p>
<p>Second paragraph expanding on the problem or topic...</p>
<h2>Main Section Title</h2>
<p>Content paragraph...</p>
<h3>1) Subsection if needed</h3>
<p>Details about this point...</p>

Return a JSON object:
{
  "title": "Engaging, SEO-optimized title (50-60 chars)",
  "slug": "url-friendly-slug-with-keyword",
  "metaDescription": "Compelling meta description that encourages clicks (150-160 chars)",
  "content": "Full HTML article content",
  "wordCount": number
}`,
      },
      {
        role: "user",
        content: `Write a ${lengthConfig.description} article (${lengthConfig.wordCount} words) for "${brandProfile.brandName}" targeting the keyword: "${keyword}"
${options?.customTitle ? `\nUse this title: "${options.customTitle}"` : ""}

Brand context: ${brandProfile.brandDescription}

Remember to:
- Start with an engaging hook (no H1 heading)
- Use H2 for main sections, H3 for numbered sub-items
- Bold the brand name and key phrases
- Write in a conversational, authoritative tone
- Include specific examples and scenarios
- End with a strong closing thought`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: lengthConfig.maxTokens,
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

// Generate image prompt for article
export async function generateImagePrompt(articleTitle: string, imageStyle: string) {
  const stylePrompts: Record<string, string> = {
    "clean-minimal": "flat, professional illustration style, clean lines, minimal colors, corporate feel",
    "photorealistic": "photorealistic, stock photo style, professional photography, high quality",
    "watercolor": "watercolor painting style, artistic, soft colors, artistic brush strokes",
    "3d-render": "3D rendered illustration, modern 3D style, vibrant colors, professional",
    "vintage": "vintage retro style, classic aesthetic, warm tones, nostalgic feel",
    "abstract": "abstract art style, bold shapes, gradient colors, modern design",
  };

  const styleDescription = stylePrompts[imageStyle] || stylePrompts["photorealistic"];

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: `Create a DALL-E image prompt for a blog featured image.
Article title: "${articleTitle}"
Style: ${styleDescription}

Return only the prompt text, no explanations.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  return response.choices[0].message.content || "";
}

// Generate image using DALL-E and convert to base64 for permanent storage
export async function generateImage(prompt: string) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1792x1024",
    quality: "standard",
  });

  const imageUrl = response.data?.[0]?.url;

  if (!imageUrl) {
    return null;
  }

  // Download the image and convert to base64 for permanent storage
  // DALL-E URLs expire after ~2 hours, so we save as base64
  try {
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const contentType = imageResponse.headers.get('content-type') || 'image/png';

    // Return as data URL that can be used directly in <img> tags
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error('Failed to download and convert image to base64:', error);
    // Fallback to original URL (will expire, but better than nothing)
    return imageUrl;
  }
}
