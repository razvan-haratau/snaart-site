import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function DesprePage() {
  return (
    <div className="min-h-screen bg-cream pt-16">
      {/* Hero */}
      <section className="bg-charcoal py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-sans">Povestea</p>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-cream tracking-wider leading-tight">
            Artă creată
            <br />
            <span className="text-gold">cu suflet și intenție</span>
          </h1>
          <div className="w-12 h-px bg-gold mx-auto my-8" />
          <p className="text-cream/70 max-w-xl mx-auto leading-relaxed">
            Fiecare tablou este un fragment din universul meu interior — o conversație
            tăcută între culori, texturi și lumină.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] bg-cream-darker overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-serif text-8xl text-gold/20">S</span>
            </div>
          </div>
          <div>
            <p className="font-serif text-4xl font-light text-charcoal tracking-wider mb-2">
              Cine sunt
            </p>
            <div className="w-10 h-px bg-gold mb-8" />
            <div className="space-y-5 text-brand-muted leading-relaxed text-sm">
              <p>
                Pictura a fost mereu parte din mine, încă din copilărie. Îmi plăcea să desenez și să creez fără să mă gândesc prea mult unde mă va duce asta mai târziu. Totuși, abia în perioada pandemiei am început să mă dedic cu adevărat acestei pasiuni. Atunci am avut timpul și curajul să transform ceea ce făceam din suflet într-o parte importantă din viața mea.
              </p>
              <p>
                Cu multă răbdare, muncă și dorința de a evolua, pictura a devenit mai mult decât un hobby. Astăzi reușesc să mă întrețin din pasiunea mea și sunt recunoscătoare că pot face ceea ce iubesc în fiecare zi. Cel mai frumos lucru este că această pasiune îmi oferă și libertatea de a petrece mai mult timp alături de copiii mei, fără să renunț la ceea ce mă împlinește.
              </p>
              <p>
                Pentru mine, arta înseamnă emoție, liniște și autenticitate, iar prin fiecare tablou încerc să transmit o parte din povestea și sufletul meu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-cream-dark py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="font-serif text-2xl md:text-3xl font-light text-charcoal italic leading-relaxed tracking-wide">
            "Îmi place să creez piese care nu doar decorează,<br />
            ci completează sufletul unui spațiu."
          </blockquote>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-serif text-4xl font-light text-charcoal tracking-wider">Procesul meu creativ</p>
            <div className="gold-divider" />
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { nr: '01', title: 'Inspirația', desc: 'Fiecare lucrare pornește de la o emoție, o textură găsită în natură sau o armonie de culori.' },
              { nr: '02', title: 'Construcția', desc: 'Aplic straturi succesive de pastă, culoare și textură, lăsând fiecare strat să se usuce complet.' },
              { nr: '03', title: 'Detaliile de aur', desc: 'Foița de aur este aplicată manual, bucată cu bucată, pentru a crea strălucirea caracteristică.' },
              { nr: '04', title: 'Finisajul', desc: 'Lucrarea primește un strat de lac protector și este pregătită cu grijă pentru livrare.' },
            ].map((step) => (
              <div key={step.nr} className="text-center">
                <p className="font-serif text-4xl text-gold/30 mb-3">{step.nr}</p>
                <div className="w-8 h-px bg-gold mx-auto mb-4" />
                <p className="font-serif text-xl font-light text-charcoal mb-3">{step.title}</p>
                <p className="text-brand-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <p className="font-serif text-4xl font-light text-charcoal tracking-wider mb-4">
          Descoperă colecția
        </p>
        <div className="gold-divider" />
        <p className="text-brand-muted text-sm mb-8 max-w-sm mx-auto">
          Explorează lucrările disponibile sau contactează-mă pentru o piesă personalizată.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/galerie" className="btn-primary inline-flex items-center gap-2">
            Galerie <ArrowRight size={14} />
          </Link>
          <Link to="/contact" className="btn-outline">
            Lucrare personalizată
          </Link>
        </div>
      </section>
    </div>
  )
}
