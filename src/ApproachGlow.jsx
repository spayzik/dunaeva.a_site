import { useEffect, useRef } from "react";

const vertex = "attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}";
const fragment = `precision mediump float;
uniform vec2 size; uniform float time;
void main(){
  vec2 uv=gl_FragCoord.xy/size;
  vec2 q=uv*2.-1.;
  // Slow domain warping creates soft mesh folds rather than bright blobs.
  float t=time*.12;
  for(int i=0;i<3;i++){
    float k=float(i)+1.;
    q+=.16/k*vec2(sin(q.y*2.6+k+t),cos(q.x*2.3-k-t*.8));
  }
  float fold=.5+.5*sin(q.x*2.4+q.y*1.8+t);
  float silk=.5+.5*cos(q.y*2.8-q.x*1.3-t*.7);
  vec3 wine=vec3(.38,.035,.13);
  vec3 mauve=vec3(.28,.12,.20);
  vec3 color=mix(wine,mauve,smoothstep(.15,.85,fold));
  color=mix(color,vec3(.40,.22,.24),silk*.22);
  float edge=smoothstep(0.,.24,uv.x)*smoothstep(0.,.24,1.-uv.x);
  float alpha=(.14+.19*fold)*edge;
  gl_FragColor=vec4(color*alpha,alpha);
}`;

function resourcesFor(gl) {
  const shaders = [];
  let program, buffer;
  const dispose = () => {
    if (program) gl.deleteProgram(program);
    if (buffer) gl.deleteBuffer(buffer);
    shaders.forEach((shader) => gl.deleteShader(shader));
  };
  try {
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertex],
      [gl.FRAGMENT_SHADER, fragment],
    ]) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Shader unavailable");
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error("Shader unavailable");
    }
    program = gl.createProgram();
    if (!program) throw new Error("Program unavailable");
    shaders.forEach((shader) => gl.attachShader(program, shader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error("Program unavailable");
    gl.useProgram(program);
    buffer = gl.createBuffer();
    if (!buffer) throw new Error("Buffer unavailable");
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
      size: gl.getUniformLocation(program, "size"),
      time: gl.getUniformLocation(program, "time"),
      dispose,
    };
  } catch {
    dispose();
    return null;
  }
}

export function ApproachGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const host = canvas.parentElement;
    const allowed = matchMedia(
      "(min-width: 761px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)",
    );
    if (!("IntersectionObserver" in window) || !("ResizeObserver" in window))
      return;
    let gl = null,
      resources = null,
      frame = null;
    let inView = false,
      lost = false,
      unavailable = false;
    let last = 0,
      elapsed = 0,
      draws = 0;
    const cancel = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      last = 0;
    };
    const resize = () => {
      if (!resources || lost) return;
      const box = host.getBoundingClientRect();
      const scale = Math.min(
        1,
        720 / Math.max(1, box.width),
        420 / Math.max(1, box.height),
      );
      canvas.width = Math.max(1, Math.round(box.width * scale));
      canvas.height = Math.max(1, Math.round(box.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const active = () =>
      inView && allowed.matches && !document.hidden && !lost && !!resources;
    const tick = (now) => {
      frame = null;
      if (!active()) return;
      if (!last || now - last >= 1000 / 24) {
        if (last) elapsed += Math.min(now - last, 100);
        last = now;
        const t = elapsed / 1000;
        gl.uniform2f(resources.size, canvas.width, canvas.height);
        gl.uniform1f(resources.time, t);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        canvas.drawCount = ++draws;
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      if (
        inView &&
        allowed.matches &&
        !document.hidden &&
        !lost &&
        !gl &&
        !unavailable
      ) {
        gl = canvas.getContext("webgl", {
          alpha: true,
          premultipliedAlpha: true,
          antialias: false,
          powerPreference: "low-power",
        });
        resources = gl ? resourcesFor(gl) : null;
        unavailable = !resources;
        resize();
      }
      canvas.dataset.state = lost
        ? "lost"
        : unavailable
          ? "unsupported"
          : active()
            ? "ready"
            : "paused";
      if (active()) {
        if (frame === null) frame = requestAnimationFrame(tick);
      } else cancel();
    };
    const contextLost = (event) => {
      event.preventDefault();
      lost = true;
      resources = null;
      sync();
    };
    const contextRestored = () => {
      lost = false;
      resources = resourcesFor(gl);
      unavailable = !resources;
      resize();
      sync();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    const resizer = new ResizeObserver(resize);
    observer.observe(host);
    resizer.observe(host);
    canvas.addEventListener("webglcontextlost", contextLost);
    canvas.addEventListener("webglcontextrestored", contextRestored);
    document.addEventListener("visibilitychange", sync);
    allowed.addEventListener("change", sync);
    sync();
    return () => {
      cancel();
      observer.disconnect();
      resizer.disconnect();
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      document.removeEventListener("visibilitychange", sync);
      allowed.removeEventListener("change", sync);
      resources?.dispose();
    };
  }, []);
  return (
    <canvas
      className="approach-glow"
      ref={ref}
      data-state="paused"
      aria-hidden="true"
    />
  );
}
