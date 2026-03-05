import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserConversations } from "@/app/actions/messageAction";
import Link from "next/link";
import { FaInbox, FaUserCircle } from "react-icons/fa";

export default async function InboxPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const conversations = await getUserConversations();
  const myEmail = session.user.email;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FaInbox className="text-3xl text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Messages</h1>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {conversations.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              You have no active conversations yet.
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {conversations.map((conv) => {
                // Find the other person's details
                const otherPersonIndex = conv.participants.findIndex((e) => e !== myEmail);
                const otherName = conv.participantNames[otherPersonIndex];
                const otherImage = conv.participantImages[otherPersonIndex];

                return (
                  <Link
                    key={conv._id}
                    href={`/profile/messages/${conv._id}`}
                    className="flex items-center gap-4 p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    {otherImage ? (
                      <img src={otherImage} alt={otherName} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <FaUserCircle className="w-12 h-12 text-zinc-400" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-white truncate">
                          {otherName}
                        </h3>
                        <span className="text-xs text-zinc-500 whitespace-nowrap ml-4">
                          {new Date(conv.lastMessageAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}