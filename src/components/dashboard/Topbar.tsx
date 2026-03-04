import { Search, SlidersHorizontal, ArrowUpDown, Sun, Moon, Menu } from 'lucide-react';
import { FilterStatus, SortOption } from '@src/types/article';
import { cn } from '@src/lib/utils';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface TopbarProps {
    searchQuery: string;
    onSearchChange: (q: string) => void;
    filterStatus: FilterStatus;
    onFilterChange: (f: FilterStatus) => void;
    sortOption: SortOption;
    onSortChange: (s: SortOption) => void;
    isDark: boolean;
    onToggleTheme: () => void;
    onMenuClick: () => void;
}

function CustomSelect({ value, onChange, options }: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    const [open, setOpen] = useState(false);
    const current = options.find(o => o.value === value);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1 text-sm text-foreground cursor-pointer focus:outline-none"
            >
                {current?.label}
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {open && (
                <>
                    {/* Backdrop to close on outside click */}
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-20 min-w-[140px] rounded-xl border border-border bg-background shadow-lg py-1">
                        {options.map(o => (
                            <button
                                key={o.value}
                                onClick={() => { onChange(o.value); setOpen(false); }}
                                className={cn(
                                    'w-full text-left px-3 py-1.5 text-sm transition-colors hover:bg-muted',
                                    o.value === value ? 'text-foreground font-medium' : 'text-muted-foreground'
                                )}
                            >
                                {o.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

const filters: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
    { value: 'deleted', label: 'Deleted' },
];

const sorts: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'updated', label: 'Recently Updated' },
    { value: 'word_count', label: 'Word Count' },
];

export default function Topbar({
    searchQuery, onSearchChange, filterStatus, onFilterChange,
    sortOption, onSortChange, isDark, onToggleTheme, onMenuClick,
}: TopbarProps) {
    return (
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="flex items-center gap-3 px-4 md:px-6 h-14">
                {/* Mobile menu */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Search */}
                <div className="flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => onSearchChange(e.target.value)}
                        placeholder="Search articles..."
                        className="w-full pl-9 pr-4 py-2 text-sm bg-muted/50 border-0 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                    />
                </div>

                <div className="hidden sm:flex items-center gap-2 ml-auto">
                    {/* Filter */}
                    <div className="relative">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <CustomSelect
                                value={filterStatus}
                                onChange={v => onFilterChange(v as FilterStatus)}
                                options={filters}
                            />
                        </div>
                    </div>

                    <div className="w-px h-5 bg-border" />

                    {/* Sort */}
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        <CustomSelect
                            value={sortOption}
                            onChange={v => onSortChange(v as SortOption)}
                            options={sorts}
                        />
                    </div>
                    <div className="w-px h-5 bg-border" />

                    {/* Theme toggle */}
                    <button
                        onClick={onToggleTheme}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </header>
    );
}
