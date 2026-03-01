'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const getVariants = (direction, distance) => {
    const hidden = { opacity: 0 };
    const visible = { opacity: 1 };

    switch (direction) {
        case 'up':
            hidden.y = distance;
            visible.y = 0;
            break;
        case 'down':
            hidden.y = -distance;
            visible.y = 0;
            break;
        case 'left':
            hidden.x = distance;
            visible.x = 0;
            break;
        case 'right':
            hidden.x = -distance;
            visible.x = 0;
            break;
        default:
            break;
    }

    return { hidden, visible };
};

export function ScrollReveal({
    children,
    className = '',
    delay = 0,
    duration = 0.8,
    direction = 'up',
    distance = 30,
    once = true,
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: '-50px' });
    const controls = useAnimation();
    const variants = getVariants(direction, distance);

    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        } else if (!once) {
            controls.start('hidden');
        }
    }, [isInView, controls, once]);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Stagger children animation container
export function StaggerContainer({
    children,
    className = '',
    staggerDelay = 0.15,
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Stagger item for use inside StaggerContainer
export function StaggerItem({
    children,
    className = '',
    direction = 'up',
}) {
    const variants = getVariants(direction, 30);

    return (
        <motion.div
            variants={variants}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Counter animation hook
export function useCountUp(end, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }, [isInView, end, duration]);

    return { count, ref };
}

// Parallax effect hook
export function useParallax(speed = 0.5) {
    const [offset, setOffset] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const scrolled = window.innerHeight - rect.top;
            setOffset(scrolled * speed * 0.1);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return { offset, ref };
}
