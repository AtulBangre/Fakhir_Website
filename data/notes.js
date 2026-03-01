// Client Notes Collection
// Linked to clients via clientId
export const notesData = [
    { id: 1, clientId: 1, author: "Sarah Mitchell", authorId: 1, date: "Jan 18, 2026", content: "Client requested priority on PPC campaigns. Discussed budget allocation for Q1." },
    { id: 2, clientId: 1, author: "John Anderson", authorId: 2, date: "Jan 15, 2026", content: "Completed initial consultation. Client has 50 SKUs to optimize." },
    { id: 3, clientId: 2, author: "Sarah Mitchell", authorId: 1, date: "Jan 16, 2026", content: "Client wants focus on beauty category. Seasonal campaigns discussed." },
    { id: 4, clientId: 3, author: "Emma Wilson", authorId: 3, date: "Jan 10, 2026", content: "Brand registry documents received. Processing application." },
];

export const getNotesByClientId = (clientId) => {
    return notesData.filter(note => note.clientId === clientId);
};

export const getNotesByAuthor = (authorName) => {
    return notesData.filter(note => note.author === authorName);
};
