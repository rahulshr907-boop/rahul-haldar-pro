
import React, { useState, useEffect } from 'react';
import { X, Siren, Plus, Trash2, Edit2, Save, Phone } from 'lucide-react';
import { EmergencyContact } from '../types';
import { storageService } from '../services/storageService';

export const EmergencyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', number: '' });

  useEffect(() => {
    setContacts(storageService.getEmergencyContacts());
  }, []);

  const handleSave = () => {
    if (!formData.name || !formData.number) return;

    let updatedContacts;
    if (currentId) {
      // Edit mode
      updatedContacts = contacts.map(c => 
        c.id === currentId ? { ...c, ...formData } : c
      );
    } else {
      // Add mode
      updatedContacts = [...contacts, { id: crypto.randomUUID(), ...formData }];
    }

    setContacts(updatedContacts);
    storageService.saveEmergencyContacts(updatedContacts);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this emergency contact?')) {
      const updatedContacts = contacts.filter(c => c.id !== id);
      setContacts(updatedContacts);
      storageService.saveEmergencyContacts(updatedContacts);
    }
  };

  const startEdit = (contact: EmergencyContact) => {
    setFormData({ name: contact.name, number: contact.number });
    setCurrentId(contact.id);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ name: '', number: '' });
    setCurrentId(null);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-red-950/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-[#251818] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-8 border-b border-red-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-red-50 dark:bg-red-950/20">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-red-600 rounded-xl text-white shadow-lg shadow-red-500/30">
                <Siren size={24} />
             </div>
             <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Emergency</h2>
                <p className="text-xs font-bold text-red-600 uppercase tracking-widest">Quick Response List</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><X/></button>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          
          {isEditing ? (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between">
                   <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider">{currentId ? 'Edit Contact' : 'Add New Number'}</h3>
                   <button onClick={resetForm} className="text-xs font-bold text-slate-400 uppercase hover:text-red-500">Cancel</button>
                </div>
                
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Contact Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:border-red-500 font-bold transition-all"
                        placeholder="e.g. Police, Ambulance, Manager"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Phone Number</label>
                      <input 
                        type="tel" 
                        value={formData.number}
                        onChange={(e) => setFormData({...formData, number: e.target.value})}
                        className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:border-red-500 font-bold text-xl transition-all"
                        placeholder="+91..."
                      />
                   </div>
                   <button 
                     onClick={handleSave}
                     className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                   >
                     <Save size={18} /> Save Number
                   </button>
                </div>
             </div>
          ) : (
            <div className="space-y-4">
               <button 
                 onClick={() => setIsEditing(true)}
                 className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:border-red-400 hover:text-red-500 transition-all group mb-6"
               >
                 <div className="p-1 bg-slate-100 dark:bg-white/5 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
                    <Plus size={16} />
                 </div>
                 <span className="text-xs font-black uppercase tracking-widest">Add Emergency Number</span>
               </button>

               {contacts.length === 0 ? (
                 <div className="text-center py-10 opacity-50">
                    <Siren size={48} className="mx-auto mb-4 text-slate-300 dark:text-white/20"/>
                    <p className="text-xs font-bold text-slate-400 uppercase">No emergency contacts saved</p>
                 </div>
               ) : (
                 <div className="space-y-3">
                   {contacts.map(contact => (
                      <div key={contact.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-red-200 dark:hover:border-red-900/30 transition-all group">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center shrink-0">
                               <Phone size={18} />
                            </div>
                            <div>
                               <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-sm">{contact.name}</h4>
                               <a href={`tel:${contact.number}`} className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors">{contact.number}</a>
                            </div>
                         </div>
                         <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(contact)} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-white/10 rounded-lg"><Edit2 size={16}/></button>
                            <button onClick={() => handleDelete(contact.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-white/10 rounded-lg"><Trash2 size={16}/></button>
                         </div>
                      </div>
                   ))}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
