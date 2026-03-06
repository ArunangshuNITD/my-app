import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FaInbox } from "react-icons/fa";
import { getUserConversations } from "@/app/actions/messageAction"; 

// FIXED IMPORT: Successfully pulling in your new client wrapper
import MessagesClientLayout from "@/components/MessagesClientlayout";

export default async function MessagesLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  // Fetch the list of conversations for the sidebar
  const conversations = await getUserConversations(session.user.email);

  // Extract the sidebar content so we can pass it to the Client Component
  const sidebarContent = (
    <>
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <FaInbox className="text-indigo-500" /> Inbox
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            No messages yet.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {conversations.map((chat) => (
              <Link 
                href={`/messages/${chat.id}`} 
                key={chat.id}
                className="flex items-center gap-3 p-4 hover:bg-white dark:hover:bg-zinc-800 transition-colors block cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-200 flex-shrink-0">
                  <img 
                    src={chat.partnerImage || `https://ui-avatars.com/api/?name=${chat.partnerName}`} 
                    alt={chat.partnerName} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-zinc-900 dark:text-white text-sm truncate">
                      {chat.partnerName}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4 md:px-8">
      {/* Wrap everything in our new Client Component layout */}
      <MessagesClientLayout sidebar={sidebarContent}>
        {children}
      </MessagesClientLayout>
    </div>
  );
}