'use client';

import React, { useState } from 'react';
import { Database, Zap, Shield, Code, Copy, Check, ChevronRight, BookOpen, Rocket, Layers } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const copyToClipboard = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
        <div className="relative group">
            <div className="absolute top-3 right-3 z-10">
                <button
                    onClick={() => copyToClipboard(code, id)}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all duration-200 border border-neutral-700"
                    aria-label="Copy code"
                >
                    {copiedCode === id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
            </div>
            <pre className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 overflow-x-auto">
                <code className="text-sm font-mono text-neutral-100">{code}</code>
            </pre>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50/30 to-emerald-50/30 dark:from-neutral-950 dark:via-blue-950/20 dark:to-emerald-950/20">
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-emerald-500/5"></div>
                <div className="relative max-w-7xl mx-auto px-8 py-20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-gradient-to-br from-blue-500 to-emerald-500 p-3 rounded-xl">
                            <BookOpen className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            Documentation
                        </h1>
                    </div>
                    <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl">
                        Complete guide to ScaleDB - A high-performance, WAL-backed key-value store with crash recovery and durability guarantees.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="flex gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <nav className="sticky top-20 space-y-1 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
                            <h3 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">On This Page</h3>
                            {[
                                { id: 'overview', label: 'Overview' },
                                { id: 'features', label: 'Key Features' },
                                { id: 'getting-started', label: 'Getting Started' },
                                { id: 'api-reference', label: 'API Reference' },
                                { id: 'architecture', label: 'Architecture' },
                                { id: 'examples', label: 'Examples' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="w-full text-left px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-200 flex items-center gap-2"
                                >
                                    <ChevronRight className="h-3 w-3" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 space-y-16">
                        {/* Overview Section */}
                        <section id="overview" className="scroll-mt-20">
                            <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-3">
                                    <Database className="h-8 w-8 text-blue-500" />
                                    Overview
                                </h2>
                                <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                                    ScaleDB is a production-ready key-value storage engine that demonstrates core database internals used in modern distributed systems.
                                    It combines in-memory performance with disk-based durability through Write-Ahead Logging (WAL).
                                </p>
                                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">What is ScaleDB?</h3>
                                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                        ScaleDB is an educational yet functional key-value store that implements fundamental concepts found in databases like PostgreSQL,
                                        Redis, and distributed systems like Cassandra. It provides fast in-memory reads, append-only disk persistence, and automatic crash
                                        recovery through log replay.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Key Features Section */}
                        <section id="features" className="scroll-mt-20">
                            <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Key Features</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        {
                                            icon: <Zap className="h-6 w-6" />,
                                            title: 'Lightning Fast',
                                            description: 'In-memory data structure for microsecond-level read and write operations.',
                                            gradient: 'from-yellow-500 to-orange-500',
                                        },
                                        {
                                            icon: <Layers className="h-6 w-6" />,
                                            title: 'Dual Data Structures',
                                            description: 'Support for both standard Key-Value pairs and FIFO Queues for message processing.',
                                            gradient: 'from-indigo-500 to-purple-500',
                                        },
                                        {
                                            icon: <Shield className="h-6 w-6" />,
                                            title: 'Crash Recovery',
                                            description: 'Automatic state reconstruction through Write-Ahead Log replay on restart.',
                                            gradient: 'from-blue-500 to-cyan-500',
                                        },
                                        {
                                            icon: <Database className="h-6 w-6" />,
                                            title: 'Durable Storage',
                                            description: 'Append-only WAL ensures data persistence and protection against partial failures.',
                                            gradient: 'from-purple-500 to-pink-500',
                                        },
                                        {
                                            icon: <Copy className="h-6 w-6" />,
                                            title: 'ROM Persistence',
                                            description: 'Atomic snapshots (db.json) for fast recovery and reduced log replay time.',
                                            gradient: 'from-pink-500 to-rose-500',
                                        },
                                        {
                                            icon: <Code className="h-6 w-6" />,
                                            title: 'Full REST API',
                                            description: 'Simple HTTP interface for all KV and Queue operations with JSON support.',
                                            gradient: 'from-emerald-500 to-teal-500',
                                        },
                                    ].map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className="group relative bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300"
                                        >
                                            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.gradient} mb-4`}>
                                                <div className="text-white">{feature.icon}</div>
                                            </div>
                                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">{feature.title}</h3>
                                            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Getting Started Section */}
                        <section id="getting-started" className="scroll-mt-20">
                            <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
                                    <Rocket className="h-8 w-8 text-emerald-500" />
                                    Getting Started
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">Installation</h3>
                                        <p className="text-neutral-700 dark:text-neutral-300 mb-4">Clone the repository and install dependencies:</p>
                                        <CodeBlock
                                            id="install"
                                            language="bash"
                                            code={`git clone https://github.com/niks-nikhil-anand/wal-backed-kv-store.git
cd wal-backed-kv-store

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install`}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">Running the Application</h3>
                                        <p className="text-neutral-700 dark:text-neutral-300 mb-4">Start both backend and frontend servers:</p>
                                        <CodeBlock
                                            id="run"
                                            language="bash"
                                            code={`# Terminal 1 - Start backend (port 4000)
cd backend
npm run dev

# Terminal 2 - Start frontend (port 3000)
cd frontend
npm run dev`}
                                        />
                                    </div>

                                    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
                                        <p className="text-emerald-900 dark:text-emerald-100">
                                            <strong>✓ Ready!</strong> Open <code className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 rounded">http://localhost:3000</code> in your browser.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* API Reference Section */}
                        <section id="api-reference" className="scroll-mt-20">
                            <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
                                    <Code className="h-8 w-8 text-purple-500" />
                                    API Reference
                                </h2>

                                <div className="space-y-12">
                                    {/* KV Store API */}
                                    <div>
                                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                                            Key-Value Store
                                        </h3>
                                        <div className="space-y-8">
                                            {/* Get All */}
                                            <div className="border-l-4 border-purple-500 pl-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-md">GET</span>
                                                    <code className="text-lg font-mono text-neutral-900 dark:text-white">/api/kv</code>
                                                </div>
                                                <p className="text-neutral-700 dark:text-neutral-300 mb-4">Retrieve all key-value pairs.</p>
                                            </div>

                                            {/* Set Key */}
                                            <div className="border-l-4 border-blue-500 pl-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-md">POST</span>
                                                    <code className="text-lg font-mono text-neutral-900 dark:text-white">/api/kv</code>
                                                </div>
                                                <p className="text-neutral-700 dark:text-neutral-300 mb-4">Create or update a key-value pair.</p>
                                                <div className="space-y-3">
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Request Body:</h4>
                                                        <CodeBlock
                                                            id="post-request"
                                                            language="json"
                                                            code={`{
  "key": "user:101",
  "value": { "name": "Alice", "role": "admin" }
}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Get Key */}
                                            <div className="border-l-4 border-emerald-500 pl-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-md">GET</span>
                                                    <code className="text-lg font-mono text-neutral-900 dark:text-white">/api/kv/:key</code>
                                                </div>
                                                <p className="text-neutral-700 dark:text-neutral-300 mb-4">Retrieve the value for a specific key.</p>
                                            </div>

                                            {/* Delete Key */}
                                            <div className="border-l-4 border-red-500 pl-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-md">DELETE</span>
                                                    <code className="text-lg font-mono text-neutral-900 dark:text-white">/api/kv/:key</code>
                                                </div>
                                                <p className="text-neutral-700 dark:text-neutral-300 mb-4">Delete a key-value pair.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Queue API */}
                                    <div>
                                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                                            Message Queues
                                        </h3>
                                        <div className="space-y-8">
                                            {/* List Queues */}
                                            <div className="border-l-4 border-purple-500 pl-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-md">GET</span>
                                                    <code className="text-lg font-mono text-neutral-900 dark:text-white">/api/queue</code>
                                                </div>
                                                <p className="text-neutral-700 dark:text-neutral-300 mb-4">List all active queues.</p>
                                            </div>

                                            {/* Enqueue */}
                                            <div className="border-l-4 border-blue-500 pl-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-md">POST</span>
                                                    <code className="text-lg font-mono text-neutral-900 dark:text-white">/api/queue/:name/enqueue</code>
                                                </div>
                                                <p className="text-neutral-700 dark:text-neutral-300 mb-4">Add an item to the end of a queue.</p>
                                                <div className="space-y-3">
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Request Body:</h4>
                                                        <CodeBlock
                                                            id="enqueue-request"
                                                            language="json"
                                                            code={`{
  "value": { "eventId": "evt_123", "type": "signup" }
}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dequeue */}
                                            <div className="border-l-4 border-orange-500 pl-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-md">POST</span>
                                                    <code className="text-lg font-mono text-neutral-900 dark:text-white">/api/queue/:name/dequeue</code>
                                                </div>
                                                <p className="text-neutral-700 dark:text-neutral-300 mb-4">Remove and return the first item from a queue.</p>
                                            </div>

                                            {/* Peek */}
                                            <div className="border-l-4 border-emerald-500 pl-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-md">GET</span>
                                                    <code className="text-lg font-mono text-neutral-900 dark:text-white">/api/queue/:name/peek</code>
                                                </div>
                                                <p className="text-neutral-700 dark:text-neutral-300 mb-4">View the first item without removing it.</p>
                                            </div>

                                            {/* Queue Size */}
                                            <div className="border-l-4 border-cyan-500 pl-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-md">GET</span>
                                                    <code className="text-lg font-mono text-neutral-900 dark:text-white">/api/queue/:name/size</code>
                                                </div>
                                                <p className="text-neutral-700 dark:text-neutral-300 mb-4">Get the number of items in a queue.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Architecture Section */}
                        <section id="architecture" className="scroll-mt-20">
                            <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
                                    <Layers className="h-8 w-8 text-cyan-500" />
                                    How It Works & Architecture
                                </h2>

                                <div className="space-y-8">
                                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                        ScaleDB implements a layered architecture that mimics production database internals. It separates the API layer,
                                        in-memory storage engine, and on-disk persistence layer to ensure high performance and durability.
                                    </p>

                                    {/* Core Concepts Grid */}
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-xl p-5">
                                            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Write-Ahead Log (WAL)</h3>
                                            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                                                Every write operation is logged to an append-only file <strong>before</strong> it interacts with the in-memory store.
                                                This ensures that even if the process crashes, the data exists on disk.
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 rounded-xl p-5">
                                            <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-2">ROM Persistence</h3>
                                            <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
                                                Periodic snapshots of the entire database state are saved to <code>db.json</code>. This enables faster recovery
                                                by loading the snapshot first and only replaying logs since the last checkpoint.
                                            </p>
                                        </div>
                                        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-xl p-5">
                                            <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-2">Crash Recovery</h3>
                                            <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">
                                                On startup, the system loads the ROM snapshot and then replays valid transactions from the WAL to reconstruct
                                                the exact state of the database before the crash.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 font-mono text-sm overflow-x-auto">
                                        <pre className="text-neutral-700 dark:text-neutral-300">
                                            {`┌─────────────────────────────────────┐
│   Client (Browser / API Client)    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      HTTP API (Express.js)          │
│  • POST /api/kv                     │
│  • POST /api/queue/:name/enqueue    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   In-Memory Store (RAM)             │
│  • KV Map: { key: value }           │
│  • Queues: { name: [item1, ...] }   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐      ┌─────────────────────────┐
│   Write-Ahead Log (wal.log)         │      │   ROM Snapshot (db.json)│
│  • Append-only persistence          │ <──> │  • Periodic Full Save   │
│  • Replay on crash                  │      │  • Quick Loader         │
└─────────────────────────────────────┘      └─────────────────────────┘`}
                                        </pre>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
                                            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs">1</span>
                                                Write Flow
                                            </h3>
                                            <ol className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                                                <li className="flex gap-2">
                                                    <span className="font-mono text-blue-600 dark:text-blue-400">WAL:</span>
                                                    Log operation with <span className="bg-neutral-100 dark:bg-neutral-700 px-1 rounded">STARTED</span> status.
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="font-mono text-blue-600 dark:text-blue-400">RAM:</span>
                                                    Update the in-memory data structures (Map or Array).
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="font-mono text-blue-600 dark:text-blue-400">ROM:</span>
                                                    Async task periodically saves full state to disk.
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="font-mono text-blue-600 dark:text-blue-400">WAL:</span>
                                                    Mark operation as <span className="bg-neutral-100 dark:bg-neutral-700 px-1 rounded">COMMITTED</span>.
                                                </li>
                                            </ol>
                                        </div>

                                        <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
                                            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-xs">2</span>
                                                Recovery Flow
                                            </h3>
                                            <ol className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                                                <li className="flex gap-2">
                                                    <span className="font-mono text-emerald-600 dark:text-emerald-400">LOAD:</span>
                                                    Read latest snapshot from <code>db.json</code> into RAM.
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="font-mono text-emerald-600 dark:text-emerald-400">SCAN:</span>
                                                    Read <code>wal.log</code> line-by-line.
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="font-mono text-emerald-600 dark:text-emerald-400">FILTER:</span>
                                                    Identify transactions not present in the snapshot.
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="font-mono text-emerald-600 dark:text-emerald-400">REPLAY:</span>
                                                    Execute valid uncommitted operations to restore state.
                                                </li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Examples Section */}
                        <section id="examples" className="scroll-mt-20">
                            <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Usage Examples</h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">JavaScript/Node.js</h3>
                                        <CodeBlock
                                            id="js-example"
                                            language="javascript"
                                            code={`// Set a key
const response = await fetch('http://localhost:4000/api/kv', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    key: 'session:abc123',
    value: { userId: 42, expires: '2026-01-13' }
  })
});

// Get a key
const data = await fetch('http://localhost:4000/api/kv/session:abc123')
  .then(res => res.json());
console.log(data.value); // { userId: 42, expires: '2026-01-13' }

// Delete a key
await fetch('http://localhost:4000/api/kv/session:abc123', {
  method: 'DELETE'
});`}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">Python</h3>
                                        <CodeBlock
                                            id="python-example"
                                            language="python"
                                            code={`import requests

# Set a key
response = requests.post('http://localhost:4000/api/kv', json={
    'key': 'config:app',
    'value': {'theme': 'dark', 'lang': 'en'}
})

# Get a key
response = requests.get('http://localhost:4000/api/kv/config:app')
data = response.json()
print(data['value'])  # {'theme': 'dark', 'lang': 'en'}

# Delete a key
requests.delete('http://localhost:4000/api/kv/config:app')`}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">cURL</h3>
                                        <CodeBlock
                                            id="curl-example"
                                            language="bash"
                                            code={`# Set a key
curl -X POST http://localhost:4000/api/kv \\
  -H "Content-Type: application/json" \\
  -d '{"key": "product:123", "value": {"name": "Laptop", "price": 999}}'

# Get a key
curl http://localhost:4000/api/kv/product:123

# Update a key
curl -X PUT http://localhost:4000/api/kv/product:123 \\
  -H "Content-Type: application/json" \\
  -d '{"value": {"name": "Laptop", "price": 899}}'

# Delete a key
curl -X DELETE http://localhost:4000/api/kv/product:123

# Get all keys
curl http://localhost:4000/api/kv`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Back to Home */}
                        <div className="flex justify-center pt-8">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                <Database className="h-5 w-5" />
                                Try ScaleDB Now
                            </Link>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
