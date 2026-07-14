import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { getAllProducts, getAllCategories } from '@/lib/products-db';
import { BUSINESS } from '@/lib/constants';

export default async function HomePage() {
  const [products, categories] = await Promise.all([getAllProducts(), getAllCategories()]);
  const featured = products.filter(p => p.featured).slice(0, 6);
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 6);

  return (
    <>
      {/* Hero - Banner Image */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] pt-20 sm:pt-24">
        <Link href="/echipamente/" className="block relative w-full h-[70vh] sm:h-[80vh]">
          <Image
            src="/hero-banner.jpg"
            alt="Sudofim Serv - Utilaje, service și soluții profesionale pentru industrie - Vezi produsele"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </Link>
      </section>

      {/* Trust Markers */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center text-center">
            {[
              { title: 'Garantie', desc: 'Echipamente testate', color: 'primary' },
              { title: 'Service Rapid', desc: 'Reparatii profesionale', color: 'accent' },
              { title: 'Inchiriere', desc: 'Utilaje disponibile', color: 'green-600' },
              { title: BUSINESS.city, desc: 'Livrare nationala', color: 'blue-600' },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-${item.color}/10 rounded-xl flex items-center justify-center shrink-0`}>
                  <svg className={`w-6 h-6 text-${item.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-dark text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-24 sm:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 sm:mb-20">
            <span className="inline-block text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4 border border-primary/20 px-4 py-1.5 rounded-full">Catalog Echipamente</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-dark mt-3">Echipamente <span className="text-primary">Disponibile</span></h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-base sm:text-lg">Peste {products.length} echipamente profesionale de sudura, generatoare si utilaje industriale.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {displayProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/echipamente/" className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all">
              Vezi toate echipamentele ({products.length})
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-24 sm:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 sm:mb-20">
            <span className="inline-block text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4 border border-primary/20 px-4 py-1.5 rounded-full">Categorii</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-dark mt-3">Echipamente pe <span className="text-primary">Categorii</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.filter(c => c.count > 0).map(cat => (
              <Link key={cat.slug} href={`/echipamente/?categorie=${cat.slug}`} className="bg-gray-50 hover:bg-primary hover:text-white rounded-2xl p-6 sm:p-8 text-center transition-all group border border-gray-100 hover:border-primary hover:shadow-xl hover:shadow-primary/10">
                <h3 className="font-bold text-sm sm:text-base mb-1.5 group-hover:text-white text-dark">{cat.name}</h3>
                <p className="text-xs text-gray-400 group-hover:text-white/70">{cat.count} produse</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-dark py-24 sm:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <span className="inline-block text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4 border border-primary/20 px-4 py-1.5 rounded-full">Ce Oferim</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">Servicii <span className="text-primary">Complete</span></h2>
            <p className="text-white/40 mt-4 max-w-2xl mx-auto text-base sm:text-lg">Solutii profesionale pentru sudura, generatoare, utilaje si service industrial.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { title: 'Aparate Sudura Electrofuziune', desc: 'Vanzare si inchiriere aparate de sudura prin electrofuziune pentru conducte de polietilena. Branduri: Ritmo, Sud Line, Nupi, Georg Fischer.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
              { title: 'Generatoare de Curent', desc: 'Generatoare de curent industriale de la marci de top: Caterpillar, Mosa. Putere de la 15kWA pana la 500kWA.', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { title: 'Service & Reparatii', desc: 'Service complet pentru echipamente de sudura, generatoare, excavatoare. Atelier propriu de prelucrari mecanice.', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
              { title: 'Inchiriere Echipamente', desc: 'Inchiriere pe termen scurt sau lung: compactoare, masini de taiat asfalt/beton, compresoare, pompe de apa.', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
              { title: 'Sudura MIG-TIG-MMA', desc: 'Aparate de sudura MIG, TIG, MMA si taiere cu plasma. Consumabile si accesorii pentru orice tip de sudura.', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9.657 7 12a5 5 0 005.657 4.243A4 4 0 0017.657 18.657z' },
              { title: 'Utilaje Constructii', desc: 'Masini de maturat, carote cu stativ, echipamente de demolari, unelte de mana profesionale pentru santiere.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
            ].map(s => (
              <div key={s.title} className="bg-dark-light border border-white/5 rounded-2xl p-8 sm:p-10 hover:border-primary/30 transition-all card-hover group">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative red-gradient py-28 sm:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-white/60 text-xs font-semibold uppercase tracking-[0.2em] mb-6 border border-white/20 px-4 py-1.5 rounded-full">Contact Rapid</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Cautati un echipament specific?</h2>
          <p className="text-white/80 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">Contactati-ne pentru o oferta personalizata. Raspundem in cel mai scurt timp.</p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <a href={`tel:${BUSINESS.salesPhone1}`} className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-primary font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-gray-100 transition-all shadow-lg shadow-black/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {BUSINESS.salesPhone1} - {BUSINESS.salesPhone1Name}
            </a>
            <a href={`tel:${BUSINESS.salesPhone2}`} className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 border-2 border-white/30 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {BUSINESS.salesPhone2} - {BUSINESS.salesPhone2Name}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
