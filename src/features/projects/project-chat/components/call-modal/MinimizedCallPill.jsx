function MinimizedCallPill({ count, onRestore }) {
  return (
    <div
      onClick={onRestore}
      className="flex items-center justify-center gap-3 flex-1 text-white cursor-pointer px-3"
    >
      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-sm font-semibold text-green-400">
        {count}
      </div>
      <span className="text-xs text-zinc-400">Tap to expand</span>
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse ml-auto" />
    </div>
  );
}

export default MinimizedCallPill