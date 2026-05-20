import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Quote, Sparkles, Gem, Leaf, Frame } from 'lucide-react'
import { useProductsStore } from '../store/productsStore'
import ProductCard from '../components/ProductCard'

const CATEGORIES = [
  {
    key: 'Abstract Gold',
    label: 'Abstract Gold',
    desc: 'Explorează',
    bg: 'bg-gold-100',
    image: null,
  },
  {
    key: 'Neutral Collection',
    label: 'Neutral Collection',
    desc: 'Explorează',
    bg: 'bg-cream-darker',
    image: null,
  },
  {
    key: 'Textured Art',
    label: 'Textured Art',
    desc: 'Explorează',
    bg: 'bg-charcoal-light/10',
    image: null,
  },
  {
    key: 'Custom Works',
    label: 'Custom Works',
    desc: 'Explorează',
    bg: 'bg-gold-50',
    image: null,
  },
]

const FEATURES = [
  { icon: Sparkles, label: 'Lucrări\nrealizate manual' },
  { icon: Gem, label: 'Piese unicat\nși originale' },
  { icon: Leaf, label: 'Materiale premium\nși foiță de aur' },
  { icon: Frame, label: 'Personalizare\nla cerere' },
]

const TESTIMONIALS = [
  {
    text: 'Am luat un tablou pentru living și arată foarte bine. Mi-a plăcut că a ajuns bine ambalat și că am primit și un certificat de autenticitate.',
    author: 'Andreea M.',
    location: 'Cluj-Napoca',
  },
  {
    text: 'Comunicare bună, livrare rapidă. Tabloul e exact cum apărea în poze, culorile sunt frumoase și textura se vede clar că e făcută manual.',
    author: 'Radu T.',
    location: 'București',
  },
  {
    text: 'L-am luat cadou și a plăcut mult. Am întrebat înainte câteva detalii despre dimensiuni și am primit răspuns repede.',
    author: 'Irina P.',
    location: 'Timișoara',
  },
]

export default function HomePage() {
  const { products, fetchProducts, isLoading } = useProductsStore()
  const [testimonialIdx, setTestimonialIdx] = useState(0)

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const featured = products.filter((p) => p.status === 'active').slice(0, 4)

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 bg-cream" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-12 items-center py-20">
          {/* Text */}
          <div className="animate-fadeInUp">
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-sans">Artă cu suflet</p>
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-light text-charcoal leading-none tracking-wider mb-6">
              TABLOURI
            </h1>
            <div className="w-12 h-px bg-gold mb-6" />
            <p className="text-sm tracking-[0.2em] uppercase text-charcoal-lighter mb-4 font-sans">
              Create pentru spații cu personalitate.
            </p>
            <p className="text-brand-muted leading-relaxed max-w-sm mb-10 text-sm">
              Fiecare lucrare este realizată manual, cu pasiune, textură și foiță de aur,
              pentru a aduce echilibru și eleganță în spațiul tău.
            </p>
            <Link to="/galerie" className="btn-outline inline-flex items-center gap-3">
              Descoperă colecția
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] bg-cream-darker overflow-hidden">
              <img
                src="/first-photo.jpg"
                alt="Alexandra pictând în atelier"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-gold/30" />
            <div className="absolute -top-4 -right-4 w-16 h-16 border border-gold/20" />
          </div>
        </div>
      </section>

      {/* About Strip */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 grid lg:grid-cols-3 gap-0">
          {/* Left image area */}
          <div className="lg:col-span-1 relative">
            <div className="aspect-square bg-cream-darker overflow-hidden">
              <img
                src="/hero-artist.jpg"
                alt="Alexandra în atelier"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Center text */}
          <div className="lg:col-span-1 flex flex-col justify-center px-0 lg:px-12 py-8 lg:py-0">
            <p className="font-serif text-3xl lg:text-4xl font-light text-charcoal tracking-wider mb-2">
              DESPRE SNAART
            </p>
            <div className="w-10 h-px bg-gold mb-6 mt-2" />
            <p className="text-brand-muted text-sm leading-relaxed mb-4">
              Sunt lucrări abstracte, realizate manual, în tehnici mixte, cu texturi puternice
              și foiță de aur aplicată manual.
            </p>
            <p className="text-brand-muted text-sm leading-relaxed">
              Fiecare tablou este unic și creat pentru a transmite emoție, armonie și rafinament.
              Îmi place să creez piese care nu doar decorează, ci completează sufletul unui spațiu.
            </p>
          </div>

          {/* Features grid */}
          <div className="lg:col-span-1 grid grid-cols-2 gap-px bg-cream-darker">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="bg-white flex flex-col items-center justify-center gap-3 p-6 text-center">
                <Icon size={22} className="text-gold" strokeWidth={1.5} />
                <p className="text-xs tracking-widest uppercase text-charcoal font-sans whitespace-pre-line leading-relaxed">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Story Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="font-serif text-4xl md:text-5xl font-light text-charcoal tracking-wider mb-3">
            Fiecare lucrare
          </p>
          <p className="font-serif text-4xl md:text-5xl font-light text-gold tracking-wider mb-8">
            are o poveste.
          </p>
          <div className="w-10 h-px bg-gold mb-10" />
          <div className="space-y-6 text-charcoal-lighter leading-relaxed text-base md:text-lg font-serif font-light">
            <p>
              Începe mereu cu o senzație — nu cu un plan. Uneori e o culoare pe care am văzut-o
              undeva și nu mi-a ieșit din minte. Alteori e o stare, o lumină de dimineață,
              un moment de liniște pe care vreau să-l opresc în loc.
            </p>
            <p>
              Prima pensulă e întotdeauna cea mai curajoasă. Pânza albă nu iartă ezitarea,
              așa că mă arunc — cu pastă, cu culoare, cu toată energia momentului.
              Straturile se adună unul peste altul, fiecare ascunzând câte ceva din cel de dinainte,
              dar lăsând urme. Exact ca în viață.
            </p>
            <p>
              Foița de aur vine la final, cu răbdare și cu mâinile care tremură puțin de fiecare dată.
              Nu pentru că e greu, ci pentru că știu că atunci lucrarea devine altceva —
              prinde lumină, respiră. Devine vie.
            </p>
            <p className="text-gold font-serif italic text-xl">
              Și atunci știu că e gata.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {(featured.length > 0 || isLoading) && (
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="font-serif text-5xl font-light text-charcoal tracking-wider">Lucrări disponibile</p>
              <div className="gold-divider" />
            </div>
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/5] bg-cream-darker" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-cream-darker w-16" />
                      <div className="h-5 bg-cream-darker w-3/4" />
                      <div className="h-4 bg-cream-darker w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
            <div className="text-center mt-10">
              <Link to="/galerie" className="btn-outline inline-flex items-center gap-2">
                Vezi toate lucrările <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Quote */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Quote size={32} className="text-gold/40 mx-auto mb-6" />
          <blockquote className="font-serif text-2xl md:text-3xl font-light text-charcoal italic leading-relaxed tracking-wide mb-6">
            Arta nu reproduce ceea ce este vizibil,
            <br />
            ci face vizibil ceea ce nu este întotdeauna.
          </blockquote>
          <div className="gold-divider" />
          <cite className="text-sm tracking-widest text-brand-muted not-italic uppercase font-sans">
            — Paul Klee
          </cite>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cream-dark py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-serif text-4xl font-light text-charcoal tracking-wider mb-2">Ce spun clienții</p>
          <div className="gold-divider" />
          <div className="mt-10 relative min-h-[160px]">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-500 flex flex-col items-center ${
                  i === testimonialIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <p className="font-serif text-xl font-light text-charcoal italic leading-relaxed mb-6">
                  "{t.text}"
                </p>
                <p className="text-sm font-sans text-gold tracking-wider">{t.author}</p>
                <p className="text-xs text-brand-muted mt-1">{t.location}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-16">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                className={`w-6 h-px transition-all ${i === testimonialIdx ? 'bg-gold w-10' : 'bg-charcoal/20'}`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
