import { getMentorById, updateMentor } from "@/app/actions/getMentors";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default async function EditMentorPage({ params }) {
    const { id } = await params;
    const mentor = await getMentorById(id);
    const session = await auth();

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "arunangshud3@gmail.com"; 
    const isOwner = session?.user?.email === mentor?.email;
    const isAdmin = session?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    if (!mentor || !session || (!isOwner && !isAdmin)) {
        redirect("/mentors");
    }

    return (
        <div className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black lg:px-8">
            <div className="mx-auto max-w-2xl">
                <Link href={`/mentors/${id}`} className="mb-6 inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                    <FaArrowLeft /> Cancel & Go Back
                </Link>

                <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                    <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
                        {isAdmin ? `Editing: ${mentor.name}` : "Edit Your Profile"}
                    </h1>

                    <form action={updateMentor} className="space-y-6">
                        {/* Now mentor._id is a plain string from our Server Action */}
                        <input type="hidden" name="id" value={mentor._id} />

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Profile Image</label>
                            <div className="mt-2 flex items-center gap-x-6">
                                <div className="relative h-20 w-20 overflow-hidden rounded-full ring-1 ring-zinc-200">
                                    <img 
                                        src={mentor.image || "/default-avatar.png"} 
                                        alt="Current Profile" 
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input 
                                        name="image" 
                                        type="file" 
                                        accept="image/*"
                                        className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:text-zinc-400 dark:file:bg-zinc-800 dark:file:text-zinc-200"
                                    />
                                    <p className="mt-2 text-xs text-zinc-500">Upload a new file to replace the current photo.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
                            <input name="name" defaultValue={mentor.name} required className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-zinc-900 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-indigo-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Expertise</label>
                            <select name="domain" defaultValue={mentor.domain} className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-zinc-900 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-indigo-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700">
                                {["JEE", "NEET", "UPSC", "CAT", "GATE", "SSC"].map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Organization</label>
                            <input name="organization" defaultValue={mentor.organization} className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-zinc-900 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-indigo-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Bio</label>
                            <textarea name="bio" defaultValue={mentor.bio} rows={5} className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-zinc-900 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-indigo-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">LinkedIn</label>
                            <input name="linkedin" defaultValue={mentor.linkedin} className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-zinc-900 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-indigo-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700" />
                        </div>

                        <button type="submit" className="w-full rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition">
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}