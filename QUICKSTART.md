# PosturePro Complete Setup Checklist

Follow these steps in order. Check off each item as you complete it.

---

## Phase 1: Accounts (15 min)

### CJDropshipping Account
- [ ] Go to https://cjdropshipping.com
- [ ] Click "Sign Up" (top right)
- [ ] Verify email
- [ ] Complete profile setup

### Snipcart Account
- [ ] Go to https://snipcart.com
- [ ] Click "Start for free"
- [ ] Verify email
- [ ] Add domain: `posture-pro-store.netlify.app`

### Stripe Account (for payments)
- [ ] Go to https://stripe.com
- [ ] Sign up for account
- [ ] Complete identity verification
- [ ] Note: Snipcart will connect to this automatically

---

## Phase 2: Product Setup (20 min)

### Find Your Product on CJDropshipping

1. Log into CJDropshipping
2. Search: "posture corrector adjustable"
3. Filter by:
   - **Warehouse:** US Warehouse (critical for fast shipping)
   - **Rating:** 4+ stars
   - **Price:** $8-15 range

4. Recommended product types:
   - Adjustable back posture corrector
   - Shoulder spine support brace
   - Look for: Neoprene, breathable mesh, velcro straps

5. Click "List" to add to your products
6. Note the product variants (sizes)

### Download Product Images

1. On your chosen product page, right-click each image
2. "Save Image As" → Save to `/public/` folder
3. Rename files:
   - `product-1.jpg` (main image)
   - `product-2.jpg` (being worn)
   - `product-3.jpg` (detail shot)
   - `product-4.jpg` (packaging if available)

### Update Website with Real Images

Edit `src/pages/index.astro`:

```astro
<!-- Replace the SVG with real images -->
<img
  src="/product-1.jpg"
  alt="PosturePro Corrector"
  class="w-full max-w-sm mx-auto"
/>
```

---

## Phase 3: Payment Setup (10 min)

### Configure Snipcart

1. Log into https://app.snipcart.com
2. Go to **Account** → **API Keys**
3. Copy your **Public API Key**

4. Edit `src/layouts/Layout.astro`:
```html
<div hidden id="snipcart" data-api-key="YOUR_ACTUAL_KEY_HERE"></div>
```

5. Go to **Payment Gateway** in Snipcart dashboard
6. Click "Connect with Stripe"
7. Follow Stripe authorization flow

### Configure Currency & Shipping

1. In Snipcart → **Regional Settings**
   - Default currency: USD
   - Weight unit: lb

2. In Snipcart → **Shipping**
   - Add rate: "Free US Shipping" → $0.00 for US orders
   - Optional: Add flat rate for international

---

## Phase 4: Order Notifications (5 min)

### Set Up Webhooks

1. In Snipcart → **Webhooks**
2. Add endpoint URL:
   ```
   https://posture-pro-store.netlify.app/.netlify/functions/notify-order
   ```
3. Events to subscribe: `order.completed`

### Optional: Discord Notifications

1. Create Discord server (or use existing)
2. Create webhook in channel settings
3. In Netlify → **Site Settings** → **Environment Variables**
4. Add: `DISCORD_WEBHOOK_URL` = your Discord webhook URL

### Optional: Email Notifications

1. Sign up at https://resend.com (free tier: 3000 emails/month)
2. Get API key
3. In Netlify → **Environment Variables**:
   - `RESEND_API_KEY` = your Resend key
   - `NOTIFICATION_EMAIL` = your email address

---

## Phase 5: Environment Variables

Add these to Netlify → **Site Settings** → **Environment Variables**:

| Variable | Required | Description |
|----------|----------|-------------|
| `SNIPCART_SECRET` | Yes | From Snipcart API Keys (Secret key) |
| `CJ_API_KEY` | Optional | For auto-fulfillment (from CJ developer portal) |
| `DISCORD_WEBHOOK_URL` | Optional | For Discord order notifications |
| `RESEND_API_KEY` | Optional | For email notifications |
| `NOTIFICATION_EMAIL` | Optional | Where to send order emails |

---

## Phase 6: Deploy & Test (10 min)

### Deploy Updates

```bash
cd ~/Desktop/posture-pro-store
npm run build
netlify deploy --dir=dist --prod
```

### Test Checkout Flow

1. Go to your live site
2. Enable Snipcart test mode (in dashboard)
3. Add product to cart
4. Use test card: `4242 4242 4242 4242`
5. Any future expiry, any CVC
6. Complete test purchase
7. Verify webhook fires (check Netlify function logs)

### Go Live

1. In Snipcart → Disable test mode
2. You're live!

---

## Daily Operations

### When Order Comes In

**If Manual Fulfillment:**
1. Check Discord/email for order notification
2. Log into CJDropshipping
3. Go to "My Products" → Your posture corrector
4. Click "Source Now" or "Buy"
5. Enter customer shipping address
6. Select size variant
7. Pay with CJ balance
8. Get tracking number (24-48 hours)
9. In Snipcart → Orders → Add tracking to order

**If Auto-Fulfillment (CJ API):**
- Orders automatically sent to CJ
- You just need to maintain CJ balance
- Tracking auto-updates

---

## Cost Summary

| Service | Cost |
|---------|------|
| CJDropshipping | Free account |
| Snipcart | 2% of sales |
| Stripe | 2.9% + $0.30/txn |
| Netlify | Free tier |
| Resend | Free (3k emails/mo) |
| **Product cost** | ~$12/unit |
| **Selling price** | $59.99 |
| **Net profit** | ~$43/unit |

---

## Troubleshooting

### Checkout not working?
- Check Snipcart API key is correct
- Check domain is added in Snipcart dashboard
- Check browser console for errors

### Webhooks not firing?
- Check URL is correct in Snipcart dashboard
- Check Netlify function logs for errors
- Use Snipcart webhook test button

### Orders not appearing?
- Check Snipcart dashboard → Orders
- Make sure you're not in test mode (or check test orders)

---

## Support Contacts

- **Snipcart:** support@snipcart.com
- **CJDropshipping:** Live chat on site
- **Stripe:** dashboard.stripe.com/support
- **Netlify:** netlify.com/support
