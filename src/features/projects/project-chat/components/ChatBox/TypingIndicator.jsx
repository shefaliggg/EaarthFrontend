export default function TypingIndicator({ typingUsers = [] }) {
  console.log("Typing users:", typingUsers);
if (!Array.isArray(typingUsers) || typingUsers.length === 0) {
  return null;
}


const displayText =
  typingUsers.length === 1
    ? "1 person is typing..."
    : `${typingUsers.length} people are typing...`;

  return (
    <div className="px-4 py-2 text-sm text-muted-foreground flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex gap-1 bg-muted p-3 rounded-xl">
        <span
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <span className="font-medium text-xs">{displayText}</span>
    </div>
  );
}