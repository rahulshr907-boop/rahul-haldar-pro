
import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Clock, Calculator, IndianRupee, RefreshCw } from 'lucide-react';
import { Note } from '../types';
import { storageService } from '../services/storageService';

interface NotebookProps {
  onClose: () => void;
  totalWeight: number;
  currentRate: number;
  onSaveRate: (rate: number) => void;
}

export const Notebook: React.FC<NotebookProps> = ({ onClose, totalWeight, currentRate, onSaveRate }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  
  // Converter State
  const [rate, setRate] = useState(currentRate.toString());
  const [calculatedValue, setCalculatedValue] = useState(currentRate * totalWeight);

  useEffect(() => {
    setNotes(storageService.getNotes());
  }, []);

  useEffect(() => {
    // Update calculation in real-time as user types
    const numRate = parseFloat(rate) || 0;
    setCalculatedValue(numRate * totalWeight);
  }, [rate, totalWeight]);

  const addNote = () => {
    if (!currentNote.trim()) return;
    const newNote: Note = {
      id: crypto.randomUUID(),
      content: currentNote,
      timestamp: Date.now()
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    storageService.saveNotes(updated);
    setCurrentNote('');
  };

  const deleteNote = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this note?")) {
        const updated = notes.filter(n => n.id !== id);
        setNotes(updated);
        storageService.saveNotes(updated);
    }
  };

  const handleSaveRateLocal = () => {
    const numRate = parseFloat(rate) || 0;
    onSaveRate(numRate);
    alert("Billing rate updated successfully!");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#2a1b1b] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="bg-orange-600 p-8 flex items-center justify-between text-white shrink-0">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter">Digital Ledger</h3>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Calculations & Notes</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* --- CONVERTER SECTION --- */}
          <div className="bg-slate-900 dark:bg-black/40 rounded-[2.5rem] p-6 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
               <Calculator size={120} />
             </div>
             
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-orange-500 rounded-lg">
                   <RefreshCw size={18} className="text-white"/>
                 </div>
                 <h4 className="font-black uppercase tracking-widest text-sm">Value Converter</h4>
               </div>

               <div className="grid grid-cols-2 gap-6 mb-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate Per Gram</label>
                   <div className="relative">
                      <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"/>
                      <input 
                        type="number" 
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 rounded-xl border border-white/10 focus:border-orange-500 outline-none font-black text-xl text-white"
                      />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Weight</label>
                   <div className="py-3 px-4 bg-white/5 rounded-xl border border-white/5 font-black text-xl text-slate-300">
                     {totalWeight.toFixed(2)} g
                   </div>
                 </div>
               </div>

               <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl border border-white/10 mb-4">
                  <span className="text-xs font-bold uppercase text-orange-400 tracking-wider">Estimated Total Value</span>
                  <span className="text-2xl font-black text-white">{calculatedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
               </div>

               <button 
                 onClick={handleSaveRateLocal}
                 className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
               >
                 <Save size={14}/> Save to Bill
               </button>
             </div>
          </div>

          <div className="border-t border-slate-200 dark:border-white/5"></div>

          {/* --- NOTES SECTION --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
               <Clock size={16} className="text-orange-600"/>
               <h4 className="font-black uppercase tracking-widest text-xs text-slate-400">Session Notes</h4>
            </div>
            <textarea
              placeholder="Start drafting new observations or quick logs..."
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              className="w-full min-h-[120px] p-6 bg-orange-50/50 dark:bg-white/5 rounded-[2rem] border-2 border-transparent focus:border-orange-500 outline-none text-slate-800 dark:text-white font-medium italic transition-all"
            />
            <button
              onClick={addNote}
              className="w-full bg-slate-900 dark:bg-orange-600 py-4 rounded-2xl text-white text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Save size={16} /> Save Record
            </button>
          </div>

          <div className="space-y-4">
            {notes.map(note => (
              <div key={note.id} className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200/50 dark:border-white/5 group relative">
                <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-relaxed mb-4">
                  {note.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Clock size={12} />
                    {new Date(note.timestamp).toLocaleString()}
                  </div>
                  <button 
                    onClick={() => deleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
