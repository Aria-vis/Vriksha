export interface SeedFestivalItem {
  slug: string;
  name_en: string;
  name_hi: string;
  description_en: string;
  description_hi: string;
  typical_month: number;
  lunar_tithi_desc: string;
  next_observed_date: string;
  region: string;
  needs_local_review: boolean;
  checklist: {
    species_scientific_name: string;
    purpose: string;
    part_needed: string;
    is_essential: boolean;
    notes?: string;
  }[];
}

export const SEED_FESTIVALS: SeedFestivalItem[] = [
  {
    slug: 'maha-shivratri',
    name_en: 'Maha Shivratri',
    name_hi: 'महाशिवरात्रि',
    description_en: 'The great night of Lord Shiva. Devotees offer Bilva leaves, Dhatura fruits, and white/blue flowers for the auspicious Lingam Abhishekam.',
    description_hi: 'भगवान शिव का पावन महापर्व। शिवलिंग अभिषेक के लिए बेलपत्र, धतूरा, आक और कनेर के पुष्प विशेष रूप से अर्पित किए जाते हैं।',
    typical_month: 2,
    lunar_tithi_desc: 'Phalguna Krishna Chaturdashi',
    next_observed_date: '2027-03-06',
    region: 'All India',
    needs_local_review: true,
    checklist: [
      {
        species_scientific_name: 'Aegle marmelos',
        purpose: 'Primary offering to Shiva Lingam; symbolizes the Trinetra (3 eyes)',
        part_needed: 'Intact trifoliate leaves (Belpatra)',
        is_essential: true,
        notes: 'Take 3-leaf clusters that are unblemished and clean.'
      },
      {
        species_scientific_name: 'Datura metel',
        purpose: 'Sacred offering to neutralize cosmic poisons (Halahala)',
        part_needed: 'Fruit and flower',
        is_essential: true,
        notes: 'CAUTION: Toxic! Handle carefully by the stem.'
      },
      {
        species_scientific_name: 'Calotropis procera',
        purpose: 'Offering of sacred white/purple flowers and garland to Shiva',
        part_needed: 'Flowers (Aak/Madar ke phool)',
        is_essential: false,
        notes: 'Do not touch eyes after handling milky sap.'
      },
      {
        species_scientific_name: 'Nerium oleander',
        purpose: 'Offering of vibrant fragrant flowers',
        part_needed: 'Flowers (Kaner)',
        is_essential: false,
        notes: 'Wash hands after plucking.'
      },
      {
        species_scientific_name: 'Prosopis cineraria',
        purpose: 'Traditional Shami leaf offering to Lord Shiva',
        part_needed: 'Fresh leaves',
        is_essential: false,
        notes: 'Pluck a few leaflets gently.'
      }
    ]
  },
  {
    slug: 'dussehra',
    name_en: 'Dussehra (Vijayadashami)',
    name_hi: 'दशहरा (विजयादशमी)',
    description_en: 'Celebration of the victory of righteousness over evil. Exchanging Shami and Apta leaves symbolizes mutual prosperity ("Gold exchange").',
    description_hi: 'बुराई पर अच्छाई की विजय का पर्व। शमी और आप्टा के पत्तों को "सोना" मानकर एक-दूसरे को आदरपूर्वक भेंट करने की परंपरा है।',
    typical_month: 10,
    lunar_tithi_desc: 'Ashvina Shukla Dashami',
    next_observed_date: '2027-10-10',
    region: 'All India',
    needs_local_review: true,
    checklist: [
      {
        species_scientific_name: 'Prosopis cineraria',
        purpose: 'Auspicious Shami leaves for greeting elders and friends as "Son-patta"',
        part_needed: 'Fresh leaflets',
        is_essential: true,
        notes: 'Take only a small sprig.'
      },
      {
        species_scientific_name: 'Mangifera indica',
        purpose: 'Mango leaves for doorstep Toran to welcome prosperity',
        part_needed: 'Fresh leaves',
        is_essential: true,
        notes: 'Tie onto thread with marigold flowers.'
      }
    ]
  },
  {
    slug: 'ganesh-chaturthi',
    name_en: 'Ganesh Chaturthi',
    name_hi: 'गणेश चतुर्थी',
    description_en: 'Welcoming Lord Ganesha with the traditional 21-sacred leaf (Eka-vimshati Patrika) and Durva grass rituals.',
    description_hi: 'भगवान गणेश का जन्मोत्सव। 21 प्रकार के पवित्र पत्रों (एकविंशति पत्रिका) और दूर्वा की 21 गांठों से विशेष पूजन किया जाता है।',
    typical_month: 9,
    lunar_tithi_desc: 'Bhadrapada Shukla Chaturthi',
    next_observed_date: '2027-09-04',
    region: 'All India',
    needs_local_review: true,
    checklist: [
      {
        species_scientific_name: 'Cynodon dactylon',
        purpose: 'Indispensable 21 Durva grass bunches offered to Ganesha',
        part_needed: 'Tender 3-bladed nodes',
        is_essential: true,
        notes: 'Rinse with clean water before offering.'
      },
      {
        species_scientific_name: 'Hibiscus rosa-sinensis',
        purpose: 'Lord Ganesha\'s most beloved red flower (Rakta Pushpa)',
        part_needed: 'Fresh red blossoms',
        is_essential: true,
        notes: 'Offer fresh morning bloomed flowers.'
      },
      {
        species_scientific_name: 'Aegle marmelos',
        purpose: 'Part of the 21 Patrika sacred botanical set',
        part_needed: 'Trifoliate leaves (Bilvapatra)',
        is_essential: true,
        notes: 'Sacred element of the 21-leaf ritual.'
      },
      {
        species_scientific_name: 'Prosopis cineraria',
        purpose: 'Shami patra for Ganesha Sahasranama puja',
        part_needed: 'Leaves',
        is_essential: true,
        notes: 'Brings wisdom and barrier removal.'
      }
    ]
  },
  {
    slug: 'diwali',
    name_en: 'Diwali & Dhanteras',
    name_hi: 'दीपावली एवं धनतेरस',
    description_en: 'Festival of lights. Homes are adorned with entrance Torans crafted from fresh Mango and Ashoka leaves to invite Goddess Lakshmi.',
    description_hi: 'दीपोत्सव एवं माता लक्ष्मी का आगमन पर्व। घर के मुख्य द्वार पर आम और अशोक के पत्तों का तोरण बांधना अत्यंत शुभ माना जाता है।',
    typical_month: 11,
    lunar_tithi_desc: 'Kartika Amavasya',
    next_observed_date: '2027-10-29',
    region: 'All India',
    needs_local_review: true,
    checklist: [
      {
        species_scientific_name: 'Mangifera indica',
        purpose: 'Entrance Toran and Kalash Sthapana for Lakshmi Puja',
        part_needed: 'Fresh green leaves',
        is_essential: true,
        notes: 'Pick healthy unblemished leaves.'
      },
      {
        species_scientific_name: 'Ocimum tenuiflorum',
        purpose: 'Tulsi leaves for offering to Lord Vishnu & Dhanvantari',
        part_needed: 'Fresh leaves and Manjari (flower spikes)',
        is_essential: true,
        notes: 'Do not pluck on Amavasya evening.'
      }
    ]
  },
  {
    slug: 'chhath-puja',
    name_en: 'Chhath Puja',
    name_hi: 'छठ पूजा',
    description_en: 'Ancient solar thanksgiving festival celebrated with profound reverence along riverbanks. Offerings comprise pure, unhybridized agricultural plants.',
    description_hi: 'सूर्यदेव एवं छठी मइया का महापर्व। सूप और दउरा में ईख, अदरक का पौधा, हल्दी का पौधा, केला और बेल फल अर्पित किए जाते हैं।',
    typical_month: 11,
    lunar_tithi_desc: 'Kartika Shukla Shashthi',
    next_observed_date: '2027-11-04',
    region: 'Bihar, Jharkhand, UP & Global Purvanchal',
    needs_local_review: true,
    checklist: [
      {
        species_scientific_name: 'Aegle marmelos',
        purpose: 'Offering of sacred Bael fruit in the Daura/Arghya',
        part_needed: 'Whole hard-shelled fruit',
        is_essential: true,
        notes: 'Unbroken fruit preferred.'
      },
      {
        species_scientific_name: 'Mangifera indica',
        purpose: 'Dry mango wood for the pristine Havana and sacred stove fire',
        part_needed: 'Fallen dry twigs and branches',
        is_essential: true,
        notes: 'Collect only naturally fallen dry wood.'
      }
    ]
  },
  {
    slug: 'tulsi-vivah',
    name_en: 'Tulsi Vivah',
    name_hi: 'तुलसी विवाह',
    description_en: 'Ceremonial marriage of the Holy Basil (Tulsi) with Lord Vishnu (Shaligrama), inaugurating the Hindu wedding season.',
    description_hi: 'तुलसी जी का भगवान शालिग्राम के साथ दिव्य विवाह। इस दिन से मांगलिक कार्यों और विवाह का शुभारंभ होता है।',
    typical_month: 11,
    lunar_tithi_desc: 'Kartika Shukla Ekadashi / Dvadashi',
    next_observed_date: '2027-11-10',
    region: 'All India',
    needs_local_review: true,
    checklist: [
      {
        species_scientific_name: 'Ocimum tenuiflorum',
        purpose: 'The central deity of the ceremony',
        part_needed: 'Living potted plant adorned as a bride',
        is_essential: true,
        notes: 'Decorate with sugarcane mandap and haldi-kumkum.'
      },
      {
        species_scientific_name: 'Phyllanthus emblica',
        purpose: 'Amla branch placed in the Tulsi pot representing Vishnu',
        part_needed: 'Tender branch with leaves and gooseberry fruit',
        is_essential: true,
        notes: 'Symbolizes the presence of Lord Damodara.'
      }
    ]
  },
  {
    slug: 'vat-savitri',
    name_en: 'Vat Savitri Vrat',
    name_hi: 'वट सावित्री व्रत',
    description_en: 'Married women observe fast and pray around the sacred Banyan tree for marital bliss and spouse\'s longevity, commemorating Savitri\'s devotion.',
    description_hi: 'सुहागिन महिलाओं द्वारा पति की दीर्घायु और अखंड सौभाग्य हेतु वट (बरगद) वृक्ष की परिक्रमा और सूत बांधने का पावन व्रत।',
    typical_month: 6,
    lunar_tithi_desc: 'Jyeshtha Amavasya / Purnima',
    next_observed_date: '2027-06-04',
    region: 'All India (North, West & Central)',
    needs_local_review: true,
    checklist: [
      {
        species_scientific_name: 'Ficus benghalensis',
        purpose: 'Living Banyan tree for parikrama (circumambulation) and thread wrapping',
        part_needed: 'Standing living tree',
        is_essential: true,
        notes: 'Find the nearest living Banyan tree. Do not cut branches.'
      }
    ]
  },
  {
    slug: 'ugadi-gudi-padwa',
    name_en: 'Ugadi / Gudi Padwa',
    name_hi: 'उगादि / गुड़ी पड़वा',
    description_en: 'Deccan and Marathi New Year celebration. Neem leaves and flowers are mixed with jaggery to symbolize life\'s dual experiences of bitter and sweet.',
    description_hi: 'नववर्ष उत्सव। जीवन के सुख-दुख का प्रतीक माने जाने वाले नीम के पत्ते और फूल गुड़ के साथ ग्रहण किए जाते हैं।',
    typical_month: 4,
    lunar_tithi_desc: 'Chaitra Shukla Pratipada',
    next_observed_date: '2027-04-07',
    region: 'Karnataka, Andhra Pradesh, Telangana, Maharashtra',
    needs_local_review: true,
    checklist: [
      {
        species_scientific_name: 'Azadirachta indica',
        purpose: 'Essential ingredient for Ugadi Pachadi / Bevu-Bella',
        part_needed: 'Tender fresh leaves and small white flowers',
        is_essential: true,
        notes: 'Pluck morning fresh flowers and tiny young leaf tips.'
      },
      {
        species_scientific_name: 'Mangifera indica',
        purpose: 'Fresh green mangoes for Pachadi and entrance Toran',
        part_needed: 'Unripe green mango & leaves',
        is_essential: true,
        notes: 'Symbolizes new beginnings.'
      }
    ]
  },
  {
    slug: 'navratri-durga-puja',
    name_en: 'Navratri & Durga Puja (Navapatrika)',
    name_hi: 'नवरात्रि एवं दुर्गा पूजा (नवपत्रिका)',
    description_en: 'Worship of the 9 sacred plants (Navapatrika / Kola Bou) embodying 9 manifestations of Goddess Durga.',
    description_hi: 'माँ दुर्गा के नौ रूपों का प्रतीक मानी जाने वाली नौ पवित्र वनस्पतियों (नवपत्रिका) का विधिवत आवाहन एवं पूजन।',
    typical_month: 10,
    lunar_tithi_desc: 'Ashvina Shukla Saptami',
    next_observed_date: '2027-10-07',
    region: 'Bengal, Assam, Odisha, All India',
    needs_local_review: true,
    checklist: [
      {
        species_scientific_name: 'Aegle marmelos',
        purpose: 'Belpatrika: Invocation of Goddess Shivaa',
        part_needed: 'Trifoliate leaves on a twig',
        is_essential: true,
        notes: 'One of the nine sacred plants bound together.'
      },
      {
        species_scientific_name: 'Saraca asoca',
        purpose: 'Ashoka: Invocation of Goddess Shokarahita',
        part_needed: 'Branch with tender leaves',
        is_essential: true,
        notes: 'Bound into the Kola Bou bundle.'
      },
      {
        species_scientific_name: 'Hibiscus rosa-sinensis',
        purpose: 'Daily Pushpanjali to Mother Durga',
        part_needed: 'Red Gudhal / Jaba flowers',
        is_essential: true,
        notes: 'Goddess Durga\'s favored floral offering.'
      }
    ]
  },
  {
    slug: 'makar-sankranti',
    name_en: 'Makar Sankranti & Pongal',
    name_hi: 'मकर संक्रांति एवं पोंगल',
    description_en: 'Harvest festival celebrating the sun transition into Capricorn. Festive cooking incorporates freshly harvested herbs and leaves.',
    description_hi: 'सूर्य के मकर राशि में प्रवेश का पावन सूर्योत्सव एवं फसलों का त्योहार।',
    typical_month: 1,
    lunar_tithi_desc: 'Solar ingress (Makara Sankranti)',
    next_observed_date: '2027-01-14',
    region: 'All India',
    needs_local_review: true,
    checklist: [
      {
        species_scientific_name: 'Mangifera indica',
        purpose: 'Entrance decor and festive mango-leaf torans',
        part_needed: 'Leaves',
        is_essential: true,
        notes: 'Symbolizes prosperity.'
      }
    ]
  },
  {
    slug: 'raksha-bandhan',
    name_en: 'Raksha Bandhan & Shravani Upakarma',
    name_hi: 'रक्षाबंधन एवं श्रावणी उपाकर्म',
    description_en: 'Celebration of sibling bonds and Vedic Upakarma ritual using sacred Durva and Tulsi for sanctification.',
    description_hi: 'भाई-बहन के स्नेह और रक्षा का पर्व तथा पवित्र यज्ञोपवीत उपाकर्म पूजन।',
    typical_month: 8,
    lunar_tithi_desc: 'Shravana Purnima',
    next_observed_date: '2027-08-17',
    region: 'All India',
    needs_local_review: true,
    checklist: [
      {
        species_scientific_name: 'Cynodon dactylon',
        purpose: 'Auspicious grass placed in the Rakhi thali and Akshata',
        part_needed: 'Fresh green Durva blades',
        is_essential: true,
        notes: 'Sign of purity and longevity.'
      },
      {
        species_scientific_name: 'Ocimum tenuiflorum',
        purpose: 'Offering during morning puja rituals',
        part_needed: 'Fresh leaves',
        is_essential: true,
        notes: 'Spiritual sanctification.'
      }
    ]
  },
  {
    slug: 'guru-purnima',
    name_en: 'Guru Purnima / Buddha Purnima',
    name_hi: 'गुरु पूर्णिमा / बुद्ध पूर्णिमा',
    description_en: 'Reverence to spiritual preceptors and commemoration of Buddha\'s enlightenment under the Bodhi tree.',
    description_hi: 'आध्यात्मिक गुरुओं के प्रति कृतज्ञता तथा बोधिवृक्ष के नीचे भगवान बुद्ध के ज्ञानोदय का स्मरण।',
    typical_month: 7,
    lunar_tithi_desc: 'Ashadha Purnima / Vaishakha Purnima',
    next_observed_date: '2027-07-18',
    region: 'All India',
    needs_local_review: true,
    checklist: [
      {
        species_scientific_name: 'Ficus religiosa',
        purpose: 'Meditation, circumambulation, and honor to the Bodhi lineage',
        part_needed: 'Living Peepal tree',
        is_essential: true,
        notes: 'Find the nearest serene Peepal/Bodhi tree for quiet contemplation.'
      }
    ]
  }
];
