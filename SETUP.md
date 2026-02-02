# PosturePro Store Setup Guide

## Live URLs

- **Production Site:** https://posture-pro-store.netlify.app
- **GitHub Repo:** https://github.com/ZacharyVorsteg/posture-pro-store
- **Netlify Admin:** https://app.netlify.com/projects/posture-pro-store

---

## Remaining Setup Steps

### 1. Snipcart Configuration (Required for Checkout)

1. **Create Snipcart Account**
   - Go to https://snipcart.com
   - Sign up for free (test mode included)
   - Add your domain: `posture-pro-store.netlify.app`

2. **Get Your API Key**
   - Dashboard → Account → API Keys
   - Copy your **Public API Key**

3. **Update the Code**
   - Edit `src/layouts/Layout.astro`
   - Replace `YOUR_SNIPCART_PUBLIC_API_KEY` with your actual key:
   ```html
   <div hidden id="snipcart" data-api-key="YOUR_KEY_HERE"></div>
   ```

4. **Configure Snipcart Dashboard**
   - Set default currency: USD
   - Add shipping rate: Free US shipping
   - Connect Stripe for payments

5. **Redeploy**
   ```bash
   npm run build && netlify deploy --dir=dist --prod
   ```

---

### 2. Product Sourcing (CJDropshipping)

1. **Create CJDropshipping Account**
   - Go to https://cjdropshipping.com
   - Sign up free

2. **Find the Product**
   - Search: "posture corrector adjustable"
   - Filter: US Warehouse, 4+ stars
   - Recommended: ~$8-15 cost (3.5x markup to $59.99)

3. **Order Fulfillment**
   - When orders come in from Snipcart, manually fulfill via CJ
   - Or set up Snipcart webhook → CJ API automation

---

### 3. Custom Domain (Optional)

1. Buy domain (Namecheap, Cloudflare, etc.)
2. In Netlify: Site settings → Domain management → Add custom domain
3. Netlify handles SSL automatically

---

### 4. Product Images

Replace placeholder with real product images:

1. Download from CJDropshipping listing
2. Save to `/public/product.jpg`
3. Add additional images: `/public/product-2.jpg`, etc.
4. Rebuild and redeploy

---

### 5. Facebook/Meta Pixel (For Ads)

1. Create pixel at business.facebook.com
2. Add to `src/layouts/Layout.astro` in `<head>`:
```html
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

---

## Tech Stack

- **Framework:** Astro 5.x
- **Styling:** Tailwind CSS 4.x
- **Cart/Checkout:** Snipcart
- **Hosting:** Netlify
- **Repo:** GitHub

---

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Netlify
netlify deploy --dir=dist --prod
```

---

## Cost Structure

| Item | Cost |
|------|------|
| Snipcart | 2% transaction fee |
| Stripe | 2.9% + $0.30/txn |
| Netlify | Free tier |
| Domain | ~$12/year |
| Product cost | ~$12 |
| **Sell price** | $59.99 |
| **Gross margin** | ~$43/unit |

---

## Next Steps Priority

1. [ ] Add Snipcart API key (enables checkout)
2. [ ] Add product images
3. [ ] Test checkout flow
4. [ ] Set up CJDropshipping fulfillment
5. [ ] Add Meta pixel
6. [ ] Launch ads
