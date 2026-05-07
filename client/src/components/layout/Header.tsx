import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="w-full py-4 px-6 sm:px-8 relative z-10">
      <Link to="/" className="inline-flex items-center gap-2.5 group">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-white shadow-sm shadow-primary/30 group-hover:shadow-md group-hover:shadow-primary/40 transition-all">
          <Zap className="w-5 h-5 fill-white" />
        </div>
        <span className="text-lg font-bold text-foreground tracking-tight">
          DPE Simplifié
        </span>
      </Link>
    </header>
  );
}
