# Pages Logic Reference

This document maps each page in `/app` to the core logic it uses: server actions, components, and models. Use this as a quick reference when adding features.

---

## How to read this file
- Path: page file under `app/`
# Pages Logic Reference

This document maps each page in `/app` to the core logic it uses: server actions, components, and models. Use this as a quick reference when adding features.

---

## Project Tree (snapshot)

Repository root: e:/web dev/mentorconnect/my-app

- .gitignore
- .gitattributes
- eslint.config.mjs
- jsconfig.json
- next.config.mjs
- package.json
- package-lock.json
- PAGES_LOGIC.md
- postcss.config.mjs
- README.md
- TREE.md
- tailwind.config.js

- public/
  - window.svg
  - vercel.svg
  - next.svg
  - globe.svg
  - file.svg
  - uploads/   (local dev uploads; prefer cloud storage in production)

- models/
  - Mentor.js
  - Contact.js
  - Booking.js
  - Blog.js

- lib/
  - db.js
  - cloudinary.js
  - blogData.js
  - auth.js

- components/
  - Authbutton.js
  - BookingManager.js
  - Chatbot.js
  - CommentNode.js
  - CountdownTimr.js
  - Footer.js
  - Navbar.js
  - Providers.js
  - StudentBookingList.js

- app/
  - globals.css
  - layout.js
  - loading.js
  - not-found.js
  - page.js
  - icon.svg
  - favicon.ico
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
        - upvote/
          - route.js
        - comment/
          - route.js
          - [commentId]/
            - route.js
    - chat/
      - route.js

  - become-mentor/
    - page.js

  - blogs/
    - page.js

  - booking-error/
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

  - success-stories/
    - page.js

  - video-call/
    - [roomid]/
      - page.js

---

## How to read this file
- Path: page file under `app/`
- Purpose: short description of the page
- Key imports: functions/components/models used by the page
- Where the function lives: file path(s)
- What it does: short summary for each function

---

## Pages

### `/app/page.js`
- Purpose: Home / landing page (highly interactive, client-heavy)
- Key imports: `framer-motion`, many `react-icons`, client hooks (`useState`, `useEffect`, `useRef`), custom UI components defined inside the page (e.g. `SpotlightGrid`, `Meteors`, `SmartSearch`, `FeatureCard`, `AnimatedCounter`, `LiveBookingNotification`).
- Where functions live: Most helper UI pieces are defined inline in the page file; animations rely on `framer-motion` helpers.
- What they do: renders an animated hero with parallax/orbit effects, a smart search input (client-side), feature cards, animated counters, and live booking notifications. This page is a client component (`"use client"`) and contains UX-only logic — no direct server actions.

### `/app/about/page.js`
- Purpose: About page describing MentorConnect
- Key imports: static components
- Where functions live: mostly presentational components under `/components`
- What they do: display static content

### `/app/contact/page.js`
- Purpose: Contact form / support information
- Key imports:
  - `handleContactForm` from `app/actions/contact.js`
  - UI icons from `react-icons`
- Where functions live:
  - `app/actions/contact.js` — `handleContactForm(formData)`
- What they do:
  - `handleContactForm` (server action): saves contact message to DB using `models/Contact.js`, then redirects to `/contact?success=true`.

### `/app/mentors/page.js`
- Purpose: List of mentors (public directory, client-side UI)
- Key imports:
  - `getMentorsList` from `app/actions/getMentors` (imported into the client component to fetch mentor data)
  - UI pieces and icons from `react-icons`
- Where functions live:
  - `app/actions/getMentors.js` — `getMentorsList()` (server helper)
- What they do:
  - The page is a client component that calls `getMentorsList()` in an effect to populate mentors, provides client-side search/filtering by domain, groups mentors by category, and links to individual mentor pages (`/mentors/[id]`). Uses theme-style mappings per category for consistent UI.

### `/app/mentors/[id]/page.js`
- Purpose: Mentor public profile page
- Key imports:
  - `getMentorById` from `app/actions/getMentors.js`
  - Mentor model `models/Mentor.js`
  - Booking link to booking page
- Where functions live:
  - `app/actions/getMentors.js` — `getMentorById(id)`
- What they do:
  - `getMentorById`: fetch mentor by ID, return lean object for rendering.

### `/app/mentors/[id]/book/page.js`
- Purpose: Booking UI for a specific mentor
- Key imports:
  - `createBooking` from `app/actions/bookingActions.js`
  - `getMentorById` from `app/actions/getMentors.js`
  - `auth` from `lib/auth`
- Where functions live:
  - `app/actions/bookingActions.js` — `createBooking(formData)`, `getTakenSlots(...)`
  - `app/actions/getMentors.js` — `getMentorById`
- What they do:
  - `createBooking`: validates session, checks for slot collisions, creates a `Booking` document, revalidates `/profile`, redirects to success page.
  - `getTakenSlots`: (helper) fetches already booked time slots for date/mentor.

### `/app/mentors/[id]/book/success/page.js`
- Purpose: Booking success confirmation screen
- Key imports: presentational only
- Where functions live: none (static)
- What they do: show success message after booking

### `/app/mentors/[id]/edit/page.js`
- Purpose: Mentor profile edit (owner/admin)
- Key imports/actions: `getMentorById`, `updateMentor` server action in `app/actions/getMentors`.
- Behavior: server page that renders a form posting to `updateMentor` and restricts access to owner/admin.

### `/app/mentors/add/page.js`
- Purpose: Admin-only add mentor page (redirects non-admins).
- Key imports/actions: `manualAddMentor` or `createMentor` from `app/actions/getMentors`.

### `/app/mentors/apply/success/page.js`
- Purpose: Mentor application success (static confirmation page).

### `/app/become-mentor/page.js`
- Purpose: Mentor application form (client) that calls `applyForMentorship` from `app/actions/getMentors`.
- Behavior: uses session; redirects to sign-in if unauthenticated and calls server action on submit.

### `/app/blogs/page.js`
- Purpose: Blog feed and comments UI (client-heavy).
- Key imports/actions: client fetch to `/api/blogs` for data; uses `CommentNode` and `next-auth` session for actions (upvote/comment); admin list filtered by `ADMIN_EMAILS`.
- Behavior: supports upvote/comment via API routes under `/app/api/blogs` and has client-side state for comments, toast, and filtering.

### `/app/create-post/page.js`
- Purpose: Create blog post page (authenticated client page).
- Behavior: protects with `next-auth` session; posts to `/api/blogs` via fetch.

### `/app/profile/page.js`
- Purpose: Central profile/dashboard for users.
- Key imports/actions/models: `auth` (server), `dbConnect`, `Mentor` model, `getIncomingBookings`, `getStudentBookings`, `getMentorBookingHistory` from `app/actions/bookingActions`.
- Behavior: server-side decides view (mentor vs student) and renders `BookingManager` and `StudentBookingList` components; fetches bookings server-side.

### `/app/dashboard/page.js`
- Purpose: Admin/overview dashboard (server data fetch).
- Key imports/actions: `getDashboardStats` from `app/actions/dashboard`.

### `/app/dashboard/*` (mixed client/server)
- Examples: `/dashboard/add-mentor` (client), `/dashboard/blogs` (client) — pages interact with admin APIs and server endpoints.

### `/app/admin/verify/page.js`
- Purpose: Admin verification UI.
- Key imports/actions: `getPendingMentors`, `verifyMentor` from `app/actions/getMentors`; uses `auth` to validate admin email.

### `/app/success-stories/page.js`
- Purpose: Presentational success stories page with filters and CTAs linking to `/mentors` and `/become-mentor`.

### `/app/booking-error/page.js`
- Purpose: Booking error UI — accepts `searchParams` and optionally links back to the mentor/book pages.


## API routes (server)

- `/app/api/auth/[...nextauth]/route.js`
  - Purpose: NextAuth route for authentication (signin/signout, callbacks).

- `/app/api/blogs/route.js` and nested routes
  - Files:
    - `/app/api/blogs/route.js` — GET list, POST create
    - `/app/api/blogs/[id]/route.js` — GET single, PUT update status (admin), DELETE
    - `/app/api/blogs/[id]/comment/route.js` — POST comment or reply
    - `/app/api/blogs/[id]/upvote/route.js` — upvote handling
    - `/app/api/blogs/[id]/comment/[commentId]/route.js` — comment-specific actions
  - Behavior: CRUD for blogs, nested comment handling, and upvotes. Client pages call these endpoints.


## Components referenced across pages (quick index)
- `components/BookingManager.js` — UI for mentors to accept/reject booking requests; calls `verifyBooking` server action.
- `components/StudentBookingList.js` — lists student bookings; used on `profile` (server-rendered data passed to this client component).
- `components/Navbar.js`, `components/Footer.js`, `components/Providers.js` — shared layout and auth UI.


## Models (DB)
- `models/Mentor.js` — mentor schema and application status
- `models/Booking.js` — booking schema (mentorId, studentEmail, date, timeSlot, duration, price, status)
- `models/Blog.js` — blog schema with comments and upvote lists
- `models/Contact.js` — stores contact messages


## Actions / Server helpers (where to look)
- `app/actions/bookingActions.js`
  - `getTakenSlots(mentorId, dateString)` — returns taken time slots
  - `createBooking(formData)` — creates booking; prevents collisions
  - `getIncomingBookings(mentorEmail)` — pending bookings for mentor
  - `getMentorBookingHistory(mentorEmail)` — historical mentor bookings
  - `getStudentBookings(studentEmail)` — returns student's bookings enriched with mentor names

- `app/actions/getMentors.js`
  - `getMentorsList()` — returns approved mentors
  - `getMentorById(id)` — single mentor fetch
  - `applyForMentorship(formData)` — saves a mentor application (sets `applicationStatus: 'pending'`)
  - `getPendingMentors()` — admin helper
  - `verifyMentor(mentorId, action)` — admin approve/reject
  - `manualAddMentor(formData)` / `createMentor` — admin add mentor
  - `updateMentor(formData)` — update existing mentor, handle image upload

- `app/actions/contact.js`
  - `handleContactForm(formData)` — saves contact message and redirects


## Quick Notes & Recommendations
- Serverless platforms (Vercel/Netlify): do not store uploads in `public/uploads` for production; use S3/Cloudinary/Firebase Storage and store remote URLs in DB.
- Keep server actions in `app/actions/*` for discoverability.
- Use `auth()` in server components/pages that need the session and redirect unauthenticated users to `/api/auth/signin`.
- When a server action modifies important data, call `revalidatePath('/profile')` or other paths to ensure caches/SSG update.

---

If you want, I can now:
- Add inline file links to key function definitions (with line numbers)
- Auto-generate a checklist for pages missing server-side auth checks
- Run `npm run lint` and report syntax issues

Tell me which of the above you'd like next.