'use client';

import React, { useState, useEffect } from 'react';
import { Search, Brain, Sparkles, FileText, ArrowRight, ThumbsUp, Download, CheckCircle, Tag, Filter } from 'lucide-react';
import { DocumentModal } from './DocumentModal';

interface Resource {
  id: number;
  title: string;
  practice_area: string;
  document_type: string;
  summary: string;
  content: string;
  jurisdiction: string;
  tags: string;
  downloads_count: number;
  upvotes: number;
  author?: {
    name: string;
    firm_name: string;
    location: string;
    bar_number: string;
  };
}

interface SearchResultItem {
  resource: Resource;
  score: number;
  relevance_reason: string;
  highlight_snippet: string;
}

export const HiveMindView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [aiSynthesis, setAiSynthesis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [activeModalDoc, setActiveModalDoc] = useState<Resource | null>(null);

  const practiceAreas = [
    'All',
    'Employment Law',
    'Civil Litigation',
    'Intellectual Property',
    'Corporate & Venture Capital',
    'Privacy & Cybersecurity'
  ];

  const apiFetch = async (path: string, options?: RequestInit) => {
    try {
      const res = await fetch(path, options);
      if (res.ok) return res;
    } catch (err) {
      // Fallback if Next.js rewrite is not active yet
    }
    return await fetch(`http://127.0.0.1:8000${path}`, options);
  };

  // Fetch initial resources
  const fetchAllResources = async (area = 'All') => {
    setLoading(true);
    try {
      const url = area === 'All'
        ? '/api/resources'
        : `/api/resources?practice_area=${encodeURIComponent(area)}`;
      const res = await apiFetch(url);
      if (res.ok) {
        const data = await res.json();
        setResources(data);
        setSearchResults([]);
        setAiSynthesis('');
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!query) {
      fetchAllResources(selectedArea);
    }
  }, [selectedArea]);

  // Execute AI semantic search
  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const targetQuery = customQuery !== undefined ? customQuery : query;
    if (!targetQuery.trim()) {
      fetchAllResources(selectedArea);
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: targetQuery,
          practice_area: selectedArea === 'All' ? null : selectedArea,
          top_k: 5
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results);
        setAiSynthesis(data.ai_synthesis);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (chipQuery: string) => {
    setQuery(chipQuery);
    handleSearch(undefined, chipQuery);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
            <Brain className="w-3.5 h-3.5" />
            <span>HeyCounsel Collective Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            The Hive Mind
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Search peer-reviewed California legal templates, litigation checklists, local San Diego court procedures, and battle-tested contract clauses contributed by top independent practitioners.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="pt-2 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a legal question or search: 'California non-compete notice' or 'San Diego CMC rules'..."
                className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Search Hive'}</span>
            </button>
          </form>

          {/* Suggested Queries */}
          <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="text-slate-500">Popular Queries:</span>
            <button
              type="button"
              onClick={() => handleChipClick('California SB 699 non-compete notice')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            >
              SB 699 Non-Compete Notice
            </button>
            <button
              type="button"
              onClick={() => handleChipClick('San Diego fast track case management')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            >
              San Diego Fast Track CMC
            </button>
            <button
              type="button"
              onClick={() => handleChipClick('AI training data customer IP indemnity')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            >
              AI Vendor IP Indemnity Rider
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span className="text-slate-500 font-semibold uppercase mr-1">Filter Domain:</span>
        {practiceAreas.map((area) => (
          <button
            key={area}
            onClick={() => setSelectedArea(area)}
            className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
              selectedArea === area
                ? 'bg-slate-900 text-amber-300 shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {area}
          </button>
        ))}
      </div>

      {/* AI Synthesis Box (When Search has results) */}
      {aiSynthesis && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-l-4 border-amber-500 bg-white p-5 rounded-r-xl shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Hive Mind AI Synthesis</span>
          </div>
          <div className="text-sm text-slate-800 leading-relaxed font-sans">
            {aiSynthesis}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="text-sm font-semibold text-slate-700">
          {searchResults.length > 0
            ? `Semantic Search Matches (${searchResults.length})`
            : `Vetted Hive Mind Resources (${resources.length})`}
        </div>
        {searchResults.length > 0 && (
          <button
            onClick={() => {
              setQuery('');
              setSearchResults([]);
              setAiSynthesis('');
              fetchAllResources(selectedArea);
            }}
            className="text-xs text-amber-600 hover:text-amber-700 font-medium underline"
          >
            Clear Search & Show All
          </button>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Render Search Results */}
        {searchResults.length > 0 ? (
          searchResults.map((item) => (
            <div
              key={item.resource.id}
              className="bg-white rounded-xl p-5 border border-slate-200 hover:border-amber-400/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      {item.resource.practice_area}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                      {item.resource.document_type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{Math.round(item.score * 100)}% match</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base hover:text-amber-600 transition-colors cursor-pointer" onClick={() => setActiveModalDoc(item.resource)}>
                    {item.resource.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.resource.summary}
                  </p>
                </div>

                {/* Highlight Snippet */}
                {item.highlight_snippet && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs font-mono text-slate-700 leading-relaxed">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                      Matched Excerpt:
                    </span>
                    &ldquo;{item.highlight_snippet}&rdquo;
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-700">
                    {item.resource.author?.name || 'Verified Member'}
                  </span>
                  <span>•</span>
                  <span>{item.resource.jurisdiction}</span>
                </div>
                <button
                  onClick={() => setActiveModalDoc(item.resource)}
                  className="inline-flex items-center space-x-1 font-semibold text-amber-600 hover:text-amber-700"
                >
                  <span>View Precedent</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : resources.length > 0 ? (
          resources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                      {res.practice_area}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 text-slate-500 border border-slate-100">
                      {res.document_type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {res.jurisdiction}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base hover:text-amber-600 transition-colors cursor-pointer" onClick={() => setActiveModalDoc(res)}>
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {res.summary}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>{res.tags}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>{res.downloads_count}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-amber-500" />
                    <span>{res.upvotes}</span>
                  </span>
                  <span className="font-medium text-slate-600">
                    {res.author?.name}
                  </span>
                </div>
                <button
                  onClick={() => setActiveModalDoc(res)}
                  className="inline-flex items-center space-x-1 font-semibold text-slate-800 hover:text-amber-600"
                >
                  <span>Open Precedent</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <FileText className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <div className="text-sm font-semibold text-slate-700">No resources found</div>
            <div className="text-xs text-slate-400 mt-1">Try another search or filter.</div>
          </div>
        )}
      </div>

      {/* Document Inspector Modal */}
      <DocumentModal
        resource={activeModalDoc}
        onClose={() => setActiveModalDoc(null)}
      />
    </div>
  );
};
