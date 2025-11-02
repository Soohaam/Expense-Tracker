import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Sparkles, Loader2, AlertCircle, Brain, TrendingUp } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const AIReview = ({ open, onClose }) => {
  const { toast } = useToast();
  const { filters } = useSelector((state) => state.transactions);
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);
  const [error, setError] = useState(null);

  const generateReview = async () => {
    setLoading(true);
    setError(null);
    setReview(null);

    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(
        `http://localhost:5000/api/ai/review?${params.toString()}`
      );

      if (response.data.success) {
        setReview(response.data.data.review);
        toast({
          title: 'Success',
          description: 'AI review generated successfully',
        });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Failed to generate AI review';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Format the AI response with proper styling
  const formatResponse = (text) => {
    if (!text) return null;

    const sections = text.split(/(?=##\s)/);
    
    return sections.map((section, index) => {
      const lines = section.trim().split('\n');
      const isHeader = lines[0].startsWith('##');
      
      if (isHeader) {
        const headerText = lines[0].replace(/^##\s*/, '').trim();
        const emoji = headerText.match(/^[\u{1F300}-\u{1F9FF}]/u)?.[0] || '';
        const title = headerText.replace(/^[\u{1F300}-\u{1F9FF}]/u, '').trim();
        const content = lines.slice(1).join('\n');

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              {emoji && <span className="text-2xl">{emoji}</span>}
              <h3 className="text-lg font-bold text-emerald-400">{title}</h3>
            </div>
            <div className="pl-8 space-y-2">
              {content.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                
                // Bullet points
                if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
                  return (
                    <div key={i} className="flex items-start gap-2 text-gray-300">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span className="flex-1">{trimmed.replace(/^[-•]\s*/, '')}</span>
                    </div>
                  );
                }
                
                // Bold text
                const boldFormatted = trimmed.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="text-emerald-300 font-semibold">$1</strong>'
                );
                
                return (
                  <p 
                    key={i} 
                    className="text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: boldFormatted }}
                  />
                );
              })}
            </div>
          </motion.div>
        );
      }
      
      return null;
    }).filter(Boolean);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] bg-gray-900 border-emerald-400/40 text-white overflow-hidden">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent font-bold">
              AI Financial Review
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Initial State - No Review */}
          {!review && !loading && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-400/30"
              >
                <TrendingUp className="h-12 w-12 text-emerald-400" />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-emerald-400">
                Get AI-Powered Financial Insights
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                Our advanced AI will analyze your income and expenses to provide
                personalized recommendations and actionable insights to improve your
                financial health.
              </p>
              <Button
                onClick={generateReview}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-emerald-500/30"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Review
              </Button>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="relative w-32 h-32 mx-auto mb-6">
                {/* Outer rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400 border-r-blue-400"
                />
                {/* Inner rotating ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-4 rounded-full border-4 border-transparent border-b-emerald-300 border-l-blue-300"
                />
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="h-10 w-10 text-emerald-400" />
                </div>
              </div>
              
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <h3 className="text-xl font-semibold text-emerald-400 mb-2">
                  Analyzing Your Finances...
                </h3>
                <p className="text-gray-400">
                  Our AI is processing your transaction data
                </p>
              </motion.div>
              
              {/* Loading steps */}
              <div className="mt-8 space-y-2 max-w-xs mx-auto">
                {['Fetching transactions', 'Analyzing patterns', 'Generating insights'].map(
                  (step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.3 }}
                      className="flex items-center gap-2 text-sm text-gray-400"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                        className="w-2 h-2 bg-emerald-400 rounded-full"
                      />
                      {step}
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-400/30">
                <AlertCircle className="h-10 w-10 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-red-400 mb-3">
                Oops! Something went wrong
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">{error}</p>
              <Button
                onClick={generateReview}
                variant="outline"
                className="border-emerald-400/40 hover:bg-emerald-400/10 text-emerald-400"
              >
                Try Again
              </Button>
            </motion.div>
          )}

          {/* Review Content */}
          {review && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ScrollArea className="h-[500px] pr-4 bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                <div className="space-y-6">
                  {formatResponse(review)}
                </div>
              </ScrollArea>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-700 mt-6">
                <Button
                  onClick={generateReview}
                  variant="outline"
                  size="sm"
                  className="border-emerald-400/40 hover:bg-emerald-400/10 text-emerald-400"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
                <Button
                  onClick={onClose}
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIReview;