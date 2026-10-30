/** Re-mounts on every navigation so the view slides in like the original app shell. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="enter-fwd">{children}</div>;
}
