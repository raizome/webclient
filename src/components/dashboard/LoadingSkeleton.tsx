import { cn } from '@src/lib/utils';

export default function LoadingSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="flex gap-4 p-5 rounded-2xl bg-card border border-border/60 animate-pulse"
                    style={{ animationDelay: `${i * 80}ms` }}
                >
                    <div className="hidden sm:block shrink-0 w-36 h-24 rounded-xl bg-muted" />
                    <div className="flex-1 space-y-3">
                        <div className="h-4 w-3/4 rounded bg-muted" />
                        <div className="space-y-2">
                            <div className="h-3 w-full rounded bg-muted" />
                            <div className="h-3 w-2/3 rounded bg-muted" />
                        </div>
                        <div className="flex gap-3 pt-1">
                            <div className="h-3 w-24 rounded bg-muted" />
                            <div className="h-3 w-16 rounded bg-muted" />
                            <div className="h-3 w-14 rounded bg-muted" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
