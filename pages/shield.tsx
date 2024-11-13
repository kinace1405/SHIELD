// pages/shield.tsx
import type { NextPage } from 'next';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Upload, 
  FileText, 
  Loader, 
  Bot, 
  User,
  X 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Message {
  content: string;
  isUser: boolean;
  timestamp?: string;
  isError?: boolean;
}

const Shield: NextPage = () => {
  // ... rest of your state declarations and functions ...
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMessage = (content: string) => {
    try {
      if (content.startsWith('[') || content.startsWith('{')) {
        const jsonContent = JSON.parse(content);
        if (Array.isArray(jsonContent) && jsonContent[0]?.text) {
          content = jsonContent[0].text;
        }
      }

      return content.split('\n\n').map((paragraph, i) => (
        <div key={i} className="mb-4">
          {paragraph.split('\n').map((line, j) => {
            if (line.trim().startsWith('•') || line.trim().startsWith('*')) {
              return (
                <div key={j} className="ml-4 flex items-start gap-2">
                  <span className="text-custom-purple">•</span>
                  <span>{line.trim().replace(/^[•*]\s*/, '')}</span>
                </div>
              );
            }
            if (line.match(/^\d+[\)\.]/)) {
              return <div key={j} className="ml-4">{line}</div>;
            }
            if (line.match(/^[A-Za-z\s\d]+:/)) {
              return <div key={j} className="font-bold text-custom-purple mt-2">{line}</div>;
            }
            return <div key={j}>{line}</div>;
          })}
        </div>
      ));
    } catch (error) {
      return content.split('\n').map((line, i) => (
        <p key={i} className="mb-2">{line}</p>
      ));
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && files.length === 0) return;

    setIsLoading(true);
    const messageContent = input;
    setInput('');

    setMessages(prev => [...prev, { 
      content: messageContent, 
      isUser: true,
      timestamp: new Date().toISOString()
    }]);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: messageContent })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const responseText = await response.text();

      setMessages(prev => [...prev, { 
        content: responseText,
        isUser: false,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        content: "An error occurred. Please try again.",
        isUser: false,
        isError: true,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-900">
      <div className="max-w-6xl mx-auto p-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="w-6 h-6 text-custom-purple" />
              SHIELD Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] overflow-y-auto mb-4 p-4 rounded-lg bg-gray-900/50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div className={`flex items-start max-w-3xl ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isUser ? 'bg-custom-purple ml-2' : 'bg-custom-green mr-2'
                    }`}>
                      {message.isUser ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.isUser 
                          ? 'bg-custom-purple text-white' 
                          : message.isError
                            ? 'bg-red-500/20 border border-red-500 text-white'
                            : 'bg-gray-800 text-white'
                      }`}
                    >
                      <div className="prose prose-invert max-w-none">
                        {formatMessage(message.content)}
                      </div>
                      {message.timestamp && (
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-800 text-white px-4 py-2 rounded-lg">
                    <Loader className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {files.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {files.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center bg-gray-700 text-white rounded-lg px-3 py-2"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="text-sm mr-2">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSend} className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-white transition-colors bg-gray-800 rounded-lg"
                title="Upload files"
              >
                <Upload className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
              />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask SHIELD anything..."
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple"
              />
              <button
                type="submit"
                disabled={isLoading || (!input.trim() && files.length === 0)}
                className="bg-custom-purple text-white rounded-lg px-4 py-2 hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Shield;