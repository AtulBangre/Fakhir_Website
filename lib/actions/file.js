'use server';

import connectDB from '@/lib/mongodb';
import File from '@/models/File';
import Note from '@/models/Note';

export async function getFilesByClientId(clientId, { page = 1, limit = 10 } = {}) {
    await connectDB();
    const skip = (page - 1) * limit;
    try {
        const files = await File.find({ clientId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const total = await File.countDocuments({ clientId });
        return {
            files: JSON.parse(JSON.stringify(files)),
            total,
            pages: Math.ceil(total / limit)
        };
    } catch (error) {
        console.error('Error fetching files:', error);
        return { files: [], total: 0, pages: 0 };
    }
}

export async function getNotesByClientId(clientId) {
    await connectDB();
    try {
        const notes = await Note.find({ clientId })
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(notes));
    } catch (error) {
        console.error('Error fetching notes:', error);
        return [];
    }
}

export async function addNote(clientId, noteData) {
    await connectDB();
    try {
        const note = await Note.create({
            clientId,
            ...noteData
        });
        return JSON.parse(JSON.stringify(note));
    } catch (error) {
        console.error('Error adding note:', error);
        return null;
    }
}
