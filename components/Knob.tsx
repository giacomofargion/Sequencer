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

// Simple, lightweight dial control built with SVG and pointer events.
// We keep behaviour minimal so it stays predictable on trackpads and touch.
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

  valueRef.current = value;

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (
    event,
  ) => {
    event.preventDefault();
    activeRef.current = true;
    const element = event.currentTarget;
    element.setPointerCapture(event.pointerId);

    const handleMove = (moveEvent: PointerEvent) => {
      if (!activeRef.current) return;
      moveEvent.preventDefault();

      const delta = -moveEvent.movementY;
      const range = max - min;
      const sensitivity = range / 200; // 200px drag to sweep full range.
      const nextRaw = valueRef.current + delta * sensitivity;
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

  const normalized =
    max === min ? 0 : (value - min) / (max - min); // 0..1
  const angle = -135 + normalized * 270; // map to -135..135

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        ref={knobRef}
        onPointerDown={handlePointerDown}
        className="relative h-9 w-9 cursor-pointer rounded-full border border-neutral-300 bg-neutral-50 shadow-sm"
        aria-label={label}
      >
        <div className="absolute inset-[18%] rounded-full bg-neutral-100" />
        <div
          className="absolute left-1/2 top-1/2 h-3 w-[1px] origin-bottom bg-emerald-600"
          style={{
            transform: `rotate(${angle}deg) translateY(-60%)`,
          }}
        />
      </div>
      <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </span>
    </div>
  );
};
