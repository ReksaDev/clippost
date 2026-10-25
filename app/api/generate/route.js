
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
  content: "You are an expert social media content writer. Use the source content without inventing facts. For Twitter or X, create a concise thread of 5 to 7 numbered posts. For LinkedIn, create one professional post with a strong opening, clear paragraphs, practical insights, and relevant hashtags. Never format LinkedIn as a numbered thread. Return only the generated content.",
},

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

const twitterResult = result;

const linkedinResponse = await fetch(
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
            "You are a professional LinkedIn content writer. Turn the source into one polished LinkedIn post with a compelling opening, clear paragraphs, practical insights, and relevant hashtags. Do not format it as a numbered thread. Do not invent facts. Return only the LinkedIn post.",
        },
        {
          role: "user",
          content: `Source content:\n${content}`,
        },
      ],
      temperature: 0.7,
    }),
  }
);

const linkedinData = await linkedinResponse.json();

if (!linkedinResponse.ok) {
  return Response.json(
    {
      error:
        linkedinData.error?.message ||
        "AI gagal membuat konten LinkedIn.",
    },
    { status: linkedinResponse.status }
  );
}

const linkedinResult =
  linkedinData.choices?.[0]?.message?.content || "";

return Response.json({
  twitter: twitterResult,
  linkedin: linkedinResult,
});
  } catch {
    return Response.json(
      { error: "Terjadi kesalahan saat memproses konten." },
      { status: 500 }
    );
  }
}
