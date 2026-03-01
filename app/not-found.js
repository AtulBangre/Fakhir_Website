
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export const metadata = {
    title: '404 - Page Not Found | Fakhri IT Services',
    description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileQuestion className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold font-heading text-gray-900 mb-2">404</h1>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8">
                    Oops! The page you are looking for seems to have wandered off. It might have been removed or renamed.
                </p>
                <Link href="/">
                    <Button className="w-full">
                        Return Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
