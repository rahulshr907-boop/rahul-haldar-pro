
import React, { useState } from 'react';
import { X, Award, MapPin, Calendar } from 'lucide-react';

export const OwnerDetailsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
    <div className="relative w-full max-w-lg bg-white dark:bg-[#251818] rounded-[2.5rem] shadow-2xl p-10 overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Award size={120} />
      </div>
      
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Owner Portfolio</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-orange-600 transition-colors"><X/></button>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-600 rounded-[2rem] shadow-xl shadow-orange-500/20" />
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">Pro Jewellery Systems Ltd.</h3>
          <p className="text-xs font-black text-orange-600 uppercase tracking-widest">Global Master License Holder</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
           <MapPin size={18} />
           <span className="text-sm font-bold">Tech Plaza, Innovation Valley, CA</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
           <Calendar size={18} />
           <span className="text-sm font-bold">Established October 2021</span>
        </div>
      </div>

      <div className="mt-8 p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
          "Dedicated to providing the most reliable inventory tracking solutions for the pro jewellery industry worldwide."
        </p>
      </div>
    </div>
  </div>
);
