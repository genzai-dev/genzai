
import React, { useState, useRef, useEffect } from 'react';
import { X, Image as ImageIcon, Video as VideoIcon, Download, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Header from './components/Header';
import ModelSelector from './components/ModelSelector';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import ConfirmationModal from './components/ConfirmationModal';
import SettingsModal from './components/SettingsModal';
import { AVAILABLE_MODELS, Message, ModelOption, ChatSession } from './types';
import { sendMessageToGemini } from './services/geminiService';

interface LoaderProps {
  isImageMode: boolean;
}

// Logo Spinner Loading Component
const LogoSpinnerLoader: React.FC<LoaderProps> = ({ isImageMode }) => {
  const textOptions = isImageMode
    ? [
        "Sedang melukis...",
        "Mencampur warna...",
        "Membuat piksel...",
        "Tunggu beberapa menit lagi...",
        "Memberikan sentuhan seni...",
        "Gambar sedang dibuat...",
        "Mengimajinasikan visual...",
        "Sedang merender...",
      ]
    : [
        "Tunggu sebentar...",
        "Sedang berpikir...",
        "Hampir selesai...",
        "Memproses permintaanmu...",
        "Beberapa detik lagi...",
        "Menganalisis data...",
        "Menyusun jawaban...",
        "Mencari informasi...",
      ];

  const [currentText, setCurrentText] = useState(textOptions[0]);

  useEffect(() => {
    // Reset to first message when mode changes to give immediate feedback
    setCurrentText(textOptions[0]);
  }, [isImageMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Random selection for variety
      const randomIndex = Math.floor(Math.random() * textOptions.length);
      setCurrentText(textOptions[randomIndex]);
    }, 2500);
    return () => clearInterval(interval);
  }, [textOptions]);

  return (
    <div className="flex flex-col items-start w-full pl-1 my-4 gap-2">
      <div className="relative flex items-center justify-center w-10 h-10">
        {/* Spinning Conic Gradient Ring (Partially Colored) */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
           <div className="absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#0000_50%,#ec4899_60%,#a855f7_80%,#f97316_100%)] animate-spin"></div>
        </div>
        
        {/* Static White Mask to create ring effect */}
        <div className="absolute inset-[2px] bg-white dark:bg-gray-950 rounded-full z-10"></div>
        
        {/* Static Logo */}
        <div 
           className="relative z-20 w-5 h-5 bg-black dark:bg-gradient-to-r dark:from-pink-500 dark:via-purple-500 dark:to-orange-500 opacity-90"
           style={{
             maskImage: 'url(https://img.icons8.com/?size=100&id=9zVjmNkFCnhC&format=png&color=000000)',
             WebkitMaskImage: 'url(https://img.icons8.com/?size=100&id=9zVjmNkFCnhC&format=png&color=000000)',
             maskSize: 'contain',
             WebkitMaskSize: 'contain',
             maskRepeat: 'no-repeat',
             WebkitMaskRepeat: 'no-repeat',
             maskPosition: 'center',
             WebkitMaskPosition: 'center'
           }}
        />
      </div>
      <span className="text-xs font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent animate-pulse ml-1 tracking-wide">
        {currentText}
      </span>
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  iconUrl: string;
  title: string;
  desc: string;
  animationClass: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ iconUrl, title, desc, animationClass, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="relative group w-full md:w-1/3 text-left transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Glow Effect - Cyan/Blue/Emerald Gradient */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 rounded-xl opacity-40 group-hover:opacity-100 blur-[2px] transition duration-500"></div>
      
      {/* Content */}
      <div className="relative h-full bg-white dark:bg-gray-900 p-3 rounded-[10px] flex items-center gap-3 transition-colors duration-300">
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
          <img 
            src={iconUrl} 
            alt={title}
            className={`w-7 h-7 dark:invert ${animationClass}`}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight mb-0.5">{title}</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{desc}</span>
        </div>
      </div>
    </button>
  );
};

// Animated Greeting Component
const AnimatedGreeting = () => {
  const phrases = [
    "Ada yang bisa saya bantu?",
    "Butuh ide kreatif hari ini?",
    "Ingin membuat gambar AI?",
    "Ayo diskusikan sesuatu!",
    "Tanya apa saja, saya siap.",
    "Lagi cari inspirasi?",
    "Coba fitur analisis video!",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 4000); // Ganti setiap 4 detik
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <p 
      key={index} // Key change triggers animation re-run
      className="text-xl text-gray-400 dark:text-gray-500 font-medium animate-slide-up"
    >
      {phrases[index]}
    </p>
  );
};

function App() {
  const [currentModel, setCurrentModel] = useState<ModelOption>(AVAILABLE_MODELS[0]);
  
  // Messages state acts as the "Active" session view
  const [messages, setMessages] = useState<Message[]>([]);
  
  // History State
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const [inputText, setInputText] = useState('');
  
  // Media States
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedDocName, setSelectedDocName] = useState<string>('');
  
  // File Input Control
  const [fileAccept, setFileAccept] = useState("image/*,video/*,application/pdf,text/*,.pdf,.txt,.csv");

  const [isLoading, setIsLoading] = useState(false);
  const [isImageGenerationLoading, setIsImageGenerationLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // UI States
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load History from LocalStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('genzai_sessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setChatSessions(parsed);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save History to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('genzai_sessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  // Dark Mode Toggle Logic
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, selectedImage, selectedVideo, selectedDocument]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        
        // Reset others
        setSelectedImage(null);
        setSelectedVideo(null);
        setSelectedDocument(null);
        setSelectedDocName('');

        if (file.type.startsWith('image/')) {
          setSelectedImage(result);
        } else if (file.type.startsWith('video/')) {
          setSelectedVideo(result);
        } else if (file.type === 'application/pdf' || file.type.startsWith('text/') || file.type.includes('document')) {
          setSelectedDocument(result);
          setSelectedDocName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset accept to default after selection
    setFileAccept("image/*,video/*,application/pdf,text/*,.pdf,.txt,.csv");
  };

  const handleRemoveMedia = () => {
    setSelectedImage(null);
    setSelectedVideo(null);
    setSelectedDocument(null);
    setSelectedDocName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `genzai-art-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to update or create session
  const updateChatSession = (newMessages: Message[], sessionId: string | null) => {
    if (!sessionId) {
      // Create new session
      const newId = Date.now().toString();
      const title = newMessages[0]?.text.slice(0, 40) + (newMessages[0]?.text.length > 40 ? '...' : '') || 'Percakapan Baru';
      
      const newSession: ChatSession = {
        id: newId,
        title: title,
        messages: newMessages,
        timestamp: Date.now(),
        modelId: currentModel.id
      };
      
      setChatSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newId);
      return newId;
    } else {
      // Update existing session
      setChatSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: newMessages,
            timestamp: Date.now()
          };
        }
        return session;
      }).sort((a, b) => b.timestamp - a.timestamp)); // Move active to top
      return sessionId;
    }
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage && !selectedVideo && !selectedDocument) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      image: selectedImage || undefined,
      video: selectedVideo || undefined,
      document: selectedDocument || undefined,
      documentName: selectedDocName || undefined,
      timestamp: Date.now(),
    };

    // Optimistic update
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Sync with History
    let activeSessionId = updateChatSession(updatedMessages, currentSessionId);

    setInputText('');
    const imageToSend = selectedImage;
    const videoToSend = selectedVideo;
    const documentToSend = selectedDocument;
    
    // Clear state
    setSelectedImage(null);
    setSelectedVideo(null);
    setSelectedDocument(null);
    setSelectedDocName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    const isImageGen = currentModel.id === 'gemini-2.5-flash-image';
    setIsImageGenerationLoading(isImageGen);
    setIsLoading(true);
    
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await sendMessageToGemini(
        userMessage.text, 
        currentModel.id, 
        updatedMessages,
        imageToSend || undefined,
        videoToSend || undefined,
        documentToSend || undefined
      );
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        generatedImage: response.generatedImage,
        timestamp: Date.now(),
      };
      
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      
      // Update history again with bot response
      updateChatSession(finalMessages, activeSessionId);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setInputText('');
    setSelectedImage(null);
    setSelectedVideo(null);
    setSelectedDocument(null);
    setSelectedDocName('');
    setIsSidebarOpen(false);
  };

  const handleLoadSession = (session: ChatSession) => {
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    const model = AVAILABLE_MODELS.find(m => m.id === session.modelId);
    if (model) setCurrentModel(model);
    setIsSidebarOpen(false);
  };

  const handleDeleteAll = () => {
    setChatSessions([]);
    setMessages([]);
    setCurrentSessionId(null);
    localStorage.removeItem('genzai_sessions');
    setIsDeleteModalOpen(false);
    setIsSidebarOpen(false);
  };

  // Feature Handlers
  const handleGenzArtClick = () => {
    // Switch to Image Generation Model
    const artModel = AVAILABLE_MODELS.find(m => m.id === 'gemini-2.5-flash-image');
    if (artModel) setCurrentModel(artModel);
    
    // Focus input and maybe set a placeholder suggestion
    textareaRef.current?.focus();
    // Optional: Visual feedback or toast could go here
  };

  const handleVideoInsightClick = () => {
    // Switch to Multimodal Model (Genz 3.5 Pro)
    const proModel = AVAILABLE_MODELS.find(m => m.id === 'gemini-2.5-flash');
    if (proModel) setCurrentModel(proModel);

    // Trigger Video Upload
    setFileAccept("video/*");
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  };

  const handleDocAnalysisClick = () => {
    // Switch to Multimodal Model (Genz 3.5 Pro)
    const proModel = AVAILABLE_MODELS.find(m => m.id === 'gemini-2.5-flash');
    if (proModel) setCurrentModel(proModel);

    // Trigger Doc Upload
    setFileAccept(".pdf,.txt,.csv,application/pdf,text/plain");
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  };

  return (
    <div className="relative flex flex-col h-screen bg-white dark:bg-gray-950 overflow-hidden font-sans transition-colors duration-300">
      <Header 
        currentModel={currentModel} 
        onOpenModelMenu={() => setIsModelMenuOpen(true)} 
        onNewChat={handleNewChat}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        onDeleteAll={() => setIsDeleteModalOpen(true)}
        chatSessions={chatSessions}
        onLoadSession={handleLoadSession}
        currentSessionId={currentSessionId}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAll}
      />

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto pt-20 pb-36 px-4 no-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="flex flex-col items-center justify-center gap-4 mb-2">
              <div 
                 className="w-14 h-14 bg-black dark:bg-gradient-to-r dark:from-pink-500 dark:via-purple-500 dark:to-orange-500 opacity-90"
                 style={{
                   maskImage: 'url(https://img.icons8.com/?size=100&id=9zVjmNkFCnhC&format=png&color=000000)',
                   WebkitMaskImage: 'url(https://img.icons8.com/?size=100&id=9zVjmNkFCnhC&format=png&color=000000)',
                   maskSize: 'contain',
                   WebkitMaskSize: 'contain',
                   maskRepeat: 'no-repeat',
                   WebkitMaskRepeat: 'no-repeat',
                   maskPosition: 'center',
                   WebkitMaskPosition: 'center'
                 }}
              />
              <h1 className="text-5xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent animate-gradient tracking-tighter pb-1">
                GenzAI
              </h1>
            </div>
            
            {/* Animated Greeting */}
            <AnimatedGreeting />

            {/* Feature Cards Section */}
            <div className="w-full max-w-3xl flex flex-col md:flex-row items-center justify-center gap-4 mt-8 px-4">
              <FeatureCard 
                iconUrl="https://img.icons8.com/?size=100&id=RxzRPd8sH7Ru&format=png&color=000000"
                title="Genz Art"
                desc="Buat gambar imajinatif dari teks dengan sekali klik."
                animationClass="animate-bounce"
                onClick={handleGenzArtClick}
              />
              <FeatureCard 
                iconUrl="https://img.icons8.com/?size=100&id=8be1UTud2QXC&format=png&color=000000"
                title="Video Insight"
                desc="Analisis isi video dan temukan momen penting."
                animationClass="animate-pulse"
                onClick={handleVideoInsightClick}
              />
              <FeatureCard 
                iconUrl="https://img.icons8.com/?size=100&id=5vIes7nAVj0R&format=png&color=000000"
                title="Dokumen Cerdas"
                desc="Baca & ringkas PDF atau file dokumen kompleks."
                animationClass="animate-[wiggle_1s_ease-in-out_infinite]"
                onClick={handleDocAnalysisClick}
              />
            </div>
            
          </div>
        ) : (
          <div className="space-y-8 max-w-3xl mx-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* GenzAI Label for Model Responses */}
                {msg.role === 'model' && (
                  <span className="mb-2 ml-1 text-[11px] font-bold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                    GenzAI
                  </span>
                )}

                <div
                  className={`text-[15px] leading-7 flex flex-col gap-2 ${
                    msg.role === 'user'
                      ? 'max-w-[85%] px-5 py-3 rounded-2xl rounded-br-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium shadow-sm border border-transparent dark:border-gray-700'
                      : 'w-full px-1 text-gray-800 dark:text-gray-200' 
                  }`}
                >
                  {/* Display User Uploaded Image */}
                  {msg.image && (
                    <div className="mb-2">
                      <img 
                        src={msg.image} 
                        alt="User upload" 
                        className="rounded-xl max-h-64 object-cover w-full border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  )}

                  {/* Display User Uploaded Video */}
                  {msg.video && (
                    <div className="mb-2">
                      <video 
                        src={msg.video} 
                        controls
                        className="rounded-xl max-h-64 w-full border border-gray-200 dark:border-gray-700 bg-black"
                      />
                    </div>
                  )}

                  {/* Display User Uploaded Document */}
                  {msg.document && (
                    <div className="mb-2 flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-500">
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                         <span className="text-sm font-semibold truncate text-gray-800 dark:text-gray-200">{msg.documentName || 'Dokumen'}</span>
                         <span className="text-[10px] text-gray-500 uppercase">PDF / DOC</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Display AI Generated Image */}
                  {msg.generatedImage && (
                    <div className="relative group mb-2">
                      <img 
                        src={msg.generatedImage} 
                        alt="AI Generated" 
                        className="rounded-xl w-full border border-purple-100 dark:border-gray-700 shadow-md"
                      />
                      <button 
                        onClick={() => handleDownloadImage(msg.generatedImage!)}
                        className="absolute bottom-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-sm text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Unduh Gambar"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  )}

                  {msg.role === 'model' ? (
                    <div className="markdown-content">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <span className="whitespace-pre-wrap">{msg.text}</span>
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && <LogoSpinnerLoader isImageMode={isImageGenerationLoading} />}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area - Fixed Bottom */}
      <div className="fixed bottom-8 left-0 right-0 px-4 z-20 max-w-3xl mx-auto w-full">
        <div className="relative group flex flex-col">
          
          {/* Media Preview Floating Card */}
          {(selectedImage || selectedVideo || selectedDocument) && (
            <div className="absolute -top-24 left-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-purple-100 dark:border-gray-700 animate-[fadeIn_0.3s_ease-out] flex items-center gap-3 z-30">
              {selectedImage && <img src={selectedImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />}
              {selectedVideo && <video src={selectedVideo} className="w-16 h-16 object-cover rounded-lg bg-black" />}
              {selectedDocument && (
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-lg flex flex-col items-center justify-center border border-red-100 dark:border-red-900/30">
                  <FileText className="text-red-500 w-6 h-6 mb-1" />
                  <span className="text-[8px] text-red-500 font-bold uppercase">DOC</span>
                </div>
              )}
              
              <div className="flex flex-col justify-center max-w-[120px]">
                 {selectedDocument && <span className="text-xs truncate font-medium text-gray-700 dark:text-gray-300">{selectedDocName}</span>}
              </div>

              <button 
                onClick={handleRemoveMedia}
                className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-1"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Animated Rotating Gradient Border */}
          <div className="absolute -inset-[2px] rounded-[30px] overflow-hidden opacity-70 group-hover:opacity-100 transition duration-500 blur-[2px]">
             <div className="absolute inset-[-100%] animate-spin-slow bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#0000_50%,#ec4899_60%,#a855f7_80%,#f97316_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#0000_50%,#ec4899_60%,#a855f7_80%,#f97316_100%)]"></div>
          </div>
          
          <div className="relative bg-white dark:bg-gray-900 rounded-[28px] px-4 py-3 z-10 transition-colors duration-300">
             {/* Text Area */}
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                currentModel.id === 'gemini-2.5-flash-image' 
                  ? "Deskripsikan gambar yang ingin dibuat..." 
                  : (selectedImage || selectedVideo || selectedDocument 
                      ? "Analisis file ini..." 
                      : "Tanya apa saja...")
              }
              rows={1}
              className="w-full bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none outline-none text-base py-1 no-scrollbar max-h-32 font-medium"
            />
            
            {/* Bottom Right Controls */}
            <div className="flex items-center justify-end gap-1 mt-1.5">
               <input 
                 type="file" 
                 accept={fileAccept}
                 ref={fileInputRef}
                 onChange={handleFileSelect}
                 className="hidden" 
               />
               <button 
                onClick={() => {
                  setFileAccept("image/*,video/*,application/pdf,text/*,.pdf,.txt,.csv");
                  setTimeout(() => fileInputRef.current?.click(), 0);
                }}
                className={`p-1.5 rounded-full transition-all ${
                  selectedImage || selectedVideo || selectedDocument
                    ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400' 
                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
                title="Tambah file"
               >
                 {selectedVideo ? (
                    <VideoIcon size={20} /> 
                  ) : (selectedImage ? (
                    <ImageIcon size={20} /> 
                  ) : selectedDocument ? (
                    <FileText size={20} />
                  ) : (
                    <img 
                      src="https://img.icons8.com/?size=100&id=aYvIy286ZAVO&format=png&color=000000" 
                      alt="Tambah"
                      className="w-5 h-5 opacity-60 dark:invert"
                    />
                  ))}
               </button>
               <button 
                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
                title="Input suara"
               >
                 <img 
                    src="https://img.icons8.com/?size=100&id=KXyViXMmQm56&format=png&color=000000" 
                    alt="Suara"
                    className="w-5 h-5 opacity-60 dark:invert"
                 />
               </button>
               <button 
                onClick={handleSendMessage}
                disabled={(!inputText.trim() && !selectedImage && !selectedVideo && !selectedDocument) || isLoading}
                className={`p-1.5 rounded-full transition-all shadow-md flex items-center justify-center ${
                  (!inputText.trim() && !selectedImage && !selectedVideo && !selectedDocument) || isLoading 
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400' 
                    : 'bg-gradient-to-r from-pink-500 to-orange-500 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
               >
                 <img 
                   src="https://img.icons8.com/?size=100&id=2GjdVg3M78wR&format=png&color=000000" 
                   alt="Kirim"
                   className={`w-5 h-5 ${
                     (!inputText.trim() && !selectedImage && !selectedVideo && !selectedDocument) || isLoading 
                       ? 'opacity-40 dark:invert' 
                       : 'invert'
                   }`} 
                 />
               </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Model Selector Drawer */}
      <ModelSelector
        isOpen={isModelMenuOpen}
        onClose={() => setIsModelMenuOpen(false)}
        currentModelId={currentModel.id}
        onSelectModel={setCurrentModel}
      />
    </div>
  );
}

export default App;
