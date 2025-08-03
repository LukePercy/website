import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Bot, Github, Volume2, Sparkles } from 'lucide-react';

const SettingsPanel = ({ isOpen, onClose, settings, onSettingsChange, availableVoices, currentVoice }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-start p-4 pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, x: -300 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.9, opacity: 0, x: -300 }}
            className="bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 w-1/4 min-w-80 shadow-2xl shadow-cyan-500/20 ml-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center space-x-2" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
                <Settings size={20} className="text-cyan-400" />
                <span>AI Settings</span>
              </h3>
              <button
                onClick={onClose}
                className="text-gray-300 hover:text-cyan-400 transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* AI Provider Selection */}
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-3 px-1" style={{ textShadow: '0 0 5px rgba(0,255,255,0.5)' }}>
                  AI Provider
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 hover:border-cyan-500/30 transition-all cursor-pointer">
                    <input
                      type="radio"
                      name="aiProvider"
                      value="auto"
                      checked={settings.aiProvider === 'auto' || !settings.aiProvider}
                      onChange={(e) => onSettingsChange({ ...settings, aiProvider: e.target.value })}
                      className="w-5 h-5 text-cyan-400 bg-gray-700 border-gray-600 focus:ring-cyan-500 focus:ring-2"
                    />
                    <Bot size={16} className="text-cyan-400" />
                    <span className="text-white font-medium">Auto-Select (Recommended)</span>
                  </label>

                  <label className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 hover:border-green-500/30 transition-all cursor-pointer">
                    <input
                      type="radio"
                      name="aiProvider"
                      value="gemini"
                      checked={settings.aiProvider === 'gemini'}
                      onChange={(e) => onSettingsChange({ ...settings, aiProvider: e.target.value })}
                      className="w-5 h-5 text-green-400 bg-gray-700 border-gray-600 focus:ring-green-500 focus:ring-2"
                    />
                    <Bot size={16} className="text-green-400" />
                    <span className="text-white font-medium">Google Gemini</span>
                  </label>

                  <label className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 hover:border-blue-500/30 transition-all cursor-pointer">
                    <input
                      type="radio"
                      name="aiProvider"
                      value="openai"
                      checked={settings.aiProvider === 'openai'}
                      onChange={(e) => onSettingsChange({ ...settings, aiProvider: e.target.value })}
                      className="w-5 h-5 text-blue-400 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <Sparkles size={16} className="text-blue-400" />
                    <span className="text-white font-medium">OpenAI GPT-4</span>
                  </label>
                  
                  <label className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 hover:border-purple-500/30 transition-all cursor-pointer">
                    <input
                      type="radio"
                      name="aiProvider"
                      value="github"
                      checked={settings.aiProvider === 'github'}
                      onChange={(e) => onSettingsChange({ ...settings, aiProvider: e.target.value })}
                      className="w-5 h-5 text-purple-400 bg-gray-700 border-gray-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <Github size={16} className="text-purple-400" />
                    <span className="text-white font-medium">GitHub AI (Coming Soon)</span>
                  </label>
                </div>
              </div>

              {/* Voice Settings */}
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-3 px-1" style={{ textShadow: '0 0 5px rgba(0,255,255,0.5)' }}>
                  Voice Response
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.voiceEnabled}
                      onChange={(e) => onSettingsChange({ ...settings, voiceEnabled: e.target.checked })}
                      className="w-5 h-5 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <span className="text-white font-medium">Enable AI voice responses</span>
                  </label>

                  {/* AI Speech Provider */}
                  {settings.voiceEnabled && (
                    <div className="ml-4 space-y-2">
                      <label className="block text-xs font-medium text-cyan-300 mb-2 px-1" style={{ textShadow: '0 0 3px rgba(0,255,255,0.3)' }}>
                        Speech Provider
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-600/30 transition-all cursor-pointer">
                          <input
                            type="radio"
                            name="speechProvider"
                            value="openai"
                            checked={settings.speechProvider === 'openai'}
                            onChange={(e) => onSettingsChange({ ...settings, speechProvider: e.target.value })}
                            className="w-4 h-4 text-purple-400 bg-gray-700 border-gray-600 focus:ring-purple-500 focus:ring-2"
                          />
                          <Sparkles size={14} className="text-purple-400" />
                          <span className="text-white text-sm">OpenAI TTS (Premium)</span>
                        </label>
                        
                        <label className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-600/30 transition-all cursor-pointer">
                          <input
                            type="radio"
                            name="speechProvider"
                            value="google"
                            checked={settings.speechProvider === 'google'}
                            onChange={(e) => onSettingsChange({ ...settings, speechProvider: e.target.value })}
                            className="w-4 h-4 text-blue-400 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2"
                          />
                          <Bot size={14} className="text-blue-400" />
                          <span className="text-white text-sm">Google Cloud TTS</span>
                        </label>
                        
                        <label className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-600/30 transition-all cursor-pointer">
                          <input
                            type="radio"
                            name="speechProvider"
                            value="browser"
                            checked={settings.speechProvider === 'browser'}
                            onChange={(e) => onSettingsChange({ ...settings, speechProvider: e.target.value })}
                            className="w-4 h-4 text-gray-400 bg-gray-700 border-gray-600 focus:ring-gray-500 focus:ring-2"
                          />
                          <Volume2 size={14} className="text-gray-400" />
                          <span className="text-white text-sm">Browser Default</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Voice Selection */}
              {settings.voiceEnabled && (
                <div>
                  <label className="flex items-center text-sm font-medium text-cyan-300 mb-3 px-1 py-1" style={{ textShadow: '0 0 5px rgba(0,255,255,0.5)' }}>
                    <Volume2 size={16} className="mr-3" />
                    Voice Selection
                  </label>
                  
                  {/* OpenAI Voice Selection */}
                  {settings.speechProvider === 'openai' && (
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-purple-300 mb-2 px-1" style={{ textShadow: '0 0 3px rgba(147,51,234,0.5)' }}>
                        OpenAI Voice
                      </label>
                      <select
                        value={settings.openaiVoice || 'onyx'}
                        onChange={(e) => onSettingsChange({ ...settings, openaiVoice: e.target.value })}
                        className="w-full p-4 bg-gray-800/70 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-purple-500/20"
                      >
                        <option value="alloy" className="bg-gray-800 text-white">Alloy - Balanced, neutral tone</option>
                        <option value="echo" className="bg-gray-800 text-white">Echo - Clear, upbeat voice</option>
                        <option value="fable" className="bg-gray-800 text-white">Fable - Warm, engaging storytelling</option>
                        <option value="onyx" className="bg-gray-800 text-white">Onyx - Deep, authoritative voice (Default)</option>
                        <option value="nova" className="bg-gray-800 text-white">Nova - Bright, energetic tone</option>
                        <option value="shimmer" className="bg-gray-800 text-white">Shimmer - Smooth, professional voice</option>
                      </select>
                      <p className="text-xs text-purple-400 mt-2 px-1" style={{ textShadow: '0 0 3px rgba(147,51,234,0.3)' }}>
                        Currently using: {settings.openaiVoice || 'onyx'} (OpenAI TTS)
                      </p>
                    </div>
                  )}

                  {/* Google Cloud Voice Selection */}
                  {settings.speechProvider === 'google' && (
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-blue-300 mb-2 px-1" style={{ textShadow: '0 0 3px rgba(59,130,246,0.5)' }}>
                        Google Cloud Voice
                      </label>
                      <select
                        value={settings.googleVoice || 'en-US-Neural2-D'}
                        onChange={(e) => onSettingsChange({ ...settings, googleVoice: e.target.value })}
                        className="w-full p-4 bg-gray-800/70 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-blue-500/20"
                      >
                        <optgroup label="US English (Neural2)" className="bg-gray-800 text-white">
                          <option value="en-US-Neural2-A" className="bg-gray-800 text-white">Neural2-A - Male, warm tone</option>
                          <option value="en-US-Neural2-C" className="bg-gray-800 text-white">Neural2-C - Female, clear voice</option>
                          <option value="en-US-Neural2-D" className="bg-gray-800 text-white">Neural2-D - Male, professional</option>
                          <option value="en-US-Neural2-E" className="bg-gray-800 text-white">Neural2-E - Female, energetic</option>
                          <option value="en-US-Neural2-F" className="bg-gray-800 text-white">Neural2-F - Female, calm tone</option>
                          <option value="en-US-Neural2-G" className="bg-gray-800 text-white">Neural2-G - Female, friendly</option>
                          <option value="en-US-Neural2-H" className="bg-gray-800 text-white">Neural2-H - Female, conversational</option>
                          <option value="en-US-Neural2-I" className="bg-gray-800 text-white">Neural2-I - Male, authoritative</option>
                          <option value="en-US-Neural2-J" className="bg-gray-800 text-white">Neural2-J - Male, casual tone</option>
                        </optgroup>
                        <optgroup label="UK English (Neural2)" className="bg-gray-800 text-white">
                          <option value="en-GB-Neural2-A" className="bg-gray-800 text-white">Neural2-A - Female, British accent</option>
                          <option value="en-GB-Neural2-B" className="bg-gray-800 text-white">Neural2-B - Male, British accent</option>
                          <option value="en-GB-Neural2-C" className="bg-gray-800 text-white">Neural2-C - Female, refined British</option>
                          <option value="en-GB-Neural2-D" className="bg-gray-800 text-white">Neural2-D - Male, clear British</option>
                        </optgroup>
                        <optgroup label="Australian English (Neural2)" className="bg-gray-800 text-white">
                          <option value="en-AU-Neural2-A" className="bg-gray-800 text-white">Neural2-A - Female, Australian accent</option>
                          <option value="en-AU-Neural2-B" className="bg-gray-800 text-white">Neural2-B - Male, Australian accent</option>
                          <option value="en-AU-Neural2-C" className="bg-gray-800 text-white">Neural2-C - Female, warm Australian</option>
                          <option value="en-AU-Neural2-D" className="bg-gray-800 text-white">Neural2-D - Male, friendly Australian</option>
                        </optgroup>
                      </select>
                      <p className="text-xs text-blue-400 mt-2 px-1" style={{ textShadow: '0 0 3px rgba(59,130,246,0.3)' }}>
                        Currently using: {settings.googleVoice || 'en-US-Neural2-D'} (Google Cloud TTS)
                      </p>
                    </div>
                  )}

                  {/* Browser Voice Selection */}
                  {settings.speechProvider === 'browser' && availableVoices && availableVoices.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-300 mb-2 px-1" style={{ textShadow: '0 0 3px rgba(156,163,175,0.5)' }}>
                        Browser Voice
                      </label>
                      <select
                        value={settings.selectedVoice || ''}
                        onChange={(e) => onSettingsChange({ ...settings, selectedVoice: e.target.value })}
                        className="w-full p-4 bg-gray-800/70 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500/50 border border-gray-500/20"
                      >
                        <option value="" className="bg-gray-800 text-white">Auto-select best voice</option>
                        {availableVoices
                          .filter(voice => voice.lang.startsWith('en'))
                          .sort((a, b) => {
                            // Prioritize higher quality voices
                            const aScore = (a.name.includes('Google') ? 100 : 0) + 
                                          (a.name.includes('Microsoft') ? 80 : 0) + 
                                          (a.name.includes('Premium') ? 60 : 0) + 
                                          (a.name.includes('Enhanced') ? 40 : 0);
                            const bScore = (b.name.includes('Google') ? 100 : 0) + 
                                          (b.name.includes('Microsoft') ? 80 : 0) + 
                                          (b.name.includes('Premium') ? 60 : 0) + 
                                          (b.name.includes('Enhanced') ? 40 : 0);
                            return bScore - aScore;
                          })
                          .map(voice => (
                            <option key={voice.name} value={voice.name} className="bg-gray-800 text-white">
                              {voice.name} ({voice.lang})
                            </option>
                          ))}
                      </select>
                      {currentVoice && (
                        <p className="text-xs text-gray-400 mt-2 px-1" style={{ textShadow: '0 0 3px rgba(156,163,175,0.3)' }}>
                          Currently using: {currentVoice.name} ({currentVoice.lang})
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Animation Settings */}
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-3 px-1" style={{ textShadow: '0 0 5px rgba(0,255,255,0.5)' }}>
                  Visual Effects
                </label>
                <label className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.animationsEnabled}
                    onChange={(e) => onSettingsChange({ ...settings, animationsEnabled: e.target.checked })}
                    className="w-5 h-5 text-blue-400 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-white font-medium">Enable background animations</span>
                </label>
              </div>

              {/* Voice Speed */}
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-3 px-1" style={{ textShadow: '0 0 5px rgba(0,255,255,0.5)' }}>
                  Voice Speed: <span className="text-white">{settings.speechRate.toFixed(1)}x</span>
                </label>
                <div className="px-1">
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={settings.speechRate}
                    onChange={(e) => onSettingsChange({ ...settings, speechRate: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 custom-range-slider"
                    style={{
                      background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((settings.speechRate - 0.5) / 1.5) * 100}%, #374151 ${((settings.speechRate - 0.5) / 1.5) * 100}%, #374151 100%)`,
                      WebkitAppearance: 'none',
                      MozAppearance: 'none'
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>0.5x</span>
                    <span>1.0x</span>
                    <span>2.0x</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
