'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Play, CheckCircle, Code, Server, ArrowRight, Layers, ExternalLink } from 'lucide-react';

interface ToolDef {
  name: string;
  description: string;
  parameters: any;
}

export const McpHubView: React.FC = () => {
  const [mcpInfo, setMcpInfo] = useState<any>(null);
  const [selectedTool, setSelectedTool] = useState<string>('search_hive_mind');
  const [toolInput, setToolInput] = useState<string>('California SB 699 non-compete notice');
  const [toolOutput, setToolOutput] = useState<string>('');
  const [executing, setExecuting] = useState(false);

  const apiFetch = async (path: string, options?: RequestInit) => {
    try {
      const res = await fetch(path, options);
      if (res.ok) return res;
    } catch (err) {
      // Fallback
    }
    return await fetch(`http://127.0.0.1:8000${path}`, options);
  };

  useEffect(() => {
    apiFetch('/api/mcp/info')
      .then((res) => res.json())
      .then((data) => setMcpInfo(data))
      .catch((err) => console.error('Failed to load MCP info:', err));
  }, []);

  const handleExecuteTool = async () => {
    setExecuting(true);
    setToolOutput('');

    try {
      if (selectedTool === 'search_hive_mind') {
        const res = await apiFetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: toolInput, top_k: 2 })
        });
        const data = await res.json();
        setToolOutput(JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          result: {
            content: [
              {
                type: "text",
                text: `=== HeyCounsel Hive Mind Search: '${toolInput}' ===\n\nAI Overview: ${data.ai_synthesis}\n\nTop Precedents Found:\n` +
                  data.results.map((r: any) => `* [ID ${r.resource.id}] ${r.resource.title} (${r.resource.jurisdiction})\n  Confidence: ${Math.round(r.score * 100)}%\n  Snippet: "${r.highlight_snippet}"`).join('\n\n')
              }
            ]
          }
        }, null, 2));
      } else if (selectedTool === 'match_co_counsel') {
        const res = await apiFetch(`/api/lawyers?specialty=${encodeURIComponent(toolInput)}`);
        const data = await res.json();
        setToolOutput(JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          result: {
            content: [
              {
                type: "text",
                text: `=== Co-Counsel Matches for '${toolInput}' ===\n\n` +
                  data.map((l: any) => `* ${l.name} (${l.firm_name}) - ${l.location}\n  Specialties: ${l.specialties}\n  Rate: $${l.hourly_rate}/hr | Rating: ${l.rating}/5.0\n  Bar: ${l.bar_number}`).join('\n\n')
              }
            ]
          }
        }, null, 2));
      } else {
        const res = await apiFetch('/api/resources/1');
        const data = await res.json();
        setToolOutput(JSON.stringify({
          jsonrpc: "2.0",
          id: 3,
          result: {
            content: [
              {
                type: "text",
                text: `=== Precedent Template: ${data.title} ===\n\n${data.content}`
              }
            ]
          }
        }, null, 2));
      }
    } catch (err: any) {
      setToolOutput(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero explanation */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span>Model Context Protocol (MCP) Standard</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              HeyCounsel MCP Server & Agent Ecosystem
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We expose the <strong className="text-white">Hive Mind</strong> and <strong className="text-white">Co-Counsel Directory</strong> through the Model Context Protocol (MCP). This allows external AI assistants (Claude Desktop, Cursor, Copilot, or internal agents) to securely retrieve California legal precedents and match attorneys natively within the lawyer’s active drafting workflow.
            </p>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl text-xs space-y-2 font-mono text-slate-300 min-w-[280px]">
            <div className="text-cyan-400 font-bold uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span>Server Specification</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-slate-400">Protocol: <span className="text-white">2024-11-05 (MCP v2)</span></div>
            <div className="text-slate-400">Transport: <span className="text-white">stdio / streamable SSE</span></div>
            <div className="text-slate-400">Implementation: <span className="text-white">mcp-server (Python 3.13)</span></div>
            <div className="text-slate-400">Active Tools: <span className="text-emerald-400 font-bold">3 Exposed</span></div>
          </div>
        </div>
      </div>

      {/* Interactive Tool Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tool Selection & Input */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-600" />
              <span>Registered MCP Tools</span>
            </h3>
            <span className="text-xs text-slate-400">Inspect & Execute</span>
          </div>

          {/* Tools List */}
          <div className="space-y-2">
            {mcpInfo?.tools?.map((tool: ToolDef) => (
              <button
                key={tool.name}
                onClick={() => {
                  setSelectedTool(tool.name);
                  if (tool.name === 'search_hive_mind') setToolInput('California SB 699 non-compete notice');
                  else if (tool.name === 'match_co_counsel') setToolInput('Intellectual Property');
                  else setToolInput('1');
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedTool === tool.name
                    ? 'border-cyan-500 bg-cyan-50/60 ring-1 ring-cyan-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {tool.name}()
                  </span>
                  {selectedTool === tool.name && (
                    <span className="text-[10px] font-semibold bg-cyan-600 text-white px-2 py-0.5 rounded-md">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </button>
            ))}
          </div>

          {/* Tool Parameters Input */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              {selectedTool === 'search_hive_mind'
                ? 'Argument: query (string)'
                : selectedTool === 'match_co_counsel'
                ? 'Argument: practice_area (string)'
                : 'Argument: resource_id (integer)'}
            </label>
            <input
              type="text"
              value={toolInput}
              onChange={(e) => setToolInput(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />

            <button
              onClick={handleExecuteTool}
              disabled={executing}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>{executing ? 'Executing MCP Tool Call...' : `Invoke ${selectedTool}()`}</span>
            </button>
          </div>
        </div>

        {/* Right: Live JSON-RPC Payload Inspector */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-sm flex flex-col justify-between text-white font-mono">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <Code className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold">MCP JSON-RPC 2.0 Response Inspector</span>
              </div>
              <span className="text-[11px] text-slate-500">
                {toolOutput ? '200 OK' : 'Ready for invocation'}
              </span>
            </div>

            {toolOutput ? (
              <pre className="text-xs text-cyan-300 bg-slate-900 p-4 rounded-xl overflow-x-auto max-h-[380px] overflow-y-auto leading-relaxed border border-slate-800">
                {toolOutput}
              </pre>
            ) : (
              <div className="text-center py-16 text-slate-500 space-y-2">
                <Server className="w-8 h-8 mx-auto text-slate-600" />
                <div className="text-xs">Click &ldquo;Invoke {selectedTool}()&rdquo; to simulate an MCP tool invocation from an AI agent.</div>
              </div>
            )}
          </div>

          {/* Quick config tip */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Claude Desktop Config: <code className="text-slate-300">"command": "python", "args": ["backend/mcp_server.py"]</code></span>
            <span className="text-cyan-400">Zero Auth Token Required</span>
          </div>
        </div>
      </div>
    </div>
  );
};
