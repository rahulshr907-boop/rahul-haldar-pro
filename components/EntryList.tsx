
import React, { useState, useRef, useEffect } from 'react';
import { InventoryEntry, User, DaiEntry } from '../types';
import { Search, Trash2, RotateCcw, Calendar, Hash, Layers, ImageIcon, Edit, X, Save, Scale, Calculator, CalendarDays, FileText, Camera, UserX, ClipboardList } from 'lucide-react';

interface EntryListProps {
  entries: InventoryEntry[];
  isTrashView: boolean;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onUpdate: (entry: InventoryEntry) => void;
  currentUser?: User;
  trashedUsers?: User[];
  onUserAction?: (id: string, action: 'restore' | 'permanent') => void;
  trashedDaiEntries?: DaiEntry[];
  onDaiAction?: (id: string, action: 'restore' | 'permanent') => void;
  onEmptyTrash?: () => void;
}

const CATEGORIES = [
  'Bracelet',
  'Pending Bracelet',
  'Necklace',
  'Earring',
  'Ring'
];

export const EntryList: React.FC<EntryListProps> = ({ 
  entries, isTrashView, onDelete, onRestore, onUpdate, trashedUsers, onUserAction, trashedDaiEntries, onDaiAction, onEmptyTrash 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<InventoryEntry | null>(null);

  const filtered = entries.filter(e => 
    e.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.category && e.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateStr?: string, timestamp?: number) => {
    const d = dateStr ? new Date(dateStr) : new Date(timestamp || Date.now());
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const hasTrashItems = isTrashView && (
    (entries.length > 0) || 
    (trashedUsers && trashedUsers.length > 0) || 
    (trashedDaiEntries && trashedDaiEntries.length > 0)
  );

  return (
    <div className="space-y-6">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={20} />
        <input
          type="text"
          placeholder={isTrashView ? "Search recycle bin..." : "Search inventory vault..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#251818] rounded-[1.5rem] border border-orange-100 dark:border-white/5 outline-none font-bold text-sm shadow-sm"
        />
      </div>

      {hasTrashItems && (
        <button 
            onClick={onEmptyTrash}
            className="w-full mb-2 py-4 bg-red-600 hover:bg-red-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-red-500/20 transition-all active:scale-95"
        >
            <Trash2 size={20} /> Empty Recycle Bin
        </button>
      )}

      <div className="grid gap-4">
        
        {/* Deleted Users Section */}
        {isTrashView && trashedUsers && trashedUsers.length > 0 && (
          <div className="mb-6 space-y-4">
             <div className="flex items-center gap-2 px-2">
                <UserX size={16} className="text-red-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Deleted Profiles</h3>
             </div>
             {trashedUsers.map(user => (
                <div key={user.id} className="bg-red-50 dark:bg-red-900/10 p-4 rounded-[1.5rem] border border-red-100 dark:border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white dark:bg-white/10 flex items-center justify-center overflow-hidden border-2 border-white dark:border-transparent shadow-sm">
                         {user.photo ? <img src={user.photo} alt={user.name} className="w-full h-full object-cover" /> : <UserX size={20} className="text-red-400" />}
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-800 dark:text-white">{user.name}</h4>
                         <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Deleted Account</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onUserAction?.(user.id, 'restore')}
                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition-colors"
                        title="Restore User"
                      >
                         <RotateCcw size={18} />
                      </button>
                      <button 
                        onClick={() => onUserAction?.(user.id, 'permanent')}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                        title="Permanently Delete User"
                      >
                         <Trash2 size={18} />
                      </button>
                   </div>
                </div>
             ))}
             <div className="h-px bg-slate-200 dark:bg-white/10 my-6"></div>
          </div>
        )}

        {/* Deleted Tasks Section */}
        {isTrashView && trashedDaiEntries && trashedDaiEntries.length > 0 && (
          <div className="mb-6 space-y-4">
             <div className="flex items-center gap-2 px-2">
                <ClipboardList size={16} className="text-red-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Deleted Tasks (DAI)</h3>
             </div>
             {trashedDaiEntries.map(task => (
                <div key={task.id} className="bg-red-50 dark:bg-red-900/10 p-4 rounded-[1.5rem] border border-red-100 dark:border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm shrink-0">
                         {task.photo ? <img src={task.photo} alt={task.diNumber} className="w-full h-full object-cover" /> : <Hash size={20} className="text-red-400" />}
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-800 dark:text-white">{task.diNumber}</h4>
                         <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">{task.details || 'No details'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onDaiAction?.(task.id, 'restore')}
                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition-colors"
                        title="Restore Task"
                      >
                         <RotateCcw size={18} />
                      </button>
                      <button 
                        onClick={() => onDaiAction?.(task.id, 'permanent')}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                        title="Permanently Delete Task"
                      >
                         <Trash2 size={18} />
                      </button>
                   </div>
                </div>
             ))}
             <div className="h-px bg-slate-200 dark:bg-white/10 my-6"></div>
          </div>
        )}

        {/* Inventory Entries List */}
        {filtered.length === 0 && (!trashedUsers || trashedUsers.length === 0) && (!trashedDaiEntries || trashedDaiEntries.length === 0) ? (
          <div className="text-center py-20 opacity-40">
            <Hash size={48} className="mx-auto mb-4" />
            <p className="font-bold uppercase tracking-widest text-xs">No records found</p>
          </div>
        ) : (
          filtered.map(entry => (
            <div 
              key={entry.id}
              className="bg-white dark:bg-[#251818] p-6 rounded-[2rem] border border-orange-100/50 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between group hover:shadow-xl hover:shadow-orange-100 dark:hover:shadow-none transition-all border-l-4 border-l-orange-500 gap-4"
            >
              <div className="flex items-start md:items-center gap-6">
                <div className="flex flex-col gap-2 shrink-0">
                  <div className="w-16 h-16 bg-orange-50 dark:bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-orange-100 dark:border-white/10">
                    <span className="text-orange-600 font-black text-lg">{entry.weight.toFixed(1)}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Grams</span>
                  </div>
                  {entry.photo && (
                     <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
                       <img src={entry.photo} alt="Item" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                     </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{entry.invoiceNumber}</span>
                    
                    {entry.category && (
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-200 text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1">
                        <Layers size={10} /> {entry.category}
                      </span>
                    )}

                    {entry.quantity && (
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-wider rounded-lg">
                        {entry.quantity} {entry.category === 'Earring' ? 'Prs' : 'Qty'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                      <Calendar size={12} />
                      {formatDate(entry.date, entry.createdAt)}
                  </div>

                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md line-clamp-2 italic">
                    {entry.description || 'No additional details provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                {!isTrashView ? (
                  <>
                    <button 
                      onClick={() => setEditingItem(entry)}
                      className="p-3 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-white/10 rounded-xl transition-all"
                      title="Edit Entry"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => onDelete(entry.id)}
                      className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                      title="Move to Recycle Bin"
                    >
                      <Trash2 size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => onRestore(entry.id)}
                      className="p-3 text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-xl transition-all"
                      title="Restore"
                    >
                      <RotateCcw size={20} />
                    </button>
                    <button 
                      onClick={() => onDelete(entry.id)}
                      className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                      title="Permanently Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {editingItem && (
        <EditEntryModal 
          entry={editingItem} 
          onClose={() => setEditingItem(null)} 
          onSave={(updated) => {
            onUpdate(updated);
            setEditingItem(null);
          }} 
        />
      )}
    </div>
  );
};

interface EditEntryModalProps {
  entry: InventoryEntry;
  onClose: () => void;
  onSave: (entry: InventoryEntry) => void;
}

const EditEntryModal: React.FC<EditEntryModalProps> = ({ entry, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    invoiceNumber: entry.invoiceNumber,
    weight: entry.weight,
    description: entry.description,
    category: entry.category || 'Bracelet',
    quantity: entry.quantity || 1,
    date: entry.date || new Date(entry.createdAt).toISOString().split('T')[0],
    photo: entry.photo || ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...entry,
      ...formData,
      weight: Number(formData.weight),
      quantity: Number(formData.quantity)
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#251818] rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Edit Entry</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Update item details manually</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-orange-600 transition-colors"><X/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 ml-2">ID NUMBER</label>
                <div className="relative group">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                  <input
                    required
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 focus:border-orange-500 outline-none font-bold text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 ml-2">Weight</label>
                <div className="relative group">
                  <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 focus:border-orange-500 outline-none font-bold text-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 ml-2">Category</label>
                <div className="relative group">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 focus:border-orange-500 outline-none font-bold text-slate-800 dark:text-white appearance-none"
                  >
                     {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 ml-2">{isEarring ? 'Pairs' : 'Qty'}</label>
                <div className="relative group">
                  <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                  <input
                    required
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 focus:border-orange-500 outline-none font-bold text-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 ml-2">Date</label>
              <div className="relative group">
                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 focus:border-orange-500 outline-none font-bold text-slate-800 dark:text-white uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 ml-2">Details / Notes</label>
              <div className="relative group">
                <FileText className="absolute left-4 top-4 text-orange-400" size={18} />
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 focus:border-orange-500 outline-none font-bold text-slate-800 dark:text-white resize-none"
                />
              </div>

               {/* Photo Section in Edit Modal */}
               <div className="flex items-center gap-4 pl-1 pt-2">
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
                          <div className="flex gap-2 mt-1">
                             <span className="text-[10px] text-orange-600 cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>Change</span>
                             <span className="text-[10px] text-red-500 cursor-pointer hover:underline" onClick={() => setFormData({...formData, photo: ''})}>Remove</span>
                          </div>
                       </div>
                     </div>
                   ) : (
                     <button 
                       type="button"
                       onClick={() => fileInputRef.current?.click()}
                       className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-300 dark:border-white/20 text-slate-500 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-white/10 transition-colors"
                     >
                       <Camera size={16} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Attach Photo</span>
                     </button>
                   )}
                </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-white/5 shrink-0">
          <button
            form="edit-form"
            type="submit"
            className="w-full bg-slate-900 dark:bg-orange-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};
