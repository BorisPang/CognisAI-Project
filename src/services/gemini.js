// --- Gemini API 核心工具函数 ---
export const generateWithGemini = async (prompt) => {
  const apiKey = ""; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };

  const delays = [1000, 2000, 4000, 8000, 16000];
  for (let attempt = 0; attempt <= 5; attempt++) {
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "未获取到有效内容。";
    } catch (error) {
      if (attempt === 5) return `生成失败，请检查网络或稍后重试。\n错误信息: ${error.message}`;
      await new Promise(res => setTimeout(res, delays[attempt]));
    }
  }
};
