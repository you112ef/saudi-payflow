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
        width="120"
        height="40"
        viewBox="0 0 120 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="120" height="40" rx="8" fill="#6f4df5" />
        <text
          x="60"
          y="25"
          fontFamily="Arial, sans-serif"
          fontSize="18"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
        >
          تابي
        </text>
      </svg>
    </motion.div>
  )
}
