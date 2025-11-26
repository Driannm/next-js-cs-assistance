export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 mt-16">
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          CS Assistance - made to make your day easier 💗
        </p>

        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Built with ❤️ for someone special.
        </p>

        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
          © {new Date().getFullYear()} CS Assistance. All rights reserved.
        </p>
      </div>
    </footer>
  );
}