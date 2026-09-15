import { blogPosts, blogSection } from '#/content/copy'

export function BlogSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#138275] sm:text-sm">
            {blogSection.tagline}
          </p>
          <h2 className="mx-auto mt-2 max-w-2xl text-2xl font-extrabold tracking-tight text-[#16282e] sm:text-3xl lg:text-4xl">
            {blogSection.title}
          </h2>
        </div>

        {/* Post Cards */}
        <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-12 sm:grid-cols-2 lg:gap-10">
          {blogPosts.map((post) => (
            <article key={post.title}>
              <div className="h-[260px] w-full overflow-hidden rounded-t-2xl sm:h-[300px]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="relative z-10 -mt-14 ml-6 mr-3 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:ml-8 sm:mr-6 sm:p-7">
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4 text-[#138275]" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <PersonIcon className="h-4 w-4 text-[#138275]" />
                    Por {post.author}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-bold leading-snug tracking-tight text-[#16282e] sm:text-lg">
                  {post.title}
                </h3>
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#138275]">
                    Ler mais »
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="4.5" width="17" height="16" rx="1.5" />
      <path d="M3.5 9.5h17M8 3v3M16 3v3" />
    </svg>
  )
}

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </svg>
  )
}
