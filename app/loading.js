export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-50/80 backdrop-blur-sm dark:bg-black/80">
      <div className="flex flex-col items-center gap-4">
        
        {/* The Animated Logo */}
        <div className="relative flex h-16 w-16 animate-bounce items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-10 w-10 text-white"
          >
            <path d="M4.5 4.5a1.5 1.5 0 00-1.5 1.5v12a1.5 1.5 0 001.5 1.5h2.25a.75.75 0 00.75-.75v-6.75l3.75 3.75a1.5 1.5 0 002.12 0l3.75-3.75v6.75a.75.75 0 00.75.75h2.25a1.5 1.5 0 001.5-1.5v-12a1.5 1.5 0 00-1.5-1.5h-2.25a1.5 1.5 0 00-1.06.44L12 9.88 7.31 5.19A1.5 1.5 0 006.25 4.5H4.5z" />
          </svg>
        </div>

        {/* Loading Text */}
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-600 delay-75"></div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-600 delay-150"></div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-600 delay-300"></div>
        </div>
        
      </div>
    </div>
  );
}