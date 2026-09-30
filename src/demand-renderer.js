// One frame per burst of input; no background animation loop.
export function createDemandRenderer({ requestFrame, cancelFrame, draw }) {
  let active = false;
  let pending = null;
  let disposed = false;
  function request() {
    if (!active || disposed || pending !== null) return;
    pending = requestFrame(() => {
      pending = null;
      if (active && !disposed) draw();
    });
  }
  function setActive(value) {
    if (disposed || active === value) return;
    active = value;
    if (active) request();
    else if (pending !== null) {
      cancelFrame(pending);
      pending = null;
    }
  }
  function dispose() {
    setActive(false);
    disposed = true;
  }
  return { request, setActive, dispose };
}
