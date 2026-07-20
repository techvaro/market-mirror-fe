import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ShopApplication = {
  id: string;
  shopName: string;
  ownerName: string;
  phone: string;
  category: string;
  market: string;
  description: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  createdAt: string;
};

type VendorContextType = {
  applications: ShopApplication[];
  addApplication: (application: Omit<ShopApplication, 'id' | 'createdAt' | 'status'>) => void;
  latestApplication: ShopApplication | null;
};

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export const VendorProvider = ({ children }: { children: ReactNode }) => {
  const [applications, setApplications] = useState<ShopApplication[]>(() => {
    try {
      const saved = localStorage.getItem('market_mirror_vendor_applications');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem('market_mirror_vendor_applications', JSON.stringify(applications));
  }, [applications]);

  const addApplication = (application: Omit<ShopApplication, 'id' | 'createdAt' | 'status'>) => {
    setApplications(prev => [{
      ...application,
      id: `app-${Date.now()}`,
      status: 'Pending Review',
      createdAt: new Date().toISOString()
    }, ...prev]);
  };

  const latestApplication = applications[0] ?? null;

  return (
    <VendorContext.Provider value={{ applications, addApplication, latestApplication }}>
      {children}
    </VendorContext.Provider>
  );
};

export const useVendor = () => {
  const context = useContext(VendorContext);
  if (!context) throw new Error('useVendor must be used within VendorProvider');
  return context;
};
