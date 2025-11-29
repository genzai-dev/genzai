import React from 'react';
import { X, User, Bell, Smartphone, HelpCircle, Shield } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl w-full max-w-md shadow-2xl border border-white/50 dark:border-gray-700 animate-[scaleIn_0.2s_ease-out] overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
              <img 
                src="https://img.icons8.com/?size=100&id=S6mp3couBHct&format=png&color=000000" 
                alt="Settings"
                className="w-5 h-5 opacity-70 dark:invert"
              />
            </div>
            Pengaturan
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Account Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">Akun</h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-1 border border-gray-100 dark:border-gray-800">
              <button className="w-full flex items-center gap-4 p-3 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all group">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <User size={20} />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Profil Pengguna</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Tamu</div>
                </div>
                <div className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md">
                  Gratis
                </div>
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">Preferensi</h3>
            <div className="flex flex-col gap-1">
              {[
                { icon: Bell, label: 'Notifikasi', sub: 'Aktif' },
                { icon: Smartphone, label: 'Tampilan Aplikasi', sub: 'Otomatis' },
                { icon: Shield, label: 'Privasi & Keamanan', sub: '' },
              ].map((item, idx) => (
                <button key={idx} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left group">
                  <item.icon size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-purple-500 transition-colors" />
                  <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                  {item.sub && <span className="text-xs text-gray-400 dark:text-gray-600">{item.sub}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="space-y-3">
             <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">Tentang</h3>
             <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left group">
                <HelpCircle size={18} className="text-gray-400 dark:text-gray-500" />
                <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">Bantuan & Dukungan</span>
             </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-[10px] text-gray-400 dark:text-gray-600">
            GenzAI v1.0.0 (Beta) • Built with Gemini
          </p>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;
