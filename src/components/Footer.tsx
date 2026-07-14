import Link from 'next/link';
import Image from 'next/image';
import { BUSINESS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="mb-4">
              <Image src="/logo-sudofim.png" alt={BUSINESS.companyName} width={180} height={56} className="h-12 w-auto" />
            </div>
            <p className="text-white/40 text-sm leading-relaxed">{BUSINESS.description} {BUSINESS.city} si toata Romania.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Link-uri Utile</h4>
            <ul className="space-y-2">
              <li><Link href="/echipamente/" className="text-white/40 hover:text-white text-sm transition-colors">Echipamente</Link></li>
              <li><Link href="/servicii/" className="text-white/40 hover:text-white text-sm transition-colors">Servicii</Link></li>
              <li><Link href="/despre-noi/" className="text-white/40 hover:text-white text-sm transition-colors">Despre Noi</Link></li>
              <li><Link href="/contact/" className="text-white/40 hover:text-white text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-white/40 text-sm">
              <li><a href={`tel:${BUSINESS.salesPhone1}`} className="hover:text-white transition-colors">{BUSINESS.salesPhone1} - {BUSINESS.salesPhone1Name}</a></li>
              <li><a href={`tel:${BUSINESS.salesPhone2}`} className="hover:text-white transition-colors">{BUSINESS.salesPhone2} - {BUSINESS.salesPhone2Name}</a></li>
              <li><a href={`mailto:${BUSINESS.email}`} className="hover:text-white transition-colors">{BUSINESS.email}</a></li>
              <li>{BUSINESS.city}, {BUSINESS.county}, {BUSINESS.country}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-8 pt-8 text-center">
          <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} {BUSINESS.companyName}. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  );
}
