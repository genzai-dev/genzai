import { Message } from "../types";

interface GeminiResponse {
  text: string;
  generatedImage?: string;
}

export const sendMessageToGemini = async (
  text: string,
  modelId: string,
  history: Message[],
  imageBase64?: string,
  videoBase64?: string,
  documentBase64?: string
): Promise<GeminiResponse> => {
  try {
    // Panggil Backend API kita sendiri (Serverless Function)
    // Ini mengamankan API Key agar tidak terekspos di browser
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: text,
        history: history, // Kirim history agar backend punya konteks
        modelId: modelId,
        imageBase64: imageBase64,
        videoBase64: videoBase64,
        documentBase64: documentBase64
      }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return {
      text: data.text || "",
      generatedImage: data.generatedImage
    };

  } catch (error) {
    console.error("Gemini Service Error:", error);
    return { 
      text: "Maaf, saya tidak dapat terhubung ke server saat ini. Pastikan koneksi internet Anda lancar." 
    };
  }
};