export const CATEGORY_COLORS: Record<string, string> = {
  'Abstract Gold': 'bg-gold-100 text-gold-dark',
  'Neutral Collection': 'bg-cream-darker text-charcoal-lighter',
  'Textured Art': 'bg-charcoal-light/10 text-charcoal',
  'Custom Works': 'bg-gold-50 text-gold-dark',
}

export function isValidRomanianPhone(phone: string): boolean {
  return /^(\+40|0040|0)\s?7\d{2}\s?\d{3}\s?\d{3}$/.test(phone.trim())
}

export const ROMANIAN_COUNTIES = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani',
  'Brăila', 'Brașov', 'București', 'Buzău', 'Călărași', 'Caraș-Severin',
  'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
  'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
  'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Sălaj', 'Satu Mare',
  'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vâlcea', 'Vaslui', 'Vrancea',
]
