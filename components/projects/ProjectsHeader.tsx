"use client"
import { motion, Variants } from 'framer-motion'

export default function ProjectsHeader() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  return (
    <motion.section
      className="px-6 md:px-12 max-w-7xl mx-auto mb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 variants={itemVariants} className="text-sm uppercase tracking-[0.4em] text-neutral-500 font-bold mb-4">
        Case Studies
      </motion.h2>
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-[0.9]">
          Selected Work
        </motion.h1>
        <motion.p variants={itemVariants} className="text-on-surface-variant max-w-sm text-sm uppercase leading-loose font-bold text-right">
          Problem → Solution → Impact.
          <br />
          <span className="text-neutral-600">Every system is engineered to a defensible standard.</span>
        </motion.p>
      </div>
    </motion.section>
  )
}
