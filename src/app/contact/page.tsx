import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/constants';
import LeadCaptureForm from '@/components/LeadCaptureForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Contacteaza ${BUSINESS.companyName} pentru echipamente industriale, sudura, generatoare. Telefon: ${BUSINESS.salesPhone1}, Email: ${BUSINESS.email}.`,
};

export default function ContactPage() {
  return (
    <section className="bg-gray-50 py-20 sm:py-28 pt-28 sm:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">Contact</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-dark mt-2">Luati <span className="text-primary">legatura</span> cu noi</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            {[
              { icon: 'phone', title: 'Telefon', lines: [`${BUSINESS.salesPhone1} - ${BUSINESS.salesPhone1Name} (${BUSINESS.salesPhone1Role})`, `${BUSINESS.salesPhone2} - ${BUSINESS.salesPhone2Name} (${BUSINESS.salesPhone2Role})`] },
              { icon: 'email', title: 'Email', lines: [BUSINESS.email] },
              { icon: 'location', title: 'Locatie', lines: [`${BUSINESS.city}, ${BUSINESS.county}, ${BUSINESS.country}`] },
              { icon: 'clock', title: 'Program', lines: ['Luni - Vineri: 08:00 - 17:00'] },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-5 p-5 bg-white rounded-xl border border-gray-100">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-dark mb-1">{item.title}</h4>
                  {item.lines.map((l, i) => (
                    <p key={i} className="text-gray-600 text-sm">{l}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <h3 className="font-bold text-dark text-xl mb-6">Trimite un mesaj</h3>
            <LeadCaptureForm />
          </div>
        </div>
      </div>
    </section>
  );
}
