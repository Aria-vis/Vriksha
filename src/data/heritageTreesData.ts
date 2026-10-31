export interface HeritageStoryItem {
  id: string;
  name: string;
  hindiName: string;
  speciesScientific: string;
  estimatedAgeYears: number;
  location: string;
  city: string;
  sacredTradition: string;
  story: string;
  imageUrl?: string;
}

export const FAMOUS_HERITAGE_TREES: HeritageStoryItem[] = [
  {
    id: 'heritage-1',
    name: 'Akshaya Vat (The Immortal Banyan)',
    hindiName: 'अक्षयवट',
    speciesScientific: 'Ficus benghalensis',
    estimatedAgeYears: 1200,
    location: 'Patalpuri Temple, Prayagraj Fort',
    city: 'Prayagraj',
    sacredTradition: 'Ramayana & Puranic Tradition',
    story: 'Revered across centuries, pilgrims believe this banyan tree remains indestructible during the cosmic deluge (pralaya). Mentioned by Chinese pilgrim Xuanzang in 644 CE.',
  },
  {
    id: 'heritage-2',
    name: 'Kabir Vad (Saint Kabir\'s Banyan)',
    hindiName: 'कबीर वड़',
    speciesScientific: 'Ficus benghalensis',
    estimatedAgeYears: 600,
    location: 'Narmada River Island, Bharuch',
    city: 'Bharuch, Gujarat',
    sacredTradition: 'Bhakti Movement',
    story: 'Legend holds that Saint Kabir was cleaning his teeth with a small twig of banyan (datun) and planted it here. Today it spans nearly 3 acres with over 3,000 aerial prop roots.',
  },
  {
    id: 'heritage-3',
    name: 'Dodda Alada Mara (The Big Banyan)',
    hindiName: 'बड़ा बरगद',
    speciesScientific: 'Ficus benghalensis',
    estimatedAgeYears: 400,
    location: 'Kethohalli, Bengaluru Rural',
    city: 'Bengaluru',
    sacredTradition: 'Folk & Nature Sanctuary',
    story: 'Spans over 3 acres, forming a natural cathedral of living canopy. Although the main trunk succumbed to natural decay in 2000, over 1,000 root columns sustain the tree.',
  },
  {
    id: 'heritage-4',
    name: 'Varanasi Mahashivratri Bilva Tree',
    hindiName: 'काशी विश्वनाथ पूजित बेल वृक्ष',
    speciesScientific: 'Aegle marmelos',
    estimatedAgeYears: 180,
    location: 'Near Manikarnika Ghat',
    city: 'Varanasi',
    sacredTradition: 'Shaivite Tradition',
    story: 'Generations of priests have offered trifoliate leaves from this single ancient tree to Lord Shiva. The community has ring-fenced the root perimeter to protect it from road work.',
  },
];
