// netlify/functions/addTestimonial.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  console.log('🔥 addTestimonial invoked');
  console.log('Incoming event method:', event.httpMethod);
  console.log('AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID ? 'OK' : 'MISSING');
  // (We won’t log the token itself for security.)

  if (event.httpMethod !== 'POST') {
    console.log('↩️ 405 Method Not Allowed');
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { fields } = JSON.parse(event.body);
  console.log('Payload fields:', fields);

  try {
    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Testimonials`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      }
    );
    const data = await airtableRes.json();
    if (!airtableRes.ok) {
      console.error('🚨 Airtable error', data);
      return { statusCode: airtableRes.status, body: JSON.stringify(data) };
    }

    console.log('✅ Record created', data);
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.error('💥 Function error', err);
    return { statusCode: 500, body: err.toString() };
  }
};

// Note: Make sure to set the environment variables AIRTABLE_BASE_ID and AIRTABLE_TOKEN in your Netlify settings.
// This function handles the submission of testimonials to Airtable.