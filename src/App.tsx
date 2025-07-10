import React, { useState } from 'react';
import { HackingTimeline } from './components/HackingTimeline';
import { TransferTimeline } from './components/TransferTimeline';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('hacking');

  const tabs = [
    { id: 'hacking', label: 'ハッキング' },
    { id: 'transfers', label: '不審な送金' },
  ];

  return (
    <div className="text-gray-200 min-h-screen font-sans antialiased">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 tracking-wider">Hacking Infomation Timeline</h1>
          <p className="text-gray-400 mt-2">ハッキング情報 タイムライン</p>
        </header>

        <div className="mb-8 border-b border-gray-700">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-500'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <main>
          {activeTab === 'hacking' && <HackingTimeline />}
          {activeTab === 'transfers' && <TransferTimeline />}
        </main>
      </div>
    </div>
  );
}

