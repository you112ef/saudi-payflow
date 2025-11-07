'use client'

import { motion } from 'framer-motion'

export default function TamaraLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2"
    >
      <svg
        width="130"
        height="44"
        viewBox="0 0 130 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Real Tamara Gradient */}
        <defs>
          <linearGradient id="tamara-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#370A56" />
            <stop offset="29%" stopColor="#7121AF" />
            <stop offset="59.79%" stopColor="#8B00EF" />
            <stop offset="96.99%" stopColor="#F933A1" />
          </linearGradient>
        </defs>
        <rect width="130" height="44" rx="8" fill="url(#tamara-gradient)" />
        <text
          x="65"
          y="28"
          fontFamily="'IBM Plex Sans', 'Ibmplexsansarabic', 'Open Sans', sans-serif"
          fontSize="20"
          fontWeight="600"
          fill="white"
          textAnchor="middle"
        >
          تمارا
        </text>
      </svg>
    </motion.div>
  )
}
