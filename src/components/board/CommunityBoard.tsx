import React, { useState } from 'react';
import { X, Sparkles, Plus, MessageCircle, MapPin, Tag } from 'lucide-react';

export interface BoardPost {
  id: string;
  type: 'have' | 'need';
  title: string;
  speciesName: string;
  locality: string;
  city: string;
  description: string;
  postedBy: string;
  postedAt: string;
  contactHint: string;
}

const INITIAL_POSTS: BoardPost[] = [
  {
    id: 'post-1',
    type: 'have',
    title: 'Excess Bilva (Bael) leaves for Shivratri',
    speciesName: 'Bael (Aegle marmelos)',
    locality: 'Indiranagar 2nd Stage',
    city: 'Bengaluru',
    description: 'We have a 25-year-old Bael tree in our front garden with plenty of fresh trifoliate leaves. Neighbors welcome to collect a handful for puja.',
    postedBy: 'Anand K.',
    postedAt: '2026-10-31T09:00:00Z',
    contactHint: 'WhatsApp: 98765-XXXXX (Ring doorbell between 7-9 AM)',
  },
  {
    id: 'post-2',
    type: 'need',
    title: 'Seeking fresh Durva (Bermuda grass) runners',
    speciesName: 'Durva (Cynodon dactylon)',
    locality: 'Assi Ghat Area',
    city: 'Varanasi',
    description: 'Need 21 clean blades of Durva grass for Ganesh Puja tomorrow morning. Any clean temple garden nearby?',
    postedBy: 'Meenakshi S.',
    postedAt: '2026-10-31T11:30:00Z',
    contactHint: 'Message via Vriksha or reply on community thread',
  },
  {
    id: 'post-3',
    type: 'have',
    title: 'Shami leaves available for Dussehra Vijayadashami',
    speciesName: 'Shami (Prosopis cineraria)',
    locality: 'Lajpat Nagar',
    city: 'New Delhi',
    description: 'Healthy Shami tree outside our society gate. Golden leaf exchange tradition — feel free to pick fallen or lower sprigs.',
    postedBy: 'Rajiv V.',
    postedAt: '2026-10-30T16:00:00Z',
    contactHint: 'Gate #3 Security Guard will direct you',
  },
];

interface CommunityBoardProps {
  isOpen: boolean;
  onClose: () => void;
  activeCityName?: string;
}

export const CommunityBoard: React.FC<CommunityBoardProps> = ({
  isOpen,
  onClose,
  activeCityName = 'All India',
}) => {
  const [posts, setPosts] = useState<BoardPost[]>(INITIAL_POSTS);
  const [filterType, setFilterType] = useState<'all' | 'have' | 'need'>('all');
  const [isPosting, setIsPosting] = useState<boolean>(false);

  // New post form state
  const [newType, setNewType] = useState<'have' | 'need'>('have');
  const [newTitle, setNewTitle] = useState('');
  const [newSpecies, setNewSpecies] = useState('');
  const [newLocality, setNewLocality] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newContact, setNewContact] = useState('');

  if (!isOpen) return null;

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSpecies.trim()) return;

    const created: BoardPost = {
      id: `post-${Date.now()}`,
      type: newType,
      title: newTitle.trim(),
      speciesName: newSpecies.trim(),
      locality: newLocality.trim() || 'Local Neighborhood',
      city: activeCityName,
      description: newDesc.trim(),
      postedBy: 'You (Community Contributor)',
      postedAt: new Date().toISOString(),
      contactHint: newContact.trim() || 'Reply on Vriksha community thread',
    };

    setPosts([created, ...posts]);
    setIsPosting(false);
    setNewTitle('');
    setNewSpecies('');
    setNewLocality('');
    setNewDesc('');
    setNewContact('');
  };

  const filteredPosts = posts.filter((p) => {
    if (filterType === 'all') return true;
    return p.type === filterType;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Community Need it Have it Board"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 to-forest-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700/80 rounded-xl">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif leading-tight">
                Community &ldquo;Need It / Have It&rdquo; Board
              </h2>
              <p className="text-xs text-emerald-200">
                Share excess puja leaves or seek ritual herbs in your neighborhood
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close community board"
            className="p-1.5 rounded-full hover:bg-emerald-700/60 text-emerald-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Filter Bar */}
        <div className="p-3 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                filterType === 'all'
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              All ({posts.length})
            </button>
            <button
              onClick={() => setFilterType('have')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                filterType === 'have'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              🌿 I Have
            </button>
            <button
              onClick={() => setFilterType('need')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                filterType === 'need'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              🙏 I Need
            </button>
          </div>

          {!isPosting && (
            <button
              onClick={() => setIsPosting(true)}
              className="flex items-center gap-1 px-3 py-1 bg-brand-saffron hover:bg-brand-saffron-light text-white text-xs font-bold rounded-full shadow transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Post Request</span>
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Post Creation Form */}
          {isPosting && (
            <form
              onSubmit={handleCreatePost}
              className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-forest-900 dark:text-forest-100 uppercase tracking-wider">
                  Create Neighborhood Listing
                </span>
                <button
                  type="button"
                  onClick={() => setIsPosting(false)}
                  className="text-xs text-stone-500 hover:text-stone-700"
                >
                  Cancel
                </button>
              </div>

              {/* Type Selector */}
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setNewType('have')}
                  className={`flex-1 py-1.5 rounded-xl font-bold border transition-colors ${
                    newType === 'have'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white dark:bg-stone-800 text-stone-700 border-stone-300'
                  }`}
                >
                  🌿 I Have (Offering to share)
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('need')}
                  className={`flex-1 py-1.5 rounded-xl font-bold border transition-colors ${
                    newType === 'need'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white dark:bg-stone-800 text-stone-700 border-stone-300'
                  }`}
                >
                  🙏 I Need (Seeking plant/leaves)
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Listing title (e.g. Fresh Bilva leaves available for Shivratri)"
                  className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-forest-600"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={newSpecies}
                    onChange={(e) => setNewSpecies(e.target.value)}
                    placeholder="Species (e.g. Bael / Bilva)"
                    className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-forest-600"
                  />
                  <input
                    type="text"
                    required
                    value={newLocality}
                    onChange={(e) => setNewLocality(e.target.value)}
                    placeholder="Neighborhood (e.g. Indiranagar)"
                    className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-forest-600"
                  />
                </div>

                <textarea
                  rows={2}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Details: Quantity, time to visit, harvesting etiquette..."
                  className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-forest-600 resize-none"
                />

                <input
                  type="text"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  placeholder="How can neighbors reach you? (e.g. WhatsApp number or gate instructions)"
                  className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-forest-600"
                />
              </div>

              <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-200 leading-tight">
                🔒 <strong>Privacy Shield</strong>: Never post your full home door number. Share general neighborhood instructions only.
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-forest-800 hover:bg-forest-900 text-white font-bold rounded-xl shadow transition-colors"
              >
                Publish to Community Board
              </button>
            </form>
          )}

          {/* Post Feed */}
          {filteredPosts.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-500">
              No community posts found for this filter. Be the first to post!
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 bg-stone-50/70 dark:bg-stone-800/40 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-2 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          post.type === 'have'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {post.type === 'have' ? '🌿 Have' : '🙏 Need'}
                      </span>
                      <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        {post.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-stone-400" />
                        <span className="italic">{post.speciesName}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium text-stone-700 dark:text-stone-300">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{post.locality}, {post.city}</span>
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 shrink-0">
                    {new Date(post.postedAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  {post.description}
                </p>

                <div className="p-2.5 bg-white dark:bg-stone-800 rounded-xl border border-stone-200/60 dark:border-stone-700 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                    <MessageCircle className="w-3.5 h-3.5 text-forest-600" />
                    <span className="font-medium">{post.contactHint}</span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-sans">@{post.postedBy}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityBoard;
