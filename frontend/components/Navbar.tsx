'use client';

import React from 'react';
import { Scale, Brain, Users, Terminal, PlusCircle, MapPin } from 'lucide-react';

interface NavbarProps {
  activeTab: 'hive-mind' | 'co-counsel' | 'mcp';
  setActiveTab: (tab: 'hive-mind' | 'co-counsel' | 'mcp') => void;
  onOpenContribute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenContribute
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-md">
              <Scale className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  HeyCounsel
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Platform
                </span>
              </div>
              <div className="flex items-center text-xs text-slate-400 space-x-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>San Diego, CA HQ</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400">Independent Lawyers Network</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('hive-mind')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeTab === 'hive-mind'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>The Hive Mind</span>
            </button>

            <button
              onClick={() => setActiveTab('co-counsel')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeTab === 'co-counsel'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Co-Counsel Matcher</span>
            </button>

            <button
              onClick={() => setActiveTab('mcp')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeTab === 'mcp'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>MCP Protocol Hub</span>
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenContribute}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Contribute to Hive</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
