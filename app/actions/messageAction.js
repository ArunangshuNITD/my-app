"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import Mentor from "@/models/Mentor";
import { revalidatePath } from "next/cache";

// IMPORTANT: Make sure you added uploadChatFile to lib/cloudinary.js!
import { uploadChatFile } from "@/lib/cloudinary"; 

export async function startConversation(mentorId) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  try {
    await dbConnect();

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) throw new Error("Mentor not found");

    const studentEmail = session.user.email;
    const mentorEmail = mentor.email;

    if (studentEmail === mentorEmail) {
      throw new Error("You cannot message yourself");
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [studentEmail, mentorEmail] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [studentEmail, mentorEmail],
        participantNames: [session.user.name, mentor.name],
        participantImages: [session.user.image || "", mentor.image || ""],
        lastMessage: "Conversation started",
        lastMessageAt: new Date(),
      });
    }

    return conversation._id.toString();
  } catch (error) {
    console.error("Error starting conversation:", error);
    throw new Error("Failed to start conversation. Please try again later.");
  }
}

export async function getUserConversations() {
  const session = await auth();
  if (!session?.user) return [];
  
  try {
    await dbConnect();
    
    const userEmail = session.user.email;
    const conversations = await Conversation.find({
      participants: userEmail,
    })
      .sort({ lastMessageAt: -1 })
      .lean();

    const formattedConversations = conversations.map((conv) => {
      const partnerIndex = conv.participants.findIndex((email) => email !== userEmail);
      return {
        id: conv._id.toString(),
        partnerName: conv.participantNames[partnerIndex] || "Unknown User",
        partnerImage: conv.participantImages[partnerIndex] || "",
        lastMessage: conv.lastMessage || "",
        updatedAt: conv.lastMessageAt,
      };
    });

    return formattedConversations;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return []; // Return empty array so the UI doesn't crash
  }
}

export async function getMessages(conversationId) {
  const session = await auth();
  if (!session?.user) return [];
  
  try {
    await dbConnect();

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    console.error("Error fetching messages:", error);
    return []; // Gracefully fallback to empty chat if DB is unreachable
  }
}

export async function sendMessage(formData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await dbConnect();

    // Extract data from FormData
    const conversationId = formData.get("conversationId");
    const text = formData.get("text") || "";
    const file = formData.get("file"); 

    let fileUrl = null;
    let fileType = null;
    let fileName = null;

    // If a file was attached, upload it using your Cloudinary helper
    if (file && file.size > 0) {
      fileName = file.name;
      
      if (file.type.startsWith("image/")) fileType = "image";
      else if (file.type.startsWith("video/")) fileType = "video";
      else if (file.type.startsWith("audio/")) fileType = "audio";
      else if (file.type === "application/pdf") fileType = "pdf";
      else fileType = "document";

      fileUrl = await uploadChatFile(file);
    }

    if (!text.trim() && !fileUrl) {
      throw new Error("Message cannot be empty");
    }

    const message = await Message.create({
      conversationId,
      senderEmail: session.user.email,
      text,
      fileUrl,
      fileType,
      fileName,
    });

    // Update sidebar preview
    let lastMessagePreview = text;
    if (!text && fileType) {
      lastMessagePreview = `Sent an attachment 📎`;
    }

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: lastMessagePreview,
      lastMessageAt: new Date(),
    });

    revalidatePath(`/messages/${conversationId}`);
    revalidatePath("/messages");
    
    return JSON.parse(JSON.stringify(message));
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message.");
  }
}

export async function deleteMessage(messageId, conversationId) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await dbConnect();
    const message = await Message.findById(messageId);
    if (!message) throw new Error("Message not found");

    if (message.senderEmail !== session.user.email) {
      throw new Error("You can only delete your own messages");
    }

    await Message.findByIdAndDelete(messageId);
    revalidatePath(`/messages/${conversationId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    throw new Error("Failed to delete message.");
  }
}