'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BUSINESS } from '@/lib/constants';

const navLinks = [
  { href: '/echipamente/', label: 'Echipamente' },
  { href: '/servicii/', label: 'Servicii' },
  { href: '/despre-noi/', label: 'Despre Noi' },
  { href: '/contact/', label: 'Contact' },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center">
            <Image src="/logo-sudofim.png" alt="Sudofim Serv" width={160} height={50} className="h-10 sm:h-12 w-auto" priority />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className="text-white/70 hover:text-white text-sm transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a href={`tel:${BUSINESS.salesPhone1}`} className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {BUSINESS.salesPhone1}
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-dark border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block text-white/70 hover:text-white text-sm py-2">
                {l.label}
              </Link>
            ))}
            <a href={`tel:${BUSINESS.salesPhone1}`} className="block text-primary font-semibold text-sm py-2">{BUSINESS.salesPhone1}</a>
          </div>
        </div>
      )}
    </header>
  );
}
