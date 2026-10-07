/**
 * Ambient technical backdrop: subtle grid, drifting glow fields, vignette.
 * Entirely decorative and hidden from assistive technology.
 */
export function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-abyss-950" />
      <div className="grid-bg absolute inset-0 opacity-80" />
      <div className="hs-float absolute -top-48 left-[12%] h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="hs-float-slow absolute -right-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(4,7,10,0)_0%,rgba(4,7,10,0.72)_70%,rgba(4,7,10,0.92)_100%)]" />
    </div>
  );
}
