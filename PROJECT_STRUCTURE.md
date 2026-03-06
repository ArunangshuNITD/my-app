# Project Structure

```
my-app/
├── app/
│   ├── globals.css
│   ├── layout.js
│   ├── loading.js
│   ├── not-found.js
│   ├── page.js
│   ├── providers.js
│   ├── template.js
│   ├── about/
│   │   └── page.js
│   ├── access-denied/
│   │   └── page.js
│   ├── actions/
│   │   ├── aiSearch.js
│   │   ├── bookingActions.js
│   │   ├── contact.js
│   │   ├── dashboard.js
│   │   ├── form.js
│   │   ├── getMentors.js
│   │   ├── messageAction.js
│   │   ├── productActions.js
│   │   └── reviewActions.js
│   ├── admin/
│   │   └── verify/
│   │       └── page.js
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.js
│   │   ├── blogs/
│   │   │   ├── route.js
│   │   │   └── [id]/
│   │   │       ├── route.js
│   │   │       ├── comment/
│   │   │       │   ├── route.js
│   │   │       │   └── [commentId]/
│   │   │       │       └── route.js
│   │   │       └── upvote/
│   │   │           └── route.js
│   │   ├── chat/
│   │   │   └── route.js
│   │   ├── mentors/
│   │   │   └── [id]/
│   │   │       └── reviews/
│   │   │           └── route.js
│   │   ├── orders/
│   │   │   └── route.js
│   │   ├── products/
│   │   │   ├── route.js
│   │   │   └── [id]/
│   │   │       ├── route.js
│   │   │       └── reviews/
│   │   │           └── route.js
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
│   ├── cart/
│   │   └── page.js
│   ├── contact/
│   │   └── page.js
│   ├── create-post/
│   │   └── page.js
│   ├── dashboard/
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── add-mentor/
│   │   │   └── page.js
│   │   ├── blogs/
│   │   │   └── page.js
│   │   └── messages/
│   │       └── page.js
│   ├── how-it-works/
│   │   └── page.js
│   ├── meeting/
│   │   └── [roomID]/
│   │       └── page.js
│   ├── mentors/
│   │   ├── page.js
│   │   ├── add/
│   │   │   └── page.js
│   │   ├── apply/
│   │   │   └── success/
│   │   │       └── page.js
│   │   └── [id]/
│   │       ├── page.js
│   │       ├── book/
│   │       │   ├── page.js
│   │       │   └── success/
│   │       │       └── page.js
│   │       └── edit/
│   │           └── page.js
│   ├── messages/
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── [conversationId]/
│   │       └── page.js
│   ├── profile/
│   │   ├── page.js
│   │   ├── messages/
│   │   │   ├── page.js
│   │   │   └── [conversationId]/
│   │   │       └── page.js
│   │   └── sell-pdf/
│   │       └── page.js
│   ├── store/
│   │   ├── page.js
│   │   └── [id]/
│   │       └── page.js
│   └── success-stories/
│       └── page.js
├── components/
│   ├── Authbutton.js
│   ├── BookingManager.js
│   ├── Chatbot.js
│   ├── ChatInterface.js
│   ├── CommentNode.js
│   ├── CountdownTimr.js
│   ├── DelayedRender.js
│   ├── Footer.js
│   ├── MessageMentorButton.js
│   ├── Navbar.js
│   ├── Providers.js
│   ├── RateMentorButton.js
│   ├── ReviewModal.js
│   ├── SmartSearch.js
│   └── StudentBookingList.js
├── context/
│   └── CartContext.js
├── lib/
│   ├── auth.js
│   ├── blogData.js
│   ├── cloudinary.js
│   └── db.js
├── models/
│   ├── Blog.js
│   ├── Booking.js
│   ├── Contact.js
│   ├── Conversation.js
│   ├── Mentor.js
│   ├── Message.js
│   ├── Order.js
│   ├── Product.js
│   └── Review.js
├── public/
│   └── uploads/
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.js
└── Todo.md
```

## Directory Summary

| Directory | Purpose |
|-----------|---------|
| **app/** | Next.js App Router pages and routes |
| **components/** | Reusable React components |
| **context/** | React Context providers (e.g., CartContext) |
| **lib/** | Utility functions and configurations (auth, database, Cloudinary) |
| **models/** | Database schema models (MongoDB) |
| **public/uploads/** | Static assets and uploaded files |

## Key Features
- **Authentication**: Next.js Auth integration
- **Blog System**: Create, read, comment, upvote on blogs
- **Mentorship**: Booking, reviews, mentor profiles
- **E-Commerce**: Product listings, cart, orders
- **Messaging**: Real-time chat between users
- **Dashboard**: Admin and user dashboards
- **File Uploads**: Image and PDF upload handlers
