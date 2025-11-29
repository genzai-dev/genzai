import React from 'react';
import { X, Check } from 'lucide-react';
import { ModelOption, AVAILABLE_MODELS } from '../types';

interface ModelSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentModelId: string;
  onSelectModel: (model: ModelOption) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ isOpen, onClose, currentModelId, onSelectModel }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 dark:bg-black/70 z-50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Slide-up Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl z-50 p-6 shadow-2xl transform transition-transform duration-300 ease-out max-h-[70vh] overflow-y-auto border-t border-transparent dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Pilih Model</h3>
          <button onClick={onClose} className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {AVAILABLE_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onSelectModel(model);
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                currentModelId === model.id
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-purple-200 dark:hover:border-purple-800'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Logo App Wrapper */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border ${
                   currentModelId === model.id 
                    ? 'bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 shadow-sm' 
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                }`}>
                   <div 
                     className="w-7 h-7 bg-black dark:bg-gradient-to-r dark:from-pink-500 dark:via-purple-500 dark:to-orange-500 opacity-90"
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

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${currentModelId === model.id ? 'text-purple-700 dark:text-purple-300' : 'text-gray-900 dark:text-gray-100'}`}>
                      {model.name}
                    </span>
                    {model.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-sm leading-none tracking-wide">
                        {model.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {model.description}
                  </div>
                </div>
              </div>

              {currentModelId === model.id && (
                <div className="h-6 w-6 bg-purple-500 rounded-full flex items-center justify-center shrink-0 ml-2">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ModelSelector;