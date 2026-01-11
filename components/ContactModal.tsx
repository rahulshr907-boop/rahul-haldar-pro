
import React from 'react';
import { X, Phone, User, BadgeCheck } from 'lucide-react';

export const ContactModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const contacts = [
    { role: 'Owner', name: 'Dipen Chauhan', phone: '+917405636042' },
    { role: 'Craftsman', name: 'Abhijeet Koley', phone: '+918320184140' },
    { role: 'Data Entry Operator', name: 'Hetal Madam', phone: '+91 97238 91734' },
    { role: 'Co-worker', name: 'Nobo (Jamai Babu)', phone: '+918200280901' },
    { role: 'Operator', name: 'Rahul Haldar', phone: '+919332578394' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-[#251818] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Team Contact</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Direct Lines</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-white/5 rounded-full transition-all"><X/></button>
        </div>

        <div className="p-8 overflow-y-auto space-y-4">
          {contacts.map((contact, index) => (
             <div key={index} className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 hover:border-orange-200 dark:hover:border-orange-500/30 transition-all group">
                <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-orange-600 group-hover:scale-110 transition-all shadow-sm shrink-0 border border-slate-100 dark:border-transparent">
                   <Phone size={20} />
                </div>
                <div>
                   <div className="flex items-center gap-2 mb-0.5">
                     <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-md">{contact.role}</span>
                   </div>
                   <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-1">{contact.name}</h3>
                   <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center gap-2">
                     {contact.phone}
                   </a>
                </div>
             </div>
          ))}
        </div>

        <div className="p-6 bg-slate-900 dark:bg-black/40 text-center shrink-0 border-t border-slate-100 dark:border-white/5">
           <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">Pro Jewellery Official Directory</p>
        </div>
      </div>
    </div>
  );
};
