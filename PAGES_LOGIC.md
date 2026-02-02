# Pages Logic Reference

This document maps each page in `/app` to the core logic it uses: server actions, components, and models. Use this as a quick reference when adding features.

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
- Key imports:
  # Pages Logic Reference

  This document maps each page in `/app` to the core logic it uses: whether it is client or server, key imports, server actions, and models. It's been updated after scanning the current `app/**/page.js` files.

  ---

  ## How to read this file
  - Path: page file under `app/`
  - Purpose: short description of the page
  - Type: `server` or `client` (and any protected redirects)
  - Key imports / actions: functions, server actions and components used by the page
  - Where the functions live: file path(s)

  ---

  ## Pages (summary)

  Note: many pages use shared components in `/components` and server helpers in `/app/actions`.

  - `/app/page.js` (client)
    - Purpose: Home / landing page with heavy UI/animation (framer-motion) and search UX.
    - Key imports: `framer-motion`, many `react-icons`, local UI components.
    - Behavior: purely client-rendered hero, search input (no server action), feature cards, FAQ, and live notifications.

  - `/app/about/page.js` (client)
    - Purpose: About / manifesto and team; presentational.
    - Key imports: presentational components, static content.

  - `/app/contact/page.js` (client)
    - Purpose: Contact form that uses a server action.
    - Key imports/actions: `handleContactForm` from `app/actions/contact.js` (server action).
    - Behavior: form posts to `handleContactForm`, then page reads `?success` and shows confirmation.

  - `/app/how-it-works/page.js` (client)
    - Purpose: Explanatory page for platform flows (students & mentors).
    - Key imports: presentational icons; contains CTA links to `/mentors` and `/become-mentor`.
    - Behavior: purely presentational; updated to include a Quick-Start card and CTAs.

  - `/app/mentors/page.js` (client)
    - Purpose: Public mentor directory with search & filters.
    - Key imports/actions: `getMentorsList` (client import from `app/actions/getMentors`), Mentor card components.
    - Behavior: fetches mentors via `getMentorsList()` on mount, supports search, filter pills and category grouping; links to `/mentors/[id]`.

  - `/app/mentors/[id]/page.js` (server)
    - Purpose: Mentor public profile.
    - Key imports/actions: `getMentorById` from `app/actions/getMentors`, `auth` for session checks.
    - Behavior: server-rendered profile, shows booking CTA to `/mentors/[id]/book`, conditionally shows edit link for owner/admin.

  - `/app/mentors/[id]/book/page.js` (server)
    - Purpose: Booking UI for a mentor (protected — redirects to sign-in if unauthenticated).
    - Key imports/actions: `getMentorById`, server action `createBooking` from `app/actions/bookingActions`, `auth`.
    - Behavior: server page that renders booking form whose `action` is the `createBooking` server action.

  - `/app/mentors/[id]/book/success/page.js` (client)
    - Purpose: Booking success confirmation (presentational).

  - `/app/mentors/[id]/edit/page.js` (server)
    - Purpose: Mentor edit page — owner or admin only (uses `auth` + session check).
    - Key imports/actions: `getMentorById`, `updateMentor` server action in `app/actions/getMentors`.
    - Behavior: server page that renders a form posting to `updateMentor`.

  - `/app/mentors/add/page.js` (server)
    - Purpose: Admin-only add mentor page (redirects non-admins).
    - Key imports/actions: `manualAddMentor` or `createMentor` from `app/actions/getMentors`.

  - `/app/mentors/apply/success/page.js` (client)
    - Purpose: Mentor application success (static confirmation page).

  - `/app/become-mentor/page.js` (client)
    - Purpose: Mentor application form (client) that calls `applyForMentorship` from `app/actions/getMentors`.
    - Behavior: uses session; redirects to sign-in if unauthenticated and calls server action on submit.

  - `/app/blogs/page.js` (client)
    - Purpose: Blog feed and comments UI (client-heavy).
    - Key imports/actions: client fetch to `/api/blogs` for data; uses `CommentNode` and `next-auth` session for actions (upvote/comment); admin list filtered by `ADMIN_EMAILS`.
    - Behavior: supports upvote/comment via API routes under `/app/api/blogs` and has client-side state for comments, toast, and filtering.

  - `/app/create-post/page.js` (client)
    - Purpose: Create blog post page (authenticated client page).
    - Behavior: protects with `next-auth` session; posts to `/api/blogs` via fetch.

  - `/app/profile/page.js` (server)
    - Purpose: Central profile/dashboard for users.
    - Key imports/actions/models: `auth` (server), `dbConnect`, `Mentor` model, `getIncomingBookings`, `getStudentBookings`, `getMentorBookingHistory` from `app/actions/bookingActions`.
    - Behavior: server-side decides view (mentor vs student) and renders `BookingManager` and `StudentBookingList` components; fetches bookings server-side.

  - `/app/dashboard/page.js` (server)
    - Purpose: Admin/overview dashboard (server data fetch).
    - Key imports/actions: `getDashboardStats` from `app/actions/dashboard`.

  - `/app/dashboard/*` (mixed client/server)
    - Examples: `/dashboard/add-mentor` (client), `/dashboard/blogs` (client) — pages interact with admin APIs and server endpoints.

  - `/app/admin/verify/page.js` (server)
    - Purpose: Admin verification UI.
    - Key imports/actions: `getPendingMentors`, `verifyMentor` from `app/actions/getMentors`; uses `auth` to validate admin email.

  - `/app/success-stories/page.js` (client)
    - Purpose: Presentational success stories page with filters and CTAs linking to `/mentors` and `/become-mentor`.

  - `/app/booking-error/page.js` (client)
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