'use client';

import { useEffect, useState } from 'react';
import '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import { Loader2, LoaderIcon } from 'lucide-react';

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

    document.documentElement.lang = i18n.language;
    setTimeout(() => {
      setIsLoading(false);
    }, 0);
  }, [i18n.language]);

  return (
    <>
      {isLoading ? (
        <div className="min-h-screen overflow-auto flex justify-center items-center">
          <Loader2 className="h-20 w-20 text-[#A6001E] animate-spin" />
        </div>
      ) : (
        children
      )}
    </>
  );
}
