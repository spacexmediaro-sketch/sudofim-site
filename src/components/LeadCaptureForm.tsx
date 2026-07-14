'use client';

import { useState } from 'react';

export default function LeadCaptureForm({ productId, productTitle }: { productId?: string; productTitle?: string }) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/leads/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, productId, productTitle }),
      });

      if (res.ok) {
        setStatus('sent');
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="font-bold text-green-800 text-lg mb-1">Cerere trimisa!</h3>
        <p className="text-green-600 text-sm">Va vom contacta in cel mai scurt timp.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nume *</label>
        <input
          type="text" required value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
        <input
          type="tel" required value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email" value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
        <textarea
          rows={3} value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
          placeholder={productTitle ? `Doresc informatii despre: ${productTitle}` : 'Detalii despre echipamentul dorit...'}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all disabled:opacity-50"
      >
        {status === 'sending' ? 'Se trimite...' : 'Solicita Oferta'}
      </button>
      {status === 'error' && <p className="text-red-500 text-sm text-center">Eroare. Incercati din nou sau sunati-ne.</p>}
    </form>
  );
}
