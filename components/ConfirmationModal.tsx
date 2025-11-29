import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-white/50 dark:border-gray-700 animate-[scaleIn_0.2s_ease-out]">
        <div className="flex flex-col items-center text-center space-y-4">
          
          {/* Icon Wrapper */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-inner">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Trash2 className="text-white w-6 h-6" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Hapus Semua?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus semua riwayat percakapan? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full pt-2">
            <button 
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={onConfirm}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;