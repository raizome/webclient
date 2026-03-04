import { Skeleton } from '@src/components/ui/skeleton';

export default function ArticleDetailSkeleton() {
    return (
        <div className="animate-in fade-in duration-300">
            {/* Back */}
            <Skeleton className="h-5 w-32 mb-6 rounded-lg" />

            {/* Title */}
            <Skeleton className="h-10 w-full mb-2 rounded-xl" />
            <Skeleton className="h-10 w-3/4 mb-4 rounded-xl" />

            {/* Meta */}
            <div className="flex items-center gap-3 mb-6">
                <Skeleton className="h-6 w-28 rounded-lg" />
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
            </div>

            {/* Hero image */}
            <Skeleton className="h-64 w-full mb-8 rounded-2xl" />

            {/* Actions */}
            <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-10 w-28 rounded-xl" />
                ))}
            </div>

            {/* Excerpt */}
            <Skeleton className="h-28 w-full mb-8 rounded-2xl" />

            {/* Tags */}
            <div className="flex items-center gap-2 mb-8">
                <Skeleton className="h-8 w-16 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-14 rounded-full" />
            </div>
        </div>
    );
}
