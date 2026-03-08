import { useState, useCallback }    from 'react';
import { Button }                   from '@src/components/ui/button';
import { Input }                    from '@src/components/ui/input';
import { Label }                    from '@src/components/ui/label';
import { toast }                    from 'sonner';
import isValidUrl                   from '@src/commons/isValidUrl';
import { Loader2, Link as LinkIcon, Type, Tags } 
                                    from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, 
DialogTitle, DialogDescription }    from '@src/components/ui/dialog';
import addManager                   from '@src/api/addManager';


interface AddArticleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function AddArticleModal({ open, onOpenChange, onSuccess }: AddArticleModalProps) {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const urlValid = url.trim().length > 0 && isValidUrl(url.trim());
    const canSubmit = urlValid && !submitting;

    const resetForm = useCallback(() => {
        setUrl('');
        setTitle('');
        setTags('');
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        // prevent the default redirection behaviour
        e.preventDefault();
        
        if (!canSubmit) 
            return;

        setSubmitting(true);

        try {
            const resAddManager = await addManager({
                // TODO: fix access token, and consumer key
                access_token: "",
                consumer_key: "",
                url: url.trim(),
                title: title.trim() || undefined,
                tags: tags.trim() || undefined,
            });

            toast.success("Article added successfully");
            resetForm();
            onOpenChange(false);
            onSuccess?.();
        }
        catch (err) {
            // axios throws an error on failure

            // TODO: find out what went wrong
            toast.error("Something went wrong");
            console.log(err?.message);
        }

        setSubmitting(false);

    };

    return (
        <Dialog open={open} onOpenChange={v => { if (!submitting) onOpenChange(v); }}>
            <DialogContent className="sm:max-w-md gap-0">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-lg font-display font-bold">
                        Add Article
                    </DialogTitle>
                    
                    <DialogDescription className="text-sm text-muted-foreground">
                        Save a URL, read it later
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
                            <p className="text-xs text-destructive">
                                Please enter a valid URL.
                            </p>
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
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!canSubmit}>
                            {submitting ? (
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
