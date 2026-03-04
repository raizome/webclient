import { useState } from 'react';

interface AddArticlePayload {
    url: string;
    title?: string;
    tags?: string;
}

interface AddArticleResult {
    success: boolean;
    message: string;
}

async function simulateAddArticle(payload: AddArticlePayload): Promise<AddArticleResult> {
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
    const success = Math.random() > 0.5;
    return success
        ? { success: true, message: 'Article saved successfully' }
        : { success: false, message: 'Failed to save article. Please try again.' };
}

export function useAddArticle() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addArticle = async (payload: AddArticlePayload): Promise<AddArticleResult> => {
        setIsSubmitting(true);
        try {
            return await simulateAddArticle(payload);
        } finally {
            setIsSubmitting(false);
        }
    };

    return { addArticle, isSubmitting };
}
