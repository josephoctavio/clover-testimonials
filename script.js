// script.js

// -- Loader logic --
window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const app = document.getElementById('app');

  // Wait 5 seconds, then fade loader and reveal app
  setTimeout(() => {
    loader.style.opacity = '0';
    loader.addEventListener('transitionend', () => {
      loader.style.display = 'none';
      app.style.display = 'block';
    });
  }, 5000);
});

// -- Existing form submission logic --
const form = document.getElementById('testimonial-form');
const messageDiv = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  messageDiv.textContent = 'Submitting…';

  const formData = new FormData(form);
  const fields = {};
  formData.forEach((value, key) => {
    fields[key] = value;
  });
  fields.Approved = false;

  try {
    const response = await fetch('/.netlify/functions/addTestimonial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    form.reset();
    messageDiv.textContent = 'Thank you! Your testimonial is pending approval.';
  } catch (err) {
    console.error(err);
    messageDiv.textContent = 'Submission failed. Please try again later.';
  }
});
