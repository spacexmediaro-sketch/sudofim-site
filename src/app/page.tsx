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
      <section className="relative min-h-[60vh] sm:min-h-[70vh] pt-16 sm:pt-20">
        <Link href="/echipamente/" className="block relative w-full h-[60vh] sm:h-[70vh]">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
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
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">Catalog Echipamente</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark mt-2">Echipamente <span className="text-primary">Disponibile</span></h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Peste {products.length} echipamente profesionale de sudura, generatoare si utilaje industriale.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">Categorii</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark mt-2">Echipamente pe <span className="text-primary">Categorii</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.filter(c => c.count > 0).map(cat => (
              <Link key={cat.slug} href={`/echipamente/?categorie=${cat.slug}`} className="bg-gray-50 hover:bg-primary hover:text-white rounded-xl p-6 text-center transition-all group border border-gray-100 hover:border-primary">
                <h3 className="font-bold text-sm mb-1 group-hover:text-white text-dark">{cat.name}</h3>
                <p className="text-xs text-gray-400 group-hover:text-white/70">{cat.count} produse</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-dark py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">Ce Oferim</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">Servicii <span className="text-primary">Complete</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Aparate Sudura Electrofuziune', desc: 'Vanzare si inchiriere aparate de sudura prin electrofuziune pentru conducte de polietilena. Branduri: Ritmo, Sud Line, Nupi, Georg Fischer.' },
              { title: 'Generatoare de Curent', desc: 'Generatoare de curent industriale de la marci de top: Caterpillar, Mosa. Putere de la 15kWA pana la 500kWA.' },
              { title: 'Service & Reparatii', desc: 'Service complet pentru echipamente de sudura, generatoare, excavatoare. Atelier propriu de prelucrari mecanice.' },
              { title: 'Inchiriere Echipamente', desc: 'Inchiriere pe termen scurt sau lung: compactoare, masini de taiat asfalt/beton, compresoare, pompe de apa.' },
              { title: 'Sudura MIG-TIG-MMA', desc: 'Aparate de sudura MIG, TIG, MMA si taiere cu plasma. Consumabile si accesorii pentru orice tip de sudura.' },
              { title: 'Utilaje Constructii', desc: 'Masini de maturat, carote cu stativ, echipamente de demolari, unelte de mana profesionale pentru santiere.' },
            ].map(s => (
              <div key={s.title} className="bg-dark-light border border-white/5 rounded-xl p-8 hover:border-primary/30 transition-all card-hover">
                <h3 className="text-white font-bold text-lg mb-3">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="red-gradient py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Cautati un echipament specific?</h2>
          <p className="text-white/80 text-lg mb-8">Contactati-ne pentru o oferta personalizata. Raspundem in cel mai scurt timp.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.salesPhone1}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-gray-100 transition-all">
              {BUSINESS.salesPhone1} - {BUSINESS.salesPhone1Name}
            </a>
            <a href={`tel:${BUSINESS.salesPhone2}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-white/20 transition-all">
              {BUSINESS.salesPhone2} - {BUSINESS.salesPhone2Name}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
