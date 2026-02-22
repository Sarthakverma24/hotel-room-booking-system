import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

interface RevenueCatContextType {
  customerInfo: CustomerInfo | null;
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  checkPremiumAccess: () => boolean;
}

const RevenueCatContext = createContext<RevenueCatContextType | null>(null);

const API_KEYS = {
  ios: 'appl_your_key',
  android: 'goog_your_key',
};

export const RevenueCatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  useEffect(() => {
    const apiKey = Platform.select({ ios: API_KEYS.ios, android: API_KEYS.android, default: API_KEYS.android });
    Purchases.configure({ apiKey: apiKey! });
    Purchases.getCustomerInfo().then(setCustomerInfo);
  }, []);

  const purchasePackage = async (pkg: PurchasesPackage): Promise<boolean> => {
    try {
      const { customerInfo: newInfo } = await Purchases.purchasePackage(pkg);
      setCustomerInfo(newInfo);
      return true;
    } catch (error: any) {
      if (!error.userCancelled) throw error;
      return false;
    }
  };

  const checkPremiumAccess = (): boolean => {
    return !!customerInfo?.entitlements.active['premium_seller'];
  };

  return (
    <RevenueCatContext.Provider value={{ customerInfo, purchasePackage, checkPremiumAccess }}>
      {children}
    </RevenueCatContext.Provider>
  );
};

export const useRevenueCat = () => {
  const context = useContext(RevenueCatContext);
  if (!context) throw new Error('useRevenueCat must be used within RevenueCatProvider');
  return context;
};
