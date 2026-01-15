

import Link from 'next/link';
import { Database } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-neutral-200 bg-white  dark:border-neutral-800 dark:bg-neutral-950">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-6 max-w-screen-2xl">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-blue-500 to-emerald-500 p-1 rounded-lg">
                        <Database className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-neutral-900 dark:text-white">ScaleDB</span>
                </Link>

                <p className="text-center text-sm leading-loose text-neutral-600 dark:text-neutral-500 md:text-left">
                    Built by{" "}
                    <a
                        href="https://github.com/niks-nikhil-anand/wal-backed-kv-store"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4 text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                        aria-label="Nikhil's GitHub"
                    >
                        Nikhil
                    </a>
                    . The source code is available on{" "}
                    <a
                        href="https://github.com/niks-nikhil-anand/wal-backed-kv-store"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4 text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                        aria-label="Repository on GitHub"
                    >
                        GitHub
                    </a>
                    .
                </p>

                <p className="text-center text-sm text-neutral-600 dark:text-neutral-500 md:text-right">
                    <span className="font-medium text-neutral-700 dark:text-neutral-400">WAL-backed Key-Value Store</span>
                </p>
            </div>
        </footer>
    );
}
