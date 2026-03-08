import { Heart, Archive, Trash2, ExternalLink, Tag, Clock, BookOpen, ArrowLeft, Image, Video, ChevronRight, StickyNote, Highlighter, BookMarked } from 'lucide-react';
import { Article } from '@src/types/article';
import { formatRelativeTime, estimateReadTime, formatWordCount } from '@src/commons/formatters';
import { cn } from '@src/commons/utils';
import { useNavigate } from 'react-router-dom';

interface ArticleDetailProps {
    article: Article;
    onToggleFavorite: () => void;
    onToggleArchive: () => void;
    onDelete: () => void;
    onBack: () => void;
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

function getTagGradient(tag: string) {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    const idx = Math.abs(hash) % TAG_GRADIENTS.length;
    const g = TAG_GRADIENTS[idx];
    return `linear-gradient(135deg, ${g.from}, ${g.to})`;
}

export default function ArticleDetail({ article, onToggleFavorite, onToggleArchive, onDelete, onBack }: ArticleDetailProps) {
    const navigate = useNavigate();
    const title = article.resolved_title || article.given_title || article.given_url;
    const readTime = estimateReadTime(article.word_count);
    const wordCount = formatWordCount(article.word_count);
    const url = article.resolved_url || article.given_url;
    const domainName = typeof article.domain === 'string' ? article.domain : article.domain?.name;

    return (
        <div className="animate-in fade-in duration-300">
            {/* Back navigation */}
            <button
                onClick={onBack}
                className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                Back to articles
            </button>

            {/* Header */}
            <header className="mb-6">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground leading-tight tracking-tight">
                    {title}
                </h1>

                {/* Meta info */}
                <div className="flex items-center gap-3 mt-4 flex-wrap text-sm text-muted-foreground">
                    {domainName && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted font-medium text-foreground/80 text-xs">
                            {domainName}
                        </span>
                    )}
                    {article.author && (
                        <span>by <span className="text-foreground/80 font-medium">{article.author.name}</span></span>
                    )}
                    {readTime && (
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {readTime}
                        </span>
                    )}
                    {wordCount && (
                        <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            {wordCount}
                        </span>
                    )}
                    <span>{formatRelativeTime(article.time_added)}</span>
                    {article.favorite && (
                        <Heart className="w-4 h-4 fill-primary text-primary" />
                    )}
                </div>
            </header>

            {/* Hero image */}
            {article.top_image_url && (
                <div className="mb-8 rounded-2xl overflow-hidden bg-muted shadow-sm">
                    <img
                        src={article.top_image_url}
                        alt={title}
                        className="w-full h-auto max-h-[420px] object-cover"
                        loading="lazy"
                    />
                </div>
            )}

            {/* Action bar */}
            <div className="flex items-center gap-2 mb-8 flex-wrap">
                <ActionBtn
                    icon={Heart}
                    label={article.favorite ? 'Unfavorite' : 'Favorite'}
                    active={article.favorite}
                    activeClass="text-primary bg-primary/10 border-primary/20"
                    onClick={onToggleFavorite}
                />
                <ActionBtn
                    icon={Archive}
                    label={article.status === 1 ? 'Unarchive' : 'Archive'}
                    active={article.status === 1}
                    activeClass="text-secondary bg-secondary/10 border-secondary/20"
                    onClick={onToggleArchive}
                />
                <ActionBtn
                    icon={Trash2}
                    label="Delete"
                    onClick={onDelete}
                    className="hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5"
                />
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                    <ExternalLink className="w-4 h-4" />
                    Open original
                </a>
                <ActionBtn
                    icon={Tag}
                    label="Manage tags"
                    onClick={() => { }}
                />
            </div>

            {/* Excerpt / Summary */}
            {article.excerpt && (
                <section className="mb-8 p-5 rounded-2xl bg-muted/50 border border-border/60">
                    <p className="text-base md:text-lg leading-relaxed text-foreground/85 font-normal">
                        {article.excerpt}
                    </p>
                </section>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Tags</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                        {article.tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => navigate(`/home/tags/${encodeURIComponent(tag)}`)}
                                className="group relative px-3.5 py-1.5 rounded-full text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                                style={{ background: getTagGradient(tag) }}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Media indicators */}
            {(article.has_video > 0 || article.has_image > 0) && (
                <section className="mb-8">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Media</h2>
                    <div className="flex items-center gap-3">
                        {article.has_video > 0 && (
                            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted border border-border/60 text-sm text-muted-foreground">
                                <Video className="w-4 h-4" />
                                Contains Video
                            </div>
                        )}
                        {article.has_image > 0 && (
                            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted border border-border/60 text-sm text-muted-foreground">
                                <Image className="w-4 h-4" />
                                Contains Images
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Future placeholder */}
            <section className="mt-12 mb-8">
                <div className="border border-dashed border-border rounded-2xl p-8 text-center">
                    <div className="flex items-center justify-center gap-6 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                            <BookMarked className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                            <StickyNote className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                            <Highlighter className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                        Reader mode, notes & highlights — coming soon
                    </p>
                </div>
            </section>
        </div>
    );
}

function ActionBtn({
    icon: Icon, label, active, activeClass, onClick, className,
}: {
    icon: typeof Heart;
    label: string;
    active?: boolean;
    activeClass?: string;
    onClick: () => void;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            aria-label={label}
            className={cn(
                'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all',
                active && activeClass,
                className
            )}
        >
            <Icon className={cn('w-4 h-4', active && 'fill-current')} />
            {label}
        </button>
    );
}
