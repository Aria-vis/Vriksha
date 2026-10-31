export interface CivicNurseryItem {
  id: string;
  name: string;
  agency: string;
  city: string;
  address: string;
  phone: string;
  distributionType: 'free' | 'subsidized';
  availableSaplings: string[];
  seasonalTiming: string;
  websiteUrl?: string;
}

export const CIVIC_NURSERIES: CivicNurseryItem[] = [
  {
    id: 'nur-1',
    name: 'Lalbagh State Forest Department Nursery',
    agency: 'Karnataka Forest Department',
    city: 'Bengaluru',
    address: 'Near West Gate, Lalbagh Botanical Garden, Mavalli',
    phone: '080-26578184',
    distributionType: 'subsidized',
    availableSaplings: ['Neem', 'Bael (Bilva)', 'Amla', 'Pongamia (Honge)', 'Mahua', 'Arjuna'],
    seasonalTiming: 'Monsoon distribution drive (June–September) & Year-round sales (₹15–₹30/sapling)',
    websiteUrl: 'https://aranya.gov.in',
  },
  {
    id: 'nur-2',
    name: 'Delhi Forest Department Free Sapling Counter',
    agency: 'Department of Forests & Wildlife, GNCTD',
    city: 'New Delhi',
    address: 'Birla Mandir Nursery, Mandir Marg / Hauz Khas Central Nursery',
    phone: '011-23363388',
    distributionType: 'free',
    availableSaplings: ['Neem', 'Peepal', 'Bargad (Banyan)', 'Jamun', 'Amaltas', 'Curry Leaf (Kadi Patta)'],
    seasonalTiming: 'Van Mahotsav Free Distribution (Up to 5 saplings free per citizen with Aadhaar/ID)',
    websiteUrl: 'https://forest.delhigovt.nic.in',
  },
  {
    id: 'nur-3',
    name: 'Sarnath Social Forestry Range Nursery',
    agency: 'Uttar Pradesh Forest Corporation',
    city: 'Varanasi',
    address: 'Near Deer Park, Sarnath',
    phone: '0542-2595000',
    distributionType: 'free',
    availableSaplings: ['Bilva (Bael)', 'Shami', 'Tulsi', 'Parijat (Harsingar)', 'Rudraksha', 'Ashoka'],
    seasonalTiming: 'Pavitra Vana Mission: Free sacred tree saplings for temples, ghats and community parks',
    websiteUrl: 'https://upforest.gov.in',
  },
  {
    id: 'nur-4',
    name: 'Sanjay Gandhi Biological Park Sapling Bank',
    agency: 'Bihar State Environment & Forest Dept',
    city: 'Patna',
    address: 'Bailey Road, Patna Zoo Gate #2',
    phone: '0612-2284555',
    distributionType: 'subsidized',
    availableSaplings: ['Moringa (Sahjan)', 'Bael', 'Amla', 'Gulmohar', 'Sheesham'],
    seasonalTiming: 'Jal-Jeevan-Hariyali Abhiyan subsidized distribution',
    websiteUrl: 'https://forest.bih.nic.in',
  },
];
