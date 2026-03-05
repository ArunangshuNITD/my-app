"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import Mentor from "@/models/Mentor";
import { revalidatePath } from "next/cache";

// 1. Start or find a conversation with a mentor
export async function startConversation(mentorId) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await dbConnect();

  const mentor = await Mentor.findById(mentorId);
  if (!mentor) throw new Error("Mentor not found");

  const studentEmail = session.user.email;
  const mentorEmail = mentor.email;

  // Prevent messaging yourself
  if (studentEmail === mentorEmail) {
    throw new Error("You cannot message yourself");
  }

  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    participants: { $all: [studentEmail, mentorEmail] },
  });

  // If not, create a new one
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
}

// 2. Get all conversations for the inbox sidebar
export async function getUserConversations() {
  const session = await auth();
  if (!session?.user) return [];

  await dbConnect();
  const userEmail = session.user.email;

  const conversations = await Conversation.find({
    participants: userEmail,
  })
    .sort({ lastMessageAt: -1 })
    .lean();

  // Map over the conversations to extract the partner's info
  const formattedConversations = conversations.map((conv) => {
    // Find the index of the person who is NOT the current user
    const partnerIndex = conv.participants.findIndex((email) => email !== userEmail);

    return {
      id: conv._id.toString(),
      partnerName: conv.participantNames[partnerIndex] || "Unknown User",
      partnerImage: conv.participantImages[partnerIndex] || "",
      lastMessage: conv.lastMessage || "",
      updatedAt: conv.lastMessageAt,
    };
  });

  // Because we manually mapped to simple strings/dates, we don't even need the JSON.parse trick here!
  return formattedConversations;
}

// 3. Get messages for a specific chat
export async function getMessages(conversationId) {
  const session = await auth();
  if (!session?.user) return [];

  await dbConnect();

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .lean();

  return JSON.parse(JSON.stringify(messages));
}

// 4. Send a new message
export async function sendMessage(conversationId, text) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await dbConnect();

  const message = await Message.create({
    conversationId,
    senderEmail: session.user.email,
    text,
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: text,
    lastMessageAt: new Date(),
  });

  // UPDATED: Changed from /profile/messages to /messages
  revalidatePath(`/messages/${conversationId}`);
  revalidatePath("/messages");
  
  return JSON.parse(JSON.stringify(message));
}
// Add this to your messageAction.js file

export async function deleteMessage(messageId, conversationId) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await dbConnect();

  // Find the message first to verify ownership
  const message = await Message.findById(messageId);
  if (!message) throw new Error("Message not found");

  // Security check: Only allow the sender to delete their own message
  if (message.senderEmail !== session.user.email) {
    throw new Error("You can only delete your own messages");
  }

  // Delete it!
  await Message.findByIdAndDelete(messageId);

  // Refresh the UI
  revalidatePath(`/messages/${conversationId}`);
  
  return { success: true };
}