"use client";

import { CheckCircle, AlertCircle, Lightbulb, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Suggestion {
  id: string;
  type: 'improvement' | 'warning' | 'success' | 'enhancement';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  implemented?: boolean;
}

interface SuggestionsListProps {
  suggestions: Suggestion[];
  onImplementSuggestion?: (suggestionId: string) => void;
  className?: string;
}

const suggestionIcons = {
  improvement: Lightbulb,
  warning: AlertCircle,
  success: CheckCircle,
  enhancement: Sparkles,
};

const suggestionColors = {
  improvement: 'text-blue-500 bg-blue-50 border-blue-200',
  warning: 'text-amber-500 bg-amber-50 border-amber-200',
  success: 'text-green-500 bg-green-50 border-green-200',
  enhancement: 'text-purple-500 bg-purple-50 border-purple-200',
};

const priorityColors = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-700',
};

export function SuggestionsList({ suggestions, onImplementSuggestion, className }: SuggestionsListProps) {
  if (suggestions.length === 0) {
    return (
      <div className={cn("bg-white rounded-xl border border-gray-200 p-8", className)}>
        <div className="text-center">
          <Sparkles size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Suggestions Yet</h3>
          <p className="text-gray-500">
            Upload and validate an image to get AI-powered improvement suggestions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200", className)}>
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">AI Suggestions</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
            {suggestions.length} suggestions
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        {suggestions.map((suggestion) => {
          const Icon = suggestionIcons[suggestion.type];
          
          return (
            <div
              key={suggestion.id}
              className={cn(
                "border rounded-lg p-4 transition-all duration-200 hover:shadow-md",
                suggestionColors[suggestion.type],
                suggestion.implemented && "opacity-60"
              )}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Icon size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 truncate">
                      {suggestion.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        priorityColors[suggestion.priority]
                      )}>
                        {suggestion.priority}
                      </span>
                      {suggestion.implemented && (
                        <CheckCircle size={16} className="text-green-500" />
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {suggestion.description}
                  </p>
                  
                  {!suggestion.implemented && onImplementSuggestion && (
                    <button
                      onClick={() => onImplementSuggestion(suggestion.id)}
                      className="inline-flex items-center px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                    >
                      Implement
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {suggestions.filter(s => s.implemented).length} of {suggestions.length} implemented
          </span>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-gray-600">
                {suggestions.filter(s => s.priority === 'high').length} High
              </span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-600">
                {suggestions.filter(s => s.priority === 'medium').length} Medium
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}