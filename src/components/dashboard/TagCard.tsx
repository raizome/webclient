import { useNavigate } from 'react-router-dom';
import { Tag } from 'lucide-react';
import { cn } from '@src/lib/utils';

interface TagCardProps {
    tagName: string;
    count: number;
    index: number;
}

const TAG_GRADIENTS = [
    { from: 'hsl(6 80% 62%)', to: 'hsl(20 90% 68%)' },
    { from: 'hsl(160 38% 48%)', to: 'hsl(180 45% 55%)' },
    { from: 'hsl(250 60% 58%)', to: 'hsl(270 65% 65%)' },
    { from: 'hsl(35 85% 55%)', to: 'hsl(45 90% 62%)' },
    { from: 'hsl(195 70% 48%)', to: 'hsl(210 75% 58%)' },
    { from: 'hsl(330 65% 55%)', to: 'hsl(345 70% 62%)' },
    { from: 'hsl(140 50% 45%)', to: 'hsl(155 55% 55%)' },
    { from: 'hsl(275 55% 52%)', to: 'hsl(290 60% 60%)' },
];

function getGradient(index: number) {
    const g = TAG_GRADIENTS[index % TAG_GRADIENTS.length];
    return `linear-gradient(135deg, ${g.from}, ${g.to})`;
}

export default function TagCard({ tagName, count, index }: TagCardProps) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(`/dashboard/tags/${encodeURIComponent(tagName)}`)}
            className={cn(
                'group relative w-full text-left rounded-2xl p-6 overflow-hidden',
                'transition-all duration-200 ease-out',
                'hover:-translate-y-1 hover:shadow-lg',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                'active:scale-[0.98]'
            )}
            style={{ background: getGradient(index) }}
            aria-label={`${tagName} — ${count} article${count !== 1 ? 's' : ''}`}
        >
            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            <div className="relative z-10 flex flex-col gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Tag className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-display font-bold text-white leading-tight">
                        {tagName}
                    </h3>
                    <p className="text-sm text-white/70 mt-0.5">
                        {count} article{count !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>
        </button>
    );
}
