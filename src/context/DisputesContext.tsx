import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Report = {
  id: string;
  shopId: number;
  reason: string;
  description: string;
  createdAt: string;
};

export type Dispute = {
  id: string;
  orderId: string;
  reason: string;
  description: string;
  status: 'Under Review' | 'Resolved' | 'Closed';
  createdAt: string;
};

type DisputesContextType = {
  reports: Report[];
  disputes: Dispute[];
  addReport: (report: Omit<Report, 'id' | 'createdAt'>) => void;
  addDispute: (dispute: Omit<Dispute, 'id' | 'createdAt' | 'status'>) => void;
};

const DisputesContext = createContext<DisputesContextType | undefined>(undefined);

export const DisputesProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const saved = localStorage.getItem('market_mirror_reports');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [disputes, setDisputes] = useState<Dispute[]>(() => {
    try {
      const saved = localStorage.getItem('market_mirror_disputes');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem('market_mirror_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('market_mirror_disputes', JSON.stringify(disputes));
  }, [disputes]);

  const addReport = (report: Omit<Report, 'id' | 'createdAt'>) => {
    setReports(prev => [{
      ...report,
      id: `rep-${Date.now()}`,
      createdAt: new Date().toISOString()
    }, ...prev]);
  };

  const addDispute = (dispute: Omit<Dispute, 'id' | 'createdAt' | 'status'>) => {
    setDisputes(prev => [{
      ...dispute,
      id: `disp-${Date.now()}`,
      status: 'Under Review',
      createdAt: new Date().toISOString()
    }, ...prev]);
  };

  return (
    <DisputesContext.Provider value={{ reports, disputes, addReport, addDispute }}>
      {children}
    </DisputesContext.Provider>
  );
};

export const useDisputes = () => {
  const context = useContext(DisputesContext);
  if (!context) throw new Error('useDisputes must be used within DisputesProvider');
  return context;
};
