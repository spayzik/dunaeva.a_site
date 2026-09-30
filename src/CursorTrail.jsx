import { useEffect, useRef } from "react";

export function CursorTrail() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const allowed = matchMedia(
      "(min-width: 761px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)",
    );
    let context = null;
    let frame = null;
    let latest = null;
    let points = [];
    let dirty = false;
    let lastDraw = 0;
    let draws = 0;
    const stop = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      latest = null;
      points = [];
      dirty = false;
      context?.clearRect(0, 0, 160, 160);
      canvas.dataset.state =
        allowed.matches && !document.hidden ? "idle" : "disabled";
    };
    const sync = () => {
      if (allowed.matches && !document.hidden && !context) {
        context = canvas.getContext("2d", { alpha: true });
        if (context) {
          const ratio = Math.min(devicePixelRatio || 1, 1.5);
          canvas.width = Math.round(160 * ratio);
          canvas.height = Math.round(160 * ratio);
          context.scale(ratio, ratio);
        }
      }
      stop();
    };
    const draw = (now) => {
      frame = null;
      if (!allowed.matches || document.hidden || !context || !latest) {
        stop();
        return;
      }
      if (now - lastDraw < 32) {
        frame = requestAnimationFrame(draw);
        return;
      }
      lastDraw = now;
      if (dirty) {
        points.push(latest);
        points = points.slice(-12);
        dirty = false;
      }
      points = points.filter((point) => now - point.time < 240);
      context.clearRect(0, 0, 160, 160);
      if (!points.length) {
        stop();
        return;
      }
      const head = points[points.length - 1];
      canvas.style.transform = `translate3d(${head.x - 80}px, ${head.y - 80}px, 0)`;
      context.lineWidth = 1;
      context.lineCap = "round";
      context.strokeStyle = head.dark ? "#f0d7dd" : "#a50836";
      for (let i = 1; i < points.length; i++) {
        const from = points[i - 1];
        const to = points[i];
        // Clip long swipes to a short thread, without allocating a viewport canvas.
        const distance = Math.hypot(from.x - head.x, from.y - head.y);
        const scale = distance > 64 ? 64 / distance : 1;
        const endDistance = Math.hypot(to.x - head.x, to.y - head.y);
        if (endDistance > 64) continue;
        context.globalAlpha =
          (head.dark ? 0.26 : 0.17) * Math.max(0, 1 - (now - from.time) / 240);
        context.beginPath();
        context.moveTo(
          80 + (from.x - head.x) * scale,
          80 + (from.y - head.y) * scale,
        );
        context.lineTo(80 + to.x - head.x, 80 + to.y - head.y);
        context.stroke();
      }
      canvas.dataset.frames = String(++draws);
      canvas.dataset.state = "active";
      frame = requestAnimationFrame(draw);
    };
    const move = (event) => {
      if (
        !allowed.matches ||
        document.hidden ||
        !context ||
        event.pointerType !== "mouse"
      )
        return;
      if (event.buttons) {
        stop();
        return;
      }
      const point = {
        x: event.clientX,
        y: event.clientY,
        time: performance.now(),
        dark: !!event.target.closest?.(".approach, .contact, .hero__portrait"),
      };
      if (latest && Math.hypot(point.x - latest.x, point.y - latest.y) < 2)
        return;
      latest = point;
      dirty = true;
      if (frame === null) frame = requestAnimationFrame(draw);
    };
    const leave = (event) => {
      if (!event.relatedTarget) stop();
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("blur", stop);
    window.addEventListener("scroll", stop, { passive: true });
    allowed.addEventListener("change", sync);
    sync();
    return () => {
      stop();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("blur", stop);
      window.removeEventListener("scroll", stop);
      allowed.removeEventListener("change", sync);
    };
  }, []);
  return <canvas className="cursor-trail" ref={ref} aria-hidden="true" />;
}
