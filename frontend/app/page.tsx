'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { HiveMindView } from '../components/HiveMindView';
import { CoCounselMatcher } from '../components/CoCounselMatcher';
import { McpHubView } from '../components/McpHubView';
import { ContributeModal } from '../components/ContributeModal';
import { Scale, Heart } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'hive-mind' | 'co-counsel' | 'mcp'>('hive-mind');
  const [isContributeOpen, setIsContributeOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenContribute={() => setIsContributeOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'hive-mind' && <HiveMindView />}
        {activeTab === 'co-counsel' && <CoCounselMatcher />}
        {activeTab === 'mcp' && <McpHubView />}
      </main>

      {/* Contribute Knowledge Modal */}
      <ContributeModal
        isOpen={isContributeOpen}
        onClose={() => setIsContributeOpen(false)}
        onCreated={() => {
          // If in hive mind view, trigger refresh
          if (activeTab === 'hive-mind') {
            window.location.reload();
          }
        }}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="text-white font-semibold">HeyCounsel Platform Demo</span>
            <span>—</span>
            <span>Built for San Diego Independent Lawyers & Law Firms</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span>Stack: <strong className="text-slate-200">FastAPI • SQLAlchemy • Next.js • TypeScript • MCP</strong></span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">100% Free / Local</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
