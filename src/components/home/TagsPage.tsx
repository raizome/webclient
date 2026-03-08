import { useMemo, useState, useEffect } from 'react';
import { Article } from '@src/types/article';
import { Tag, Plus } from 'lucide-react';
import TagCard from '@src/components/home/TagCard';
import { Skeleton } from '@src/components/ui/skeleton';

interface TagsPageProps {
    articles: Article[];
    loading: boolean;
}

interface TagInfo {
    tagName: string;
    count: number;
}

export default function TagsPage({ articles, loading }: TagsPageProps) {
    const tags: TagInfo[] = useMemo(() => {
        const map = new Map<string, number>();
        articles.forEach(a => {
            if (a.status === 2) return; // skip deleted
            a.tags?.forEach(t => map.set(t, (map.get(t) || 0) + 1));
        });
        return Array.from(map.entries())
            .map(([tagName, count]) => ({ tagName, count }))
            .sort((a, b) => b.count - a.count);
    }, [articles]);

    if (loading) {
        return (
            <div>
                <div className="mb-6">
                    <Skeleton className="h-7 w-24 mb-1.5" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (tags.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
                    <Tag className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No tags yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                    Start tagging your saved articles to organize them into categories.
                </p>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all">
                    <Plus className="w-4 h-4" />
                    Start tagging articles
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">Tags</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    {tags.length} tag{tags.length !== 1 ? 's' : ''}
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tags.map((tag, i) => (
                    <TagCard key={tag.tagName} tagName={tag.tagName} count={tag.count} index={i} />
                ))}
            </div>
        </div>
    );
}
