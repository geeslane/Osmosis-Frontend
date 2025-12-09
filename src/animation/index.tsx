import { Variants } from 'framer-motion';

export const navbarVariants: Variants = {
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'tween', duration: 0.6, ease: 'easeInOut' },
  },
  hidden: {
    y: 0,
    opacity: 0,
    transition: { type: 'tween', duration: 0.6, ease: 'easeInOut' },
  },
};

export const mobileMenuVariants: Variants = {
  closed: {
    x: '100%',
    opacity: 0,
    transition: { type: 'tween', duration: 0.4, ease: 'easeInOut' },
  },
  open: {
    x: 0,
    opacity: 1,
    transition: { type: 'tween', duration: 0.4, ease: 'easeInOut' },
  },
};
