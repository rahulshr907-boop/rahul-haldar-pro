
import React, { useState } from 'react';
import { Moon, Sun, User, Settings, Trash2, Info, HelpCircle, Phone, Menu, X, Users, Siren } from 'lucide-react';
import { Theme, AppSettings, User as UserType } from '../types';

interface HeaderProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  users: UserType[];
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  onAddUser: (name: string) => void;
  onUpdateUser: (u: UserType) => void;
  onViewTrash: () => void;
  trashCount: number;
  onSetView: (v: 'form' | 'list' | 'trash') => void;
  onShowOwnerDetails: () => void;
  onShowContact: () => void;
  onShowAbout: () => void;
  onShowHelp: () => void;
  onShowEmergency: () => void;
  onManageUsers: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme, setTheme, settings, users, currentUserId, setCurrentUserId, onAddUser, trashCount, onShowOwnerDetails, onShowContact, onShowAbout, onShowHelp, onShowEmergency, onViewTrash, onManageUsers
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeUser = users.find(u => u.id === currentUserId);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-orange-200/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="text-white font-black text-xl italic">P</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter">
              {settings.primaryTitle}
            </h1>
            <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">
              {settings.secondaryTitle}
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full border border-orange-200/50">
            <div className="w-8 h-8 rounded-full bg-orange-200 dark:bg-orange-800 overflow-hidden flex items-center justify-center">
               {activeUser?.photo ? <img src={activeUser.photo} alt="" className="w-full h-full object-cover"/> : <User size={16} className="text-orange-600 dark:text-orange-200"/>}
            </div>
            <select 
              value={currentUserId}
              onChange={(e) => setCurrentUserId(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-800 dark:text-orange-100 outline-none cursor-pointer min-w-[100px]"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <button onClick={onManageUsers} className="p-2 text-slate-600 dark:text-orange-200 hover:bg-orange-100 dark:hover:bg-white/10 rounded-xl transition-colors" title="Master User Panel">
            <Users size={20} />
          </button>

          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 text-slate-600 dark:text-orange-200 hover:bg-orange-100 dark:hover:bg-white/10 rounded-xl transition-colors">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <div className="h-6 w-px bg-slate-300 dark:bg-white/10 mx-2" />

          <nav className="flex items-center gap-1">
            <NavBtn icon={<Info size={18} />} onClick={onShowAbout} label="About" />
            
            <NavBtn 
                icon={
                    <div className="relative">
                        <Trash2 size={18} />
                        {trashCount > 0 && (
                           <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white border-2 border-white dark:border-[#1a0f0f]">
                             {trashCount}
                           </span>
                        )}
                    </div>
                } 
                onClick={onViewTrash} 
                label="Recycle Bin" 
            />

            <NavBtn icon={<Phone size={18} />} onClick={onShowContact} label="Contact" />
            <NavBtn icon={<HelpCircle size={18} />} onClick={onShowHelp} label="Help" />
            <NavBtn icon={<Siren size={18} />} onClick={onShowEmergency} label="Emergency" />
          </nav>
        </div>

        <button className="md:hidden p-2 text-slate-900 dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white dark:bg-slate-900 p-6 flex flex-col gap-4 border-b border-orange-100 shadow-xl">
          <div className="flex items-center justify-between">
             <span className="text-xs font-bold uppercase text-slate-400">Current Profile</span>
             <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="flex items-center gap-2 text-sm font-bold text-orange-600">
               {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
               {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
             </button>
          </div>
          <div className="flex items-center gap-2">
             <select 
                value={currentUserId}
                onChange={(e) => setCurrentUserId(e.target.value)}
                className="flex-1 p-4 bg-orange-50 dark:bg-white/5 rounded-2xl text-lg font-bold outline-none"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
            </select>
            <button onClick={onManageUsers} className="p-4 bg-slate-900 text-white rounded-2xl">
              <Users size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onShowAbout} className="p-4 bg-orange-50 dark:bg-white/5 rounded-2xl text-sm font-bold flex items-center gap-2"><Info size={16}/> About</button>
            <button onClick={onViewTrash} className="p-4 bg-orange-50 dark:bg-white/5 rounded-2xl text-sm font-bold flex items-center gap-2 text-slate-600 dark:text-slate-200">
                <Trash2 size={16}/> 
                <span>Recycle Bin</span>
                {trashCount > 0 && <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full">{trashCount}</span>}
            </button>
            <button onClick={onShowContact} className="p-4 bg-orange-50 dark:bg-white/5 rounded-2xl text-sm font-bold flex items-center gap-2"><Phone size={16}/> Contact</button>
            <button onClick={onShowHelp} className="p-4 bg-orange-50 dark:bg-white/5 rounded-2xl text-sm font-bold flex items-center gap-2"><HelpCircle size={16}/> Help</button>
            <button onClick={onShowEmergency} className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2 col-span-2 justify-center"><Siren size={16}/> Emergency Hub</button>
          </div>
        </div>
      )}
    </header>
  );
};

const NavBtn: React.FC<{ icon: React.ReactNode, onClick: () => void, label: string }> = ({ icon, onClick, label }) => (
  <button 
    onClick={onClick}
    className="group relative p-2 text-slate-600 dark:text-orange-200 hover:bg-orange-100 dark:hover:bg-white/10 rounded-xl transition-all"
  >
    {icon}
    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold uppercase tracking-widest whitespace-nowrap">
      {label}
    </span>
  </button>
);
