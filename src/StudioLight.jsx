import { useEffect, useRef } from "react";
import { createDemandRenderer } from "./demand-renderer.js";

const vertexSource =
  "attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}";
const fragmentSource =
  "precision mediump float; uniform vec2 m; uniform vec2 s; void main(){vec2 u=gl_FragCoord.xy/s; float line=abs(u.x*.85+u.y*.5-(m.x*.35+.48)); float beam=exp(-line*line*55.); float spot=exp(-distance(u,vec2(m.x,1.-m.y))*3.); vec3 tint=mix(vec3(.64,.32,.40),vec3(1.,.97,.91),beam); float alpha=beam*.18+spot*.035; gl_FragColor=vec4(tint*alpha,alpha);}";

function createResources(gl) {
  const shaders = [];
  let program;
  let buffer;
  const dispose = () => {
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    shaders.forEach((shader) => gl.deleteShader(shader));
  };
  try {
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertexSource],
      [gl.FRAGMENT_SHADER, fragmentSource],
    ]) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Shader allocation failed");
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error("Shader compilation failed");
    }
    program = gl.createProgram();
    if (!program) throw new Error("Program allocation failed");
    shaders.forEach((shader) => gl.attachShader(program, shader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error("Program linking failed");
    gl.useProgram(program);
    buffer = gl.createBuffer();
    if (!buffer) throw new Error("Buffer allocation failed");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    return {
      size: gl.getUniformLocation(program, "s"),
      mouse: gl.getUniformLocation(program, "m"),
      dispose,
    };
  } catch {
    dispose();
    return null;
  }
}

export function StudioLight() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const host = el.parentElement;
    const allowed = matchMedia(
      "(min-width: 761px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!("IntersectionObserver" in window) || !("ResizeObserver" in window)) {
      el.dataset.state = "disabled";
      return;
    }
    let gl = null;
    let resources = null;
    let inView = false;
    let lost = false;
    let unavailable = false;
    const point = { x: 0.7, y: 0.25 };
    const renderer = createDemandRenderer({
      requestFrame: requestAnimationFrame,
      cancelFrame: cancelAnimationFrame,
      draw: () => {
        if (!resources || lost) return;
        gl.uniform2f(resources.size, el.width, el.height);
        gl.uniform2f(resources.mouse, point.x, point.y);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      },
    });
    const resize = () => {
      if (!gl || !resources || lost) return;
      const bounds = host.getBoundingClientRect();
      const scale = Math.min(
        1,
        900 / Math.max(1, bounds.width),
        720 / Math.max(1, bounds.height),
      );
      el.width = Math.max(1, Math.round(bounds.width * scale));
      el.height = Math.max(1, Math.round(bounds.height * scale));
      gl.viewport(0, 0, el.width, el.height);
      renderer.request();
    };
    const sync = () => {
      const active = inView && !document.hidden && allowed.matches && !lost;
      if (active && !gl && !unavailable) {
        gl = el.getContext("webgl", {
          alpha: true,
          antialias: false,
          powerPreference: "low-power",
          premultipliedAlpha: true,
        });
        if (!gl) {
          unavailable = true;
          el.dataset.state = "unsupported";
        } else {
          resources = createResources(gl);
          if (!resources) {
            unavailable = true;
            el.dataset.state = "failed";
          }
          resize();
        }
      }
      if (!unavailable)
        el.dataset.state = lost
          ? "lost"
          : allowed.matches && resources
            ? "ready"
            : "disabled";
      renderer.setActive(active && !!resources);
    };
    const move = (event) => {
      if (!inView || !allowed.matches || document.hidden || lost || !resources)
        return;
      const bounds = host.getBoundingClientRect();
      point.x = Math.max(
        0,
        Math.min(1, (event.clientX - bounds.left) / Math.max(1, bounds.width)),
      );
      point.y = Math.max(
        0,
        Math.min(1, (event.clientY - bounds.top) / Math.max(1, bounds.height)),
      );
      renderer.request();
    };
    const leave = () => {
      point.x = 0.7;
      point.y = 0.25;
      renderer.request();
    };
    const contextLost = (event) => {
      event.preventDefault();
      lost = true;
      resources = null; // Lost context owns no usable GL handles.
      sync();
    };
    const contextRestored = () => {
      lost = false;
      resources = createResources(gl);
      unavailable = !resources;
      if (unavailable) el.dataset.state = "failed";
      resize();
      sync();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    const resizer = new ResizeObserver(resize);
    el.addEventListener("webglcontextlost", contextLost);
    el.addEventListener("webglcontextrestored", contextRestored);
    observer.observe(host);
    resizer.observe(host);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", sync);
    allowed.addEventListener("change", sync);
    sync();
    return () => {
      renderer.dispose();
      observer.disconnect();
      resizer.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", sync);
      allowed.removeEventListener("change", sync);
      el.removeEventListener("webglcontextlost", contextLost);
      el.removeEventListener("webglcontextrestored", contextRestored);
      resources?.dispose();
    };
  }, []);
  return (
    <canvas
      className="studio-light"
      ref={ref}
      data-state="pending"
      aria-hidden="true"
    />
  );
}
