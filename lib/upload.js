'use server';

import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

/**
 * Uploads a file to Vercel Blob storage.
 * @param {FormData} formData - The formData containing the file to upload.
 * @returns {Promise<{url: string, error?: string}>}
 */
export async function uploadImage(formData) {
    const file = formData.get('file');

    if (!file) {
        return { error: 'No file provided' };
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN || "vercel_blob_rw_SZFDjh9KdeU1EfbI_Z3lvVic5ELojJ2b8yE3xnnemAQl6Oe";

    if (!token) {
        return { error: 'Vercel Blob token not configured' };
    }

    try {
        const blob = await put(file.name, file, {
            access: 'public',
            token: token,
        });

        revalidatePath('/');
        return { url: blob.url };
    } catch (error) {
        console.error('Error uploading to Vercel Blob:', error);
        return { error: 'Upload failed: ' + error.message };
    }
}
