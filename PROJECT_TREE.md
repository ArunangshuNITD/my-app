```markdown
# MENTORCONNECT — COMPLETE PROJECT TREE

Repository root: e:/web dev/mentorconnect/my-app

## Top-level files
- eslint.config.mjs
- jsconfig.json
- next.config.mjs
- package.json
- package-lock.json
- PAGES_LOGIC.md
- postcss.config.mjs
- README.md
- TREE.md
- PROJECT_TREE.md
- tailwind.config.js

## Public
- public/
  - uploads/                (local dev uploads; prefer cloud storage in production)

## Models
- models/
  - Blog.js
  - Booking.js
  - Contact.js
  - Mentor.js
  - Order.js
  - Product.js

## Library utilities
- lib/
  - auth.js
  - blogData.js
  - cloudinary.js
  - db.js

## Context
- context/
  - CartContext.js

## Components
- components/
  - Authbutton.js
  - BookingManager.js
  - Chatbot.js
  - CommentNode.js
  - CountdownTimr.js
  - DelayedRender.js
  - Footer.js
  - Navbar.js
  - Providers.js
  - StudentBookingList.js
  - VideoCallInterface.js

## App (Next.js App Router)
- app/
  - globals.css
  - layout.js
  - loading.js
  - not-found.js
  - page.js
  - providers.js

  - about/
    - page.js

  - access-denied/
    - page.js

  - actions/
    - bookingActions.js
    - contact.js
    - dashboard.js
    - form.js
    - getMentors.js
    - productActions.js

  - admin/
    - verify/
      - page.js

  - api/
    - auth/
      - [...nextauth]/
        - route.js

    - blogs/
      - route.js
      - [id]/
        - route.js
        - comment/
          - route.js
          - [commentId]/
            - route.js
        - upvote/
          - route.js

    - chat/
      - route.js

    - orders/
      - route.js

    - products/
      - route.js
      - [id]/
        - route.js
        - reviews/
          - route.js

    - upload-image/
      - route.js

    - upload-pdf/
      - route.js

    - video/
      - token/
        - route.js

  - become-mentor/
    - page.js

  - blogs/
    - page.js

  - booking-error/
    - page.js

  - cart/
    - page.js

  - contact/
    - page.js

  - create-post/
    - page.js

  - dashboard/
    - layout.js
    - page.js
    - add-mentor/
      - page.js
    - blogs/
      - page.js
    - messages/
      - page.js

  - how-it-works/
    - page.js

  - mentors/
    - page.js
    - add/
      - page.js
    - apply/
      - success/
        - page.js
    - [id]/
      - page.js
      - book/
        - page.js
        - success/
          - page.js
      - edit/
        - page.js

  - profile/
    - page.js
    - sell-pdf/
      - page.js

  - store/
    - page.js
    - [id]/
      - page.js

  - success-stories/
    - page.js

  - video-call/
    - [roomid]/
      - page.js

## Notes
- Server actions: files under `app/actions/*` (used as server actions).
- API routes: under `app/api/*` (blogs, chat, auth, products, orders, uploads, video token).
- Components: mix of client and server components — check for `use client` where applicable.

Generated on: 2026-02-08

``` 
