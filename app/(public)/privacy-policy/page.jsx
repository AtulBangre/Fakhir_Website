import { getWebPage } from '@/lib/actions/content';
import LegalPageContent from '@/components/legal/LegalPageContent';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
    const page = await getWebPage('privacy-policy');
    return {
        title: page?.title || "Privacy Policy | Fakhri IT Services",
        description: "Privacy Policy of Fakhri IT Services. Learn how we collect, use and protect your personal information.",
    };
}

export default async function PrivacyPolicyPage() {
    const page = await getWebPage('privacy-policy');

    if (!page) {
        notFound();
    }

    return <LegalPageContent page={page} />;
}
