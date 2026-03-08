import { Article } from '@src/types/article';
import ArticleCard from '@src/components/home/ArticleCard.tsx';

interface ArticleListProps {
    articles: Article[];
    onToggleFavorite: (id: number) => void;
    onToggleArchive: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function ArticleList({ articles, onToggleFavorite, onToggleArchive, onDelete }: ArticleListProps) {
    return (
        <div className="space-y-3">
            {articles.map(article => (
                <ArticleCard
                    key={article.item_id}
                    article={article}
                    onToggleFavorite={onToggleFavorite}
                    onToggleArchive={onToggleArchive}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
