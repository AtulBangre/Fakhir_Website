// Consolidated Pricing Plans Collection

export const plans = [
    {
        id: "elite",
        name: "Elite",
        subtitle: "Starter Package",
        prices: {
            monthly: "₹15,000",
            monthlyUSD: "₹15,000",
        },
        period: "/month",
        description: "Best for new sellers getting started on Amazon.",
        highlighted: false,
        cta: "Get Elite Plan",
    },
    {
        id: "premium",
        name: "Premium",
        subtitle: "Most Popular",
        prices: {
            monthly: "₹20,000",
            monthlyUSD: "₹20,000",
        },
        period: "/month",
        description: "Ideal for growing brands needing comprehensive management.",
        highlighted: true,
        cta: "Get Premium Plan",
    },
    {
        id: "platinum",
        name: "Platinum",
        subtitle: "Enterprise Solution",
        prices: {
            monthly: "₹30,000",
            monthlyUSD: "₹30,000",
        },
        period: "/month",
        description: "Full-service solution for high-volume sellers and large catalogs.",
        highlighted: false,
        cta: "Get Platinum Plan",
    }
];

// Unified Features List
// Each feature defines its availability/value across plans
export const planFeatures = [
    { text: "Listing/ Cataloging", values: { elite: "Up To 100", premium: "Up To 500", platinum: "Up To 1000" }, included: ["elite", "premium", "platinum"] },
    { text: "GTIN / Brand / Category Approvals", values: { elite: true, premium: true, platinum: true }, included: ["elite", "premium", "platinum"] },
    { text: "Listing Optimization", values: { elite: true, premium: true, platinum: true }, included: ["elite", "premium", "platinum"] },
    { text: "Order Management", values: { elite: true, premium: true, platinum: true }, included: ["elite", "premium", "platinum"] },
    { text: "Weekly Meeting", values: { elite: false, premium: true, platinum: true }, included: ["premium", "platinum"] },
    { text: "Returns Management", values: { elite: true, premium: true, platinum: true }, included: ["elite", "premium", "platinum"] },
    { text: "Safe-T Claims & A to Z Claim", values: { elite: true, premium: true, platinum: true }, included: ["elite", "premium", "platinum"] },
    { text: "Performance Management", values: { elite: "Basic", premium: "Advanced", platinum: "Advanced + Priority" }, included: ["elite", "premium", "platinum"] },
    { text: "FBA Setup & Shipments", values: { elite: true, premium: true, platinum: true }, included: ["elite", "premium", "platinum"] },
    { text: "FBA Planning", values: { elite: true, premium: true, platinum: true }, included: ["elite", "premium", "platinum"] },
    { text: "Sponsored Ad Campaigns", values: { elite: true, premium: true, platinum: true }, included: ["elite", "premium", "platinum"] },
    { text: "Display / Brand Ads", values: { elite: false, premium: "Display Ads", platinum: "Display+Brands Ads" }, included: ["premium", "platinum"] },
    { text: "Budget Planning", values: { elite: false, premium: true, platinum: true }, included: ["premium", "platinum"] },
    { text: "Deals & Coupons", values: { elite: true, premium: true, platinum: true }, included: ["elite", "premium", "platinum"] },
    { text: "Growth Strategy", values: { elite: false, premium: true, platinum: true }, included: ["premium", "platinum"] },
    { text: "Program Access", values: { elite: false, premium: false, platinum: true }, included: ["platinum"] },
    { text: "Pricing Determination", values: { elite: true, premium: true, platinum: true }, included: ["elite", "premium", "platinum"] },
    { text: "Product Recommendations", values: { elite: false, premium: true, platinum: true }, included: ["premium", "platinum"] },
    { text: "A+ / EBC + Infographics", values: { elite: false, premium: "5 EBC + 5 InfoGFX", platinum: "10 EBC + 10 InfoGFX" }, included: ["premium", "platinum"] },
    { text: "SEO & Keywords", values: { elite: "Basic", premium: "Monthly 1 Time", platinum: "Monthly 3 Time" }, included: ["elite", "premium", "platinum"] },
    { text: "Competitor Analysis", values: { elite: false, premium: false, platinum: true }, included: ["platinum"] },
    { text: "Custom Reports", values: { elite: false, premium: true, platinum: "Advanced" }, included: ["premium", "platinum"] },
    { text: "M.T.R. Tax Reports & Invoices", values: { elite: true, premium: false, platinum: true }, included: ["elite", "platinum"] },
    { text: "Payment Reconciliation Report", values: { elite: false, premium: false, platinum: true }, included: ["platinum"] },
    { text: "Daily Monitoring", values: { elite: true, premium: true, platinum: true }, included: ["elite", "premium", "platinum"] },
    { text: "Priority Support", values: { elite: false, premium: false, platinum: true }, included: ["platinum"] },
];

// Helper to reconstruct the old `pricingPlans` structure for backward compatibility
export const getPricingPlans = () => {
    return plans.map(plan => ({
        ...plan,
        features: planFeatures.map(feature => ({
            text: feature.text,
            value: feature.values[plan.id],
            included: feature.included.includes(plan.id)
        }))
    }));
};

// Aliases for backward compatibility
export const pricingPlans = getPricingPlans();

export const pricingDisclaimer = "Sales and growth results may vary based on multiple factors including product category, competition, market conditions, and seller commitment. No guaranteed outcomes. Results mentioned are based on historical client performance and are not promises of future success.";

export const pricingPageInfo = {
    title: "Add-on Services Pricing",
    description: "Enhance your Amazon business with our premium add-on services. Choose from a variety of specialized services to boost your performance.",
    badge: "Add-on Services"
};
