import { CheckCircle, Loader, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

type StepStatus = 'completed' | 'active' | 'pending';

interface ProcessingStepProps {
  label: string;
  status: StepStatus;
}

export function ProcessingStep({ label, status }: ProcessingStepProps) {
  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
      status === 'completed' && "bg-success/5",
      status === 'active' && "bg-primary/5",
      status === 'pending' && "bg-secondary/50"
    )}>
      <div className="flex-shrink-0">
        {status === 'completed' && (
          <CheckCircle className="w-6 h-6 text-success" />
        )}
        {status === 'active' && (
          <Loader className="w-6 h-6 text-primary animate-spin" />
        )}
        {status === 'pending' && (
          <Circle className="w-6 h-6 text-muted-foreground/40" />
        )}
      </div>
      <span className={cn(
        "font-medium transition-colors",
        status === 'completed' && "text-success",
        status === 'active' && "text-primary",
        status === 'pending' && "text-muted-foreground"
      )}>
        {label}
      </span>
    </div>
  );
}
