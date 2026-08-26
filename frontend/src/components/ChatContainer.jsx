import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const selectedUser = useChatStore((state) => state.selectedUser);
  const messages = useChatStore((state) => state.messages);
  const isMessagesLoading = useChatStore((state) => state.isMessagesLoading);
  const getMessagesByUserId = useChatStore(
    (state) => state.getMessagesByUserId,
  );

  const authUser = useAuthStore((state) => state.authUser);

  const messageEndRef = useRef(null);

  // Get messages when selected user changes
  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessagesByUserId(selectedUser._id);
  }, [selectedUser?._id, getMessagesByUserId]);

  // Scroll to newest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (!selectedUser) {
    return null;
  }

  return (
    <>
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length === 0 ? (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {messages.map((msg) => {
              const isMine = msg.senderId === authUser?._id;

              return (
                <div
                  key={msg._id}
                  className={`chat ${isMine ? "chat-end" : "chat-start"}`}
                >
                  <div
                    className={`chat-bubble relative ${
                      isMine
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-800 text-slate-200"
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Shared"
                        loading="lazy"
                        className="rounded-lg max-h-48 w-auto object-cover"
                      />
                    )}

                    {msg.text && <p className="mt-2 break-words">{msg.text}</p>}

                    <p className="mt-1 flex items-center gap-1 text-xs opacity-75">
                      {new Date(msg.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>
              );
            })}

            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;
