import type { Metadata } from 'next';
import Link from 'next/link';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Servicii - Vanzare, Inchiriere, Service Echipamente',
  description: 'Servicii complete: vanzare, inchiriere si service echipamente industriale, sudura electrofuziune, generatoare de curent, compactoare, compresoare.',
};

const services = [
  { title: 'Aparate Sudura Electrofuziune', desc: 'Vanzare si inchiriere aparate de sudura prin electrofuziune pentru conducte de polietilena. Branduri: Ritmo, Sud Line, Nupi, Georg Fischer, Friamat, Plasson. Capacitati de la 20mm pana la 1600mm.' },
  { title: 'Sudura Cap la Cap', desc: 'Echipamente profesionale de sudura cap la cap pentru tevi PEHD. Diametre de la 63mm pana la 500mm. Aparate Hurner Germania, Ritmo, Georg Fischer.' },
  { title: 'Generatoare de Curent', desc: 'Generatoare de curent industriale diesel de la 15kWA pana la 500kWA. Marci: Caterpillar, Mosa, SDMO, Atlas Copco. Noi si second hand.' },
  { title: 'Service & Reparatii', desc: 'Service complet pentru echipamente de sudura, generatoare, excavatoare, bobcat-uri. Atelier propriu de prelucrari mecanice (strunjire, frezare, rectificare).' },
  { title: 'Inchiriere Echipamente', desc: 'Inchiriere pe termen scurt sau lung: compactoare (maiuri, placi, cilindri), masini de taiat asfalt/beton, compresoare, pompe de apa, echipamente de foraj.' },
  { title: 'Sudura MIG/TIG/MMA', desc: 'Aparate de sudura MIG, TIG, MMA si taiere cu plasma de la producatori de top: EWM, Esab, Telwin, Fronius. Consumabile si accesorii.' },
  { title: 'Masini de Taiat', desc: 'Fierastraie cu banda pentru debitat metale (Macc Italia), masini de taiat asfalt, masini de taiat beton. Reprezentant oficial Macc Italia.' },
  { title: 'Utilaje Constructii', desc: 'Excavatoare, buldoexcavatoare, masini de maturat, carote cu stativ, rachete de subtraversare, echipamente de demolari.' },
];

export default function ServiciiPage() {
  return (
    <div className="pt-24 sm:pt-28">
      <section className="bg-dark py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">Ce Oferim</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2">Servicii <span className="text-primary">Complete</span></h1>
            <p className="text-white/50 mt-3 max-w-2xl mx-auto">Experienta de peste 18 ani in echipamente industriale. Oferim solutii complete pentru orice nevoie.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map(s => (
              <div key={s.title} className="bg-dark-light border border-white/5 rounded-xl p-8 hover:border-primary/30 transition-all">
                <h3 className="text-white font-bold text-lg mb-3">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="red-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Aveti nevoie de un echipament?</h2>
          <p className="text-white/80 text-lg mb-8">Sunati-ne acum sau trimiteti o cerere de oferta.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.salesPhone1}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold text-sm uppercase tracking-wider rounded-lg">
              {BUSINESS.salesPhone1}
            </a>
            <Link href="/echipamente/" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white font-bold text-sm uppercase tracking-wider rounded-lg">
              Vezi Echipamentele
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
