
import React, { useState, useEffect, useRef } from 'react';
import { X, Hash, Calendar, FileText, Camera, Plus, Save, Trash2, Image as ImageIcon, Clock, CheckCircle2, ArrowRightCircle, FolderOpen, Edit, Edit2, RotateCcw } from 'lucide-react';
import { storageService } from '../services/storageService';
import { DaiEntry, DaiEntryStatus } from '../types';

export const DaiEntryModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [entries, setEntries] = useState<DaiEntry[]>([]);
  const [activeTab, setActiveTab] = useState<DaiEntryStatus>('waiting');
  const [editingEntry, setEditingEntry] = useState<DaiEntry | null>(null);
  
  const [formData, setFormData] = useState({
    diNumber: '',
    date: new Date().toISOString().split('T')[0],
    details: '',
    photo: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEntries(storageService.getDaiEntries());
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.diNumber) return;

    const newEntry: DaiEntry = {
      id: crypto.randomUUID(),
      diNumber: formData.diNumber,
      date: formData.date,
      details: formData.details,
      photo: formData.photo,
      createdAt: Date.now(),
      status: 'waiting' // Default to Waiting folder
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    storageService.saveDaiEntries(updated);
    
    // Reset form
    setFormData({
      diNumber: '',
      date: new Date().toISOString().split('T')[0],
      details: '',
      photo: ''
    });
    
    // Switch to waiting tab to show the new entry
    setActiveTab('waiting');
  };

  const handleDelete = (entry: DaiEntry) => {
    if (entry.status === 'trash') {
        if (window.confirm('Delete this entry permanently? This cannot be undone.')) {
            const updated = entries.filter(e => e.id !== entry.id);
            setEntries(updated);
            storageService.saveDaiEntries(updated);
        }
    } else {
        // Soft Delete (Move to Trash) - Instant Action, No Confirmation
        handleMoveStatus(entry.id, 'trash');
    }
  };

  const handleMoveStatus = (id: string, newStatus: DaiEntryStatus) => {
    const updated = entries.map(e => e.id === id ? { ...e, status: newStatus } : e);
    setEntries(updated);
    storageService.saveDaiEntries(updated);
  };

  const handleUpdateEntry = (updatedEntry: DaiEntry) => {
    const updated = entries.map(e => e.id === updatedEntry.id ? updatedEntry : e);
    setEntries(updated);
    storageService.saveDaiEntries(updated);
    setEditingEntry(null);
  };

  const filteredEntries = entries.filter(e => e.status === activeTab);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-6xl bg-white dark:bg-[#1a0f0f] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">
        
        {/* Left Panel: Form */}
        <div className="w-full md:w-[380px] bg-white dark:bg-[#251818] border-b md:border-b-0 md:border-r border-orange-100 dark:border-white/5 flex flex-col shrink-0 relative z-20">
           <div className="p-8 border-b border-orange-100 dark:border-white/5">
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-3 bg-orange-600 rounded-xl text-white">
                    <Plus size={20} />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">New Task</h2>
                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Add to Waiting</p>
                 </div>
              </div>
           </div>

           <div className="p-8 overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="space-y-6">
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">DI Number</label>
                    <div className="relative">
                       <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                       <input 
                         required
                         type="text" 
                         value={formData.diNumber}
                         onChange={(e) => setFormData({...formData, diNumber: e.target.value})}
                         placeholder="DI-XXXX"
                         className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:border-orange-500 font-bold text-slate-800 dark:text-white"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Date</label>
                    <div className="relative">
                       <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                       <input 
                         required
                         type="date" 
                         value={formData.date}
                         onChange={(e) => setFormData({...formData, date: e.target.value})}
                         className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:border-orange-500 font-bold text-slate-800 dark:text-white uppercase"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Details / Others</label>
                    <div className="relative">
                       <FileText className="absolute left-4 top-4 text-orange-400" size={18} />
                       <textarea 
                         rows={3}
                         value={formData.details}
                         onChange={(e) => setFormData({...formData, details: e.target.value})}
                         placeholder="Additional information..."
                         className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:border-orange-500 font-medium text-slate-800 dark:text-white resize-none"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Attachment</label>
                    <div 
                       onClick={() => fileInputRef.current?.click()}
                       className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-white/5 transition-all group min-h-[100px]"
                    >
                       {formData.photo ? (
                          <div className="relative w-full h-32 rounded-xl overflow-hidden">
                             <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold uppercase">Change Photo</span>
                             </div>
                          </div>
                       ) : (
                          <>
                             <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                <Camera size={20} className="text-slate-400 group-hover:text-orange-500" />
                             </div>
                             <span className="text-xs font-bold text-slate-400 group-hover:text-orange-600">Upload Photo</span>
                          </>
                       )}
                       <input 
                         ref={fileInputRef}
                         type="file" 
                         accept="image/*" 
                         className="hidden"
                         onChange={handlePhotoUpload}
                       />
                    </div>
                    {formData.photo && (
                       <button 
                         type="button" 
                         onClick={() => setFormData({...formData, photo: ''})} 
                         className="text-[10px] text-red-500 font-bold uppercase w-full text-center hover:underline"
                       >
                          Remove Photo
                       </button>
                    )}
                 </div>

                 <button 
                   type="submit"
                   className="w-full py-4 bg-slate-900 dark:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-xl hover:shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                 >
                   <Save size={16} /> Save to Waiting
                 </button>
              </form>
           </div>
        </div>

        {/* Right Panel: List & Folders */}
        <div className="flex-1 bg-slate-50 dark:bg-black/20 flex flex-col overflow-hidden relative z-10">
           <div className="p-6 md:p-8 border-b border-orange-100 dark:border-white/5 bg-white dark:bg-[#251818] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                 <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Task Manager</h2>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workflow Folders</p>
              </div>
              
              {/* Folder Tabs */}
              <div className="flex items-center p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl self-start md:self-auto flex-wrap">
                 <button 
                   onClick={() => setActiveTab('waiting')}
                   className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'waiting' ? 'bg-white dark:bg-[#1a0f0f] text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                 >
                   <Clock size={14} /> Waiting
                 </button>
                 <button 
                   onClick={() => setActiveTab('out')}
                   className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'out' ? 'bg-white dark:bg-[#1a0f0f] text-blue-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                 >
                   <ArrowRightCircle size={14} /> Out
                 </button>
                 <button 
                   onClick={() => setActiveTab('in')}
                   className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'in' ? 'bg-white dark:bg-[#1a0f0f] text-green-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                 >
                   <CheckCircle2 size={14} /> In
                 </button>
                 <button 
                   onClick={() => setActiveTab('trash')}
                   className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'trash' ? 'bg-white dark:bg-[#1a0f0f] text-red-600 shadow-sm' : 'text-slate-400 hover:text-red-500 dark:hover:text-red-400'}`}
                 >
                   <Trash2 size={14} /> Trash
                 </button>
              </div>

              <button onClick={onClose} className="absolute top-8 right-8 md:static p-2 text-slate-400 hover:text-orange-600 transition-colors bg-slate-50 dark:bg-white/5 rounded-xl"><X/></button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-8">
              {filteredEntries.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center opacity-40">
                    <FolderOpen size={64} className="mb-4 text-slate-300 dark:text-white/20"/>
                    <p className="font-bold text-slate-400 uppercase tracking-widest">Folder is empty</p>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredEntries.map(entry => (
                       <div key={entry.id} className="bg-white dark:bg-[#251818] rounded-3xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                          {entry.photo ? (
                             <div className="h-40 bg-slate-100 dark:bg-white/5 relative overflow-hidden shrink-0">
                                <img src={entry.photo} alt="Entry" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-2 right-2 p-1 bg-black/50 backdrop-blur rounded-lg">
                                   <ImageIcon size={14} className="text-white" />
                                </div>
                             </div>
                          ) : (
                             <div className="h-24 bg-gradient-to-br from-slate-50 to-white dark:from-white/5 dark:to-transparent flex items-center justify-center border-b border-slate-50 dark:border-white/5 shrink-0">
                                <Hash size={24} className="text-slate-200 dark:text-white/10" />
                             </div>
                          )}
                          
                          <div className="p-5 flex-1 flex flex-col">
                             <div className="flex items-start justify-between mb-3">
                                <div>
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">DI Number</span>
                                   <h3 className="text-lg font-black text-slate-800 dark:text-white">{entry.diNumber}</h3>
                                </div>
                                <div className="text-right">
                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Date</span>
                                   <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                                      {new Date(entry.date).toLocaleDateString()}
                                   </span>
                                </div>
                             </div>
                             
                             {entry.details && (
                                <div className="mb-4 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 flex-1">
                                   <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-2">{entry.details}</p>
                                </div>
                             )}
                             
                             <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-50 dark:border-white/5">
                                <div className="flex gap-2">
                                  {activeTab !== 'trash' && (
                                      <button 
                                        onClick={() => setEditingEntry(entry)}
                                        className="text-slate-400 hover:text-blue-500 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        title="Edit Entry"
                                      >
                                         <Edit size={16} />
                                      </button>
                                  )}
                                  
                                  {activeTab === 'trash' ? (
                                    <>
                                        <button 
                                            onClick={() => handleMoveStatus(entry.id, 'waiting')}
                                            className="text-slate-400 hover:text-green-500 p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                            title="Restore"
                                        >
                                            <RotateCcw size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(entry)}
                                            className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                                            title="Delete Permanently"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                  ) : (
                                      <button 
                                        onClick={() => handleDelete(entry)}
                                        className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                                        title="Move to Trash"
                                      >
                                         <Trash2 size={16} />
                                      </button>
                                  )}
                                </div>

                                {activeTab === 'waiting' && (
                                    <button 
                                        onClick={() => handleMoveStatus(entry.id, 'out')}
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        To Out <ArrowRightCircle size={14}/>
                                    </button>
                                )}
                                {activeTab === 'out' && (
                                    <button 
                                        onClick={() => handleMoveStatus(entry.id, 'in')}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-green-600/20"
                                    >
                                        To In <CheckCircle2 size={14}/>
                                    </button>
                                )}
                                {activeTab === 'in' && (
                                     <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[9px] font-black uppercase tracking-widest rounded-lg">
                                        Completed
                                     </span>
                                )}
                                {activeTab === 'trash' && (
                                    <span className="px-3 py-1.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-[9px] font-black uppercase tracking-widest rounded-lg">
                                        Removed
                                    </span>
                                )}
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        </div>
      </div>
      
      {editingEntry && (
        <EditDaiEntryModal 
            entry={editingEntry} 
            onClose={() => setEditingEntry(null)} 
            onSave={handleUpdateEntry} 
        />
      )}
    </div>
  );
};

interface EditDaiEntryModalProps {
  entry: DaiEntry;
  onClose: () => void;
  onSave: (entry: DaiEntry) => void;
}

const EditDaiEntryModal: React.FC<EditDaiEntryModalProps> = ({ entry, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    diNumber: entry.diNumber,
    date: entry.date,
    details: entry.details,
    photo: entry.photo || ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...entry,
      ...formData
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

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-[#251818] rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Edit Task</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Update task details</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-orange-600 transition-colors"><X/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <form id="edit-dai-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">DI Number</label>
                <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                    <input 
                        required
                        type="text" 
                        value={formData.diNumber}
                        onChange={(e) => setFormData({...formData, diNumber: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:border-orange-500 font-bold text-slate-800 dark:text-white"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Date</label>
                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                    <input 
                        required
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:border-orange-500 font-bold text-slate-800 dark:text-white uppercase"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Details / Others</label>
                <div className="relative">
                    <FileText className="absolute left-4 top-4 text-orange-400" size={18} />
                    <textarea 
                        rows={3}
                        value={formData.details}
                        onChange={(e) => setFormData({...formData, details: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:border-orange-500 font-medium text-slate-800 dark:text-white resize-none"
                    />
                </div>
            </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Attachment</label>
                <div className="flex items-center gap-4 pl-1 pt-2">
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     className="hidden" 
                     accept="image/*"
                     onChange={handlePhotoUpload}
                   />
                   
                   {formData.photo ? (
                     <div className="flex items-center gap-4 w-full">
                       <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-orange-200 dark:border-white/10 group shadow-sm shrink-0">
                         <img src={formData.photo} className="w-full h-full object-cover" alt="Preview" />
                         <button 
                           type="button"
                           onClick={() => setFormData({...formData, photo: ''})}
                           className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                         >
                           <X size={14} />
                         </button>
                       </div>
                       <div className="text-xs flex-1">
                          <p className="font-bold text-green-600 dark:text-green-400 flex items-center gap-1 mb-2"><ImageIcon size={12}/> Photo Attached</p>
                          <div className="flex gap-3">
                             <button type="button" className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-colors" onClick={() => fileInputRef.current?.click()}>Change</button>
                             <button type="button" className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500 font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors" onClick={() => setFormData({...formData, photo: ''})}>Remove</button>
                          </div>
                       </div>
                     </div>
                   ) : (
                     <button 
                       type="button"
                       onClick={() => fileInputRef.current?.click()}
                       className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-300 dark:border-white/20 text-slate-500 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-white/10 transition-colors group"
                     >
                       <Camera size={16} className="group-hover:text-orange-500 transition-colors" />
                       <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-orange-600 transition-colors">Attach New Photo</span>
                     </button>
                   )}
                </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-white/5 shrink-0">
          <button
            form="edit-dai-form"
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
