import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorBoundary = ({ error, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl"
    >
      <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
      <h3 className="text-xl font-semibold text-red-400 mb-2">Something went wrong</h3>
      <p className="text-gray-300 text-center mb-4 max-w-md">
        {error?.message || "I encountered an unexpected error. Let's try that again."}
      </p>
      {onRetry && (
        <motion.button
          onClick={onRetry}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          <span>Try Again</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default ErrorBoundary;
