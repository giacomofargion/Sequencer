import { useRef } from "react";
import type { FC } from "react";

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

// Professional-looking knob control with smooth rotation and visual feedback
export const Knob: FC<Props> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
}) => {
  const knobRef = useRef<HTMLDivElement | null>(null);
  const valueRef = useRef(value);
  const activeRef = useRef(false);
  const startYRef = useRef(0);
  const startValueRef = useRef(0);

  valueRef.current = value;

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (
    event,
  ) => {
    event.preventDefault();
    activeRef.current = true;
    const element = event.currentTarget;
    element.setPointerCapture(event.pointerId);
    startYRef.current = event.clientY;
    startValueRef.current = valueRef.current;

    const handleMove = (moveEvent: PointerEvent) => {
      if (!activeRef.current) return;
      moveEvent.preventDefault();

      const deltaY = startYRef.current - moveEvent.clientY; // Up = positive
      const range = max - min;
      const sensitivity = range / 150; // 150px drag to sweep full range
      const nextRaw = startValueRef.current + deltaY * sensitivity;
      const clamped = Math.min(max, Math.max(min, nextRaw));
      const snapped = Math.round(clamped / step) * step;
      valueRef.current = snapped;
      onChange(snapped);
    };

    const handleUp = () => {
      activeRef.current = false;
      element.releasePointerCapture(event.pointerId);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const normalized = max === min ? 0 : (value - min) / (max - min); // 0..1
  const angle = -140 + normalized * 280; // map to -140..140 degrees

  // Format value for display
  const formatValue = (val: number): string => {
    if (step >= 1) return Math.round(val).toString();
    if (step >= 0.1) return val.toFixed(1);
    return val.toFixed(2);
  };

  return (
    <div className="flex flex-col items-center gap-0.5 sm:gap-1">
      <div
        ref={knobRef}
        onPointerDown={handlePointerDown}
        className="relative h-10 w-10 sm:h-12 sm:w-12 cursor-grab active:cursor-grabbing select-none touch-none"
        aria-label={label}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
      >
        {/* Outer ring with gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 shadow-inner border border-neutral-400/30" />

        {/* Inner disc */}
        <div className="absolute inset-[8%] rounded-full bg-gradient-to-br from-neutral-50 to-neutral-100 shadow-sm border border-neutral-300/50" />

        {/* Center dot */}
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-400" />

        {/* Indicator line */}
        <div
          className="absolute left-1/2 top-1/2 h-4 w-0.5 origin-bottom bg-gradient-to-t from-blue-600 to-blue-400 shadow-sm"
          style={{
            transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-50%)`,
            transformOrigin: "center bottom",
          }}
        />

        {/* Value display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[8px] sm:text-[9px] font-mono font-semibold text-neutral-700">
            {formatValue(value)}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-[7px] sm:text-[8px] font-medium uppercase tracking-wider text-white text-center max-w-[55px] leading-tight">
          {label}
        </span>
      )}
    </div>
  );
};
