MENTORCONNECT - PROJECT TREE

Repository root: e:/web dev/mentorconnect/my-app

.gitignore
.gitattributes
eslint.config.mjs
jsconfig.json
next.config.mjs
package.json
package-lock.json
PAGES_LOGIC.md
postcss.config.mjs
README.md
tailwind.config.js

app/
  ```markdown
  MENTORCONNECT - FULL PROJECT TREE

  Repository root: e:/web dev/mentorconnect/my-app

  .gitignore
  .gitattributes
  eslint.config.mjs
  jsconfig.json
  next.config.mjs
  package.json
  package-lock.json
  PAGES_LOGIC.md
  postcss.config.mjs
  README.md
  tailwind.config.js
  TREE.md

  app/
    globals.css
    layout.js
    loading.js
    not-found.js
    page.js
    providers.js
    icon.svg
    favicon.ico

    about/
      page.js

    access-denied/
      page.js

    actions/
      bookingActions.js
      contact.js
      dashboard.js
      form.js
      getMentors.js

    admin/
      verify/
        page.js

    api/
      auth/
        [...nextauth]/
          route.js
      blogs/
        route.js
        [id]/
          route.js
          upvote/
            route.js
          comment/
            route.js
            [commentId]/
              route.js
      chat/
        route.js

    become-mentor/
      page.js

    blogs/
      page.js

    booking-error/
      page.js

    contact/
      page.js

    create-post/
      page.js

    dashboard/
      layout.js
      page.js
      add-mentor/
        page.js
      blogs/
        page.js
      messages/
        page.js

    how-it-works/
      page.js

    mentors/
      page.js
      [id]/
        page.js
        book/
          page.js
            success/
              page.js
        edit/
          page.js
      add/
        page.js
      apply/
        success/
          page.js

    profile/
      page.js

    success-stories/
      page.js

  components/
    Authbutton.js
    BookingManager.js
    Chatbot.js
    CommentNode.js
    CountdownTimr.js
    Footer.js
    Navbar.js
    Providers.js
    StudentBookingList.js

  lib/
    auth.js
    blogData.js
    cloudinary.js
    db.js

  models/
    Blog.js
    Booking.js
    Contact.js
    Mentor.js

  public/
    uploads/   (local dev uploads; prefer cloud storage in production)
    window.svg
    vercel.svg
    next.svg
    file.svg
    globe.svg

  - Notes / highlights
  - Server actions live under `app/actions/*` (bookingActions, getMentors, contact, form).
  - API routes for blogs, chat, and next-auth live under `app/api/*`.
  - Pages and components are a mix of server and client components; check files for `use client` where needed.

  If you want, I can:
  - Add file links with line numbers for key functions into `PAGES_LOGIC.md`.
  - Run `npm run lint` and report any issues.
  - Generate a JSON or YAML version of this tree for tooling.

  Generated on: 2026-02-04

  ```
