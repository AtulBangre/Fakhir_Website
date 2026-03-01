import { getWebPage } from '@/lib/actions/content';
import LegalPageContent from '@/components/legal/LegalPageContent';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
    const page = await getWebPage('terms-conditions');
    return {
        title: page?.title || "Terms & Conditions | Fakhri IT Services",
        description: "Terms and Conditions for using Fakhri IT Services. Please read our service agreement carefully.",
    };
}

export default async function TermsConditionsPage() {
    const page = await getWebPage('terms-conditions');

    if (!page) {
        notFound();
    }

    return <LegalPageContent page={page} />;
}
