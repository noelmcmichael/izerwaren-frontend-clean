# Izerwaren Marine Shop - Frontend

Clean Next.js frontend for Izerwaren Marine Shop with Shopify integration.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Environment Variables

Required environment variables for Vercel deployment:

- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` - Your Shopify store domain
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` - Shopify Storefront API token
- `SHOPIFY_ADMIN_ACCESS_TOKEN` - Shopify Admin API token  
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- `NEXTAUTH_URL` - Your deployment URL

## 🏗️ Deployment

This app is configured for Vercel deployment with automatic builds from main branch.

## 🛠️ Tech Stack

- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Shopify Buy SDK
- SWR for data fetching

🤖 Generated with [Memex](https://memex.tech)
Co-Authored-By: Memex <noreply@memex.tech>