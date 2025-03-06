'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, Mail, Loader2 } from 'lucide-react';

import apiGet from '@/lib/network/apiGet';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/ui/language-switcher';

export default function ConfirmationPage() {
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();
  const hasMounted = useRef(false);
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';
  const [verificationStatus, setVerificationStatus] = useState<
    'pending' | 'verified' | 'error'
  >('pending');

  const verifyEmail = async () => {
    try {
      const { success, message, err } = await apiGet('verify-email', {
        token,
        email,
      });
      setVerificationStatus(success ? 'verified' : 'error');
      if (!success) {
        toast({
          title: message,
          description:
            err ||
            t('verification.toast.errorDescription'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      setVerificationStatus('error');
    }
  };

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      if (token && email) {
        verifyEmail();
      }
    }
  }, [token, email]);

  const directionClass = i18n.language === 'ar' ? 'rtl-form' : '';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8 flex items-center justify-center ${directionClass}`}>
      <LanguageSwitcher />
      
      <Card className="w-full max-w-md shadow-xl overflow-hidden">
        <CardHeader className="bg-[#A6001E] text-white">
          <CardTitle className="text-2xl md:text-3xl font-bold">
            {t('verification.emailTitle')}
          </CardTitle>
          <CardDescription className="text-purple-100">
            {verificationStatus === 'pending'
              ? t('verification.description.pendingEmail')
              : verificationStatus === 'verified'
              ? t('verification.description.verified')
              : t('verification.description.error')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
          {verificationStatus === 'pending' && (
            <>
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  {t('verification.verifyingEmail')}
                </h3>
                <p className="text-gray-500">
                  {t('verification.verifyingWait')}{' '}
                  <span className="font-medium">{email}</span>
                </p>
              </div>
            </>
          )}

          {verificationStatus === 'verified' && (
            <>
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">{t('verification.verified')}</h3>
                <p className="text-gray-500">
                  {t('verification.successMessage')}{' '}
                  <span className="font-medium">{email}</span> {t('verification.successMessageEnd')}
                </p>
              </div>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
                <Mail className="h-10 w-10 text-red-600" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  {t('verification.toast.failedTitle')}
                </h3>
                <p className="text-gray-500">
                  {t('verification.toast.errorDescription')}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
