import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Article } from '@src/types/article';
import { mockArticles } from '@src/data/mockArticles';
import HomeSidebar from '@src/components/home/HomeSidebar';
import Topbar from '@src/components/home/Topbar';
import { useTheme } from '@src/hooks/useTheme';
import { useIsMobile } from '@src/hooks/use-mobile';
import { X } from 'lucide-react';
import ArticleDetail from '@src/components/article/ArticleDetail';
import ArticleDetailSkeleton from '@src/components/article/ArticleDetailSkeleton';
import type { NavSection, FilterStatus, SortOption } from '@src/types/article';

export default function ArticlePage() {
    const { itemId } = useParams<{ itemId: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<NavSection>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [sortOption, setSortOption] = useState<SortOption>('newest');
    const { isDark, toggle: toggleTheme } = useTheme();
    const isMobile = useIsMobile();

    useEffect(() => {
        if (!isMobile) setMobileMenuOpen(false);
    }, [isMobile]);

    // Simulate API fetch
    useEffect(() => {
        setLoading(true);
        setError(false);
        const timer = setTimeout(() => {
            const found = mockArticles.find(a => a.item_id === Number(itemId));
            if (found) {
                setArticle(found);
            } else {
                setError(true);
            }
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [itemId]);

    const toggleFavorite = useCallback(() => {
        setArticle(prev => prev ? { ...prev, favorite: !prev.favorite } : prev);
    }, []);

    const toggleArchive = useCallback(() => {
        setArticle(prev => prev ? { ...prev, status: (prev.status === 1 ? 0 : 1) as 0 | 1 | 2 } : prev);
    }, []);

    const deleteArticle = useCallback(() => {
        setArticle(prev => prev ? { ...prev, status: 2 as const } : prev);
        setTimeout(() => navigate('/home'), 500);
    }, [navigate]);

    const articleCounts = useMemo(() => ({
        all: mockArticles.filter(a => a.status !== 2).length,
        favorites: mockArticles.filter(a => a.favorite && a.status !== 2).length,
        archived: mockArticles.filter(a => a.status === 1).length,
    }), []);

    return (
        <div className="min-h-screen flex bg-background">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <HomeSidebar
                    activeSection={activeSection}
                    onSectionChange={s => { setActiveSection(s); navigate('/home'); }}
                    collapsed={sidebarCollapsed}
                    onCollapse={setSidebarCollapsed}
                    onAddArticle={() => { }}
                    articleCounts={articleCounts}
                />
            </div>

            {/* Mobile drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div className="relative z-50 h-full w-64 animate-in slide-in-from-left duration-300">
                        <HomeSidebar
                            activeSection={activeSection}
                            onSectionChange={s => { setActiveSection(s); setMobileMenuOpen(false); navigate('/home'); }}
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

            {/* Main content */}
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
                    <div className="mx-auto max-w-[850px]">
                        {loading ? (
                            <ArticleDetailSkeleton />
                        ) : error || !article ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                                    <span className="text-2xl">📄</span>
                                </div>
                                <h2 className="text-lg font-semibold text-foreground mb-1">Article not found</h2>
                                <p className="text-sm text-muted-foreground mb-4">
                                    The article you're looking for doesn't exist or has been removed.
                                </p>
                                <button
                                    onClick={() => navigate('/home')}
                                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                                >
                                    Back to Home
                                </button>
                            </div>
                        ) : (
                            <ArticleDetail
                                article={article}
                                onToggleFavorite={toggleFavorite}
                                onToggleArchive={toggleArchive}
                                onDelete={deleteArticle}
                                onBack={() => navigate('/home')}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
