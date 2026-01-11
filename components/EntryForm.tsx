
import React, { useState, useRef } from 'react';
import { InventoryEntry, User } from '../types';
import { Package, Hash, Scale, FileText, Send, Layers, CalendarDays, Calculator, User as UserIcon, Camera, X, Image as ImageIcon } from 'lucide-react';

interface EntryFormProps {
  onSubmit: (entry: Omit<InventoryEntry, 'id' | 'createdAt' | 'isDeleted'>) => void;
  currentUserId: string;
  users: User[];
}

const CATEGORIES = [
  'Bracelet',
  'Pending Bracelet',
  'Necklace',
  'Earring',
  'Ring'
];

export const EntryForm: React.FC<EntryFormProps> = ({ onSubmit, currentUserId, users }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    weight: '',
    description: '',
    category: 'Bracelet',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    photo: ''
  });

  const currentUser = users.find(u => u.id === currentUserId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.invoiceNumber || !formData.weight) return;

    onSubmit({
      userId: currentUserId,
      invoiceNumber: formData.invoiceNumber,
      weight: parseFloat(formData.weight),
      description: formData.description,
      category: formData.category,
      quantity: formData.quantity ? parseInt(formData.quantity) : 1,
      date: formData.date,
      photo: formData.photo
    });

    setFormData({ 
      invoiceNumber: '', 
      weight: '', 
      description: '',
      category: 'Bracelet',
      quantity: '',
      date: new Date().toISOString().split('T')[0],
      photo: ''
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const isEarring = formData.category === 'Earring';

  return (
    <div className="bg-white dark:bg-[#251818] rounded-[2.5rem] p-8 shadow-xl shadow-orange-100 dark:shadow-none border border-orange-100/50 dark:border-white/5 relative overflow-hidden transition-all duration-300">
      
      {/* User Profile Badge (Master User Section integration) */}
      <div className="absolute top-0 right-0 p-6 z-10">
        <div className="flex items-center gap-3 bg-white/50 dark:bg-white/5 pl-2 pr-4 py-2 rounded-full border border-orange-100 dark:border-white/10 backdrop-blur-sm shadow-sm">
          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden flex items-center justify-center border border-white dark:border-transparent">
            {currentUser?.photo ? (
              <img src={currentUser.photo} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={16} className="text-slate-400" />
            )}
          </div>
          <div className="text-xs">
            <span className="block font-black text-slate-800 dark:text-white leading-none mb-0.5">{currentUser?.name}</span>
            <span className="block text-[8px] font-bold text-orange-600 uppercase tracking-wider">Jewelry Operator</span>
          </div>
        </div>
      </div>

      <div className="mb-8 relative">
        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter">New Registration</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enter item details below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Invoice & Weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 ml-2">ID NUMBER</label>
            <div className="relative group">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 group-focus-within:text-orange-600 transition-colors" size={20} />
              <input
                required
                type="text"
                placeholder="ID-0001"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-orange-50/50 dark:bg-white/5 rounded-2xl border-2 border-transparent focus:border-orange-500 outline-none transition-all font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 ml-2">Weight (Grams)</label>
            <div className="relative group">
              <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 group-focus-within:text-orange-600 transition-colors" size={20} />
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-orange-50/50 dark:bg-white/5 rounded-2xl border-2 border-transparent focus:border-orange-500 outline-none transition-all font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Category & Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 ml-2">Item Type</label>
            <div className="relative group">
              <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 group-focus-within:text-orange-600 transition-colors" size={20} />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-orange-50/50 dark:bg-white/5 rounded-2xl border-2 border-transparent focus:border-orange-500 outline-none transition-all font-bold text-slate-800 dark:text-white appearance-none cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 ml-2">
              {isEarring ? 'Pairs Count' : 'Quantity (QTY)'}
            </label>
            <div className="relative group">
              <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 group-focus-within:text-orange-600 transition-colors" size={20} />
              <input
                required
                type="number"
                min="1"
                placeholder={isEarring ? "Number of pairs..." : "Total quantity..."}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-orange-50/50 dark:bg-white/5 rounded-2xl border-2 border-transparent focus:border-orange-500 outline-none transition-all font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Auto Calendar */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 ml-2">Date Selection</label>
          <div className="relative group">
            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 group-focus-within:text-orange-600 transition-colors" size={20} />
            <input
              required
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-orange-50/50 dark:bg-white/5 rounded-2xl border-2 border-transparent focus:border-orange-500 outline-none transition-all font-bold text-slate-800 dark:text-white uppercase tracking-wider"
            />
          </div>
          <div className="px-4 flex items-center gap-2">
             <div className="h-px w-8 bg-orange-200 dark:bg-orange-900/50"></div>
             <span className="text-[11px] font-black text-slate-500 dark:text-slate-300 tracking-wide uppercase">
               Recorded: {new Date(formData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
             </span>
             <div className="h-px w-8 bg-orange-200 dark:bg-orange-900/50"></div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 ml-2">Details / Notes</label>
          <div className="relative group">
            <FileText className="absolute left-4 top-6 text-orange-400 group-focus-within:text-orange-600 transition-colors" size={20} />
            <textarea
              placeholder="Enter specific product details or batch info..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-orange-50/50 dark:bg-white/5 rounded-2xl border-2 border-transparent focus:border-orange-500 outline-none transition-all font-bold text-slate-800 dark:text-white resize-none"
            />
          </div>
          
          {/* Photo Attachment Section */}
          <div className="flex items-center gap-4 pl-1">
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/*"
               onChange={handlePhotoUpload}
             />
             
             {formData.photo ? (
               <div className="flex items-center gap-4">
                 <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-orange-200 dark:border-white/10 group shadow-sm">
                   <img src={formData.photo} className="w-full h-full object-cover" alt="Preview" />
                   <button 
                     type="button"
                     onClick={() => setFormData({...formData, photo: ''})}
                     className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                   >
                     <X size={14} />
                   </button>
                 </div>
                 <div className="text-xs">
                    <p className="font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><ImageIcon size={12}/> Photo Attached</p>
                    <p className="text-[10px] text-slate-400 cursor-pointer hover:text-red-500" onClick={() => setFormData({...formData, photo: ''})}>Remove photo</p>
                 </div>
               </div>
             ) : (
               <button 
                 type="button"
                 onClick={() => fileInputRef.current?.click()}
                 className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-white/5 rounded-xl border border-dashed border-orange-300 dark:border-white/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-white/10 transition-colors"
               >
                 <Camera size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Attach Photo</span>
               </button>
             )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 py-5 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-200 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <Send size={18} />
          Register Entry
        </button>
      </form>
    </div>
  );
};
