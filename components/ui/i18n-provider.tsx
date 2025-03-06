'use client';

import { useEffect } from 'react';
import '@/lib/i18n';
import { useTranslation } from 'react-i18next';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return <>{children}</>;
}
