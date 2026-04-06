"use client"
import { motion } from 'framer-motion'

export default function PersonalProjectsCallout() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="px-6 md:px-12 max-w-7xl mx-auto mb-12"
        >
            <div className="bg-surface-container border border-white/5 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-white/20 transition-colors relative overflow-hidden group">
                {/* Abstract Decoration Background */}
                <motion.div
                    className="absolute right-0 top-0 w-64 h-64 bg-accent-green/5 blur-[100px] rounded-full pointer-events-none"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="flex items-center gap-6 z-10 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-full bg-accent-green/10 border border-accent-green/20 flex flex-shrink-0 items-center justify-center text-accent-green relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-accent-green/20"
                            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="material-symbols-outlined text-3xl z-10">folder_open</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-black uppercase text-white tracking-tighter mb-1">MY PROJECT</h3>
                        <p className="text-sm font-bold leading-relaxed">
                            <span className="text-accent-green tracking-[0.2em] uppercase">Personal Portfolios</span>
                        </p>
                    </div>
                </div>

                <div className="text-left md:text-right z-10 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/10 md:border-t-0">
                    <p className="text-[12px] text-neutral-500 uppercase tracking-widest font-bold max-w-xs md:ml-auto group-hover:text-neutral-400 transition-colors">
                        Showcasing individual experiments, creative coding, and system design explorations.
                    </p>
                </div>
            </div>
        </motion.section>
    )
}
