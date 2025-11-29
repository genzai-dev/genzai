import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error: API Key missing' }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const { message, history, modelId, imageBase64, videoBase64, documentBase64 } = await request.json();

    const isImageGenModel = modelId === 'gemini-2.5-flash-image';

    // Helper untuk memproses base64
    const processBase64 = (base64Str: string, defaultMime: string) => {
      let mimeType = defaultMime;
      let data = base64Str;
      if (base64Str.includes(';base64,')) {
          const split = base64Str.split(';base64,');
          data = split[1];
          const mimeMatch = split[0].match(/:(.*?)$/);
          if (mimeMatch) mimeType = mimeMatch[1];
      }
      return { mimeType, data };
    };

    // Konfigurasi System Instruction
    const systemInstruction = isImageGenModel 
      ? "Kamu adalah Genz Art, AI yang mampu membuat dan mengedit gambar. Jika pengguna meminta gambar, buatlah gambar tersebut. Jawablah selalu dalam Bahasa Indonesia."
      : "Kamu adalah GenzAI, asisten AI yang ramah dan membantu. Kamu bisa melihat gambar, menonton video, dan membaca dokumen PDF/Teks jika pengguna memberikannya. Saat menganalisis video atau dokumen, perhatikan detail penting. Jawablah selalu dalam Bahasa Indonesia yang luwes.";

    // Persiapkan Chat / Generate Request
    // Jika history kosong atau model image gen, kita gunakan generateContent langsung (stateless)
    // Namun untuk chat history, kita perlu membangun konteks 'contents'
    
    let contents = [];

    // 1. Masukkan History (Kecuali pesan terakhir yang baru dikirim user, karena akan kita gabung dengan media)
    // Kita harus mapping format Message frontend ke format Content SDK
    if (history && history.length > 0) {
      // Filter pesan terakhir dari user karena akan diproses terpisah dengan lampiran
      const previousMessages = history.slice(0, -1); 
      
      contents = previousMessages.map((msg: any) => {
        const parts = [{ text: msg.text }];
        // Note: Untuk history lampiran lama, idealnya kita kirim ulang datanya jika ingin konteks penuh,
        // tapi untuk efisiensi bandwidth seringkali text-only history sudah cukup kecuali user mereferensikan gambar lama.
        // Di implementasi sederhana ini, kita kirim teks riwayatnya saja.
        return {
          role: msg.role,
          parts: parts
        };
      });
    }

    // 2. Proses Pesan Baru (Current Message)
    const currentParts: any[] = [{ text: message }];

    if (imageBase64) {
      const { mimeType, data } = processBase64(imageBase64, 'image/jpeg');
      currentParts.push({ inlineData: { mimeType, data } });
    }

    if (videoBase64) {
      const { mimeType, data } = processBase64(videoBase64, 'video/mp4');
      currentParts.push({ inlineData: { mimeType, data } });
    }

    if (documentBase64) {
       const { mimeType, data } = processBase64(documentBase64, 'application/pdf');
       currentParts.push({ inlineData: { mimeType, data } });
    }

    contents.push({
      role: 'user',
      parts: currentParts
    });

    // Panggil Gemini API
    const response = await ai.models.generateContent({
      model: modelId,
      contents: contents,
      config: {
        systemInstruction: systemInstruction
      }
    });

    // Proses Response
    let responseText = "";
    let generatedImage = undefined;

    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.text) {
            responseText += part.text;
          }
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            generatedImage = `data:${mimeType};base64,${base64Data}`;
          }
        }
      }
    }

    // Fallback text check
    if (!responseText && !generatedImage) {
        // Coba akses property text langsung jika ada (tergantung versi SDK)
        // @ts-ignore
        if (response.text) responseText = response.text;
    }

    return new Response(JSON.stringify({ text: responseText, generatedImage }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Backend API Error:", error);
    return new Response(JSON.stringify({ 
      text: "Maaf, terjadi kesalahan di server saat menghubungi AI.",
      details: error.message 
    }), { status: 500 });
  }
}