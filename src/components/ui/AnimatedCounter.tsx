"use client";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export function AnimatedCounter({ end, duration = 2000, prefix = "", suffix = "" }: { 
  end: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string; 
}) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (!inView) return;
    
    let startTime: number;
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };
    
    requestAnimationFrame(animateCount);
  }, [end, duration, inView]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
