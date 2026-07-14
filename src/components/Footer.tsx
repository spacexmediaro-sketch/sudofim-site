import Link from 'next/link';
import Image from 'next/image';
import { BUSINESS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-dark-light border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid md:grid-cols-4 gap-10 sm:gap-16">
          <div className="md:col-span-2">
            <div className="mb-6">
              <Image src="/logo-sudofim.png" alt={BUSINESS.companyName} width={220} height={73} className="h-14 sm:h-16 w-auto" />
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">{BUSINESS.description} {BUSINESS.city} si toata Romania.</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Navigare</h4>
            <ul className="space-y-3">
              <li><Link href="/echipamente/" className="text-white/50 hover:text-primary text-sm transition-colors">Echipamente</Link></li>
              <li><Link href="/servicii/" className="text-white/50 hover:text-primary text-sm transition-colors">Servicii</Link></li>
              <li><Link href="/despre-noi/" className="text-white/50 hover:text-primary text-sm transition-colors">Despre Noi</Link></li>
              <li><Link href="/contact/" className="text-white/50 hover:text-primary text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Contact</h4>
            <ul className="space-y-3 text-white/50 text-sm">
              <li>
                <a href={`tel:${BUSINESS.salesPhone1}`} className="hover:text-primary transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {BUSINESS.salesPhone1}
                </a>
              </li>
              <li>
                <a href={`tel:${BUSINESS.salesPhone2}`} className="hover:text-primary transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {BUSINESS.salesPhone2}
                </a>
              </li>
              <li>
                <a href={`mailto:${BUSINESS.email}`} className="hover:text-primary transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {BUSINESS.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {BUSINESS.city}, {BUSINESS.county}
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} {BUSINESS.companyName}. Toate drepturile rezervate.</p>
          <p className="text-white/20 text-xs">Echipamente industriale &bull; Service &bull; Inchiriere</p>
        </div>
      </div>
    </footer>
  );
}
