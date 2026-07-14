import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Despre Noi',
  description: `${BUSINESS.companyName} - companie din ${BUSINESS.city} specializata in echipamente industriale, sudura, generatoare. Experienta de peste 18 ani.`,
};

export default function DesprePage() {
  return (
    <section className="bg-white py-20 sm:py-32 pt-28 sm:pt-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">Despre Noi</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-dark mt-2 mb-6">Experienta de peste <span className="text-primary">18 ani</span> in echipamente industriale</h1>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p><strong className="text-dark">{BUSINESS.companyName}</strong> este o companie din {BUSINESS.city}, judetul {BUSINESS.county}, specializata in comercializarea, inchirierea si service-ul echipamentelor industriale de mica si medie mecanizare.</p>
              <p>Oferim solutii complete pentru sudura prin electrofuziune si sudura cap la cap, generatoare de curent, compactoare, masini de taiat, compresoare si multe altele.</p>
              <p>Echipa noastra asigura consultanta tehnica, suport post-vanzare si service profesional pentru toate echipamentele comercializate.</p>
              <p>Suntem reprezentanti oficiali pentru branduri de top precum <strong>Macc Italia</strong> (fierastraie cu banda pentru debitat metale) si colaboram cu producatori precum Ritmo, Husqvarna, Caterpillar, Mosa si multi altii.</p>
            </div>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { value: '18+', label: 'Ani Experienta' },
                { value: '500+', label: 'Clienti' },
                { value: '400+', label: 'Echipamente' },
                { value: '24h', label: 'Suport Tehnic' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-primary font-bold text-3xl">{s.value}</p>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl p-8 lg:p-12 space-y-6">
            {[
              { title: 'Echipamente Profesionale', desc: 'Lucram doar cu branduri de top: Husqvarna, Caterpillar, Mosa, Ritmo, Georg Fischer.' },
              { title: 'Atelier Propriu', desc: 'Atelier complet echipat cu strunguri si freze pentru prelucrari mecanice si reparatii.' },
              { title: 'Consultanta Tehnica', desc: 'Echipa noastra va ajuta sa alegeti echipamentul potrivit pentru nevoile dumneavoastra.' },
              { title: 'Livrare Nationala', desc: 'Livram echipamentele in toata Romania. Transport asigurat pentru utilaje grele.' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-dark mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
