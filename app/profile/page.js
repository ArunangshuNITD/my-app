import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Mentor from "@/models/Mentor"; 
import { getIncomingBookings, getStudentBookings, getMentorBookingHistory } from "@/app/actions/bookingActions";
import BookingManager from "@/components/BookingManager"; 
import StudentBookingList from "@/components/StudentBookingList"; 
import Link from "next/link";
import { 
  FaEnvelope, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaGraduationCap, 
  FaChalkboardTeacher, 
  FaArrowRight,
  FaUserEdit,
  FaExternalLinkAlt,
  FaCalendarCheck,
  FaHistory,
  FaVideo
} from "react-icons/fa";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  await dbConnect();
  const mentorProfile = await Mentor.findOne({ email: session.user.email });
  const isApprovedMentor = mentorProfile?.applicationStatus === "approved";

  // --- DATA FETCHING ---
  let pendingIncomingBookings = []; 
  let historyIncomingBookings = []; 
  let studentHistory = [];          

  if (isApprovedMentor) {
    // 1. Get Incoming Requests (For Me as a Mentor)
    pendingIncomingBookings = await getIncomingBookings(session.user.email);
    historyIncomingBookings = await getMentorBookingHistory(session.user.email);
  }
  
  // 2. ALWAYS fetch outgoing requests (For Me as a Student/User)
  studentHistory = await getStudentBookings(session.user.email);

  // Filter confirmed sessions for the Mentor to "Join"
  const mentorActiveSessions = isApprovedMentor 
    ? historyIncomingBookings.filter(b => b.status === "confirmed" || b.status === "ongoing")
    : [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">My Profile</h1>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          
          <div className={`h-32 bg-gradient-to-r ${isApprovedMentor ? "from-purple-600 to-indigo-600" : "from-blue-600 to-cyan-600"}`}></div>

          <div className="px-8 pb-8">
            {/* Avatar Section */}
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden bg-zinc-200 shadow-md">
                <img 
                  src={session.user.image || "/default-avatar.png"} 
                  alt={session.user.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  {session.user.name}
                  {isApprovedMentor ? (
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full border border-purple-200 flex items-center gap-1">
                       <FaChalkboardTeacher /> Verified Mentor
                    </span>
                  ) : (
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200 flex items-center gap-1">
                       <FaGraduationCap /> Student
                    </span>
                  )}
                </h2>
                <p className="text-zinc-500 flex items-center gap-2 mt-1">
                  <FaEnvelope className="text-zinc-400" /> {session.user.email}
                </p>
              </div>

              <hr className="border-zinc-100 dark:border-zinc-800" />

              {/* MENTOR VIEW */}
              {isApprovedMentor ? (
                <div className="pt-2 space-y-8">
                  {/* Dashboard Header */}
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                       <FaChalkboardTeacher className="text-purple-500" /> Mentor Dashboard
                    </h3>
                    <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-xl border border-purple-100 dark:border-purple-800 flex items-start gap-4">
                      <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-lg text-purple-600 dark:text-purple-200">
                        <FaCheckCircle size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-purple-900 dark:text-purple-200 mb-1">
                          Profile Active
                        </h4>
                        <div className="flex flex-wrap gap-3 mt-3">
                          <Link href={`/mentors/${mentorProfile._id}`} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                              View Public Profile <FaExternalLinkAlt size={12} />
                          </Link>
                          <Link href={`/mentors/${mentorProfile._id}/edit`} className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-white border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                              Edit Profile <FaUserEdit size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* NEW: Mentor's Active/Upcoming Classes (Join Button Here) */}
                  {mentorActiveSessions.length > 0 && (
                    <div className="pt-4">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                        <FaVideo className="text-rose-500" /> Your Teaching Schedule
                      </h3>
                      <StudentBookingList bookings={mentorActiveSessions} />
                    </div>
                  )}

                  {/* Incoming Requests Manager (Management Queue) */}
                  <div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                          <FaCalendarCheck className="text-indigo-500" /> Session Management (Inbox)
                      </h3>
                      <BookingManager 
                        incomingBookings={pendingIncomingBookings} 
                        historyBookings={historyIncomingBookings} 
                      />
                  </div>

                  {/* Outgoing Requests (Mentor as a Student) */}
                  <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                       <FaHistory className="text-zinc-500" /> My Learning (As Student)
                    </h3>
                    <StudentBookingList bookings={studentHistory} />
                  </div>
                </div>
              ) : (
                /* STUDENT VIEW */
                <>
                  <div className="pt-2 space-y-8">
                    {/* Welcome Card */}
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                        <FaGraduationCap className="text-blue-500" /> Student Dashboard
                      </h3>
                      <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
                        <h4 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-1">
                          Welcome, {session.user.name}!
                        </h4>
                        <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                          Find the best mentors to guide you through JEE, NEET, and UPSC.
                        </p>
                        <Link href="/mentors" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                          Browse Mentors <FaArrowRight size={12} />
                        </Link>
                      </div>
                    </div>

                    {/* Student Booking History */}
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                        <FaHistory className="text-zinc-500" /> My Applications
                      </h3>
                      <StudentBookingList bookings={studentHistory} />
                    </div>

                    {/* Mentor Application Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                       <FaChalkboardTeacher className="text-zinc-500" /> Become a Mentor
                      </h3>
                      {!mentorProfile ? (
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                          <p className="text-zinc-600 dark:text-zinc-400 mb-4 text-sm">
                            Do you have expertise in JEE, NEET, or UPSC? Share your knowledge and earn money.
                          </p>
                          <Link href="/become-mentor" className="inline-block bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                            Apply Now
                          </Link>
                        </div>
                      ) : (
                        <div className={`p-4 rounded-xl border ${
                          mentorProfile.applicationStatus === "rejected" ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300" :
                          "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300"
                        }`}>
                          <div className="flex items-center gap-3">
                              {mentorProfile.applicationStatus === "pending" && <FaClock size={24} />}
                              {mentorProfile.applicationStatus === "rejected" && <FaTimesCircle size={24} />}
                              <div>
                                  <p className="font-bold capitalize">Mentor Application {mentorProfile.applicationStatus}</p>
                                  <p className="text-sm opacity-80 mt-1">
                                      {mentorProfile.applicationStatus === "pending" && "We are reviewing your application. This usually takes 24-48 hours."}
                                      {mentorProfile.applicationStatus === "rejected" && "Your application was not approved at this time."}
                                  </p>
                              </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}