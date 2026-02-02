"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa"; // Run: npm install react-icons

export default function Footer() {
  const pathname = usePathname();

  // Hide on dashboard
  if (pathname.startsWith("/dashboard")) {
    return null;
  }
  return (
    <footer className="border-t border-zinc-200 bg-white pt-16 pb-8 dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <span className="text-lg font-bold">M</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Mentor<span className="text-indigo-600">Connect</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Empowering students to crack JEE, NEET, GATE, and more by connecting them with mentors who have been there, done that.
            </p>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white">Platform</h3>
            <ul role="list" className="mt-6 space-y-4">
              <li>
                <Link href="/mentors" className="text-sm leading-6 text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">
                  Browse Mentors
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm leading-6 text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm leading-6 text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Student Resources */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white">Resources</h3>
            <ul role="list" className="mt-6 space-y-4">
              <li>
                <Link href="/success-stories" className="text-sm leading-6 text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/materials" className="text-sm leading-6 text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">
                  Study Roadmaps
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-sm leading-6 text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">
                  Community Discord
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white">Stay Updated</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Get the latest study tips and mentor updates directly to your inbox.
            </p>
            <form className="mt-4 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="w-full min-w-0 appearance-none rounded-md border-0 bg-zinc-100 px-3 py-1.5 text-base text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
                placeholder="Enter your email"
              />
              <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="mt-16 border-t border-zinc-200 pt-8 dark:border-zinc-800 sm:mt-20 md:flex md:items-center md:justify-between">
          <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} Mentor Connect Inc. All rights reserved.
          </p>
          <div className="mt-8 flex space-x-6 md:order-2 md:mt-0">
            <Link href="#" className="text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300">
              <span className="sr-only">Facebook</span>
              <FaLinkedin className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300">
              <span className="sr-only">Instagram</span>
              <FaInstagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300">
              <span className="sr-only">Twitter</span>
              <FaTwitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300">
              <span className="sr-only">GitHub</span>
              <FaGithub className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}