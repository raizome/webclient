import { BookOpen, Plus } from 'lucide-react';

interface EmptyStateProps {
    title?: string;
    description?: string;
    onAddArticle?: () => void;
}

export default function EmptyState({
    title = 'No articles yet',
    description = 'Save your first article to get started with your reading list.',
    onAddArticle,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
                <BookOpen className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
            {onAddArticle && (
                <button
                    onClick={onAddArticle}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Add your first article
                </button>
            )}
        </div>
    );
}
