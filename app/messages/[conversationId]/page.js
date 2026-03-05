import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChatInterface from "@/components/ChatInterface"; // Adjust this path if needed
// FIXED: Import the actual function name from your actions file
import { getMessages } from "@/app/actions/messageAction"; 

export default async function ActiveChatPage({ params }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const { conversationId } = await params; 

  // FIXED: Call the correct function
  const initialMessages = await getMessages(conversationId);

  return (
    <div className="h-full w-full flex flex-col">
      <ChatInterface 
        initialMessages={initialMessages} 
        conversationId={conversationId} 
        currentUserEmail={session.user.email} 
      />
    </div>
  );
}