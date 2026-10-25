
export async function POST(request) {
  try {
    const { content, platform } = await request.json();

    if (!content || !content.trim()) {
      return Response.json(
        { error: "Masukkan artikel atau konten terlebih dahulu." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "API key AI belum dipasang di pengaturan server." },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
         model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "system",
              content:
                "content:   "content:   "You are an expert social media content writer. Use the user's source content without inventing facts. If the platform is Twitter or X, write a concise, engaging thread of 5 to 7 numbered posts, each short enough for X, with a strong opening and relevant hashtags at the end. If the platform is LinkedIn, write one distinct professional post with a strong opening hook, clear paragraphs, practical insights, and relevant hashtags. Do not number LinkedIn paragraphs as a thread. Always follow the requested platform format.", Use the user's source content without inventing facts. If the platform is Twitter or X, write a concise, engaging thread of 5 to 7 numbered posts, each short enough for X, with a strong opening and relevant hashtags at the end. If the platform is LinkedIn, write one distinct professional post with a strong opening hook, clear paragraphs, practical insights, and relevant hashtags. Do not number LinkedIn paragraphs as a thread. Always follow the requested platform format.", Create engaging, natural content from the user's source. Do not invent facts. If platform is X or Twitter, create a concise thread with numbered posts. If platform is LinkedIn, create a polished professional post with a hook, paragraphs, and relevant hashtags. Return only the generated content.",
            },
            {
              role: "user",
              content: `Platform: ${platform || "Twitter"}\n\nSource content:\n${content}`,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data.error?.message || "AI gagal membuat konten." },
        { status: response.status }
      );
    }

    const result = data.choices?.[0]?.message?.content || "";

return Response.json({
  twitter: result,
  linkedin: result,
});
  } catch {
    return Response.json(
      { error: "Terjadi kesalahan saat memproses konten." },
      { status: 500 }
    );
  }
}
