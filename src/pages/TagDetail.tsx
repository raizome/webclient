import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Article, FilterStatus, SortOption } from '@src/types/article';
import { mockArticles } from '@src/data/mockArticles';
import HomeSidebar from '@src/components/home/HomeSidebar';
import Topbar from '@src/components/home/Topbar';
import ArticleList from '@src/components/home/ArticleList';
import EmptyState from '@src/components/home/EmptyState';
import LoadingSkeleton from '@src/components/home/LoadingSkeleton';
import TagDetailHeader from '@src/components/home/TagDetailHeader';
import { useTheme } from '@src/hooks/useTheme';
import { useIsMobile } from '@src/hooks/use-mobile';
import { cn } from '@src/commons/utils';
import { X } from 'lucide-react';

export default function TagDetail() {
    const { tagName } = useParams<{ tagName: string }>();
    const navigate = useNavigate();
    const decodedTag = decodeURIComponent(tagName || '');
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [sortOption, setSortOption] = useState<SortOption>('newest');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isDark, toggle: toggleTheme } = useTheme();
    const isMobile = useIsMobile();

    useEffect(() => {
        const timer = setTimeout(() => {
            setArticles(mockArticles);
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isMobile) setMobileMenuOpen(false);
    }, [isMobile]);

    const toggleFavorite = useCallback((id: number) => {
        setArticles(prev => prev.map(a => a.item_id === id ? { ...a, favorite: !a.favorite } : a));
    }, []);

    const toggleArchive = useCallback((id: number) => {
        setArticles(prev => prev.map(a =>
            a.item_id === id ? { ...a, status: (a.status === 1 ? 0 : 1) as 0 | 1 | 2 } : a
        ));
    }, []);

    const deleteArticle = useCallback((id: number) => {
        setArticles(prev => prev.map(a =>
            a.item_id === id ? { ...a, status: 2 as const } : a
        ));
    }, []);

    const filteredArticles = useMemo(() => {
        let result = articles.filter(a => a.tags?.includes(decodedTag) && a.status !== 2);

        if (filterStatus === 'active') result = result.filter(a => a.status === 0);
        else if (filterStatus === 'archived') result = result.filter(a => a.status === 1);

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(a =>
                (a.resolved_title || a.given_title || '').toLowerCase().includes(q) ||
                (a.excerpt || '').toLowerCase().includes(q)
            );
        }

        result.sort((a, b) => {
            switch (sortOption) {
                case 'newest': return new Date(b.time_added).getTime() - new Date(a.time_added).getTime();
                case 'oldest': return new Date(a.time_added).getTime() - new Date(b.time_added).getTime();
                case 'updated': return new Date(b.time_updated || b.time_added).getTime() - new Date(a.time_updated || a.time_added).getTime();
                case 'word_count': return (b.word_count || 0) - (a.word_count || 0);
                default: return 0;
            }
        });

        return result;
    }, [articles, decodedTag, filterStatus, searchQuery, sortOption]);

    const articleCounts = useMemo(() => ({
        all: articles.filter(a => a.status !== 2).length,
        favorites: articles.filter(a => a.favorite && a.status !== 2).length,
        archived: articles.filter(a => a.status === 1).length,
    }), [articles]);

    return (
        <div className="min-h-screen flex bg-background">
            <div className="hidden lg:block">
                <HomeSidebar
                    activeSection="tags"
                    onSectionChange={() => navigate('/home')}
                    collapsed={sidebarCollapsed}
                    onCollapse={setSidebarCollapsed}
                    onAddArticle={() => { }}
                    articleCounts={articleCounts}
                />
            </div>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div className="relative z-50 h-full w-64 animate-in slide-in-from-left duration-300">
                        <HomeSidebar
                            activeSection="tags"
                            onSectionChange={() => { setMobileMenuOpen(false); navigate('/home'); }}
                            collapsed={false}
                            onCollapse={() => { }}
                            onAddArticle={() => setMobileMenuOpen(false)}
                            articleCounts={articleCounts}
                        />
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute top-4 right-[-44px] p-2 rounded-lg bg-card border border-border text-muted-foreground"
                            aria-label="Close menu"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col min-w-0">
                <Topbar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filterStatus={filterStatus}
                    onFilterChange={setFilterStatus}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                    isDark={isDark}
                    onToggleTheme={toggleTheme}
                    onMenuClick={() => setMobileMenuOpen(true)}
                />

                <main className="flex-1 px-4 md:px-8 py-6">
                    <div className="max-w-3xl mx-auto">
                        {loading ? (
                            <LoadingSkeleton />
                        ) : (
                            <>
                                <TagDetailHeader tagName={decodedTag} articleCount={filteredArticles.length} />
                                {filteredArticles.length === 0 ? (
                                    <EmptyState
                                        title="No articles with this tag"
                                        description={`No articles tagged "${decodedTag}" match your current filters.`}
                                    />
                                ) : (
                                    <ArticleList
                                        articles={filteredArticles}
                                        onToggleFavorite={toggleFavorite}
                                        onToggleArchive={toggleArchive}
                                        onDelete={deleteArticle}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
