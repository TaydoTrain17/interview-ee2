"use client";

import dynamic from 'next/dynamic';

// Dynamically import ChatInterface
const ChatInterface = dynamic(() => import('@/components/ChatInterface'), {
  loading: () => <div className="p-4 text-center">Loading chat interface...</div>
});

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="p-4 bg-white dark:bg-gray-800 shadow">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          AI Chat Assistant
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Talk with our AI assistant using text or voice
        </p>
      </header>
      
      <main className="flex-1 p-4 container mx-auto">
        <ChatInterface />
      </main>
      
      <footer className="p-4 bg-white dark:bg-gray-800 shadow-inner">
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Powered by OpenAI and Next.js
        </p>
      </footer>
    </div>
  );
}
