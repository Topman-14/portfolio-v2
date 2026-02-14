'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ProjectCard } from './project-card';
import { RevealHeader } from '@/components/custom/reveal-header';
import { GButton } from '@/components/ui/gbutton';
import { ArrowRight } from 'lucide-react';

type ProjectWork = {
    id: string;
    title: string;
    description: string;
    image: string | null;
    tools: string[];
    category: string | null;
};

export const ProjectsStack = ({ works }: { works: ProjectWork[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const length = works.length;

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <div className='relative'>
            <div
                ref={containerRef}
                style={{ height: `${length * 100}vh` }}
                className='relative'
            >
                <div
                    className='sticky top-0 h-screen flex-col flex items-center justify-center overflow-visible'
                    style={{
                        perspective: '2000px',
                        perspectiveOrigin: 'center center'
                    }}
                >
                    <RevealHeader
                        title='Projects'
                        subtitle="A few featured builds — scroll to swipe through them, then dive into the full archive."
                        className='w-full pt-10 md:pt-20'
                    />
                    <div className='relative w-full h-full' style={{ transformStyle: 'preserve-3d' }}>
                        {works.map((work, index) => (
                            <StackCard
                                key={work.id}
                                work={work}
                                index={index}
                                totalCards={length}
                                scrollYProgress={scrollYProgress}
                            />
                        ))}
                    </div>
                    <GButton href='/work' className='group mb-5 md:mb-10'>
                        <span>View More</span>
                        <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                    </GButton>
                </div>
            </div>
        </div>
    );
};

type StackCardProps = {
    work: ProjectWork;
    index: number;
    totalCards: number;
    scrollYProgress: MotionValue<number>;
};

const StackCard = ({ work, index, totalCards, scrollYProgress }: StackCardProps) => {
    const cardProgress = 1 / totalCards;
    const start = cardProgress * index;
    const end = cardProgress * (index + 1);

    const [currentZIndex, setCurrentZIndex] = useState(totalCards - index);

    const y = useTransform(
        scrollYProgress,
        [0, start, end, 1],
        [index * 40, index * 40, -100, -100 - ((totalCards - index - 1) * 40)]
    );

    const scale = useTransform(
        scrollYProgress,
        [0, start, start + 0.01, end - 0.01, end],
        [1 - (index * 0.05), 1 - (index * 0.05), 1, 1, 0.95]
    );

    const opacity = useTransform(
        scrollYProgress,
        [0, start, start + 0.01, end - 0.05, end, end + 0.1],
        [1, 1, 1, 1, 0.3, 0]
    );

    const rotateX = useTransform(
        scrollYProgress,
        [0, start, end],
        [(totalCards - index) * 3, (totalCards - index) * 3, 0]
    );

    const translateZ = useTransform(
        scrollYProgress,
        [0, start, end, 1],
        [-index * 50, -index * 50, 0, -500]
    );

    const pointerEvents = useTransform(scrollYProgress, (latest) => {
        return (latest >= start && latest < end) ? 'auto' : 'none';
    });

    useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            let newZIndex;

            if (latest >= start && latest < end) {
                newZIndex = totalCards + 10;
            } else if (latest >= end) {
                newZIndex = index;
            } else {
                newZIndex = totalCards - index;
            }

            setCurrentZIndex(newZIndex);
        });

        return () => unsubscribe();
    }, [scrollYProgress, start, end, index, totalCards, work.title, translateZ]);

    return (
        <motion.div
            className='absolute inset-0 w-full flex items-center justify-center px-4'
            style={{
                y,
                scale,
                opacity,
                rotateX,
                translateZ,
                zIndex: currentZIndex,
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
                pointerEvents: pointerEvents as unknown as 'auto' | 'none',
            }}
        >
            <ProjectCard work={work} />
        </motion.div>
    );
};

