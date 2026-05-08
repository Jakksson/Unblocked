import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, Dice5, Trophy, Zap, Clock } from 'lucide-react';
import gamesData from './data/games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(gamesData.map(g => g.category)))];

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleRandomGame = () => {
    const randomIndex = Math.floor(Math.random() * gamesData.length);
    setSelectedGame(gamesData[randomIndex]);
  };

  return (
    <div className="min-h-screen flex flex-col font-mono bg-dark-bg text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-bg border-b-4 border-neon-primary px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedGame(null); setActiveCategory('All'); setSearchQuery(''); }}>
          <div className="p-2 bg-neon-primary text-black">
            <Gamepad2 size={32} strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Nova</h1>
            <p className="text-[10px] font-bold text-neon-primary uppercase tracking-[0.2em] -mt-1">Unblocked Games</p>
          </div>
        </div>

        <div className="flex-1 max-w-xl w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-border-accent" size={20} />
          <input
            type="text"
            placeholder="SEARCH FOR A GAME..."
            className="w-full bg-card-bg border-4 border-border-accent px-12 py-3 focus:outline-none focus:border-neon-primary transition-colors text-sm uppercase font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleRandomGame}
            className="bg-card-bg border-4 border-border-accent p-3 hover:border-neon-primary text-white transition-all flex items-center gap-2 text-xs font-black uppercase"
          >
            <Dice5 size={18} className="text-neon-primary" />
            <span className="hidden lg:inline">Random</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-12">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              {/* Category Pills */}
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 border-4 font-black uppercase text-xs transition-all ${
                      activeCategory === cat
                        ? 'bg-neon-primary border-neon-primary text-black -translate-x-1 -translate-y-1 shadow-[4px_4px_0_0_black]'
                        : 'bg-card-bg border-border-accent text-white hover:border-neon-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="game-card group"
                    onClick={() => setSelectedGame(game)}
                  >
                    <div className="aspect-video bg-black relative overflow-hidden">
                      <img 
                        src={game.thumbnail} 
                        alt={game.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 grayscale group-hover:grayscale-0"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/600x400/151515/00ff66?text=NOVA+GAMES';
                        }}
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="bg-neon-primary text-black px-2 py-0.5 text-[10px] font-black uppercase">
                          {game.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 border-t-4 border-border-accent bg-card-bg group-hover:bg-neon-primary group-hover:text-black transition-colors">
                      <h3 className="font-black text-lg leading-tight uppercase tracking-tight">{game.title}</h3>
                      <p className="text-[10px] mt-1 opacity-60 uppercase font-bold truncate">
                        {game.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-border-accent">
                  <X size={64} className="mb-4" />
                  <p className="text-xl font-black uppercase italic">No games found for "{searchQuery}"</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-6xl mx-auto space-y-6"
            >
              {/* Game Header */}
              <div className="flex items-center justify-between border-b-4 border-border-accent pb-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2 border-4 border-border-accent hover:border-red-500 hover:text-red-500 bg-card-bg transition-all"
                  >
                    <X size={24} strokeWidth={3} />
                  </button>
                  <div>
                    <h2 className="text-2xl font-black uppercase italic leading-none">{selectedGame.title}</h2>
                    <p className="text-xs text-neon-primary font-bold uppercase mt-1 tracking-widest">{selectedGame.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-card-bg border-4 border-border-accent hover:border-neon-primary transition-all">
                    <Maximize2 size={20} />
                  </button>
                  <a 
                    href={selectedGame.iframeUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 bg-card-bg border-4 border-border-accent hover:border-neon-secondary transition-all"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>

              {/* Game Player */}
              <div className="relative aspect-video w-full border-8 border-border-accent bg-black shadow-[16px_16px_0_0_black]">
                <iframe
                  src={selectedGame.iframeUrl}
                  className="absolute inset-0 w-full h-full border-none"
                  title={selectedGame.title}
                  allowFullScreen
                />
              </div>

              {/* Game Info Panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-card-bg border-4 border-border-accent p-6">
                    <h3 className="font-black uppercase mb-2 text-neon-primary italic flex items-center gap-2">
                      <Zap size={18} /> Description
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-400 capitalize">
                      {selectedGame.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-card-bg border-4 border-border-accent p-6 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-border-accent uppercase mb-1">Played recently</p>
                      <div className="flex items-center gap-2 font-black uppercase italic">
                        <Clock size={16} className="text-neon-primary" />
                        <span>2h ago</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-border-accent uppercase mb-1">Rating</p>
                      <div className="flex items-center gap-2 font-black uppercase italic text-neon-secondary">
                        <Trophy size={16} />
                        <span>4.8/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t-4 border-border-accent mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-border-accent">
          <p>© 2026 NOVA UNBLOCKED INC. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neon-primary">Terms of Duel</a>
            <a href="#" className="hover:text-neon-primary">Privacy Shield</a>
            <a href="#" className="hover:text-neon-primary">Join the cult</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
