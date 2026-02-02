# PosturePro Fulfillment Guide

Complete workflow for processing orders from Snipcart through CJDropshipping.

---

## Overview

```
Customer Order → Snipcart → You → CJDropshipping → Customer
```

**Your role:** Bridge between payment processor and fulfillment.

---

## Step 1: Snipcart Order Notification

When a customer places an order:

1. **Email notification** - Snipcart sends order details to your registered email
2. **Dashboard** - View at https://app.snipcart.com → Orders

Order contains:
- Customer name, email, shipping address
- Product: PosturePro Corrector
- Size: S/M or L/XL
- Order total (your revenue)

---

## Step 2: CJDropshipping Fulfillment

### Manual Process (Start Here)

1. **Log into CJDropshipping**
   - https://cjdropshipping.com → Sign in

2. **Find the product**
   - Search: "posture corrector adjustable"
   - Filter: US Warehouse (faster shipping)
   - Select product matching your listing

3. **Place order**
   - Click "List" → "My Products" if you've saved it
   - Enter customer shipping address
   - Select size variant (S/M or L/XL)
   - Pay wholesale cost (~$8-15)

4. **Get tracking**
   - CJ provides tracking within 24-48 hours
   - Usually USPS for US orders

5. **Update Snipcart**
   - Go to Snipcart dashboard → Orders
   - Find order → Add tracking number
   - Customer receives shipping notification email

### Automation (Scale Later)

Once you have consistent orders, automate with webhooks:

```javascript
// Snipcart Webhook → Your Server → CJ API
// Set up in Snipcart Dashboard → Webhooks
// Endpoint: https://your-server.com/api/order

// Webhook payload includes:
// - customer info
// - shipping address
// - items ordered
// - custom options (size)
```

CJ API docs: https://developers.cjdropshipping.com/

---

## Step 3: Customer Communication

### Automated (Snipcart handles)
- Order confirmation email
- Shipping notification with tracking
- Delivery confirmation

### Manual (You handle)
- Customer service inquiries → support@yourdomain.com
- Returns/refunds → Process through Snipcart

---

## Product Sourcing on CJDropshipping

### Finding the Right Product

Search terms:
- "posture corrector adjustable"
- "back posture brace"
- "posture support belt"

Filter by:
- **Warehouse:** US (3-5 day shipping) vs China (10-20 days)
- **Rating:** 4+ stars
- **Price:** $8-15 wholesale for good margin

### Recommended Product Attributes

| Attribute | Look For |
|-----------|----------|
| Material | Neoprene, breathable mesh |
| Sizes | S/M and L/XL variants |
| Color | Black (universally acceptable) |
| Adjustable | Velcro straps |
| US Warehouse | Yes (critical for shipping time) |

---

## Pricing Math

| Item | Amount |
|------|--------|
| **Your sale price** | $59.99 |
| Product cost (CJ) | -$12.00 |
| Snipcart fee (2%) | -$1.20 |
| Stripe fee (2.9% + $0.30) | -$2.04 |
| **Net profit per sale** | ~$44.75 |

Margin: ~75%

---

## Handling Returns

1. Customer emails requesting return
2. Verify within 30-day window
3. Provide return instructions:
   - Ship to your address OR
   - Use CJ's return address (check their policy)
4. Process refund in Snipcart once received
5. If defective, file claim with CJ

---

## Quality Control

### Before First Order
- Order a sample to yourself
- Verify quality, sizing accuracy
- Take real photos for future use

### Ongoing
- Monitor CJ product reviews
- Check for quality complaints
- Have backup supplier identified

---

## Scaling Checklist

- [ ] 10+ orders: Consider CJ Pro account for better rates
- [ ] 50+ orders: Set up API automation
- [ ] 100+ orders: Negotiate custom pricing with CJ
- [ ] 500+ orders: Consider private labeling

---

## Emergency Contacts

- **Snipcart Support:** support@snipcart.com
- **CJDropshipping:** Live chat on their site
- **Stripe:** dashboard.stripe.com/support

---

## Daily Workflow

**Morning (5 min):**
1. Check Snipcart for new orders
2. Process any pending orders through CJ
3. Update tracking numbers

**As Needed:**
- Respond to customer emails
- Handle returns/issues

---

## Notes

- Start manual, automate when volume justifies
- US warehouse = happy customers = fewer refunds
- Sample your own product before selling
- Keep $200+ float in CJ account for fast fulfillment
