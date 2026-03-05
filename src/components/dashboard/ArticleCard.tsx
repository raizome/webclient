import { Heart, Archive, Trash2, Tag, Image, Video, Clock, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Article } from '@src/types/article';
import { formatRelativeTime, estimateReadTime } from '@src/commons/formatters';
import { cn } from '@src/commons/utils';
import { useState } from 'react';

interface ArticleCardProps {
    article: Article;
    onToggleFavorite: (id: number) => void;
    onToggleArchive: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function ArticleCard({ article, onToggleFavorite, onToggleArchive, onDelete }: ArticleCardProps) {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();
    const title = article.resolved_title || article.given_title || article.given_url;
    const readTime = estimateReadTime(article.word_count);

    return (
        <article
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => navigate(`/dashboard/article/${article.item_id}`)}
            className="group relative flex gap-4 p-4 md:p-5 rounded-2xl bg-card border border-border/60 hover:border-border hover:shadow-md transition-all duration-200 cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`Article: ${title}`}
        >
            {/* Thumbnail */}
            {article.top_image_url ? (
                <div className="hidden sm:block shrink-0 w-28 h-20 md:w-36 md:h-24 rounded-xl overflow-hidden bg-muted">
                    <img
                        src={article.top_image_url}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                </div>
            ) : (
                <div className="hidden sm:flex shrink-0 w-28 h-20 md:w-36 md:h-24 rounded-xl bg-muted items-center justify-center">
                    <BookOpen className="w-8 h-8 text-muted-foreground/40" />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm md:text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    {article.favorite && (
                        <Heart className="w-4 h-4 shrink-0 fill-primary text-primary mt-0.5" />
                    )}
                </div>

                {article.excerpt && (
                    <p className="mt-1.5 text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {article.excerpt}
                    </p>
                )}

                {/* Meta row */}
                <div className="mt-auto pt-2.5 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    {article.domain && (
                        <span className="font-medium text-foreground/70">{article.domain.name}</span>
                    )}
                    {article.author && (
                        <span>by {article.author.name}</span>
                    )}
                    {readTime && (
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {readTime}
                        </span>
                    )}
                    <span>{formatRelativeTime(article.time_added)}</span>
                    {/* Media badges */}
                    <div className="flex items-center gap-1.5">
                        {article.has_image > 0 && <Image className="w-3 h-3" />}
                        {article.has_video > 0 && <Video className="w-3 h-3" />}
                        {article.status === 1 && (
                            <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium uppercase tracking-wider">
                                Archived
                            </span>
                        )}
                    </div>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {article.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium text-muted-foreground"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Hover actions */}
            <div className={cn(
                'absolute right-3 top-3 flex items-center gap-1 transition-all duration-200',
                hovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'
            )}>
                <ActionButton
                    icon={Heart}
                    active={article.favorite}
                    activeClass="fill-primary text-primary"
                    label="Toggle favorite"
                    onClick={e => { e.stopPropagation(); onToggleFavorite(article.item_id); }}
                />
                <ActionButton
                    icon={Archive}
                    active={article.status === 1}
                    activeClass="text-secondary"
                    label="Toggle archive"
                    onClick={e => { e.stopPropagation(); onToggleArchive(article.item_id); }}
                />
                <ActionButton
                    icon={Trash2}
                    label="Delete"
                    onClick={e => { e.stopPropagation(); onDelete(article.item_id); }}
                    className="hover:text-destructive hover:bg-destructive/10"
                />
                <ActionButton
                    icon={Tag}
                    label="Add tag"
                    onClick={e => e.stopPropagation()}
                />
            </div>
        </article>
    );
}

function ActionButton({
    icon: Icon, active, activeClass, label, onClick, className,
}: {
    icon: typeof Heart;
    active?: boolean;
    activeClass?: string;
    label: string;
    onClick: (e: React.MouseEvent) => void;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            aria-label={label}
            className={cn(
                'p-1.5 rounded-lg bg-card/90 backdrop-blur border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
                active && activeClass,
                className
            )}
        >
            <Icon className="w-3.5 h-3.5" />
        </button>
    );
}
