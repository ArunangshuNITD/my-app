import { getMessages } from "@/app/actions/dashboard";

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Inbox</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden dark:bg-[#242526]">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-200 dark:bg-[#242526] dark:divide-zinc-700">
            {messages.map((msg) => (
              <tr key={msg._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-white">
                  {msg.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                  {msg.email}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs truncate">
                  {msg.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {messages.length === 0 && (
                <tr>
                    <td colSpan="4" className="text-center py-8 text-zinc-500">No messages found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}