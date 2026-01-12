'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Database, Activity, Github, Settings, Linkedin } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 text-neutral-900 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-white/10 dark:bg-neutral-950/80 dark:text-white">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-8">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <div className="bg-gradient-to-br from-blue-500 to-emerald-500 p-1 rounded-lg">
                            <Database className="h-5 w-5 text-white" />
                        </div>
                        <span className="hidden font-bold text-neutral-900 dark:text-white sm:inline-block">ScaleDB</span>
                    </Link>
                    <div className="hidden md:flex gap-6 items-center text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Home</Link>
                        <Link href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Documentation</Link>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2 mr-4 px-3 py-1 bg-neutral-100 dark:bg-neutral-900 rounded-full border border-neutral-200 dark:border-neutral-800">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs text-neutral-700 dark:text-neutral-300 font-mono">System Operational</span>
                    </div>
                    <div className="flex items-center gap-2">                        <ThemeToggle />                        <a href="https://github.com/niks-nikhil-anand/wal-backed-kv-store" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
                        <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                            <Github className="h-4 w-4" />
                        </Button>
                    </a>
                        <a href="https://www.linkedin.com/in/nikhilanand86/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                            <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
