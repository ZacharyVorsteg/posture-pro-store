/**
 * Snipcart Order Webhook Handler
 *
 * This function receives order.completed events from Snipcart
 * and can trigger fulfillment via CJDropshipping API.
 *
 * Environment variables required:
 * - SNIPCART_SECRET: Your Snipcart secret key for webhook validation
 * - CJ_API_KEY: Your CJDropshipping API key (optional, for auto-fulfillment)
 * - NOTIFICATION_EMAIL: Email to receive order notifications
 */

const crypto = require('crypto');

exports.handler = async (event, context) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body);
    const { eventName, content } = payload;

    // Log all events for debugging
    console.log(`Received webhook: ${eventName}`);

    // Only process order.completed events
    if (eventName !== 'order.completed') {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Event ignored', eventName })
      };
    }

    // Validate webhook signature (optional but recommended)
    const snipcartSecret = process.env.SNIPCART_SECRET;
    if (snipcartSecret) {
      const requestToken = event.headers['x-snipcart-requesttoken'];
      // In production, validate this token against Snipcart's API
      // https://docs.snipcart.com/v3/webhooks/introduction#validating-webhooks
    }

    // Extract order details
    const order = {
      invoiceNumber: content.invoiceNumber,
      email: content.email,
      total: content.total,
      currency: content.currency,
      creationDate: content.creationDate,

      // Customer info
      billingAddress: {
        name: content.billingAddressName,
        address1: content.billingAddressAddress1,
        address2: content.billingAddressAddress2,
        city: content.billingAddressCity,
        province: content.billingAddressProvince,
        postalCode: content.billingAddressPostalCode,
        country: content.billingAddressCountry,
        phone: content.billingAddressPhone
      },

      shippingAddress: {
        name: content.shippingAddressName,
        address1: content.shippingAddressAddress1,
        address2: content.shippingAddressAddress2,
        city: content.shippingAddressCity,
        province: content.shippingAddressProvince,
        postalCode: content.shippingAddressPostalCode,
        country: content.shippingAddressCountry,
        phone: content.shippingAddressPhone
      },

      // Items
      items: content.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        customFields: item.customFields // Contains size selection
      }))
    };

    console.log('Order received:', JSON.stringify(order, null, 2));

    // Option 1: Send notification email (via external service)
    // You can integrate with SendGrid, Mailgun, etc.

    // Option 2: Auto-fulfill via CJDropshipping API
    const cjApiKey = process.env.CJ_API_KEY;
    if (cjApiKey) {
      await createCJOrder(order, cjApiKey);
    }

    // Option 3: Store in database for manual processing
    // You can integrate with Supabase, Airtable, etc.

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Order processed successfully',
        invoiceNumber: order.invoiceNumber
      })
    };

  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

/**
 * Create order in CJDropshipping via API
 * Documentation: https://developers.cjdropshipping.com/
 */
async function createCJOrder(order, apiKey) {
  const CJ_API_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

  // Get size from custom fields
  const sizeField = order.items[0]?.customFields?.find(f => f.name === 'Size');
  const size = sizeField?.value || 'L/XL';

  // Map size to CJ variant ID (you'll need to get these from CJ)
  const sizeToVariant = {
    'S/M': 'YOUR_SM_VARIANT_ID',
    'L/XL': 'YOUR_LXL_VARIANT_ID'
  };

  const cjOrderPayload = {
    orderNumber: order.invoiceNumber,
    shippingZip: order.shippingAddress.postalCode,
    shippingCountry: order.shippingAddress.country,
    shippingCountryCode: 'US', // Adjust as needed
    shippingProvince: order.shippingAddress.province,
    shippingCity: order.shippingAddress.city,
    shippingPhone: order.shippingAddress.phone || '',
    shippingCustomerName: order.shippingAddress.name,
    shippingAddress: `${order.shippingAddress.address1} ${order.shippingAddress.address2 || ''}`.trim(),
    logisticName: 'USPS', // Or your preferred carrier
    fromCountryCode: 'US', // Ship from US warehouse
    payType: 2, // Balance payment
    products: order.items.map(item => ({
      vid: sizeToVariant[size] || sizeToVariant['L/XL'],
      quantity: item.quantity
    }))
  };

  try {
    const response = await fetch(`${CJ_API_BASE}/shopping/order/createOrderV2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': apiKey
      },
      body: JSON.stringify(cjOrderPayload)
    });

    const result = await response.json();
    console.log('CJ Order created:', result);
    return result;
  } catch (error) {
    console.error('CJ API error:', error);
    throw error;
  }
}
