'use client'

import { motion } from 'framer-motion'

export default function TabbyLogo() {
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
        {/* Real Tabby Green Background */}
        <rect width="130" height="44" rx="24" fill="#3BFF9D" />

        {/* Tabby Text */}
        <text
          x="65"
          y="28"
          fontFamily="'IBM Plex Mono', 'IBM Plex Sans Arabic', 'Inter', sans-serif"
          fontSize="20"
          fontWeight="600"
          fill="#131C26"
          textAnchor="middle"
        >
          تابي
        </text>
      </svg>
    </motion.div>
  )
}
