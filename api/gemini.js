export default async function handler(req, res) {
    const API_KEY = process.env.GEMINI_API_KEY;
    const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(MODEL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: req.body.prompt }] }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });

        const data = await response.json();

        // ★追加：Geminiがエラー（400番台など）を返してきた場合、正直にフロントへ伝える
        if (!response.ok) {
            console.error("Gemini API Error:", data); // Vercelの裏側のログに残す
            return res.status(response.status).json({ error: data.error?.message || "Gemini APIキーの設定に問題があります" });
        }

        // 成功した場合はそのまま返す
        res.status(200).json(data);
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "サーバー内部エラーが発生しました" });
    }
}
