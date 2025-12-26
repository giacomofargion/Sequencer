"use client";

import { useState, useEffect, useRef } from "react";
import type { FC } from "react";

type TutorialStep = {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for element to highlight
  position?: "top" | "bottom" | "left" | "right" | "center";
  action?: () => void; // Optional action to perform
};

type Props = {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
};

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to Fargion Sequencer!",
    description: "Let's take a quick tour of the interface. This tutorial will show you the basics of creating beats and patterns.",
    position: "center",
  },
  {
    id: "transport",
    title: "Transport Controls",
    description: "Use these controls to play/pause, adjust tempo (BPM), and set your loop range. Try clicking the play button to hear the default beat!",
    target: '[data-tutorial="transport-controls"]',
    position: "bottom",
  },
  {
    id: "pattern",
    title: "Pattern Grid",
    description: "This is where you create your beat. Click on any step to toggle it on or off. Active steps show an × mark. The highlighted column shows the current playback position.",
    target: '[data-tutorial="pattern-grid"]',
    position: "top",
  },
  {
    id: "knobs",
    title: "Sound Controls",
    description: "Use these knobs to adjust the pitch, decay, and timbre of each instrument. Drag them up or down to change values and hear the difference in real-time.",
    target: '[data-tutorial="sound-controls"]',
    position: "left",
  },
  {
    id: "instruments",
    title: "Instrument Views",
    description: "Switch between Drums and Synth views using these tabs. Each has its own pattern and controls. The Synth view lets you create melodic sequences.",
    target: '[data-tutorial="instrument-tabs"]',
    position: "bottom",
  },
  {
    id: "rooms",
    title: "Collaboration",
    description: "Create or join a room to collaborate with others in real-time. All changes sync instantly across all participants.",
    target: '[data-tutorial="room-controls"]',
    position: "bottom",
  },
  {
    id: "complete",
    title: "You're all set!",
    description: "Enjoy!",
    position: "center",
  },
];

export const Tutorial: FC<Props> = ({ isActive, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightPosition, setHighlightPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = TUTORIAL_STEPS[currentStep];

  // Calculate highlight position for target element
  useEffect(() => {
    // Reset position when step changes to force recalculation
    setHighlightPosition(null);

    if (!isActive || !step?.target) {
      return;
    }

    const updatePosition = () => {
      try {
        const element = document.querySelector(step.target!);
        if (element) {
          const rect = element.getBoundingClientRect();
          setHighlightPosition({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
          });

          // Scroll element into view if needed (with delay to ensure smooth transition)
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
        } else {
          setHighlightPosition(null);
        }
      } catch (e) {
        setHighlightPosition(null);
      }
    };

    // Small delay to ensure DOM is ready, especially when going back
    const timer = setTimeout(updatePosition, 200);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isActive, step?.target, currentStep]); // Use step.target instead of step to ensure recalculation

  // Position tooltip relative to highlight
  useEffect(() => {
    if (!highlightPosition || !tooltipRef.current || step.position === "center") return;

    const updatePosition = () => {
      if (!tooltipRef.current) return;

      const tooltip = tooltipRef.current;
      const position = step.position || "bottom";

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isMobile = viewportWidth < 640;
      const padding = isMobile ? 8 : 16;
      const gap = 16;

      // On mobile, use simple bottom-fixed positioning
      if (isMobile) {
        tooltip.style.position = "fixed";
        tooltip.style.bottom = `${padding}px`;
        tooltip.style.top = "auto";
        tooltip.style.left = "50%";
        tooltip.style.right = "auto";
        tooltip.style.transform = "translateX(-50%)";
        tooltip.style.maxHeight = `${viewportHeight - padding * 2}px`;
        tooltip.style.overflowY = "auto";
        return;
      }

      // Desktop positioning logic
      // Get tooltip dimensions (use getBoundingClientRect for accuracy)
      const tooltipRect = tooltip.getBoundingClientRect();
      const tooltipWidth = tooltipRect.width || 320;
      const tooltipHeight = tooltipRect.height || 200;

      // Get highlight element to get its viewport position
      const highlightElement = document.querySelector(step.target!);
      if (!highlightElement) return;

      const highlightRect = highlightElement.getBoundingClientRect();
      const highlightTop = highlightRect.top;
      const highlightLeft = highlightRect.left;
      const highlightBottom = highlightTop + highlightRect.height;
      const highlightRight = highlightLeft + highlightRect.width;

      let top = 0;
      let left = 0;

      // Calculate preferred position
      switch (position) {
        case "top":
          top = highlightTop - tooltipHeight - gap;
          left = highlightLeft + highlightRect.width / 2 - tooltipWidth / 2;
          if (top < padding) {
            top = highlightBottom + gap;
          }
          break;
        case "bottom":
          top = highlightBottom + gap;
          left = highlightLeft + highlightRect.width / 2 - tooltipWidth / 2;
          if (top + tooltipHeight > viewportHeight - padding) {
            top = highlightTop - tooltipHeight - gap;
          }
          break;
        case "left":
          top = highlightTop + highlightRect.height / 2 - tooltipHeight / 2;
          left = highlightLeft - tooltipWidth - gap;
          if (left < padding) {
            left = highlightRight + gap;
          }
          break;
        case "right":
          top = highlightTop + highlightRect.height / 2 - tooltipHeight / 2;
          left = highlightRight + gap;
          if (left + tooltipWidth > viewportWidth - padding) {
            left = highlightLeft - tooltipWidth - gap;
          }
          break;
      }

      // Clamp to viewport with padding
      const clampedTop = Math.max(padding, Math.min(top, viewportHeight - tooltipHeight - padding));
      const clampedLeft = Math.max(padding, Math.min(left, viewportWidth - tooltipWidth - padding));

      tooltip.style.position = "fixed";
      tooltip.style.top = `${clampedTop}px`;
      tooltip.style.left = `${clampedLeft}px`;
      tooltip.style.bottom = "auto";
      tooltip.style.right = "auto";
      tooltip.style.transform = "none";
    };

    // Small delay to ensure tooltip is rendered and has dimensions
    const timer = setTimeout(updatePosition, 100);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [highlightPosition, step.position, currentStep]);

  if (!isActive) return null;

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      if (step.action) step.action();
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

  // For center position, center the tooltip
  const isCenter = step.position === "center";

  return (
    <>
      {/* Dark overlay with cutout */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 bg-black/70"
        style={{
          clipPath: highlightPosition && !isCenter
            ? `polygon(0% 0%, 0% 100%, ${highlightPosition.left}px 100%, ${highlightPosition.left}px ${highlightPosition.top}px, ${highlightPosition.left + highlightPosition.width}px ${highlightPosition.top}px, ${highlightPosition.left + highlightPosition.width}px ${highlightPosition.top + highlightPosition.height}px, ${highlightPosition.left}px ${highlightPosition.top + highlightPosition.height}px, ${highlightPosition.left}px 100%, 100% 100%, 100% 0%)`
            : undefined,
        }}
      />

      {/* Highlight border */}
      {highlightPosition && !isCenter && (
        <div
          className="fixed z-40 pointer-events-none border-2 border-emerald-400 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
          style={{
            top: highlightPosition.top - 4,
            left: highlightPosition.left - 4,
            width: highlightPosition.width + 8,
            height: highlightPosition.height + 8,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`fixed z-50 w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] max-w-sm sm:max-w-sm rounded-xl border border-slate-700/50 bg-slate-800/95 backdrop-blur-xl p-4 sm:p-5 shadow-2xl ${
          isCenter
            ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto"
            : ""
        }`}
        style={isCenter ? {} : undefined}
      >
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-emerald-400">{step.title}</h3>
            <span className="text-xs text-slate-500">
              {currentStep + 1} / {TUTORIAL_STEPS.length}
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex-1 rounded-lg border border-slate-600/50 bg-slate-700/50 px-3 py-2 text-xs font-medium text-slate-300 transition-all hover:bg-slate-700/70 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="rounded-lg border border-slate-600/50 bg-slate-700/50 px-3 py-2 text-xs font-medium text-slate-300 transition-all hover:bg-slate-700/70 active:scale-95"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2 text-xs font-medium text-white transition-all hover:from-emerald-600 hover:to-emerald-700 active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            {currentStep === TUTORIAL_STEPS.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </>
  );
};
