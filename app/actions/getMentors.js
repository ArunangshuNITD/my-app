"use server";

import dbConnect from "@/lib/db";
import Mentor from "@/models/Mentor";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary"; 
import Review from "@/models/Review";

// Ensure this matches your logged-in email exactly
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "arunangshud3@gmail.com";

// Helper to safely check Admin Email
const isAdmin = (sessionEmail) => {
  if (!sessionEmail) return false;
  return sessionEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();
};

// =========================================================
// 1. PUBLIC: GET ALL APPROVED MENTORS
// =========================================================
export async function getMentorsList() {
  try {
    await dbConnect();
    const mentors = await Mentor.find({ applicationStatus: "approved" })
      .sort({ createdAt: -1 })
      .lean();

    return mentors.map((mentor) => ({
      ...mentor,
      _id: mentor._id.toString(),
      createdAt: mentor.createdAt?.toISOString(),
      updatedAt: mentor.updatedAt?.toISOString(),
    }));
  } catch (error) {
    console.error("❌ Error fetching mentors:", error);
    return [];
  }
}

// =========================================================
// 2. PUBLIC: GET SINGLE MENTOR
// =========================================================
export async function getMentorById(id) {
  await dbConnect();

  const mentor = await Mentor.findById(id).lean();
  if (!mentor) return null;

  // Aggregate reviews
  const reviewStats = await Review.aggregate([
    { $match: { mentor: mentor._id } },
    {
      $group: {
        _id: "$mentor",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  // Fetch reviews with population
  const reviews = await Review.find({ mentor: mentor._id })
    .populate({
      path: "student",
      select: "name image",
      strictPopulate: false, 
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // ✅ FIX: Manually serialize everything to plain objects
  return {
    ...mentor,
    _id: mentor._id.toString(),
    createdAt: mentor.createdAt?.toISOString(),
    updatedAt: mentor.updatedAt?.toISOString(),
    averageRating: reviewStats[0]?.averageRating || 0,
    totalReviews: reviewStats[0]?.totalReviews || 0,
    reviews: reviews.map((r) => ({
      ...r,
      _id: r._id.toString(),
      createdAt: r.createdAt?.toISOString(),
      student: r.student ? { 
        ...r.student, 
        _id: r.student._id.toString() 
      } : null,
    })),
  };
}

// =========================================================
// 3. USER ACTION: APPLY FOR MENTORSHIP (SELF)
// =========================================================
export async function applyForMentorship(formData) {
  const session = await auth();
  if (!session || !session.user) {
    return { error: "You must be logged in to apply." };
  }
  const email = session.user.email;

  await dbConnect();

  const existingApp = await Mentor.findOne({ email });
  if (existingApp) {
    return { error: `You have already applied. Current Status: ${existingApp.applicationStatus}` };
  }

  const rawData = {
    firstName: formData.get('first-name'),
    lastName: formData.get('last-name'),
    domain: formData.get('domain'),
    bio: formData.get('about'),
    organization: formData.get('organization'),
    linkedin: formData.get('linkedin')
  };

  if (!rawData.firstName) return { error: "First name is required" };

  // --- CLOUDINARY UPLOAD ---
  const imageFile = formData.get('profile-image');
  let imagePath = session.user.image || "/default-avatar.png";

  if (imageFile && imageFile.size > 0) {
    try {
      imagePath = await uploadImage(imageFile);
    } catch (imgError) {
      console.error("⚠️ Image Upload Failed:", imgError);
      return { error: "Image upload failed. Please try again." };
    }
  }

  try {
    await Mentor.create({
      name: `${rawData.firstName} ${rawData.lastName}`,
      email: email,
      domain: rawData.domain,
      bio: rawData.bio,
      organization: rawData.organization || "Independent",
      linkedin: rawData.linkedin,
      image: imagePath,
      role: "Mentor",
      price: 500,
      applicationStatus: "pending",
    });
    return { success: true };
  } catch (dbError) {
    console.error("❌ DATABASE ERROR:", dbError);
    return { error: "Failed to save application." };
  }
}

// =========================================================
// 4. ADMIN ACTION: GET PENDING APPLICATIONS
// =========================================================
export async function getPendingMentors() {
  const session = await auth();

  if (!isAdmin(session?.user?.email)) {
    return [];
  }

  try {
    await dbConnect();
    const mentors = await Mentor.find({ applicationStatus: "pending" })
      .sort({ createdAt: -1 })
      .lean();

    return mentors.map(m => ({
      ...m,
      _id: m._id.toString(),
      createdAt: m.createdAt?.toISOString(),
    }));
  } catch (error) {
    console.error("❌ Error fetching pending mentors:", error);
    return [];
  }
}

// =========================================================
// 5. ADMIN ACTION: VERIFY (APPROVE / REJECT)
// =========================================================
export async function verifyMentor(mentorId, action) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    throw new Error("Unauthorized Access");
  }
  try {
    await dbConnect();
    if (action === "approve") {
      await Mentor.findByIdAndUpdate(mentorId, { applicationStatus: "approved" });
    } else if (action === "reject") {
      await Mentor.findByIdAndUpdate(mentorId, { applicationStatus: "rejected" });
    }
    revalidatePath("/admin/verify");
    revalidatePath("/dashboard");
    revalidatePath("/mentors");
  } catch (error) {
    console.error("❌ Error verifying mentor:", error);
    return { error: "Verification failed" };
  }
}

// =========================================================
// 6. ADMIN ACTION: MANUAL ADD / UPDATE
// =========================================================
export async function manualAddMentor(formData) {
  const session = await auth();

  if (!isAdmin(session?.user?.email)) {
    return { error: "Unauthorized: Only admins can manually add mentors." };
  }

  await dbConnect();

  const email = formData.get("email");
  const firstName = formData.get("first-name"); 
  const lastName = formData.get("last-name");   
  const fullName = formData.get("name") || `${firstName} ${lastName}`;

  if (!email || !fullName) {
    return { error: "Email and Name are required." };
  }

  const imageFile = formData.get('image'); 
  let uploadedImagePath = null;

  if (imageFile && imageFile.size > 0) {
    try {
      uploadedImagePath = await uploadImage(imageFile);
    } catch (imgError) {
      console.error("⚠️ Image Upload Failed:", imgError);
    }
  }

  const updateData = {
    name: fullName,
    domain: formData.get("domain"),
    bio: formData.get("bio") || formData.get("about"),
    organization: formData.get("organization") || "Independent",
    linkedin: formData.get("linkedin"),
    role: "Mentor",
    price: 500,
    isVerified: true,
    applicationStatus: "approved"
  };

  try {
    const existingMentor = await Mentor.findOne({ email });

    if (existingMentor) {
      const imageToUse = uploadedImagePath || existingMentor.image;
      await Mentor.updateOne({ email }, { ...updateData, image: imageToUse });
    } else {
      const imageToUse = uploadedImagePath || "/default-avatar.png";
      await Mentor.create({ ...updateData, email, image: imageToUse });
    }

    revalidatePath("/mentors");
    revalidatePath("/dashboard");
    return { success: true, message: "Action successful" };
  } catch (error) {
    console.error("❌ Database Error:", error);
    return { error: "Failed to save mentor." };
  }
}

// =========================================================
// ✅ 7. SHARED ACTION: UPDATE MENTOR
// =========================================================
export async function updateMentor(formData) {
  const id = formData.get("id");
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  await dbConnect();

  try {
    const existingMentor = await Mentor.findById(id);
    if (!existingMentor) throw new Error("Mentor not found");

    const isOwner = existingMentor.email === session.user.email;
    const admin = isAdmin(session.user.email);

    if (!isOwner && !admin) {
      throw new Error("Unauthorized");
    }

    const imageFile = formData.get('image'); 
    let newImagePath = null;

    if (imageFile && imageFile.size > 0) {
      try {
        newImagePath = await uploadImage(imageFile);
      } catch (imgError) {
        console.error("⚠️ Update Image Upload Failed:", imgError);
      }
    }

    const updateData = {
      name: formData.get("name"),
      domain: formData.get("domain"),
      organization: formData.get("organization"),
      linkedin: formData.get("linkedin"),
      bio: formData.get("bio"),
    };

    if (newImagePath) {
      updateData.image = newImagePath;
    }

    await Mentor.findByIdAndUpdate(id, updateData);

  } catch (error) {
    console.error("❌ Update Error:", error);
    return { message: "Update failed" };
  }

  revalidatePath(`/mentors/${id}`);
  revalidatePath("/mentors");
  redirect(`/mentors/${id}`);
}