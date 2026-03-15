import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Mentor from "@/models/Mentor";
import Order from "@/models/Order";
import Review from "@/models/Review";
import UserActivity from "@/models/UserActivity";
import Bounty from "@/models/Bounty"; 
import SkillProgress from "@/models/SkillProgress"; // --- ADDED: Import SkillProgress model ---
import { logUserActivity } from "@/app/actions/userActivity";
import { getIncomingBookings, getStudentBookings, getMentorBookingHistory } from "@/app/actions/bookingActions";
import BookingManager from "@/components/BookingManager";
import StudentBookingList from "@/components/StudentBookingList";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import BadgeGallery from "@/components/BadgeGallery";
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
  FaFilePdf,
  FaCalendarCheck,
  FaHistory,
  FaVideo,
  FaShoppingBag,
  FaUsersCog,
  FaStar,
  FaCommentDots,
  FaFire,
  FaMap // --- ADDED: Map icon for the Journey ---
} from "react-icons/fa";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  await dbConnect();

  // 1. Log today's activity quietly in the background
  await logUserActivity(session.user.email);

  // 2. Fetch User Activity Data for the Heatmap
  const userActivityData = await UserActivity.findOne({ userEmail: session.user.email }).lean();
  const activeDatesArray = userActivityData?.activeDates || [];

  // 3. Fetch Mentor Profile
  const mentorProfile = await Mentor.findOne({ email: session.user.email }).lean();
  const isApprovedMentor = mentorProfile?.applicationStatus === "approved";

  // 4. Fetch Orders (Purchased Items)
  const myOrders = await Order.find({ userEmail: session.user.email }).sort({ createdAt: -1 }).lean();

  // 5. Fetch Bookings
  let pendingIncomingBookings = [];
  let historyIncomingBookings = [];
  let studentHistory = [];

  if (isApprovedMentor) {
    pendingIncomingBookings = await getIncomingBookings(session.user.email);
    historyIncomingBookings = await getMentorBookingHistory(session.user.email);
  }

  studentHistory = await getStudentBookings(session.user.email);

  // 6. Fetch My Written Reviews
  const myReviews = await Review.find({ studentId: session.user.id })
    .populate("mentor", "name image jobTitle")
    .sort({ createdAt: -1 })
    .lean();

  // 7. Fetch Bounty Stats
  const bountiesSolvedCount = await Bounty.countDocuments({ solver: session.user.id, status: 'solved' });
  const bountiesPostedCount = await Bounty.countDocuments({ student: session.user.id });

  // --- ADDED: 8. Fetch Skill Tree Progress ---
  const skillProgress = await SkillProgress.findOne({ userId: session.user.id }).lean();
  const masteredNodesCount = skillProgress?.masteredNodes?.length || 0;

  // --- COUNTS CALCULATION ---
  const mentorActiveSessions = isApprovedMentor
    ? historyIncomingBookings.filter(b => b.status === "confirmed" || b.status === "ongoing")
    : [];

  const purchaseCount = myOrders.length || 0;
  const activeCount = mentorActiveSessions.length || 0;
  const learningCount = studentHistory.length || 0;

  // --- 9. DYNAMIC BADGE EVALUATION ---
  const earnedBadgeIds = [];

  // Mentor Badges (Active Teaching Sessions)
  if (activeCount >= 50) earnedBadgeIds.push("mentor_gold");
  else if (activeCount >= 20) earnedBadgeIds.push("mentor_silver");
  else if (activeCount >= 10) earnedBadgeIds.push("mentor_bronze");

  // Student Badges (Learning Sessions)
  if (learningCount >= 50) earnedBadgeIds.push("student_gold");
  else if (learningCount >= 20) earnedBadgeIds.push("student_silver");
  else if (learningCount >= 10) earnedBadgeIds.push("student_bronze");

  // Bounty Badges Logic
  if (bountiesSolvedCount >= 1) earnedBadgeIds.push("bounty_hunter");
  if (bountiesSolvedCount >= 10) earnedBadgeIds.push("bounty_master");
  if (bountiesPostedCount >= 5) earnedBadgeIds.push("generous_scholar");

  // --- ADDED: Skill Tree Badges Logic ---
  if (masteredNodesCount >= 1) earnedBadgeIds.push("journey_initiate");
  if (masteredNodesCount >= 10) earnedBadgeIds.push("journey_scholar");

  // Keep existing static/streak badges 
  earnedBadgeIds.push("first_blood");
  earnedBadgeIds.push("streak_10"); 

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">My Profile</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">Personal dashboard — quick access to bookings, activity, and tools.</p>

        {/* --- HEADER SECTION (Profile & Tools) --- */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-8">
          <div className={`h-32 bg-gradient-to-r ${isApprovedMentor ? "from-purple-600 to-indigo-600" : "from-blue-600 to-cyan-600"}`}></div>
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden bg-zinc-200 shadow-md">
                <img
                  src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-4 mb-8">
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

                <div className="mt-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* --- ADDED: My Journey Button --- */}
                    <Link href="/journey" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-full text-sm transition-colors shadow-sm">
                      <FaMap /> My Journey
                    </Link>

                    <Link href="/profile/sell-pdf" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm transition-colors shadow-sm">
                      <FaFilePdf /> Sell
                    </Link>
                    <Link href="/messages" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-full text-sm transition-colors shadow-sm">
                      <FaCommentDots /> Messages
                    </Link>
                    {mentorProfile && (
                      <Link href={`/mentors/${mentorProfile._id}/edit`} className="inline-flex items-center gap-2 bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 px-3 py-1 rounded-full text-sm transition-colors">
                        <FaUserEdit size={14} /> Edit
                      </Link>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <div className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                      {purchaseCount} purchases
                    </div>
                    <div className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                      {activeCount} active sessions
                    </div>
                    <div className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                      {learningCount} learning
                    </div>
                    
                    {/* New Bounty Pills */}
                    {bountiesSolvedCount > 0 && (
                      <div className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-sm font-medium text-amber-700 dark:text-amber-300">
                        {bountiesSolvedCount} bounties looted
                      </div>
                    )}
                    {bountiesPostedCount > 0 && (
                      <div className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        {bountiesPostedCount} bounties posted
                      </div>
                    )}

                    {/* --- ADDED: Skill Tree Stats Pill --- */}
                    {masteredNodesCount > 0 && (
                      <div className="px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-sm font-medium text-teal-700 dark:text-teal-300">
                        {masteredNodesCount} nodes mastered
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sessions Office (Full Width Tool) */}
            {isApprovedMentor && (
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-zinc-900 dark:text-white">
                  <FaCalendarCheck className="text-indigo-500" /> Sessions Office
                </h4>
                <div className="p-4 rounded-xl border border-stone-100 shadow-md bg-gradient-to-b from-white to-blue-50/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-md bg-indigo-50 shadow-sm">
                      <FaUsersCog className="text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">Incoming Requests</div>
                      <div className="text-xs text-zinc-500">Manage your schedule</div>
                    </div>
                  </div>
                  <BookingManager
                    incomingBookings={pendingIncomingBookings}
                    historyBookings={historyIncomingBookings}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* LEFT COLUMN: Dashboard Logic (2/3 Width) */}
          <div className="lg:col-span-2 space-y-8">

            {/* --- ADDED: LEARNING JOURNEY WIDGET --- */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <FaMap className="text-teal-500" /> My Learning Journey
              </h3>
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-teal-100 dark:border-teal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <h4 className="text-lg font-bold text-teal-900 dark:text-teal-200 mb-1">Interactive Skill Tree</h4>
                  <p className="text-teal-700 dark:text-teal-400 text-sm">
                    You have mastered <strong>{masteredNodesCount}</strong> nodes. View your map to unlock the next challenge.
                  </p>
                </div>
                <Link href="/journey" className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap">
                  Resume Journey <FaArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* --- ACTIVITY STREAK (Visible to Everyone) --- */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <FaFire className="text-orange-500" /> Activity Streak
              </h3>
              <div>
                <ActivityHeatmap
                  activeDates={activeDatesArray}
                  earnedBadgeIds={earnedBadgeIds} 
                />
              </div>
            </div>

            {/* --- BADGE GALLERY --- */}
            <div>
              <BadgeGallery earnedBadgeIds={earnedBadgeIds} />
            </div>

            {isApprovedMentor ? (
              /* MENTOR VIEW */
              <>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <FaChalkboardTeacher className="text-purple-500" /> Mentor Status
                  </h3>
                  <div className="p-6 rounded-xl border border-purple-100 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-blue-50/50">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-white shadow-sm text-purple-700">
                        <FaCheckCircle size={26} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-purple-900 dark:text-purple-200 mb-1">Profile Active</h4>
                        <p className="text-sm text-purple-700/80 mb-3">Your mentor profile is live.</p>
                        <div className="flex flex-wrap gap-3">
                          <Link href={`/mentors/${mentorProfile._id}`} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                            View Public Profile <FaExternalLinkAlt size={12} />
                          </Link>
                          <Link href={`/mentors/${mentorProfile._id}/edit`} className="inline-flex items-center gap-2 bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                            Edit Profile <FaUserEdit size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {mentorActiveSessions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                      <FaVideo className="text-rose-500" /> Your Teaching Schedule
                    </h3>
                    <StudentBookingList bookings={mentorActiveSessions} isMentorView={true} />
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <FaHistory className="text-zinc-500" /> My Learning (As Student)
                  </h3>
                  <StudentBookingList bookings={studentHistory} />
                </div>
              </>
            ) : (
              /* STUDENT VIEW */
              <>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <FaGraduationCap className="text-blue-500" /> Student Dashboard
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-800 mb-6">
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

                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <FaHistory className="text-zinc-500" /> My Applications
                  </h3>
                  <StudentBookingList bookings={studentHistory} />
                </div>

                {/* --- MY REVIEWS SECTION --- */}
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <FaCommentDots className="text-yellow-500" /> My Reviews
                  </h3>
                  {myReviews.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
                      <p className="text-zinc-500 italic text-sm">You haven't reviewed any mentors yet.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {myReviews.map((review) => (
                        <div key={review._id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <img
                                src={review.mentor?.image || "/default-avatar.png"}
                                alt={review.mentor?.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-bold text-sm text-zinc-900 dark:text-white">
                                  {review.mentor?.name || "Unknown Mentor"}
                                </p>
                                <div className="flex items-center gap-1">
                                  <span className="text-yellow-500 text-xs flex">
                                    {[...Array(5)].map((_, i) => (
                                      <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                                    ))}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span className="text-xs text-zinc-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-300 text-sm mt-3 italic">
                            "{review.comment}"
                          </p>
                          <div className="mt-2 text-xs font-semibold flex items-center gap-1">
                            {review.booking ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <FaCheckCircle size={10} /> Verified Session
                              </span>
                            ) : (
                              <span className="text-blue-500">General Review</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Become Mentor Section */}
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                    <FaChalkboardTeacher className="text-zinc-500" /> Become a Mentor
                  </h3>
                  {!mentorProfile ? (
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                      <p className="text-zinc-600 dark:text-zinc-400 mb-4 text-sm">
                        Do you have expertise in JEE, NEET, or UPSC? Share your knowledge.
                      </p>
                      <Link href="/become-mentor" className="inline-block bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                        Apply Now
                      </Link>
                    </div>
                  ) : (
                    <div className={`p-4 rounded-xl border ${mentorProfile.applicationStatus === "rejected" ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300" :
                        "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300"
                      }`}>
                      <div className="flex items-center gap-3">
                        {mentorProfile.applicationStatus === "pending" && <FaClock size={24} />}
                        {mentorProfile.applicationStatus === "rejected" && <FaTimesCircle size={24} />}
                        <div>
                          <p className="font-bold capitalize">Mentor Application {mentorProfile.applicationStatus}</p>
                          <p className="text-sm opacity-80 mt-1">
                            {mentorProfile.applicationStatus === "pending" && "We are reviewing your application."}
                            {mentorProfile.applicationStatus === "rejected" && "Your application was not approved."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* RIGHT COLUMN: Purchased Items */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <FaShoppingBag className="text-green-600" /> My Purchases
              </h3>

              {myOrders.length === 0 ? (
                <p className="text-zinc-500 italic bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center text-sm">
                  No items purchased yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((order) => (
                    <div key={order._id} className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-zinc-900 shadow-sm">
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                        <span className="text-xs font-bold text-zinc-400">#{order._id.toString().slice(-6).toUpperCase()}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-700'
                          }`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded bg-zinc-100 flex-shrink-0 overflow-hidden">
                              {item.coverImage ? (
                                <img src={item.coverImage} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">IMG</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200 truncate">{item.name}</p>
                              <p className="text-xs text-zinc-500">₹{Number(item.price).toLocaleString("en-IN")}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-right">
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">
                          Total: ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}