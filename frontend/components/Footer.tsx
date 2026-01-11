

export function Footer() {
    return (
        <footer className="border-t border-neutral-800 bg-neutral-950 pb-5">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-6 max-w-screen-2xl">
                <p className="text-center text-sm leading-loose text-neutral-500 md:text-left">
                    Built by{" "}
                    <a
                        href="https://github.com/niks-nikhil-anand/wal-backed-kv-store"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4 text-neutral-400 hover:text-white"
                        aria-label="Nikhil's GitHub"
                    >
                        Nikhil
                    </a>
                    . The source code is available on{" "}
                    <a
                        href="https://github.com/niks-nikhil-anand/wal-backed-kv-store"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4 text-neutral-400 hover:text-white"
                        aria-label="Repository on GitHub"
                    >
                        GitHub
                    </a>
                    .
                </p>

                <p className="text-center text-sm text-neutral-500 md:text-right">
                    <span className="font-medium text-neutral-400">WAL-backed Key-Value Store</span>
                </p>
            </div>
        </footer>
    );
}
