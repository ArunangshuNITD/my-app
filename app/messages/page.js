import { FaCommentDots } from "react-icons/fa";

export default function MessagesIndexPage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-zinc-50/50 dark:bg-black/50 h-full">
      <div className="text-center">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCommentDots size={24} />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Your Messages</h3>
        <p className="text-sm text-zinc-500 mt-1 max-w-sm">
          Select a conversation from the sidebar to view your chat history or send a new message.
        </p>
      </div>
    </div>
  );
}