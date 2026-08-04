import React, { useState, useEffect } from 'react';
import { Settings, Check, Eye, EyeOff } from 'lucide-react';

interface SentinelConfigProps {
  onConfigured: (isConfigured: boolean) => void;
}

export const SentinelConfig: React.FC<SentinelConfigProps> = ({ onConfigured }) => {
  const [apiKey, setApiKey] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Load from sessionStorage on mount
  useEffect(() => {
    const storedApiKey = sessionStorage.getItem('sentinel_api_key') || '';
    const storedAppId = sessionStorage.getItem('sentinel_application_id') || '';
    setApiKey(storedApiKey);
    setApplicationId(storedAppId);

    const configured = !!(storedApiKey && storedAppId);
    setIsSaved(configured);
    onConfigured(configured);

    // If not configured, auto-expand
    if (!configured) {
      setIsExpanded(true);
    }
  }, [onConfigured]);

  const handleSave = () => {
    if (!apiKey.trim() || !applicationId.trim()) return;

    sessionStorage.setItem('sentinel_api_key', apiKey.trim());
    sessionStorage.setItem('sentinel_application_id', applicationId.trim());
    setIsSaved(true);
    onConfigured(true);
    setIsExpanded(false);
  };

  const handleClear = () => {
    sessionStorage.removeItem('sentinel_api_key');
    sessionStorage.removeItem('sentinel_application_id');
    setApiKey('');
    setApplicationId('');
    setIsSaved(false);
    onConfigured(false);
    setIsExpanded(true);
  };

  const isValid = apiKey.trim() && applicationId.trim();

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      {/* Toggle Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Settings size={15} className="text-gray-400" />
          <span className="font-medium text-gray-600 dark:text-gray-300">
            Sentinel Configuration
          </span>
          {isSaved && (
            <span className="inline-flex items-center space-x-1 text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              <Check size={12} />
              <span>Connected</span>
            </span>
          )}
          {!isSaved && (
            <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
              Required
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Config Panel */}
      {isExpanded && (
        <div className="px-4 pb-3 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Sentinel API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setIsSaved(false);
                }}
                placeholder="sk_live_..."
                className="w-full text-sm px-3 py-2 pr-9 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title={showApiKey ? 'Hide' : 'Show'}
              >
                {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Sentinel Application ID
            </label>
            <input
              type="text"
              value={applicationId}
              onChange={(e) => {
                setApplicationId(e.target.value);
                setIsSaved(false);
              }}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={handleSave}
              disabled={!isValid}
              className="text-sm px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Save
            </button>
            {isSaved && (
              <button
                onClick={handleClear}
                className="text-sm px-4 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
