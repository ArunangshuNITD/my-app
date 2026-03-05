import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMessages } from "@/app/actions/dashboard";
import ChatInterface from "@/components/ChatInterface";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default async function ChatPage({ params }) {
  const { conversationId } = await params;
  const session = await auth();
  
  if (!session?.user) redirect("/");

  const messages = await getMessages(conversationId);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link 
            href="/profile/messages" 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
          >
            <FaArrowLeft />
          </Link>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Conversation</h1>
        </div>

        <ChatInterface 
          initialMessages={messages} 
          conversationId={conversationId} 
          currentUserEmail={session.user.email} 
        />
      </div>
    </div>
  );
}