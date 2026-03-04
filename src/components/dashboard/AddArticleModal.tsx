import { useState, useCallback } from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@src/components/ui/dialog';
import { Button } from '@src/components/ui/button';
import { Input } from '@src/components/ui/input';
import { Label } from '@src/components/ui/label';
import { useAddArticle } from '@src/hooks/useAddArticle';
import { toast } from 'sonner';
import { Loader2, Link as LinkIcon, Type, Tags } from 'lucide-react';

interface AddArticleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

function isValidUrl(str: string): boolean {
    try {
        const url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

export default function AddArticleModal({ open, onOpenChange, onSuccess }: AddArticleModalProps) {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const { addArticle, isSubmitting } = useAddArticle();

    const urlValid = url.trim().length > 0 && isValidUrl(url.trim());
    const canSubmit = urlValid && !isSubmitting;

    const resetForm = useCallback(() => {
        setUrl('');
        setTitle('');
        setTags('');
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        const result = await addArticle({
            url: url.trim(),
            title: title.trim() || undefined,
            tags: tags.trim() || undefined,
        });

        if (result.success) {
            toast.success(result.message);
            resetForm();
            onOpenChange(false);
            onSuccess?.();
        } else {
            toast.error(result.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={v => { if (!isSubmitting) onOpenChange(v); }}>
            <DialogContent className="sm:max-w-md gap-0">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-lg font-display font-bold">Add Article</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Save a link to read later.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* URL */}
                    <div className="space-y-2">
                        <Label htmlFor="article-url" className="text-sm font-medium flex items-center gap-1.5">
                            <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
                            URL <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="article-url"
                            type="url"
                            placeholder="https://example.com/article"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            required
                            autoFocus
                            className="h-11"
                        />
                        {url.trim().length > 0 && !urlValid && (
                            <p className="text-xs text-destructive">Please enter a valid URL.</p>
                        )}
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="article-title" className="text-sm font-medium flex items-center gap-1.5">
                            <Type className="w-3.5 h-3.5 text-muted-foreground" />
                            Title <span className="text-muted-foreground font-normal">(optional)</span>
                        </Label>
                        <Input
                            id="article-title"
                            type="text"
                            placeholder="Optional custom title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="h-11"
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label htmlFor="article-tags" className="text-sm font-medium flex items-center gap-1.5">
                            <Tags className="w-3.5 h-3.5 text-muted-foreground" />
                            Tags <span className="text-muted-foreground font-normal">(optional)</span>
                        </Label>
                        <Input
                            id="article-tags"
                            type="text"
                            placeholder="ai, productivity, design"
                            value={tags}
                            onChange={e => setTags(e.target.value)}
                            className="h-11"
                        />
                        <p className="text-xs text-muted-foreground">Comma-separated tags</p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!canSubmit}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving…
                                </>
                            ) : (
                                'Save Article'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
