MENTORCONNECT - PROJECT TREE

Repository root: e:/web dev/mentorconnect/my-app

eslint.config.mjs
jsconfig.json
next.config.mjs
package.json
PAGES_LOGIC.md
postcss.config.mjs
README.md
tailwind.config.js

app/
  page.js
  globals.css
  layout.js
  loading.js
  not-found.js
  providers.js
  about/
    page.js
  actions/
    bookingActions.js
    contact.js
    dashboard.js
    getMentors.js
    form.js
    bookingActions.js (duplicate reference - main file above)
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
        comment/
          route.js
          [commentId]/
            route.js
        upvote/
          route.js
    // (other API routes if present)
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
    add/
      page.js
    [id]/
      page.js
      book/
        page.js
        success/
          page.js
      edit/
        page.js
    apply/
      success/
        page.js
  profile/
    page.js
  success-stories/
    page.js
  booking-error/
    page.js

components/
  Authbutton.js
  BookingManager.js
  CommentNode.js
  Footer.js
  Navbar.js
  Providers.js
  StudentBookingList.js

lib/
  auth.js
  blogData.js
  db.js

models/
  Blog.js
  Booking.js
  Contact.js
  Mentor.js

public/
  uploads/   (intended location for local dev uploads; not recommended for production)
  default-avatar.png (referenced in pages)
  avatars/   (images referenced in About page)

Notes / highlights
- Pages split between server components (e.g., profile, mentors/[id], booking pages) and client components (home, blogs, create-post).
- Server actions live under `app/actions/*` (bookingActions, getMentors, contact).
- API routes for blogs and next-auth live under `app/api/*`.
- Use `public/uploads` for local/dev file storage only; production should use object storage (S3/Cloudinary).

If you want, I can:
- Add file links with line numbers for key functions into `PAGES_LOGIC.md`.
- Run `npm run lint` and report any issues.
- Generate a JSON or YAML version of this tree for tooling.

Generated on: 2026-01-28
