# MENTORCONNECT - PROJECT TREE

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

## Extras / Notes

- **Server actions:** live under `app/actions/*` (e.g., `bookingActions.js`, `getMentors.js`, `contact.js`, `form.js`).
- **API routes:** see `app/api/*` for blogs, chat, and next-auth routes.
- **Uploads:** `public/uploads/` used for local dev; consider cloud storage for production.
- **Components:** mix of server and client components—check files for `use client` where needed.

## Suggested next steps

- **Add file links:** populate `PAGES_LOGIC.md` with links to key functions and lines.
- **Run lint:** `npm run lint` to surface style/type issues.
- **Export:** generate JSON/YAML representation for tooling or CI.
- **Already exported:** full tree also saved to `PROJECT_TREE.md`.

Generated on: 2026-02-06
