"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Users, Calendar, Briefcase, Terminal, ArrowRight, CheckCircle2 } from 'lucide-react';
import Hero from './Hero';

export default function Home() {
  const navLinks = [
    { name: 'Home', href: '#top' },
    { name: 'Features', href: '#features' },
    { name: 'Mentorship', href: '#mentorship' },
    { name: 'Events', href: '#events' },
    { name: 'Resources', href: '#resources' },
  ];

  return (
    <div id="top" className="min-h-screen bg-[#ffffff] text-[#555555] font-sans selection:bg-[#FF5722]/30 selection:text-black flex flex-col overflow-x-hidden scroll-smooth">
      
      {/* Hero Section */}
      <Hero />

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
            <h2 className="text-3xl md:text-5xl font-bold text-black tracking-tight">Placement Prep</h2>
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
            <div className="bg-[#FAFAFA] rounded-3xl p-6 border border-black/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5722]/5 rounded-full blur-2xl group-hover:bg-[#FF5722]/10 transition-colors" />
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center border-b border-black/5 pb-4">
                  <span className="font-semibold text-black">Data Structures</span>
                  <span className="text-[#FF5722] text-sm font-bold">45/150 Solved</span>
                </div>
                <div className="space-y-3">
                  {['Arrays', 'Linked Lists', 'Trees'].map((topic, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#ffffff] p-3 rounded-xl border border-black/5 shadow-sm">
                      <CheckCircle2 className={`w-5 h-5 ${i === 0 ? 'text-green-500' : 'text-[#888888]'}`} />
                      <span className={i === 0 ? 'text-black' : 'text-[#555555]'}>{topic}</span>
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
            <h2 className="text-3xl md:text-5xl font-bold text-black tracking-tight">Mentorship</h2>
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
            <div className="bg-[#FAFAFA] rounded-3xl p-6 border border-black/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF5722]/5 rounded-full blur-2xl group-hover:bg-[#FF5722]/10 transition-colors" />
              <div className="space-y-4 relative z-10 flex flex-col gap-4">
                <div className="flex gap-4 items-center bg-[#ffffff] p-4 rounded-xl border border-black/5 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-[#FAFAFA] border border-[#FF5722]/30 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#FF5722]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-black font-semibold">Sarah Jenkins</h4>
                    <p className="text-xs text-[#555555]">Senior SWE @ TechCorp</p>
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
            <h2 className="text-3xl md:text-5xl font-bold text-black tracking-tight">Events Hub</h2>
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
            <div className="bg-[#FAFAFA] rounded-3xl p-6 border border-black/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#FF5722]/5 rounded-full blur-2xl group-hover:bg-[#FF5722]/10 transition-colors" />
              <div className="relative z-10">
                <div className="h-32 bg-[#ffffff] rounded-xl mb-4 border border-black/5 flex items-center justify-center overflow-hidden relative shadow-sm">
                   <div className="absolute inset-0 bg-gradient-to-r from-[#FF5722]/10 to-transparent" />
                   <Calendar className="w-8 h-8 text-[#FF5722]/50" />
                </div>
                <h4 className="text-black font-semibold text-lg">Annual Hackathon 2026</h4>
                <p className="text-sm text-[#555555] mt-1 mb-4">Join 500+ students for 48 hours of coding.</p>
                <button className="w-full py-2 bg-black/5 hover:bg-black/10 text-black rounded-lg text-sm font-semibold transition-colors border border-black/5">
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
            <h2 className="text-3xl md:text-5xl font-bold text-black tracking-tight">Resources</h2>
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
            <div className="bg-[#FAFAFA] rounded-3xl p-6 border border-black/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FF5722]/5 rounded-full blur-2xl group-hover:bg-[#FF5722]/10 transition-colors" />
              <div className="space-y-4 relative z-10 flex flex-col gap-3">
                <div className="bg-[#ffffff] p-4 rounded-xl border border-black/5 shadow-sm flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <BookOpen className="w-5 h-5 text-[#888888]" />
                    <span className="text-black text-sm">OS Cheat Sheet</span>
                  </div>
                  <span className="text-xs text-[#FF5722] bg-[#FF5722]/10 px-2 py-1 rounded">PDF</span>
                </div>
                <div className="bg-[#ffffff] p-4 rounded-xl border border-black/5 shadow-sm flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <Briefcase className="w-5 h-5 text-[#888888]" />
                    <span className="text-black text-sm">Summer Internship</span>
                  </div>
                  <span className="text-xs text-green-600 bg-green-500/10 px-2 py-1 rounded">Applied</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-black/10 py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#888888]" />
            <span className="font-semibold text-black">CampusOS</span>
          </div>
          <p className="text-sm text-center md:text-left text-[#555555]">
            © 2026 CampusOS. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-[#555555]">
            <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-black transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
