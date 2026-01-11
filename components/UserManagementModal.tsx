
import React, { useState, useRef } from 'react';
import { X, Camera, Save, Trash2, Plus, User as UserIcon, Mail, Phone, MapPin, Edit2 } from 'lucide-react';
import { User } from '../types';

interface UserManagementModalProps {
  users: User[];
  setUsers: (users: User[]) => void;
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  onClose: () => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  users, setUsers, currentUserId, setCurrentUserId, onClose
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeUsers = users.filter(u => !u.isDeleted);

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({ ...user });
  };

  const startNew = () => {
    setEditingId('new');
    setFormData({ name: '', photo: '', phone: '', address: '', email: '' });
  };

  const handleSave = () => {
    if (!formData.name) return;

    if (editingId === 'new') {
      const newUser: User = {
        id: crypto.randomUUID(),
        name: formData.name,
        photo: formData.photo,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
        isDeleted: false
      };
      setUsers([...users, newUser]);
      // Switch to the new user immediately
      setCurrentUserId(newUser.id);
    } else {
      setUsers(users.map(u => u.id === editingId ? { ...u, ...formData } as User : u));
    }
    setEditingId(null);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (activeUsers.length <= 1) {
      alert("Cannot delete the last active user.");
      return;
    }
    
    // Soft Delete: Mark as deleted instead of removing
    const updatedUsers = users.map(u => u.id === id ? { ...u, isDeleted: true } : u);
    setUsers(updatedUsers);
    
    // If deleted user was current, switch to first available active user
    if (currentUserId === id) {
      const remaining = updatedUsers.filter(u => !u.isDeleted);
      if (remaining.length > 0) {
          setCurrentUserId(remaining[0].id);
      }
    }

    if (editingId === id) {
      setEditingId(null);
      setFormData({});
    }
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#251818] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Sidebar: User List */}
        <div className="w-full md:w-1/3 bg-slate-50 dark:bg-white/5 border-r border-slate-100 dark:border-white/5 flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
             <div>
               <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-sm">Master User List</h3>
               <p className="text-[10px] font-bold text-slate-400">Select to edit details</p>
             </div>
             <button onClick={startNew} className="p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-500 transition-colors shadow-lg shadow-orange-500/20">
               <Plus size={18} />
             </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeUsers.map(user => (
              <div 
                key={user.id} 
                onClick={() => startEdit(user)}
                className={`group relative p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border ${editingId === user.id ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-200' : 'bg-white dark:bg-white/5 border-transparent hover:border-orange-200 shadow-sm'}`}
              >
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden shrink-0 flex items-center justify-center border-2 border-white dark:border-transparent shadow-md">
                  {user.photo ? <img src={user.photo} alt={user.name} className="w-full h-full object-cover" /> : <UserIcon size={20} className="text-slate-400" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{user.name}</p>
                  <p className="text-[10px] font-medium text-slate-500 truncate">{user.phone || 'No Contact Number'}</p>
                </div>
                
                {/* List Actions */}
                <div className="hidden group-hover:flex items-center gap-1 absolute right-2 bg-white/90 dark:bg-slate-800/90 p-1 rounded-lg backdrop-blur shadow-sm">
                   <button 
                     onClick={(e) => { e.stopPropagation(); startEdit(user); }}
                     className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                   >
                     <Edit2 size={14}/>
                   </button>
                   {activeUsers.length > 1 && (
                     <button 
                       onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}
                       className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                       title="Move to Recycle Bin"
                     >
                       <Trash2 size={14}/>
                     </button>
                   )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Edit Form */}
        <div className="flex-1 flex flex-col p-8 overflow-y-auto bg-white dark:bg-[#251818]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                {editingId === 'new' ? 'Create User Profile' : editingId ? 'Edit Profile Details' : 'Master User Section'}
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                {editingId ? 'Manage user information & permissions' : 'Select a user from the list to begin'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-white/5 rounded-full transition-all"><X/></button>
          </div>

          {editingId ? (
            <div className="space-y-8 max-w-xl mx-auto w-full">
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-32 h-32 rounded-full bg-slate-50 dark:bg-white/5 border-4 border-white dark:border-[#2a1b1b] shadow-2xl overflow-hidden flex items-center justify-center">
                    {formData.photo ? (
                      <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={48} className="text-slate-300" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                    <Camera className="text-white drop-shadow-lg" size={24} />
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">Click to Upload Photo</p>
              </div>

              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">User Name</label>
                  <input 
                    type="text" 
                    value={formData.name || ''} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:border-orange-500 font-bold transition-all"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                      <input 
                        type="email" 
                        value={formData.email || ''} 
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-10 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:border-orange-500 font-bold transition-all"
                        placeholder="user@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                      <input 
                        type="tel" 
                        value={formData.phone || ''} 
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-10 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:border-orange-500 font-bold transition-all"
                        placeholder="Contact Number"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Address</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input 
                      type="text" 
                      value={formData.address || ''} 
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="w-full pl-10 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:border-orange-500 font-bold transition-all"
                      placeholder="Street, City, Zip Code"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 mt-auto">
                 {editingId !== 'new' && (
                   <button onClick={() => handleDelete(editingId)} className="flex-1 bg-red-50 text-red-600 dark:bg-red-950/30 font-black p-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                     <Trash2 size={18} /> Delete
                   </button>
                 )}
                 <button onClick={handleSave} className="flex-[2] bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black p-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95">
                   <Save size={18} /> {editingId === 'new' ? 'Create User' : 'Save Changes'}
                 </button>
              </div>

            </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center opacity-40 text-center space-y-4">
                <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center border-4 border-dashed border-slate-200 dark:border-white/10">
                  <UserIcon size={40} className="text-slate-300"/>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-700 dark:text-slate-300">No User Selected</h3>
                  <p className="text-sm text-slate-400">Choose a profile from the left to edit or create a new one.</p>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
