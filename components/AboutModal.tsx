
import React, { useState, useEffect, useRef } from 'react';
import { X, User, Briefcase, Copyright, Camera } from 'lucide-react';

export const AboutModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [photo, setPhoto] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('app_about_photo');
    if (saved) setPhoto(saved);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhoto(result);
        localStorage.setItem('app_about_photo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-[#251818] rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
               <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">About</h2>
               <h2 className="text-xl font-black text-orange-600 uppercase tracking-tighter">PRO JEWELLERY</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-orange-600 transition-colors"><X/></button>
          </div>
          
          <div className="space-y-8">
            {/* Photo Upload Section */}
            <div className="flex flex-col items-center">
                <div 
                    className="relative w-28 h-28 rounded-full bg-slate-50 dark:bg-white/5 border-4 border-white dark:border-[#2a1b1b] shadow-xl overflow-hidden group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {photo ? (
                        <img src={photo} alt="About Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-white/20">
                            <User size={40} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                        <Camera className="text-white" size={20} />
                    </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                <span className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-orange-600" onClick={() => fileInputRef.current?.click()}>
                    {photo ? 'Change Photo' : 'Upload Photo'}
                </span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-center">
              <span className="text-orange-600 font-bold">PRO JEWELLERY</span> is a personal business platform owned by Dipen Chauhan. It is specifically designed to manage and track partnership-based jewelry work, professional billing, and digital records with accuracy and trust.
            </p>

            <div className="grid gap-4">
               <InfoCard 
                 icon={<User size={18} />} 
                 label="Owner" 
                 value="Dipen Chauhan" 
                 colorClass="bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
               />
               <InfoCard 
                 icon={<Briefcase size={18} />} 
                 label="Focus" 
                 value="Partnership Work Management" 
                 colorClass="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
               />
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-slate-400 mb-1">
                 <Copyright size={12} />
                 <span className="text-xs font-bold">2026 PRO JEWELLERY</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">All Rights Reserved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value, colorClass }: { icon: any, label: string, value: string, colorClass: string }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 transition-colors hover:border-orange-200 dark:hover:border-orange-500/30">
    <div className={`p-3 rounded-xl ${colorClass}`}>
       {icon}
    </div>
    <div>
       <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">{label}</h4>
       <p className="text-sm font-bold text-slate-800 dark:text-white">{value}</p>
    </div>
  </div>
);
