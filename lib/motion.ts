/**
 * Luxury real estate design system — Framer Motion variants.
 * Use with whileInView and viewport={{ once: true, amount: 0.2 }} for scroll-triggered animations.
 * Ease: [0.16, 1, 0.3, 1] for premium feel.
 */

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export const stagger = {
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

export const viewportOnce = { once: true, amount: 0.2 } as const

export const buttonHoverTap = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
} as const
