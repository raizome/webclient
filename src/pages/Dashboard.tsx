import { useState, useMemo, useCallback, useEffect } from 'react';
import { Article, FilterStatus, SortOption, NavSection } from '@src/types/article';
import { mockArticles } from '@src/data/mockArticles';
import DashboardSidebar from '@src/components/dashboard/DashboardSidebar';
import Topbar from '@src/components/dashboard/Topbar';
import ArticleList from '@src/components/dashboard/ArticleList';
import EmptyState from '@src/components/dashboard/EmptyState';
import LoadingSkeleton from '@src/components/dashboard/LoadingSkeleton';
import TagsPage from '@src/components/dashboard/TagsPage';
import { useTheme } from '@src/hooks/useTheme';
import { useIsMobile } from '@src/hooks/use-mobile';
import { cn } from '@src/commons/utils';
import { X } from 'lucide-react';
import AddArticleModal from '@src/components/dashboard/AddArticleModal';


export default function Dashboard() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [sortOption, setSortOption] = useState<SortOption>('newest');
    const [activeSection, setActiveSection] = useState<NavSection>('all');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const { isDark, toggle: toggleTheme } = useTheme();
    const isMobile = useIsMobile();



    // Simulate API fetch
    useEffect(() => {
        const timer = setTimeout(() => {

            setArticles(mockArticles);
            setLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    // Close mobile menu on resize
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
        let result = [...articles];

        // Nav section filter
        if (activeSection === 'favorites') result = result.filter(a => a.favorite);
        else if (activeSection === 'archived') result = result.filter(a => a.status === 1);
        else result = result.filter(a => a.status !== 2); // hide deleted from "all"

        // Status filter (topbar)
        if (filterStatus === 'active') result = result.filter(a => a.status === 0);
        else if (filterStatus === 'archived') result = result.filter(a => a.status === 1);
        else if (filterStatus === 'deleted') result = result.filter(a => a.status === 2);

        // Search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(a =>
                (a.resolved_title || a.given_title || '').toLowerCase().includes(q) ||
                (a.excerpt || '').toLowerCase().includes(q) ||
                (a.domain?.name || '').toLowerCase().includes(q)
            );
        }

        // Sort
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
    }, [articles, activeSection, filterStatus, searchQuery, sortOption]);

    const articleCounts = useMemo(() => ({
        all: articles.filter(a => a.status !== 2).length,
        favorites: articles.filter(a => a.favorite && a.status !== 2).length,
        archived: articles.filter(a => a.status === 1).length,
    }), [articles]);

    const sectionTitle = activeSection === 'all' ? 'All Items' : activeSection === 'favorites' ? 'Favorites' : activeSection === 'archived' ? 'Archived' : 'Tags';
    const showTagsGrid = activeSection === 'tags';

    return (
        <div className="min-h-screen flex bg-background">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <DashboardSidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    collapsed={sidebarCollapsed}
                    onCollapse={setSidebarCollapsed}
                    onAddArticle={() => setAddModalOpen(true)}
                    articleCounts={articleCounts}
                />
            </div>

            {/* Mobile drawer overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div className="relative z-50 h-full w-64 animate-in slide-in-from-left duration-300">
                        <DashboardSidebar
                            activeSection={activeSection}
                            onSectionChange={s => { setActiveSection(s); setMobileMenuOpen(false); }}
                            collapsed={false}
                            onCollapse={() => { }}
                            onAddArticle={() => { setMobileMenuOpen(false); setAddModalOpen(true); }}
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
                    <div className={cn('mx-auto', showTagsGrid ? 'max-w-6xl' : 'max-w-3xl')}>
                        {showTagsGrid ? (
                            <TagsPage articles={articles} loading={loading} />
                        ) : (
                            <>
                                {/* Section header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
                                            {sectionTitle}
                                        </h1>
                                        {!loading && (
                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                {loading ? (
                                    <LoadingSkeleton />
                                ) : filteredArticles.length === 0 ? (
                                    <EmptyState
                                        title={searchQuery ? 'No results found' : undefined}
                                        description={searchQuery ? `No articles match "${searchQuery}". Try a different search term.` : undefined}
                                        onAddArticle={!searchQuery ? () => { } : undefined}
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

            <AddArticleModal
                open={addModalOpen}
                onOpenChange={setAddModalOpen}
                onSuccess={() => {
                    // Future: refetch articles from API
                }}
            />
        </div>
    );
}
