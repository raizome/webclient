import { ArrowLeft, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TagDetailHeaderProps {
    tagName: string;
    articleCount: number;
}

export default function TagDetailHeader({ tagName, articleCount }: TagDetailHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="mb-6">
            <button
                onClick={() => navigate('/home', { state: { section: 'tags' } })}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Tags
            </button>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">{tagName}</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {articleCount} article{articleCount !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>
        </div>
    );
}
