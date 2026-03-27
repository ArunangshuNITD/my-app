my-app/
├── .agents/
├── .env.local
├── .git/
├── .gitattributes
├── .gitignore
├── .next/
├── .windsurf/
│   └── skills/
│       └── supabase-postgres-best-practices
├── PROJECT_STRUCTURE.md
├── README.md
├── Todo.md
├── app/
│   ├── about/
│   │   └── page.js
│   ├── access-denied/
│   │   └── page.js
│   ├── actions/
│   │   ├── aiSearch.js
│   │   ├── bookingActions.js
│   │   ├── bountyActions.js
│   │   ├── contact.js
│   │   ├── dashboard.js
│   │   ├── form.js
│   │   ├── getMentors.js
│   │   ├── messageAction.js
│   │   ├── productActions.js
│   │   ├── pvpActions.js
│   │   ├── quizActions.js
│   │   ├── reviewActions.js
│   │   ├── roadmapActions.js
│   │   ├── skillTreeActions.js
│   │   ├── spaceRepititionActions.js
│   │   └── userActivity.js
│   ├── admin/
│   │   └── page.js
│   ├── api/
│   │   ├── auth/
│   │   │   └── route.js
│   │   ├── blogs/
│   │   │   ├── [id]/
│   │   │   │   └── route.js
│   │   │   ├── create/
│   │   │   │   └── route.js
│   │   │   ├── delete/
│   │   │   │   └── route.js
│   │   │   ├── route.js
│   │   │   └── update/
│   │   │       └── route.js
│   │   ├── chat/
│   │   │   └── route.js
│   │   ├── matches/
│   │   │   └── route.js
│   │   ├── mentors/
│   │   │   └── route.js
│   │   ├── orders/
│   │   │   └── route.js
│   │   ├── products/
│   │   │   ├── [id]/
│   │   │   │   └── route.js
│   │   │   ├── create/
│   │   │   │   └── route.js
│   │   │   └── route.js
│   │   ├── upload-image/
│   │   │   └── route.js
│   │   └── upload-pdf/
│   │       └── route.js
│   ├── become-mentor/
│   │   └── page.js
│   ├── blogs/
│   │   └── page.js
│   ├── booking-error/
│   │   └── page.js
│   ├── bounty-board/
│   │   ├── [id]/
│   │   │   └── page.js
│   │   └── page.js
│   ├── cart/
│   │   └── page.js
│   ├── contact/
│   │   └── page.js
│   ├── create-post/
│   │   └── page.js
│   ├── dashboard/
│   │   ├── add-mentor/
│   │   │   └── page.js
│   │   ├── blogs/
│   │   │   └── page.js
│   │   ├── layout.js
│   │   ├── messages/
│   │   │   └── page.js
│   │   └── page.js
│   ├── favicon.ico
│   ├── globals.css
│   ├── how-it-works/
│   │   └── page.js
│   ├── icon.svg
│   ├── journey/
│   │   └── page.js
│   ├── layout.js
│   ├── loading.js
│   ├── meeting/
│   │   └── [roomID]/
│   │       └── page.js
│   ├── mentors/
│   │   ├── [id]/
│   │   │   └── page.js
│   │   ├── booking/
│   │   │   └── page.js
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── profile/
│   │   │   └── page.js
│   │   ├── reviews/
│   │   │   └── page.js
│   │   └── search/
│   │       └── page.js
│   ├── messages/
│   │   ├── [id]/
│   │   │   └── page.js
│   │   ├── layout.js
│   │   └── page.js
│   ├── not-found.js
│   ├── online-battle/
│   │   ├── [matchId]/
│   │   │   └── page.js
│   │   └── page.js
│   ├── page.js
│   ├── pricing/
│   │   └── page.js
│   ├── profile/
│   │   ├── bookings/
│   │   │   └── page.js
│   │   ├── layout.js
│   │   ├── orders/
│   │   │   └── page.js
│   │   └── page.js
│   ├── providers.js
│   ├── store/
│   │   ├── layout.js
│   │   └── page.js
│   ├── success-stories/
│   │   └── page.js
│   └── template.js
├── components/
│   ├── ActivityHeatmap.js
│   ├── Authbutton.js
│   ├── BadgeGallery.js
│   ├── BadgeUnlockPopup.js
│   ├── BookingManager.js
│   ├── BountyCard.js
│   ├── ChatInterface.js
│   ├── Chatbot.js
│   ├── CommentNode.js
│   ├── CountdownTimr.js
│   ├── DelayedRender.js
│   ├── Footer.js
│   ├── LiveSurgeTicker.js
│   ├── MessageMentorButton.js
│   ├── MessagesClientlayout.js
│   ├── Navbar.js
│   ├── NeedsReviewQueue.js
│   ├── ProgressRing.js
│   ├── Providers.js
│   ├── PvPTimer.js
│   ├── RateMentorButton.js
│   ├── ReviewModal.js
│   ├── RoadmapTodo.js
│   ├── SkillTree/
│   │   ├── CustomNode.js
│   │   ├── QuizModel.js
│   │   └── SkillTreeBoard.js
│   ├── SmartSearch.js
│   ├── StudentBookingList.js
│   ├── TemplateSelector.js
│   └── UpvoteWithTip.js
├── context/
│   └── CartContext.js
├── eslint.config.mjs
├── jsconfig.json
├── lib/
│   ├── auth.js
│   ├── blogData.js
│   ├── chatTemplates.js
│   ├── cloudinary.js
│   ├── curricula/
│   │   ├── jee/
│   │   │   ├── chemistry/
│   │   │   │   ├── inorganic.js
│   │   │   │   ├── organic.js
│   │   │   │   └── physical.js
│   │   │   ├── mathametics/
│   │   │   │   ├── algebra.js
│   │   │   │   ├── calculus.js
│   │   │   │   └── geometry.js
│   │   │   └── physics/
│   │   │       ├── electromagnetism.js
│   │   │       ├── extendedmechanics.js
│   │   │       ├── mechanics.js
│   │   │       ├── modern.js
│   │   │       ├── optics.js
│   │   │       ├── thermal.js
│   │   │       └── waves.js
│   │   └── neet/
│   │       ├── biology/
│   │       ├── chemistry/
│   │       └── physics/
│   ├── db.js
│   ├── supabase.js
│   ├── surgePricing.js
│   └── uploadthing.js
├── models/
│   ├── Blog.js
│   ├── Booking.js
│   ├── Bounty.js
│   ├── Contact.js
│   ├── Conversation.js
│   ├── Match.js
│   ├── Mentor.js
│   ├── Message.js
│   ├── Order.js
│   ├── Player.js
│   ├── Product.js
│   ├── Review.js
│   ├── SkillProgress.js
│   └── UserActivity.js
├── next.config.mjs
├── node_modules/
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── uploads/
│   ├── vercel.svg
│   └── window.svg
├── skills-lock.json
└── tailwind.config.js