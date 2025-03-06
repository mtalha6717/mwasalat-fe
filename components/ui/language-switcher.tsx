'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  return (
    <Card 
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 cursor-pointer overflow-hidden w-16 shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex flex-col">
        <div className={`py-2 px-4 text-center ${i18n.language === 'en' ? 'bg-yellow-200 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
          EN
        </div>
        <div className={`py-2 px-4 text-center ${i18n.language === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
          عربي
        </div>
      </div>
    </Card>
  );
}