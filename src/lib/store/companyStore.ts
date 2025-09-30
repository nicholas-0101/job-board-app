import { create } from "zustand";

export interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  city:string;
  description: string;
  website: string;
  logo: string | null;
  adminId: number;
}

interface CompanyState {
  company: Company | null;
  setCompany: (c: Company | null) => void;
  clearCompany: () => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  company: null,
  setCompany: (company) => set({ company }),
  clearCompany: () => set({ company: null }),
}));