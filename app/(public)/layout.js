
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { CartProvider } from "@/context/CartContext";
import { getCompanyData } from '@/lib/actions/content';

export default async function PublicLayout({ children }) {
    const company = await getCompanyData();

    return (
        <CartProvider>
            <ScrollToTop />
            <Header initialCompany={company} />
            <main className="min-h-screen pt-20 overflow-x-hidden">
                {children}
            </main>
            <Footer initialCompany={company} />
        </CartProvider>
    );
}
