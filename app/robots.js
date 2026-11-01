export default function robots() {
  const baseUrl = process.env.BETTER_AUTH_URL || "https://thardelight.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin-controls/",
          "/api/",
          "/account/",
          "/checkout/",
          "/invoice/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
