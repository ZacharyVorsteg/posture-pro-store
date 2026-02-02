/**
 * Simple Order Notification Handler
 *
 * Receives Snipcart webhooks and logs orders for manual fulfillment.
 * Orders are logged to Netlify Functions logs (viewable in dashboard).
 *
 * For email notifications, you can integrate with:
 * - SendGrid: https://sendgrid.com
 * - Resend: https://resend.com
 * - Mailgun: https://mailgun.com
 */

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { eventName, content } = JSON.parse(event.body);

    // Only process completed orders
    if (eventName !== 'order.completed') {
      return { statusCode: 200, body: JSON.stringify({ status: 'ignored' }) };
    }

    // Format order for easy reading
    const orderSummary = {
      '=== NEW ORDER ===': '',
      'Order #': content.invoiceNumber,
      'Date': new Date(content.creationDate).toLocaleString(),
      'Total': `$${content.total} ${content.currency}`,
      '': '',
      '--- CUSTOMER ---': '',
      'Email': content.email,
      'Name': content.shippingAddressName,
      'Address': [
        content.shippingAddressAddress1,
        content.shippingAddressAddress2,
        `${content.shippingAddressCity}, ${content.shippingAddressProvince} ${content.shippingAddressPostalCode}`,
        content.shippingAddressCountry
      ].filter(Boolean).join('\n'),
      'Phone': content.shippingAddressPhone || 'Not provided',
      ' ': '',
      '--- ITEMS ---': '',
      'Items': content.items.map(item => {
        const size = item.customFields?.find(f => f.name === 'Size')?.value || 'N/A';
        return `${item.quantity}x ${item.name} (Size: ${size}) - $${item.price}`;
      }).join('\n'),
      '  ': '',
      '--- FULFILLMENT ACTION ---': '',
      'Action': 'Go to CJDropshipping → Create order with above details'
    };

    // Log to Netlify Functions console (viewable in dashboard)
    console.log('\n' + '='.repeat(50));
    Object.entries(orderSummary).forEach(([key, value]) => {
      if (key.startsWith('---') || key.startsWith('===')) {
        console.log(key);
      } else if (key.trim() === '') {
        console.log('');
      } else {
        console.log(`${key}: ${value}`);
      }
    });
    console.log('='.repeat(50) + '\n');

    // Optional: Send to Discord webhook for instant notifications
    const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
    if (discordWebhook) {
      await sendDiscordNotification(discordWebhook, content);
    }

    // Optional: Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    if (resendApiKey && notificationEmail) {
      await sendEmailNotification(resendApiKey, notificationEmail, content);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'success',
        order: content.invoiceNumber
      })
    };

  } catch (error) {
    console.error('Error processing order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Processing failed' })
    };
  }
};

async function sendDiscordNotification(webhookUrl, order) {
  const size = order.items[0]?.customFields?.find(f => f.name === 'Size')?.value || 'N/A';

  const embed = {
    title: `New Order #${order.invoiceNumber}`,
    color: 0x22c55e, // Green
    fields: [
      { name: 'Customer', value: order.shippingAddressName, inline: true },
      { name: 'Total', value: `$${order.total}`, inline: true },
      { name: 'Size', value: size, inline: true },
      { name: 'Email', value: order.email, inline: false },
      {
        name: 'Shipping Address',
        value: [
          order.shippingAddressAddress1,
          order.shippingAddressAddress2,
          `${order.shippingAddressCity}, ${order.shippingAddressProvince} ${order.shippingAddressPostalCode}`
        ].filter(Boolean).join('\n'),
        inline: false
      }
    ],
    timestamp: new Date().toISOString()
  };

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] })
  });
}

async function sendEmailNotification(apiKey, toEmail, order) {
  const size = order.items[0]?.customFields?.find(f => f.name === 'Size')?.value || 'N/A';

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'PosturePro Orders <orders@posturepro.store>',
      to: toEmail,
      subject: `New Order #${order.invoiceNumber} - $${order.total}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Order #:</strong> ${order.invoiceNumber}</p>
        <p><strong>Total:</strong> $${order.total}</p>
        <p><strong>Size:</strong> ${size}</p>

        <h3>Customer</h3>
        <p>${order.shippingAddressName}<br>
        ${order.email}<br>
        ${order.shippingAddressPhone || ''}</p>

        <h3>Shipping Address</h3>
        <p>${order.shippingAddressAddress1}<br>
        ${order.shippingAddressAddress2 || ''}<br>
        ${order.shippingAddressCity}, ${order.shippingAddressProvince} ${order.shippingAddressPostalCode}<br>
        ${order.shippingAddressCountry}</p>

        <hr>
        <p><a href="https://cjdropshipping.com">Fulfill on CJDropshipping</a></p>
      `
    })
  });
}
