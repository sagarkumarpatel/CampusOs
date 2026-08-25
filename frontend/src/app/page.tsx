import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-1 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white flex flex-col justify-center items-center px-4 relative overflow-hidden select-none">
      {/* Decorative gradient glowing spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

      <div className="max-w-4xl text-center z-10 flex flex-col items-center">
        <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 mb-6 animate-pulse">
          Version 1.0 Live
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-violet-300">
          CampusOS
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed font-light">
          Your complete campus growth journey connected in one unified ecosystem.
          Placement preparation, mentor matching, event hubs, and career tracking.
        </p>

        {/* Five Core Needs Grid Preview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mb-12 text-left">
          {[
            { title: 'Placement Prep', desc: 'DSA & CS fundamentals progress tracker.' },
            { title: 'Mentor Guidance', desc: 'Find alumni & developers for mentorship.' },
            { title: 'Event Registration', desc: 'Hackathons, coding contests & seminars.' },
            { title: 'Academic Resources', desc: 'Lecture notes, PYQs, and cheat sheets.' },
            { title: 'Career Tracking', desc: 'Track jobs, internships & timelines.' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-300 cursor-default group"
            >
              <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-normal">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/auth/register"
            className="px-8 py-3.5 rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Create Account
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-3.5 rounded-xl font-medium bg-white/5 border border-white/10 hover:bg-white/10 text-white hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
