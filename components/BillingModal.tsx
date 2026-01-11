
import React, { useRef, useState } from 'react';
import { X, IndianRupee, Download, FileText, ChevronRight, User as UserIcon, Phone, Calendar, Printer, Mail, MapPin, Image as ImageIcon, File, Layers, Hash } from 'lucide-react';
import { User, InventoryEntry } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface BillingModalProps {
  user: User;
  entries: InventoryEntry[];
  totalWeight: number;
  billingRate?: number;
  onClose: () => void;
}

export const BillingModal: React.FC<BillingModalProps> = ({ user, entries, totalWeight, billingRate = 0, onClose }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [showPrintMenu, setShowPrintMenu] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const totalValue = totalWeight * billingRate;

  const handleExportCSV = () => {
    const headers = ['Date', 'ID Number', 'Category', 'Quantity', 'Weight (g)', 'Description'];
    const rows = entries.map(e => [
      e.date ? new Date(e.date).toLocaleDateString() : new Date(e.createdAt).toLocaleDateString(),
      e.invoiceNumber,
      e.category || '-',
      e.quantity || 1,
      e.weight.toFixed(2),
      `"${(e.description || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `billing_record_${user.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async (type: 'png' | 'pdf') => {
    if (!invoiceRef.current) return;
    setIsGenerating(true);
    setShowPrintMenu(false);

    try {
      // Clone the professional invoice template
      const original = invoiceRef.current;
      const clone = original.cloneNode(true) as HTMLElement;

      // Configure clone for capture (must be visible in DOM but off-screen)
      clone.style.display = 'block';
      clone.style.position = 'absolute';
      clone.style.top = '-10000px';
      clone.style.left = '0';
      clone.style.zIndex = '-1';
      clone.classList.remove('hidden'); // Ensure it's not hidden by class
      
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2, // High scale for crisp text
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        windowWidth: 1000 // Fix width to ensure consistent layout
      });

      document.body.removeChild(clone);

      const fileName = `Invoice_${user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;

      if (type === 'png') {
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Generate PDF matching the image dimensions (Long receipt style)
        const pdf = new jsPDF({
          orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
          unit: 'px',
          format: [imgWidth, imgHeight]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${fileName}.pdf`);
      }
    } catch (error) {
      console.error("Generation failed", error);
      alert("Failed to generate document. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md no-print" onClick={onClose} />
      
      {/* --- UI MODAL (Interactive View) --- */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#251818] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print-area">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shrink-0 relative">
          <div className="absolute top-8 right-8 z-10 no-print">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X/></button>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Billing Insight</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/10 rounded-full overflow-hidden border-2 border-white/20 flex items-center justify-center shrink-0">
                 {user.photo ? (
                   <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                 ) : (
                   <UserIcon size={32} className="text-white/50" />
                 )}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Account Holder</p>
                <h3 className="text-2xl font-black leading-none mb-2">{user.name}</h3>
                <div className="space-y-1">
                  {user.phone && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                      <Phone size={14} /> {user.phone}
                    </div>
                  )}
                  {user.email && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                      <Mail size={14} /> {user.email}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
               {billingRate > 0 && (
                <div className="text-right bg-white/5 p-4 rounded-2xl border border-white/10 min-w-[140px]">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Total Value</p>
                   <h3 className="text-3xl font-black text-green-400">₹{totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                </div>
               )}
               <div className="text-right bg-white/5 p-4 rounded-2xl border border-white/10 min-w-[140px]">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Total Weight</p>
                <h3 className="text-3xl font-black text-orange-500">{totalWeight.toFixed(2)}<span className="text-lg ml-1 opacity-50 text-white">g</span></h3>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50 dark:bg-white/5 print-expand">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Full Work Record</h4>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{entries.length} Entries Logged</span>
            </div>
            
            <div className="divide-y divide-slate-200 dark:divide-white/5 mb-6">
              {entries.map(e => (
                <div key={e.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs uppercase shadow-sm border border-slate-100 dark:border-white/5 shrink-0">
                      ID
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-slate-900 dark:text-white">{e.invoiceNumber}</span>
                        <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-200 text-[9px] font-black uppercase rounded">{e.category}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                         <Calendar size={10}/> {e.date ? new Date(e.date).toLocaleDateString() : new Date(e.createdAt).toLocaleDateString()}
                         <span className="w-1 h-1 bg-slate-300 rounded-full mx-1"></span>
                         {e.quantity || 1} {e.category === 'Earring' ? 'Prs' : 'Qty'}
                      </div>
                      {e.description && (
                        <p className="text-xs text-slate-500 mt-1 italic max-w-md">{e.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-black text-lg text-slate-800 dark:text-white">{e.weight.toFixed(2)}g</span>
                  </div>
                </div>
              ))}
              
              {entries.length === 0 && (
                 <div className="py-10 text-center text-slate-400 text-sm font-bold italic">No records found for this user.</div>
              )}
            </div>

            {/* Total Weight Bottom Summary */}
            {entries.length > 0 && (
              <div className="space-y-4">
                 <div className="p-6 bg-slate-900 dark:bg-black/30 rounded-3xl flex items-center justify-between border border-slate-800/50 dark:border-white/5 shadow-lg">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Total Weight Aggregate</span>
                  <span className="text-3xl font-black text-orange-500 flex items-baseline gap-1">
                     {totalWeight.toFixed(2)} <span className="text-sm font-bold text-white opacity-50">g</span>
                  </span>
                </div>
                
                {billingRate > 0 && (
                  <div className="p-6 bg-green-900/20 rounded-3xl flex items-center justify-between border border-green-900/10">
                    <div>
                      <span className="block text-green-700 dark:text-green-400 font-bold text-xs uppercase tracking-widest">Total Estimated Value</span>
                      <span className="block text-[10px] text-green-600/60 dark:text-green-400/50 font-medium">Based on rate {billingRate}/g</span>
                    </div>
                    <span className="text-3xl font-black text-green-600 dark:text-green-400 flex items-baseline gap-1">
                       ₹{totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-8 bg-white dark:bg-[#251818] border-t border-slate-100 dark:border-white/5 no-print shrink-0 relative">
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleExportCSV}
              disabled={entries.length === 0}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed p-5 rounded-2xl text-slate-700 dark:text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Download size={16}/> Export CSV
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowPrintMenu(!showPrintMenu)}
                disabled={entries.length === 0 || isGenerating}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed p-5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20"
              >
                {isGenerating ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <Printer size={16}/> Print / Download
                  </>
                )}
              </button>

              {/* Dropdown Menu */}
              {showPrintMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden z-20 animate-in fade-in slide-in-from-bottom-2">
                  <button 
                    onClick={() => handleDownload('png')}
                    className="w-full p-4 flex items-center gap-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-slate-100 dark:border-white/5"
                  >
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                      <ImageIcon size={16} />
                    </div>
                    <div>
                      <span className="block text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Download PNG</span>
                      <span className="block text-[10px] text-slate-400 font-bold">High Quality Image</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleDownload('pdf')}
                    className="w-full p-4 flex items-center gap-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                     <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg">
                      <File size={16} />
                    </div>
                    <div>
                      <span className="block text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Download PDF</span>
                      <span className="block text-[10px] text-slate-400 font-bold">Document Format</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- PROFESSIONAL INVOICE TEMPLATE (Hidden, used for Generation) --- */}
      <div className="hidden">
        <div ref={invoiceRef} className="w-[800px] bg-white text-slate-800 p-16 font-sans relative">
          
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-16 border-b border-slate-100 pb-12">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic">P</div>
                <div>
                   <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">PRO JEWELLERY</h1>
                   <p className="text-[10px] font-bold tracking-[0.3em] text-orange-600 uppercase">Gram Tracker Pro</p>
                </div>
              </div>
              <div className="text-xs text-slate-500 font-medium space-y-1">
                <p>Official Inventory Record</p>
                <p>License ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-5xl font-black text-slate-200 uppercase tracking-tighter mb-2">INVOICE</h2>
              <p className="font-bold text-slate-600">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {/* Client Details Section */}
          <div className="flex gap-10 items-start mb-16">
             <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
               {user.photo ? (
                 <img src={user.photo} className="w-full h-full object-cover" alt="User" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-300"><UserIcon size={32}/></div>
               )}
             </div>
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Billed To</p>
               <h3 className="text-3xl font-black text-slate-900 mb-4">{user.name}</h3>
               <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-600 font-medium">
                  {user.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-orange-500"/> {user.phone}</div>}
                  {user.email && <div className="flex items-center gap-2"><Mail size={14} className="text-orange-500"/> {user.email}</div>}
                  {user.address && <div className="flex items-center gap-2 col-span-2"><MapPin size={14} className="text-orange-500"/> {user.address}</div>}
               </div>
             </div>
          </div>

          {/* Records Table */}
          <table className="w-full mb-12">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">ID / Description</th>
                <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Date Recorded</th>
                <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Type / Qty</th>
                <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map(e => (
                <tr key={e.id} className="group">
                  <td className="py-4 align-top">
                    <div className="font-bold text-slate-800">{e.invoiceNumber}</div>
                    <div className="text-xs text-slate-500 mt-1 italic max-w-xs">{e.description}</div>
                  </td>
                  <td className="py-4 align-top text-sm font-medium text-slate-600">
                    {e.date ? new Date(e.date).toLocaleDateString() : new Date(e.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 align-top text-center">
                    <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                       <span className="text-[10px] font-bold text-slate-600 uppercase">{e.category}</span>
                       <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                       <span className="text-[10px] font-black text-slate-800">{e.quantity || 1}</span>
                    </div>
                  </td>
                  <td className="py-4 align-top text-right">
                    <span className="text-lg font-black text-slate-800">{e.weight.toFixed(2)}</span>
                    <span className="text-xs font-bold text-slate-400 ml-1">g</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Section */}
          <div className="flex justify-end mb-16">
            <div className="flex flex-col gap-4 min-w-[300px]">
              
              <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10"><IndianRupee size={80}/></div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-2">Total Billable Weight</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">{totalWeight.toFixed(2)}</span>
                    <span className="text-xl font-bold opacity-50">grams</span>
                 </div>
              </div>

              {billingRate > 0 && (
                <div className="bg-slate-100 text-slate-900 p-8 rounded-3xl relative overflow-hidden">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                     Total Value <span className="opacity-50">(Rate: {billingRate}/g)</span>
                   </p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-green-600">₹{totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 pt-8 flex items-center justify-between text-xs text-slate-400 font-medium uppercase tracking-wider">
             <span>Generated by Pro Jewellery Gram Tracker</span>
             <span>System Verified • {new Date().getFullYear()}</span>
          </div>

        </div>
      </div>
    </div>
  );
};
