'use client';
import { Work } from "@prisma/client";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ProjectCard } from "@/components/web/work/project-card";

export const MarqueeRow = ({
    works,
    direction,
    speed,
  }: {
    works: Work[];
    direction: 'left' | 'right';
    speed: number;
  }) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const worksSignature = works.map((work) => work.id).join('-');
  
    const calculateCycleWidth = (container: HTMLDivElement) => {
      const children = Array.from(container.children) as HTMLElement[];
      if (!children.length) return 0;
  
      const segmentCount = children.length % 3 === 0 ? 3 : 1;
      const segmentSize = Math.max(1, Math.floor(children.length / segmentCount));
      const referenceChild = children[0] as HTMLElement | undefined;
      const sentinelChild = children[segmentSize] as HTMLElement | undefined;
  
      if (referenceChild && sentinelChild) {
        const width = Math.abs(sentinelChild.offsetLeft - referenceChild.offsetLeft);
        if (width) {
          return width;
        }
      }
  
      const lastChild = children.at(-1);
      if (referenceChild && lastChild) {
        const width =
          lastChild.offsetLeft +
          lastChild.getBoundingClientRect().width -
          referenceChild.offsetLeft;
        if (width) {
          return width;
        }
      }
  
      return container.scrollWidth;
    };
  
    useGSAP(
      () => {
        if (!rowRef.current) return;
  
        const row = rowRef.current;
        const cycleWidth = calculateCycleWidth(row);
        const viewportWidth =
          row.parentElement?.getBoundingClientRect().width ??
          row.getBoundingClientRect().width;
        const fallbackTravel =
          viewportWidth && viewportWidth > 0
            ? Math.min(cycleWidth, viewportWidth * 0.25)
            : cycleWidth;
  
        if (!cycleWidth) return;
  
        timelineRef.current?.kill();
  
        const safeTravel =
          direction === 'left'
            ? Math.max(cycleWidth - viewportWidth, fallbackTravel)
            : cycleWidth;
  
        if (!safeTravel) return;
  
        const fromX = direction === 'left' ? 0 : -safeTravel;
        const toX = direction === 'left' ? -safeTravel : 0;
  
        gsap.set(row, { x: fromX });
  
        const timeline = gsap.timeline({
          repeat: -1,
          yoyo: true,
          defaults: { ease: 'none' },
        });
  
        timeline.fromTo(row, { x: fromX }, { x: toX, duration: speed });
        timelineRef.current = timeline;
  
        return () => {
          timeline.kill();
          timelineRef.current = null;
        };
      },
      { scope: rowRef, dependencies: [direction, speed, worksSignature] }
    );
  
    const handleMouseEnter = () => {
      setIsPaused(true);
      timelineRef.current?.pause();
    };
  
    const handleMouseLeave = () => {
      setIsPaused(false);
      timelineRef.current?.resume();
    };
  
    return (
      <div
        className='relative'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={rowRef}
          className='flex gap-6'
          style={{ willChange: 'transform' }}
        >
          {works.map((work, index) => (
            <ProjectCard key={`${work.id}-${index}`} work={work} index={index} isPaused={isPaused} />
          ))}
        </div>
      </div>
    );
  };
  
  