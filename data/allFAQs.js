// Frequently Asked Questions Collection
// Master Database ensuring single source of truth

export const allFAQs = [
    // HOME PAGE FAQs
    {
        id: "home-1",
        question: "What services does Fakhri IT Services provide?",
        answer: "We offer comprehensive Amazon seller services including Account Management, FBA Operations, PPC Campaign Management, Product Listing Optimization, A+ Content (EBC) Creation, and Account Reinstatement services. We are your end-to-end partner for Amazon success.",
        categories: { home: true, pricing: false, dashboard: false }
    },
    {
        id: "home-2",
        question: "How quickly can I see results?",
        answer: "While results vary based on the category and competition, most clients see a noticeable improvement in account health and traffic within the first 30 days. Significant sales growth and ROI improvements typically materialize within 2-3 months of our strategic implementation.",
        categories: { home: true, pricing: false, dashboard: false }
    },
    {
        id: "home-3",
        question: "Do you work with new sellers?",
        answer: "Yes! We specialize in launching new brands on Amazon. From setting up your Seller Central account to creating optimized listings and launching your first PPC campaigns, we guide you through every step of the journey.",
        categories: { home: true, pricing: false, dashboard: false }
    },
    {
        id: "home-4",
        question: "Why should I choose Fakhri IT Services?",
        answer: "We are an Amazon Gold Partner with over 8 years of experience and 500+ satisfied clients. Our data-driven strategies, transparent reporting, and dedicated support team ensure you get the best possible ROI for your Amazon business.",
        categories: { home: true, pricing: false, dashboard: false }
    },
    {
        id: "home-5",
        question: "How do I communicate with my account manager?",
        answer: "You will have a dedicated account manager assigned to your business. We offer communication via email, WhatsApp, and scheduled video calls to keep you updated on your performance and strategy.",
        categories: { home: true, pricing: false, dashboard: false }
    },

    // PRICING PAGE FAQs
    {
        id: "pricing-1",
        question: "What's included in the setup?",
        answer: "All plans include initial account audit, optimization roadmap, and onboarding. Setup typically takes 2-3 weeks depending on the complexity of your catalog.",
        categories: { home: false, pricing: true, dashboard: false }
    },
    {
        id: "pricing-2",
        question: "Can I upgrade my plan later?",
        answer: "Absolutely! You can upgrade your plan at any time. We'll prorate the difference and seamlessly transition you to the higher tier.",
        categories: { home: false, pricing: true, dashboard: false }
    },
    {
        id: "pricing-3",
        question: "Is there a minimum commitment?",
        answer: "We recommend a minimum 3-month commitment to see meaningful results, but we offer month-to-month options for flexibility.",
        categories: { home: false, pricing: true, dashboard: false }
    },
    {
        id: "pricing-4",
        question: "What if I need custom services?",
        answer: "Our Platinum plan is fully customizable. Contact our sales team to discuss your specific needs and we'll create a tailored solution.",
        categories: { home: false, pricing: true, dashboard: false }
    },

    // CLIENT DASHBOARD FAQs
    {
        id: "dash-1",
        question: "How can I view my task progress?",
        answer: "Navigate to the 'Tasks' tab in the sidebar to see all your tasks. You can filter tasks by status, manager, or date range using the filters panel.",
        categories: { home: false, pricing: false, dashboard: true }
    },
    {
        id: "dash-2",
        question: "How do I download files shared by my account manager?",
        answer: "Go to the 'Files' tab to access all deliverables. Each file has Preview and Download buttons. You can also filter files by date.",
        categories: { home: false, pricing: false, dashboard: true }
    },
    {
        id: "dash-3",
        question: "How can I check my billing history?",
        answer: "Visit the 'Billing' tab to view your payment history, invoices, and upcoming payment schedules.",
        categories: { home: false, pricing: false, dashboard: true }
    },
    {
        id: "dash-4",
        question: "How do I contact my account manager?",
        answer: "Your account manager's details are displayed on the Dashboard tab. You can email them directly or use the WhatsApp button at the bottom right of the screen.",
        categories: { home: false, pricing: false, dashboard: true }
    },
    {
        id: "dash-5",
        question: "Can I upgrade my current plan?",
        answer: "Yes! Go to the 'My Plan' tab to view available plans and add-ons. Contact your account manager to discuss upgrade options.",
        categories: { home: false, pricing: false, dashboard: true }
    },
    {
        id: "dash-6",
        question: "How do I update my profile information?",
        answer: "Navigate to the 'Profile' tab to update your personal information, company details, and notification preferences.",
        categories: { home: false, pricing: false, dashboard: true }
    },
    {
        id: "dash-7",
        question: "What do the different task statuses mean?",
        answer: "Pending: Task is scheduled but not started. In Progress: Task is actively being worked on. Completed: Task has been finished and delivered.",
        categories: { home: false, pricing: false, dashboard: true }
    },
    {
        id: "dash-8",
        question: "How often are files updated?",
        answer: "Files are uploaded as they are completed. You'll receive a notification when new files are available in your account.",
        categories: { home: false, pricing: false, dashboard: true }
    }
];

// Helper exports for backward compatibility (optional, but good for phased refactoring if needed, though we will refactor all consumers)
export const homeFAQs = allFAQs.filter(f => f.categories.home);
export const pricingFAQs = allFAQs.filter(f => f.categories.pricing);
export const clientDashboardFAQs = allFAQs.filter(f => f.categories.dashboard);

