import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { LoaderIcon } from "lucide-react";

function ChatContainer() {
  const selectedUser = useChatStore((state) => state.selectedUser);
  const messages = useChatStore((state) => state.messages);
  const isMessagesLoading = useChatStore((state) => state.isMessagesLoading);
  const getMessagesByUserId = useChatStore(
    (state) => state.getMessagesByUserId,
  );

  const { subscribeToMessages, unsubscribeFromMessages } = useChatStore();

  const authUser = useAuthStore((state) => state.authUser);

  const messageEndRef = useRef(null);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date)
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace("AM", "A.M.")
      .replace("PM", "P.M.");
  };

  const isSameDay = (date1, date2) => {
    const first = new Date(date1);
    const second = new Date(date2);

    return (
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate()
    );
  };

  // Get messages when selected user changes
  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  // Scroll to newest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {}, []);

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
            {messages.map((msg, index) => {
              const previousMessage = messages[index - 1];

              const showDate =
                !previousMessage ||
                !isSameDay(msg.createdAt, previousMessage.createdAt);

              const isMine = msg.senderId === authUser?._id;

              return (
                <div key={msg._id}>
                  {/* DATE SEPARATOR */}
                  {showDate && (
                    <div className="text-center text-xs text-slate-500 my-6">
                      {formatDate(msg.createdAt)}
                    </div>
                  )}

                  {/* MESSAGE */}
                  <div className={`chat ${isMine ? "chat-end" : "chat-start"}`}>
                    <div
                      className={`chat-bubble ${
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

                      {msg.text && <p className="break-words">{msg.text}</p>}

                      {/* TIME INSIDE BUBBLE */}
                      <div className="flex justify-end items-center gap-1 mt-1 text-xs opacity-70">
                        <span>{formatTime(msg.createdAt)}</span>

                        {isMine && msg.status === "sending" && (
                          <span className="flex items-center gap-1">
                            <LoaderIcon className="w-3 h-3 animate-spin" />
                          </span>
                        )}

                        {isMine && msg.status === "sent" && <span>✓</span>}
                      </div>
                    </div>
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
