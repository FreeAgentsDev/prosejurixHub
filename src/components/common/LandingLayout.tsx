import React from 'react';

interface LandingLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const LandingLayout = ({ children, className = '' }: LandingLayoutProps) => {
  return (
    <div className={`relative overflow-hidden bg-slate-950 text-slate-100 ${className}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(99,102,241,0.3),_transparent_50%)]" />
        <div className="absolute -top-24 -right-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute top-1/2 -left-10 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
};

export default LandingLayout;

