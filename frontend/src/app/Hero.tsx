"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import styles from "./Hero.module.css";

const customEase = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <div className={styles.heroContainer}>
      {/* Navbar (Top) */}
      <motion.nav
        className={styles.navbar}
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: customEase }}
      >
        <div className={`${styles.navLeft} ${styles.navClickable}`}>
          <div className={styles.logoIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="6"
                width="8"
                height="16"
                rx="4"
                transform="rotate(-35 2 6)"
                fill="black"
              />
              <rect
                x="12"
                y="10"
                width="8"
                height="16"
                rx="4"
                transform="rotate(-35 12 10)"
                fill="black"
              />
            </svg>
            <span className={styles.logoText}>CampusOS</span>
          </div>

          <a href="#top" className={`${styles.menuPill} ${styles.navClickable}`} style={{ textDecoration: 'none' }}>
            <div className={styles.menuBadge}>
              <Home size={12} strokeWidth={2.5} />
            </div>
            Home
          </a>

          <div className={styles.navTagsContainer}>
            <a href="#features" className={styles.navTagPill}>Placement Prep</a>
            <a href="#mentorship" className={styles.navTagPill}>Mentorship Hub</a>
          </div>
        </div>

        <div className={`${styles.navRight} ${styles.navClickable}`}>
          <Link href="/auth/login" className={styles.portalPill}>
            <span className={styles.portalText}>Portal Access</span>
            <div className={styles.portalIcon}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="3" cy="3" r="1.5" fill="white" />
                <circle cx="9" cy="3" r="1.5" fill="white" />
                <circle cx="3" cy="9" r="1.5" fill="white" />
                <circle cx="9" cy="9" r="1.5" fill="white" />
              </svg>
            </div>
          </Link>
        </div>
      </motion.nav>

      {/* Background Video */}
      <motion.div
        className={styles.videoWrapper}
        initial={{ x: "-50%", y: "-50%", scale: 1.05, opacity: 0 }}
        animate={{ x: "-50%", y: "-50%", scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: customEase }}
      >
        <video
          className={styles.video}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </motion.div>

      {/* Footer Content (Bottom) */}
      <motion.div
        className={styles.footer}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.5, ease: customEase }}
      >
        <div className={styles.footerLeft}>
          <motion.div
            className={styles.subtitleRow}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: customEase }}
          >
            <div className={styles.bullet} />
            Unified Student Growth Platform
          </motion.div>

          <motion.h1
            className={styles.heading}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: customEase }}
          >
            Unlock Your Campus <br /> Career Potential.
          </motion.h1>

          <motion.div
            className={styles.buttonsRow}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0, ease: customEase }}
          >
            <Link href="/auth/login" className={styles.primaryBtn}>
              Get Started
            </Link>
            <a href="#features" className={styles.secondaryBtn}>Explore Platform</a>
          </motion.div>
        </div>

        <motion.div
          className={styles.footerRight}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0, ease: customEase }}
        >
          <a href="#features" className={styles.tagPill}>DSA Tracker</a>
          <a href="#mentorship" className={styles.tagPill}>Mentorship</a>
          <a href="#events" className={styles.tagPill}>Events</a>
        </motion.div>
      </motion.div>
    </div>
  );
}
