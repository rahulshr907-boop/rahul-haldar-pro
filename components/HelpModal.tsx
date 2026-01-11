
import React, { useState, useRef, useEffect } from 'react';
import { X, Book, MousePointer, MessageCircle, Mail, UserCog, Camera } from 'lucide-react';

export const HelpModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [photo, setPhoto] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('app_help_photo');
    if (saved) setPhoto(saved);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhoto(result);
        localStorage.setItem('app_help_photo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#251818] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Help Center</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-orange-600 transition-colors"><X/></button>
        </div>
        
        <div className="p-10 flex-1 overflow-y-auto space-y-10">
          
          {/* Operator Information Section */}
          <section className="bg-slate-900 dark:bg-white/5 p-8 rounded-[2rem] text-white relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <UserCog size={140} />
             </div>
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-600 rounded-lg">
                    <UserCog size={18} className="text-white"/>
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-sm text-orange-100">System Operator</h3>
               </div>

               <div className="flex flex-col md:flex-row gap-6 mb-6">
                   <div className="flex-1">
                      <h4 className="text-2xl font-black uppercase tracking-tight text-white mb-1">Rahul Haldar</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Contact & Technical Lead</p>
                   </div>
                   
                   {/* Photo Upload */}
                   <div className="flex flex-col items-center md:items-end">
                       <div 
                           className="relative w-20 h-20 rounded-2xl bg-white/10 border border-white/10 overflow-hidden cursor-pointer group shadow-lg"
                           onClick={() => fileInputRef.current?.click()}
                       >
                           {photo ? (
                               <img src={photo} alt="Operator" className="w-full h-full object-cover" />
                           ) : (
                               <div className="w-full h-full flex items-center justify-center text-white/20">
                                   <UserCog size={32} />
                               </div>
                           )}
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                               <Camera className="text-white" size={18} />
                           </div>
                       </div>
                       <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                       <span className="mt-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest hover:text-orange-400 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                           Upload Photo
                       </span>
                   </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a href="https://wa.me/919332578394" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl hover:bg-white/20 transition-all border border-white/5">
                     <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center border border-[#25D366]/20">
                        <MessageCircle size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">WhatsApp</p>
                        <p className="text-sm font-black text-white">+91 93325 78394</p>
                     </div>
                  </a>
                  
                  <a href="mailto:rahulhaldar.in@gmail.com" className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl hover:bg-white/20 transition-all border border-white/5">
                     <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/20">
                        <Mail size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                        <p className="text-sm font-black text-white truncate">rahulhaldar.in@gmail.com</p>
                     </div>
                  </a>
               </div>
             </div>
          </section>

          <section>
            <h3 className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-widest mb-4">
              <Book size={14}/> Getting Started
            </h3>
            <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl space-y-4">
              <Step num="01" text="Select your profile from the dropdown at the top." />
              <Step num="02" text="Use the Entry tab to record invoice numbers and precise weight." />
              <Step num="03" text="View totals and historical logs in the Records Vault." />
            </div>
          </section>

          <section>
            <h3 className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-widest mb-4">
              <MousePointer size={14}/> Quick Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center justify-between hover:border-orange-200 transition-colors">
                <span className="text-xs font-bold text-slate-500">Vault View</span>
                <kbd className="bg-slate-200 dark:bg-white/10 px-2 py-1 rounded text-[10px] font-black text-slate-700 dark:text-white">CTRL + L</kbd>
              </div>
              <div className="p-4 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center justify-between hover:border-orange-200 transition-colors">
                <span className="text-xs font-bold text-slate-500">Quick Entry</span>
                <kbd className="bg-slate-200 dark:bg-white/10 px-2 py-1 rounded text-[10px] font-black text-slate-700 dark:text-white">CTRL + N</kbd>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

const Step = ({ num, text }: { num: string, text: string }) => (
  <div className="flex gap-4">
    <span className="text-orange-500 font-black text-xs">{num}</span>
    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{text}</p>
  </div>
);
