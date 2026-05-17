import { useLocation } from 'react-router-dom'

const PAGES: Record<string, { title: string; content: string }> = {
  '/termeni': {
    title: 'Termeni și Condiții',
    content: `Prin utilizarea site-ului SNAART, acceptați termenii și condițiile prezentate mai jos.

Toate lucrările prezentate pe site sunt proprietatea artistei și sunt protejate de dreptul de autor. Este interzisă reproducerea sau utilizarea comercială fără acordul scris al artistei.

Prețurile afișate sunt exprimate în RON și includ TVA. Ne rezervăm dreptul de a modifica prețurile fără notificare prealabilă.

Comenzile sunt procesate în ordinea primirii. Confirmarea comenzii se trimite pe email în cel mai scurt timp.`,
  },
  '/confidentialitate': {
    title: 'Politica de Confidențialitate',
    content: `SNAART respectă confidențialitatea datelor cu caracter personal.

Datele colectate (nume, email, telefon, adresă) sunt folosite exclusiv pentru procesarea comenzilor și comunicarea cu clienții.

Nu vindem, nu transferăm și nu divulgăm datele tale personale către terți fără consimțământul tău.

Ai dreptul de a accesa, rectifica sau șterge datele tale personale. Ne poți contacta la hello@snaart.ro pentru orice solicitare legată de GDPR.`,
  },
  '/retur': {
    title: 'Politica de Retur',
    content: `Poți returna orice produs în termen de 30 de zile de la primire, în starea originală.

Produsele personalizate (tablouri la comandă) nu pot fi returnate dacă au fost realizate conform specificațiilor tale.

Pentru a iniția un retur, contactează-ne la hello@snaart.ro cu numărul comenzii și motivul returnării.

Rambursarea se efectuează în 5-10 zile lucrătoare de la recepționarea produsului returnat.`,
  },
  '/gdpr': {
    title: 'GDPR',
    content: `În conformitate cu Regulamentul (UE) 2016/679, ai următoarele drepturi:

- Dreptul de acces la datele tale personale
- Dreptul la rectificare
- Dreptul la ștergere ("dreptul de a fi uitat")
- Dreptul la restricționarea prelucrării
- Dreptul la portabilitatea datelor
- Dreptul de a te opune prelucrării

Pentru exercitarea acestor drepturi, ne poți contacta la hello@snaart.ro.`,
  },
}

export default function LegalPages() {
  const { pathname } = useLocation()
  const page = PAGES[pathname]

  if (!page) return null

  return (
    <div className="min-h-screen bg-cream pt-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <p className="font-serif text-4xl font-light text-charcoal tracking-wider mb-2">{page.title}</p>
        <div className="w-10 h-px bg-gold mb-8" />
        <div className="prose prose-sm max-w-none">
          {page.content.split('\n\n').map((para, i) => (
            <p key={i} className="text-brand-muted leading-relaxed mb-4 text-sm">{para}</p>
          ))}
        </div>
        <p className="text-xs text-brand-muted/60 mt-8 tracking-wide">
          Ultima actualizare: {new Date().getFullYear()}. SNAART.
        </p>
      </div>
    </div>
  )
}
