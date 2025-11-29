import React from 'react';
import { X, MessageSquarePlus, Trash2, Clock, MessageSquare } from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onDeleteAll: () => void;
  chatSessions: ChatSession[];
  onLoadSession: (session: ChatSession) => void;
  currentSessionId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  onNewChat, 
  onDeleteAll,
  chatSessions,
  onLoadSession,
  currentSessionId
}) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 left-0 h-full w-72 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col border-r border-transparent dark:border-gray-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
             <div 
               className="w-8 h-8 bg-black dark:bg-gradient-to-r dark:from-pink-500 dark:via-purple-500 dark:to-orange-500"
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
             <span className="font-bold text-lg bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
               GenzAI
             </span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          
          {/* New Chat Button */}
          <button 
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-purple-400 dark:hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-900 transition-all font-medium group"
          >
            <MessageSquarePlus size={18} className="group-hover:scale-110 transition-transform" />
            <span>Percakapan Baru</span>
          </button>

          {/* History Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              <Clock size={12} />
              <span>Riwayat Terkini</span>
            </div>
            
            <div className="space-y-1">
              {chatSessions.length === 0 ? (
                <div className="text-center py-4 px-2 text-sm text-gray-400 dark:text-gray-600 italic">
                  Belum ada riwayat
                </div>
              ) : (
                chatSessions.map((session) => (
                  <button 
                    key={session.id}
                    onClick={() => onLoadSession(session)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group ${
                      currentSessionId === session.id 
                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <MessageSquare size={16} className={`${
                      currentSessionId === session.id 
                        ? 'text-purple-600 dark:text-purple-400' 
                        : 'text-gray-400 group-hover:text-purple-500'
                    } transition-colors flex-shrink-0`} />
                    <span className="truncate font-medium">{session.title}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button 
            onClick={onDeleteAll}
            className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium text-sm"
          >
            <Trash2 size={18} />
            <span>Hapus Semua Percakapan</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;