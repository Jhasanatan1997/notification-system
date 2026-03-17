import { clsx } from "clsx";

export function Card({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("rounded-2xl border border-white/10 bg-white/5 p-5", className)}>
      {title ? <div className="text-sm font-semibold text-white/80">{title}</div> : null}
      <div className={title ? "mt-3" : ""}>{children}</div>
    </div>
  );
}

