import { useEffect, useRef } from "react";

// A fixed pool of compositor animations; no render loop or React pointer state.
export function HeroDust() {
  const ref = useRef(null);
  useEffect(() => {
    const layer = ref.current;
    const host = layer.parentElement;
    const allowed = matchMedia(
      "(min-width: 761px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!("IntersectionObserver" in window) || !Element.prototype.animate)
      return;
    const dots = Array.from({ length: 8 }, (_, index) => {
      const dot = document.createElement("span");
      dot.className = "hero-dust__dot";
      dot.dataset.tone = index % 3 === 0 ? "warm" : "wine";
      layer.append(dot);
      return { dot, animation: null };
    });
    const obstacles = host.querySelectorAll(
      "h1, .hero__eyebrow, .hero__role, .hero__intro, .red-stroke, .hero__actions, .hero__portrait, .hero__signature",
    );
    let inView = false;
    let last = null;
    let slot = 0;
    const clear = () => {
      dots.forEach((entry) => entry.animation?.cancel());
      last = null;
    };
    const sync = () => {
      const active = inView && allowed.matches && !document.hidden;
      layer.dataset.state = active ? "ready" : "disabled";
      if (!active) clear();
    };
    const move = (event) => {
      if (
        !inView ||
        !allowed.matches ||
        document.hidden ||
        event.pointerType !== "mouse" ||
        event.buttons
      )
        return;
      const now = performance.now();
      if (
        last &&
        (now - last.time < 100 ||
          Math.hypot(event.clientX - last.x, event.clientY - last.y) < 24)
      )
        return;
      // Protect the portrait, signature, type and controls, including drift space.
      for (const obstacle of obstacles) {
        const box = obstacle.getBoundingClientRect();
        if (
          event.clientX >= box.left - 20 &&
          event.clientX <= box.right + 20 &&
          event.clientY >= box.top - 20 &&
          event.clientY <= box.bottom + 20
        )
          return;
      }
      const box = host.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      if (x < 16 || y < 16 || x > box.width - 16 || y > box.height - 16) return;
      const entry = dots[slot++ % dots.length];
      entry.animation?.cancel();
      const drift = slot % 2 ? 7 : -7;
      entry.animation = entry.dot.animate(
        [
          { transform: `translate(${x}px, ${y}px) scale(.6)`, opacity: 0 },
          {
            transform: `translate(${x + drift * 0.3}px, ${y - 3}px) scale(1)`,
            opacity: 0.34,
            offset: 0.18,
          },
          {
            transform: `translate(${x + drift}px, ${y - 12}px) scale(.6)`,
            opacity: 0,
          },
        ],
        { duration: 900, easing: "ease-out" },
      );
      last = { x: event.clientX, y: event.clientY, time: now };
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(host);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", clear);
    allowed.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", clear);
      allowed.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      clear();
      dots.forEach(({ dot }) => dot.remove());
    };
  }, []);
  return <div className="hero-dust" ref={ref} aria-hidden="true" />;
}
