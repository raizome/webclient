/* OAuth placeholder buttons */
export const OAuthPlaceholder = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <button type="button" disabled 
            className="flex items-center justify-center gap-2 h-11 rounded-lg border border-input 
                        bg-card text-muted-foreground text-sm font-medium opacity-60 cursor-not-allowed" 
            aria-label={`Sign up with ${label} (coming soon)`}>
        {icon}<span>{label}</span><span className="text-[10px] opacity-70">Soon</span>
    </button>
);
