'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Database, Activity, Github, Settings } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-8">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <div className="bg-gradient-to-br from-blue-500 to-emerald-500 p-1 rounded-lg">
                            <Database className="h-5 w-5 text-white" />
                        </div>
                        <span className="hidden font-bold text-white sm:inline-block">ScaleDB</span>
                    </Link>
                    <div className="hidden md:flex gap-6 items-center text-sm font-medium text-neutral-400">
                        <Link href="/" className="hover:text-white transition-colors">Explorer</Link>
                        <Link href="#" className="hover:text-white transition-colors">Documentation</Link>
                        <Link href="#" className="hover:text-white transition-colors">API Reference</Link>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2 mr-4 px-3 py-1 bg-neutral-900 rounded-full border border-neutral-800">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs text-neutral-400 font-mono">System Operational</span>
                    </div>
                   <Link href={"https://github.com/niks-nikhil-anand/wal-backed-kv-store"}>
                   <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                        <Github className="h-4 w-4" />
                    </Button>
                   </Link>
                    
                </div>
            </div>
        </nav>
    );
}
