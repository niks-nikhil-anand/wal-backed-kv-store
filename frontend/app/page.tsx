'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [queryKey, setQueryKey] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const handleSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key || !value) return;

    try {
      // Attempt to parse the value as JSON; fall back to string if parsing fails
      let parsedValue;
      try {
        parsedValue = JSON.parse(value);
      } catch {
        parsedValue = value;
      }

      const res = await fetch('http://localhost:4000/api/kv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: parsedValue }),
      });
      const data = await res.json();
      if (res.ok) {
        addLog(`SUCCESS: Set key "${key}"`);
        toast.success(data.message || `Key "${key}" set`);
        setKey('');
        setValue('');
      } else {
        addLog(`ERROR: ${data.error}`);
        toast.error(data.error || 'Failed to set key');
      }
    } catch (err) {
      addLog(`ERROR: Failed to connect to backend`);
      toast.error('Failed to connect to backend');
    }
  };

  const handleGet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryKey) return;

    try {
      const res = await fetch(`http://localhost:4000/api/kv/${encodeURIComponent(queryKey)}`);
      const data = await res.json();
      if (res.ok) {
        setResult(JSON.stringify(data.value, null, 2));
        addLog(`SUCCESS: Retrieved key "${queryKey}"`);
        toast.success(`Retrieved "${queryKey}"`);
      } else {
        setResult(null);
        addLog(`ERROR: ${data.error}`);
        toast.error(data.error || 'Failed to retrieve key');
      }
    } catch (err) {
      addLog(`ERROR: Failed to connect to backend`);
      toast.error('Failed to connect to backend');
    }
  };

  return (
    <div className="min-h-[calc(100vh-9rem)] text-neutral-900 dark:text-neutral-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Write Section */}
          <section className="bg-white/60 dark:bg-neutral-800/50 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700/50 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-400">
              <span className="text-2xl">✍️</span> Write Data
            </h2>
            <form onSubmit={handleSet} className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-1">Key</label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="e.g., user:101"
                  className="w-full bg-white border border-neutral-300 dark:bg-neutral-900 dark:border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-1">Value (JSON/String)</label>
                <textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder='e.g., {"name": "Alice", "role": "admin"}'
                  rows={4}
                  className="w-full bg-white border border-neutral-300 dark:bg-neutral-900 dark:border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all font-mono text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
              >
                Set Key
              </button>
            </form>
          </section>

          {/* Read Section */}
          <section className="bg-white/60 dark:bg-neutral-800/50 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700/50 backdrop-blur-sm flex flex-col">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-emerald-400">
              <span className="text-2xl">🔍</span> Read Data
            </h2>
            <form onSubmit={handleGet} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-neutral-400 mb-1">Search Key</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={queryKey}
                    onChange={(e) => setQueryKey(e.target.value)}
                    placeholder="Enter key to retrieve..."
                    className="flex-1 bg-white border border-neutral-300 dark:bg-neutral-900 dark:border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20"
                  >
                    Get
                  </button>
                </div>
              </div>
            </form>

            <div className="flex-1 flex flex-col">
              <label className="block text-sm text-neutral-400 mb-1">Result</label>
              <div className="flex-1 bg-neutral-50 border border-neutral-200 dark:bg-neutral-950 dark:border-neutral-800 rounded-lg p-4 font-mono text-sm overflow-auto text-emerald-900 dark:text-emerald-100/90 shadow-inner">
                {result ? (
                  <pre>{result}</pre>
                ) : (
                  <span className="text-neutral-600 italic">No data fetched yet...</span>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Logs Section */}
        <section className="bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 h-48 overflow-hidden flex flex-col transition-colors duration-200">
          <h3 className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-3">Activity Log</h3>
          <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1.5 custom-scrollbar">
            {logs.length === 0 && <div className="text-neutral-500 dark:text-neutral-400">Waiting for interaction...</div>}
            {logs.map((log, i) => (
              <div
                key={i}
                className={`border-l-2 pl-3 ${log.includes('ERROR') ? 'border-red-500 dark:border-red-400' : 'border-neutral-200 dark:border-neutral-800'}`}
              >
                <span className={log.includes('ERROR') ? 'text-red-600 dark:text-red-400' : 'text-neutral-700 dark:text-neutral-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}