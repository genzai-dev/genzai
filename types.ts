
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 data string for display
  video?: string; // Base64 data string for video display
  document?: string; // Base64 data string for PDF/Doc display
  documentName?: string; // Filename for display
  generatedImage?: string; // Base64 data string for AI generated image
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number; // Last updated
  modelId: string;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  badge?: string;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  { id: 'gemini-2.5-flash', name: 'Genz 3.5 Pro', description: 'Multimodal, Cepat & Hemat Kuota', badge: 'BARU' },
  { id: 'gemini-2.5-flash-image', name: 'Genz Art', description: 'Buat & Edit Gambar', badge: 'BETA' },
  { id: 'gemini-2.5-flash-lite', name: 'Genz 3.0 Flash', description: 'Seimbang & Cerdas' },
  { id: 'gemini-2.0-flash', name: 'Genz 2.5 Flash', description: 'Performa tinggi generasi sebelumnya' },
  { id: 'gemini-2.0-flash-lite', name: 'Genz 2.5 Lite', description: 'Model ringan yang efisien' },
  { id: 'gemini-flash-latest', name: 'Genz 1.5 Flash', description: 'Model cepat versi lama' },
  { id: 'gemini-flash-lite-latest', name: 'Genz 1.5 Lite', description: 'Efisiensi versi lama' },
];
