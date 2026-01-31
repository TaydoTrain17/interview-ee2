"use client";

import { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaPlay, FaStop, FaPaperPlane } from 'react-icons/fa';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: 'You are a helpful assistant.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-expect-error - SpeechRecognition is not in the TypeScript types yet
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map((result: SpeechRecognitionResult) => result[0])
            .map((result: SpeechRecognitionAlternative) => result.transcript)
            .join('');

          setInput(transcript);
        };

        recognitionRef.current.onerror = (event: Event) => {
          console.error('Speech recognition error', event);
          setIsListening(false);
        };
      }
    }
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Text-to-speech function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      setIsSpeaking(true);
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }
      
      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.content };
      
      setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while sending the message.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages
            .filter(msg => msg.role !== 'system')
            .map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-gray-200 text-gray-800 mr-auto'
                } max-w-[80%]`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.role === 'assistant' && (
                  <button 
                    onClick={() => speak(msg.content)}
                    disabled={isSpeaking}
                    className="text-xs text-gray-600 mt-2 hover:text-gray-800"
                  >
                    {isSpeaking ? <FaStop /> : <FaPlay />}
                  </button>
                )}
              </div>
            ))}
          {isLoading && (
            <div className="bg-gray-200 text-gray-800 p-3 rounded-lg mr-auto">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2 items-center">
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-2 rounded-full ${
              isListening ? 'bg-red-500 text-white' : 'bg-gray-200'
            }`}
          >
            {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 bg-blue-500 text-white rounded-full disabled:opacity-50"
          >
            <FaPaperPlane />
          </button>
          
          {isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="p-2 bg-red-500 text-white rounded-full"
            >
              <FaStop />
            </button>
          )}
        </form>
      </div>
    </div>
  );
} 