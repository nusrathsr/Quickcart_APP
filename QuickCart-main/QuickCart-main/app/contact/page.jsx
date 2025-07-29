'use client';

export default function Contact() {
  return (
    <div className="px-6 md:px-16 lg:px-32 py-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-gray-700 leading-relaxed max-w-3xl">
        Have questions or need assistance? We’re here to help! Reach out to us
        through any of the following methods:
      </p>
      <ul className="mt-4 space-y-2 text-gray-700 max-w-3xl">
        <li><strong>Phone:</strong> +1-234-567-890</li>
        <li><strong>Email:</strong> support@quickcart.com</li>
        <li><strong>Address:</strong> 123 QuickCart Lane, Shopping City, USA</li>
      </ul>
    </div>
  );
}
