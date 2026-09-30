// Fixed positioning also protects the background from touch scrolling on iOS.
// Restore exact inline styles and the original scroll position when the viewer closes.
export function lockPageScroll() {
  const root = document.documentElement;
  const body = document.body;
  const x = window.scrollX;
  const y = window.scrollY;
  const previous = {
    rootOverflow: root.style.overflow,
    scrollBehavior: root.style.scrollBehavior,
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    width: body.style.width,
  };
  root.style.overflow = "hidden";
  body.style.position = "fixed";
  body.style.top = `-${y}px`;
  body.style.left = `-${x}px`;
  body.style.width = "100%";
  let released = false;
  return () => {
    if (released) return;
    released = true;
    root.style.overflow = previous.rootOverflow;
    root.style.scrollBehavior = "auto";
    body.style.position = previous.position;
    body.style.top = previous.top;
    body.style.left = previous.left;
    body.style.width = previous.width;
    window.scrollTo(x, y);
    root.style.scrollBehavior = previous.scrollBehavior;
  };
}
