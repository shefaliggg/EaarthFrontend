export default function TypingIndicator({ typingUsers = [] }) {
  if (!Array.isArray(typingUsers) || typingUsers.length === 0) {
    return null;
  }

  const maxVisible = 3;
  const visibleUsers = typingUsers.slice(0, maxVisible);
  const extraCount = typingUsers.length - maxVisible;

  return (
    <div className="flex items-end gap-3 pr-4 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Stacked Avatars */}
      <div className="flex items-center">
        {visibleUsers.map((user, index) => (
          <div
            key={user.id || index}
            className={`
              w-8 h-8 rounded-full bg-muted border-2 border-background
              flex items-center justify-center text-xs font-medium
              -ml-2 first:ml-0
            `}
            style={{ zIndex: 10 - index }}
          >
            {user.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
        ))}

        {extraCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium -ml-2">
            +{extraCount}
          </div>
        )}
      </div>

      {/* Bubble */}
      <div className="bg-muted backdrop-blur-sm px-4 py-[11px] rounded-md rounded-tl-none shadow-sm">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150" />
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300" />
        </div>
      </div>
    </div>
  );
}
