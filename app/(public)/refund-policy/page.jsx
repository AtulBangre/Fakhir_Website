import { getWebPage } from '@/lib/actions/content';
import LegalPageContent from '@/components/legal/LegalPageContent';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
    const page = await getWebPage('refund-policy');
    return {
        title: page?.title || "Refund Policy | Fakhri IT Services",
        description: "Refund Policy of Fakhri IT Services. Learn about our terms for refunds and cancellations.",
    };
}

export default async function RefundPolicyPage() {
    const page = await getWebPage('refund-policy');

    if (!page) {
        notFound();
    }

    return <LegalPageContent page={page} />;
}
