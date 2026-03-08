import { Bookmark, Heart, Archive, Tag, Plus, Settings, LogOut, ChevronLeft } from 'lucide-react';
import { NavSection } from '@src/types/article';
import { cn } from '@src/commons/utils';
import logo from '@src/assets/logo.png';

interface SidebarProps {
    activeSection: NavSection;
    onSectionChange: (section: NavSection) => void;
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
    onAddArticle: () => void;
    articleCounts: { all: number; favorites: number; archived: number };
}

const navItems: { id: NavSection; label: string; icon: typeof Bookmark }[] = [
    { id: 'all', label: 'All Items', icon: Bookmark },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'archived', label: 'Archived', icon: Archive },
    { id: 'tags', label: 'Tags', icon: Tag },
];

export default function HomeSidebar({
    activeSection, onSectionChange, collapsed, onCollapse, onAddArticle, articleCounts,
}: SidebarProps) {
    const getCount = (id: NavSection) => {
        if (id === 'all') return articleCounts.all;
        if (id === 'favorites') return articleCounts.favorites;
        if (id === 'archived') return articleCounts.archived;
        return undefined;
    };

    return (
        <aside
            className={cn(
                'h-screen sticky top-0 flex flex-col border-r border-border bg-card transition-all duration-300 z-30',
                collapsed ? 'w-[68px]' : 'w-64'
            )}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
                <img src={logo} alt="Open Pocket" className="w-8 h-8 rounded-lg shrink-0" />
                {!collapsed && (
                    <span className="font-display font-bold text-lg text-foreground tracking-tight">
                        Open Pocket
                    </span>
                )}
                <button
                    onClick={() => onCollapse(!collapsed)}
                    className={cn(
                        'ml-auto p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
                        collapsed && 'ml-0'
                    )}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
                </button>
            </div>

            {/* Add Article */}
            <div className="px-3 pt-4 pb-2">
                <button
                    onClick={onAddArticle}
                    className={cn(
                        'w-full flex items-center gap-2 rounded-xl bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 active:scale-[0.98]',
                        collapsed ? 'justify-center p-2.5' : 'px-4 py-2.5 text-sm'
                    )}
                >
                    <Plus className="w-4 h-4 shrink-0" />
                    {!collapsed && 'Add Article'}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2 space-y-1">
                {navItems.map(({ id, label, icon: Icon }) => {
                    const active = activeSection === id;
                    const count = getCount(id);
                    return (
                        <button
                            key={id}
                            onClick={() => onSectionChange(id)}
                            className={cn(
                                'w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all',
                                collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5',
                                active
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            )}
                        >
                            <Icon className="w-[18px] h-[18px] shrink-0" />
                            {!collapsed && (
                                <>
                                    <span className="flex-1 text-left">{label}</span>
                                    {count !== undefined && (
                                        <span className={cn(
                                            'text-xs tabular-nums px-1.5 py-0.5 rounded-md',
                                            active ? 'bg-primary/15 text-primary' : 'text-muted-foreground'
                                        )}>
                                            {count}
                                        </span>
                                    )}
                                </>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="border-t border-border px-3 py-3 space-y-1">
                <button className={cn(
                    'w-full flex items-center gap-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
                    collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
                )}>
                    <Settings className="w-[18px] h-[18px] shrink-0" />
                    {!collapsed && 'Settings'}
                </button>
                <button className={cn(
                    'w-full flex items-center gap-3 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors',
                    collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
                )}>
                    <LogOut className="w-[18px] h-[18px] shrink-0" />
                    {!collapsed && 'Log out'}
                </button>
            </div>
        </aside>
    );
}
