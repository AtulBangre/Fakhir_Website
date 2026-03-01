
export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/client/', '/admin/', '/super-admin/', '/api/'],
        },
        sitemap: 'https://www.fakhriitservices.com/sitemap.xml', // Replace with actual domain
    }
}
