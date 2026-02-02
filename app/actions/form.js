'use server'

import { redirect } from 'next/navigation'
import { join } from 'path'
import fs from 'fs/promises'
import { mkdir } from 'fs/promises'
import dbConnect from '@/lib/db'
import Mentor from '@/models/Mentor'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function handleAction(formData) {
  // 1. Check Authentication
  const session = await auth();
  
  if (!session || !session.user) {
    throw new Error("You must be logged in to become a mentor");
  }

  // 2. Extract Data from Form
  const firstName = formData.get('first-name')
  const lastName = formData.get('last-name')
  const domain = formData.get('domain')
  const bio = formData.get('about')
  const organization = formData.get('organization')
  // 👇 THIS IS THE FIX: Get the email you typed in the form
  const formEmail = formData.get('email'); 

  // 3. Handle Profile Image Upload
  const imageFile = formData.get('profile-image')
  let imagePath = session.user.image || "/default-avatar.png"; 

  if (imageFile && imageFile.size > 0) {
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {
      // Ignore error if folder exists
    }

    const uniqueName = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    
    await fs.writeFile(join(uploadDir, uniqueName), buffer)
    imagePath = `/uploads/${uniqueName}`
  }

  // 4. CONNECT TO MONGODB
  await dbConnect();

  // 5. SAVE TO DATABASE
  try {
      // Optional: Check if email is provided
      if (!formEmail) {
          throw new Error("Email is required");
      }

      const existingProfile = await Mentor.findOne({ email: formEmail });
      
      if (existingProfile) {
        console.log("Profile already exists, updating...");
        // You can add update logic here if you want
      }

      await Mentor.create({
        name: `${firstName} ${lastName}`,
        domain: domain,
        bio: bio,
        image: imagePath,
        
        // ✅ FIX: Use the email from the form, not just the session
        email: formEmail, 
        
        organization: organization || "IIT Bombay", 
        role: "Mentor",
        price: 500, 
      });
      
      console.log('✅ Saved mentor to MongoDB:', firstName);
  } catch (error) {
      console.error("❌ Error saving to DB:", error);
      throw new Error("Failed to save mentor");
  }

  // 6. Refresh Data & Redirect
  revalidatePath('/mentors'); 
  redirect('/mentors');
}