'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Download, Bookmark, FileText, Scale, User, MapPin } from 'lucide-react';

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

interface DocumentModalProps {
  resource: Resource | null;
  onClose: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ resource, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!resource) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(resource.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-start justify-between border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {resource.practice_area}
              </span>
              <span className="text-xs text-slate-400">
                {resource.document_type}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {resource.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Contributor Card */}
          {resource.author && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold border border-amber-200">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Contributed by {resource.author.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {resource.author.firm_name} • {resource.author.bar_number}
                  </div>
                </div>
              </div>
              <div className="flex items-center text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span>{resource.author.location}</span>
              </div>
            </div>
          )}

          {/* Metadata badges */}
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 bg-amber-50/50 p-3 rounded-lg border border-amber-100">
            <div>
              <span className="font-semibold text-slate-700">Jurisdiction: </span>
              {resource.jurisdiction}
            </div>
            <div>
              <span className="font-semibold text-slate-700">Tags: </span>
              {resource.tags}
            </div>
          </div>

          {/* Document Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                <FileText className="w-4 h-4 mr-1.5 text-amber-500" />
                Precedent & Clause Text
              </h3>
              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Clause' : 'Copy Clause'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto border border-slate-800">
              {resource.content}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Downloaded <span className="font-semibold text-slate-700">{resource.downloads_count}</span> times by verified independent attorneys.
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied' : 'Copy to Clipboard'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
