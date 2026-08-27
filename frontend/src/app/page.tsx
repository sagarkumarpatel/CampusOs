"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Users, Calendar, Briefcase, Terminal, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const navLinks = [
    { name: 'Home', href: '#top' },
    { name: 'Features', href: '#features' },
    { name: 'Mentorship', href: '#mentorship' },
    { name: 'Events', href: '#events' },
    { name: 'Resources', href: '#resources' },
  ];

  return (
    <div id="top" className="min-h-screen bg-[#121212] text-[#AAAAAA] font-sans selection:bg-[#FF5722]/30 selection:text-white flex flex-col overflow-x-hidden scroll-smooth">
      
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-[#FF5722]/10 border border-[#FF5722]/30 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-[#FF5722]" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">CampusOS</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium hover:text-[#FF5722] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#FF5722] text-white hover:bg-[#FF6B00] shadow-lg shadow-[#FF5722]/20 hover:scale-105 active:scale-95 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6 relative flex flex-col items-center justify-center text-center z-10 min-h-[70vh]">
        
        {/* Subtle glowing radial gradient in the background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF5722]/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722]">
            Unified Growth Platform
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Unlock Your Campus <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#AAAAAA]">Career Potential</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            The unified growth platform for students. Placement prep, mentor matching, event hubs, academic resources, and career tracking—all under one authenticated roof.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/login">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-semibold bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/20 flex items-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Features Sections */}
      <div className="flex flex-col gap-24 pb-24">
        
        {/* Features (Placement Prep) */}
        <section id="features" className="pt-24 px-6 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex-1 space-y-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#FF5722]/10 border border-[#FF5722]/20 flex items-center justify-center">
              <Terminal className="w-6 h-6 text-[#FF5722]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Placement Prep</h2>
            <p className="text-lg leading-relaxed max-w-lg">
              Track your DSA progress, manage private subject notes, and easily maintain your personal resume link in one central dashboard.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex-1 w-full"
          >
            {/* Demo Card */}
            <div className="bg-[#1E1E1E] rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5722]/5 rounded-full blur-2xl group-hover:bg-[#FF5722]/10 transition-colors" />
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="font-semibold text-white">Data Structures</span>
                  <span className="text-[#FF5722] text-sm font-bold">45/150 Solved</span>
                </div>
                <div className="space-y-3">
                  {['Arrays', 'Linked Lists', 'Trees'].map((topic, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#242424] p-3 rounded-xl border border-white/5">
                      <CheckCircle2 className={`w-5 h-5 ${i === 0 ? 'text-green-500' : 'text-[#AAAAAA]'}`} />
                      <span className={i === 0 ? 'text-white' : 'text-[#AAAAAA]'}>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Mentorship */}
        <section id="mentorship" className="pt-24 px-6 max-w-7xl mx-auto w-full flex flex-col md:flex-row-reverse items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex-1 space-y-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#FF5722]/10 border border-[#FF5722]/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#FF5722]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Mentorship</h2>
            <p className="text-lg leading-relaxed max-w-lg">
              Connect with expert mentors and seniors. Schedule session requests for resume reviews and get personalized career guidance.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex-1 w-full"
          >
            {/* Demo Card */}
            <div className="bg-[#1E1E1E] rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF5722]/5 rounded-full blur-2xl group-hover:bg-[#FF5722]/10 transition-colors" />
              <div className="space-y-4 relative z-10 flex flex-col gap-4">
                <div className="flex gap-4 items-center bg-[#242424] p-4 rounded-xl border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#FF5722]/30 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#FF5722]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">Sarah Jenkins</h4>
                    <p className="text-xs text-[#AAAAAA]">Senior SWE @ TechCorp</p>
                  </div>
                  <button className="px-3 py-1.5 text-xs rounded-lg bg-[#FF5722]/10 text-[#FF5722] font-semibold">Request</button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Events */}
        <section id="events" className="pt-24 px-6 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex-1 space-y-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#FF5722]/10 border border-[#FF5722]/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#FF5722]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Events Hub</h2>
            <p className="text-lg leading-relaxed max-w-lg">
              Stay up to date. Browse campus announcements, register for upcoming workshops, hackathons, and coding contests.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex-1 w-full"
          >
            {/* Demo Card */}
            <div className="bg-[#1E1E1E] rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#FF5722]/5 rounded-full blur-2xl group-hover:bg-[#FF5722]/10 transition-colors" />
              <div className="relative z-10">
                <div className="h-32 bg-[#242424] rounded-xl mb-4 border border-white/5 flex items-center justify-center overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-r from-[#FF5722]/10 to-transparent" />
                   <Calendar className="w-8 h-8 text-[#FF5722]/50" />
                </div>
                <h4 className="text-white font-semibold text-lg">Annual Hackathon 2026</h4>
                <p className="text-sm text-[#AAAAAA] mt-1 mb-4">Join 500+ students for 48 hours of coding.</p>
                <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-semibold transition-colors border border-white/5">
                  View Event
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Resources */}
        <section id="resources" className="pt-24 px-6 max-w-7xl mx-auto w-full flex flex-col md:flex-row-reverse items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex-1 space-y-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#FF5722]/10 border border-[#FF5722]/20 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-[#FF5722]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Resources</h2>
            <p className="text-lg leading-relaxed max-w-lg">
              Access shared academic materials like PYQs and lecture notes. Apply for internships, and maintain application checklists.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex-1 w-full"
          >
            {/* Demo Card */}
            <div className="bg-[#1E1E1E] rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FF5722]/5 rounded-full blur-2xl group-hover:bg-[#FF5722]/10 transition-colors" />
              <div className="space-y-4 relative z-10 flex flex-col gap-3">
                <div className="bg-[#242424] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <BookOpen className="w-5 h-5 text-[#AAAAAA]" />
                    <span className="text-white text-sm">OS Cheat Sheet</span>
                  </div>
                  <span className="text-xs text-[#FF5722] bg-[#FF5722]/10 px-2 py-1 rounded">PDF</span>
                </div>
                <div className="bg-[#242424] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <Briefcase className="w-5 h-5 text-[#AAAAAA]" />
                    <span className="text-white text-sm">Summer Internship</span>
                  </div>
                  <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">Applied</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#AAAAAA]" />
            <span className="font-semibold text-white">CampusOS</span>
          </div>
          <p className="text-sm text-center md:text-left">
            © 2026 CampusOS. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
