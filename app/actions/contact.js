"use server";

import dbConnect from "@/lib/db";
import Contact from "@/models/Contact";
import { redirect } from "next/navigation";

export async function handleContactForm(formData) {
  // 1. Extract data
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  try {
    // 2. Connect to DB
    await dbConnect();

    // 3. Create new document in MongoDB
    await Contact.create({
      name,
      email,
      message,
    });

    console.log(`Message saved to DB from: ${email}`);
  } catch (error) {
    console.error("Error saving to MongoDB:", error);
    // Optional: Return an error state to the client here if needed
    throw new Error("Failed to send message");
  }

  // 4. Redirect on success
  redirect("/contact?success=true");
}