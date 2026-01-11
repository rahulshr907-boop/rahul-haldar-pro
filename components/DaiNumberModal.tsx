
import React, { useState, useEffect } from 'react';
import { X, Link, Plus, Trash2, Image as ImageIcon, ExternalLink, Search } from 'lucide-react';
import { storageService } from '../services/storageService';
import { DaiImage } from '../types';

export const DaiNumberModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [images, setImages] = useState<DaiImage[]>([]);
  const [url, setUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setImages(storageService.getDaiImages());
  }, []);

  const handleAdd = () => {
    if (!url.trim()) return;
    
    let generatedTitle = 'Untitled Asset';
    try {
        const urlObj = new URL(url.trim());
        const pathSegments = urlObj.pathname.split('/').filter(Boolean);
        if (pathSegments.length > 0) {
            generatedTitle = decodeURIComponent(pathSegments[pathSegments.length - 1]);
        } else {
            generatedTitle = urlObj.hostname;
        }
    } catch (e) {
        const parts = url.trim().split('/');
        generatedTitle = parts[parts.length - 1] || url.trim();
    }

    const newImage: DaiImage = {
      id: crypto.randomUUID(),
      url: url.trim(),
      title: generatedTitle,
      timestamp: Date.now()
    };

    const updated = [newImage, ...images];
    setImages(updated);
    storageService.saveDaiImages(updated);
    setUrl('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this photo from gallery?')) {
        const updated = images.filter(img => img.id !== id);
        setImages(updated);
        storageService.saveDaiImages(updated);
    }
  };

  const filteredImages = images.filter(img => 
    img.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-[#1a0f0f] flex flex-col animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-orange-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-orange-50 dark:bg-[#251818]">
          <div className="flex items-center gap-4">
             <div className="p-4 bg-orange-600 rounded-2xl text-white shadow-xl shadow-orange-600/20">
                <ImageIcon size={28} />
             </div>
             <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">DAI Gallery</h2>
                <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">Digital Asset Interface • Full Archive</p>
             </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white dark:bg-white/5 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all shadow-sm">
            <X size={24} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
           
           {/* Sidebar Controls (Desktop) or Top (Mobile) */}
           <div className="w-full md:w-[400px] p-8 border-b md:border-b-0 md:border-r border-orange-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex flex-col gap-8 shrink-0 overflow-y-auto">
              
              {/* Add New Section */}
              <div className="bg-white dark:bg-[#251818] p-6 rounded-[2rem] shadow-xl shadow-orange-100/50 dark:shadow-none border border-orange-100/50 dark:border-white/5">
                 <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                   <Plus size={16} className="text-orange-500"/> Add New Asset
                 </h3>
                 
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Image Link</label>
                       <div className="relative">
                          <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="text" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste cloud URL..."
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:border-orange-500 font-medium text-slate-800 dark:text-white text-sm"
                          />
                       </div>
                    </div>

                    <button 
                      onClick={handleAdd}
                      disabled={!url.trim()}
                      className="w-full py-4 bg-slate-900 dark:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
                    >
                      <Plus size={16} /> Auto-Add to Gallery
                    </button>
                 </div>
              </div>

              {/* Search Section */}
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Search Gallery</label>
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Find by name..."
                      className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#251818] rounded-2xl border border-orange-100 dark:border-white/10 outline-none focus:border-orange-500 font-bold text-slate-800 dark:text-white shadow-sm"
                    />
                 </div>
              </div>
           </div>

           {/* Gallery Grid Area */}
           <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-black/20">
             {images.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-40">
                  <ImageIcon size={80} className="mb-6 text-slate-300 dark:text-white/20"/>
                  <p className="font-black text-slate-400 uppercase tracking-widest text-lg">Gallery is Empty</p>
                  <p className="text-sm text-slate-400 mt-2">Add your first digital asset from the sidebar</p>
               </div>
             ) : (
               <>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredImages.length === 0 ? (
                        <div className="col-span-full text-center py-20 opacity-50">
                           <p className="font-bold text-slate-500 uppercase">No matching photos found</p>
                        </div>
                    ) : (
                        filteredImages.map((img) => (
                          <div key={img.id} className="group flex flex-col bg-white dark:bg-[#251818] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-white/5 hover:-translate-y-1">
                             <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-white/5">
                                <img 
                                  src={img.url} 
                                  alt={img.title} 
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Invalid+Link';
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                   <a href={img.url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-slate-900 rounded-xl hover:bg-orange-500 hover:text-white transition-colors shadow-lg">
                                      <ExternalLink size={20} />
                                   </a>
                                   <button onClick={() => handleDelete(img.id)} className="p-3 bg-white text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors shadow-lg">
                                      <Trash2 size={20} />
                                   </button>
                                </div>
                             </div>
                             
                             <div className="p-4">
                                <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate" title={img.title}>{img.title}</h4>
                                <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">
                                   {new Date(img.timestamp).toLocaleDateString()}
                                </p>
                             </div>
                          </div>
                        ))
                    )}
                 </div>
               </>
             )}
           </div>
        </div>
    </div>
  );
};
