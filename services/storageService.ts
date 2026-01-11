
import { InventoryEntry, Note, EmergencyContact, DaiImage, DaiEntry } from '../types';

const STORAGE_KEYS = {
  ENTRIES: 'precision_entries',
  NOTES: 'precision_notes',
  RATES: 'precision_billing_rates',
  EMERGENCY: 'precision_emergency_contacts',
  DAI_IMAGES: 'precision_dai_images',
  DAI_ENTRIES: 'precision_dai_entries',
};

export const storageService = {
  getEntries: (): InventoryEntry[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    return saved ? JSON.parse(saved) : [];
  },

  saveEntries: (entries: InventoryEntry[]) => {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  },

  getNotes: (): Note[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
    return saved ? JSON.parse(saved) : [];
  },

  saveNotes: (notes: Note[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  getBillingRate: (userId: string): number => {
    const allRates = JSON.parse(localStorage.getItem(STORAGE_KEYS.RATES) || '{}');
    return Number(allRates[userId]) || 0;
  },

  saveBillingRate: (userId: string, rate: number) => {
    const allRates = JSON.parse(localStorage.getItem(STORAGE_KEYS.RATES) || '{}');
    allRates[userId] = rate;
    localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(allRates));
  },

  getEmergencyContacts: (): EmergencyContact[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMERGENCY);
    return saved ? JSON.parse(saved) : [];
  },

  saveEmergencyContacts: (contacts: EmergencyContact[]) => {
    localStorage.setItem(STORAGE_KEYS.EMERGENCY, JSON.stringify(contacts));
  },

  getDaiImages: (): DaiImage[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.DAI_IMAGES);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // Migration: Convert string[] to DaiImage[] if necessary
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
        return parsed.map((url: string) => ({
          id: crypto.randomUUID(),
          url,
          title: 'Untitled',
          timestamp: Date.now()
        }));
      }
      return parsed;
    } catch {
      return [];
    }
  },

  saveDaiImages: (images: DaiImage[]) => {
    localStorage.setItem(STORAGE_KEYS.DAI_IMAGES, JSON.stringify(images));
  },

  getDaiEntries: (): DaiEntry[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.DAI_ENTRIES);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    // Migration: Add status if missing
    return parsed.map((entry: any) => ({
      ...entry,
      status: entry.status || 'waiting'
    }));
  },

  saveDaiEntries: (entries: DaiEntry[]) => {
    localStorage.setItem(STORAGE_KEYS.DAI_ENTRIES, JSON.stringify(entries));
  }
};
