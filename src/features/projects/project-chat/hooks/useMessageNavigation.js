import { useCallback } from "react";
import useChatStore from "../store/chat.store";

export default function useMessageNavigation() {
  const jumpToMessage = useChatStore((s) => s.jumpToMessage);
  const selectedChat = useChatStore((s) => s.selectedChat);
  const setSelectedMessage = useChatStore((s) => s.setSelectedMessage);

  const scrollToMessage = useCallback(
    async (messageId) => {
      const element = document.getElementById(`message-${messageId}`);

      // ✅ already in DOM
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });

        setSelectedMessage(messageId);
        setTimeout(() => setSelectedMessage(null), 2000);

        return;
      }

      // 🔥 fetch context
      await jumpToMessage(selectedChat.id, messageId);

      // 🔥 wait for multiple frames to ensure DOM is ready and rendered
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(`message-${messageId}`);

          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });

            setSelectedMessage(messageId);
            setTimeout(() => setSelectedMessage(null), 4000);
          }
        });
      });
    },
    [selectedChat?.id, jumpToMessage, setSelectedMessage],
  );

  return { scrollToMessage };
}
