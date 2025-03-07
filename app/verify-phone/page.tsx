'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Loader2, AlertCircle, Phone } from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import apiPost from '@/lib/network/apiPost';

export default function ConfirmationPage() {
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const [otp, setOtp] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<
    'initial' | 'pending' | 'verified' | 'error'
  >('initial');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const verifyOTP = async () => {
    if (otp.length !== 4) {
      toast({
        title: t('verification.toast.invalidTitle'),
        description: t('verification.toast.invalidDescription'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    setVerificationStatus('pending');

    try {
      const { success, message, err } = await apiPost('verify-otp', {
        otp,
        phone,
      });

      setVerificationStatus(success ? 'verified' : 'error');

      if (!success) {
        toast({
          title: message || t('verification.toast.failedTitle'),
          description: err || t('verification.toast.failedDescription'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      setVerificationStatus('error');
      toast({
        title: t('verification.toast.errorTitle'),
        description: t('verification.toast.errorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOTP = async () => {
    if (!phone) {
      return;
    }

    setIsResending(true);

    try {
      const { success, message, err } = await apiPost('resend-otp', {
        phone,
      });

      if (success) {
        toast({
          title: t('verification.toast.codeResendTitle'),
          description: t('verification.toast.codeResendTitle', { phone }),
          variant: 'default',
        });
      }

      if (!success) {
        toast({
          title: t('verification.toast.codeResendTitle'),
          description:
            message || t('verification.toast.errorCodeResendDescription'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: t('verification.toast.codeResendTitle'),
        description: t('verification.toast.errorCodeResendDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8 flex items-center justify-center`}
    >
      <LanguageSwitcher />
      <Card className="w-full max-w-md shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-b from-[#A6001E] to-[#A6001E]/50 text-white">
          <CardTitle className="text-2xl md:text-3xl font-bold">
            {t('verification.title')}
          </CardTitle>
          <CardDescription className="text-purple-100">
            {verificationStatus === 'initial'
              ? t('verification.description.initial')
              : verificationStatus === 'pending'
              ? t('verification.description.pending')
              : verificationStatus === 'verified'
              ? t('verification.description.phoneVerified')
              : t('verification.description.phoneError')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
          {(verificationStatus === 'initial' ||
            verificationStatus === 'error' ||
            verificationStatus === 'pending') && (
            <>
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#A6001E]/30">
                {verificationStatus === 'pending' ? (
                  <Loader2 className="h-10 w-10 text-[#A6001E] animate-spin" />
                ) : (
                  <Phone className="h-10 w-10 text-[#A6001E]" />
                )}
              </div>
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold mb-2">
                  {t('verification.enterCode')}
                </h3>
                <p className="text-gray-500 mb-4">
                  {t('verification.codeSent')}{' '}
                  <span className="font-medium">{phone}</span>
                </p>
                <InputOTP
                  maxLength={4}
                  value={otp}
                  onChange={setOtp}
                  disabled={isSubmitting || isResending}
                  containerClassName="justify-center force-ltr"
                  dir="ltr"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={verifyOTP}
                className="w-full bg-[#A6001E] hover:bg-[#8e0019]"
                disabled={
                  otp.length !== 4 || isSubmitting || !phone || isResending
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('verification.verifying')}
                  </>
                ) : (
                  t('verification.verify')
                )}
              </Button>

              {phone && (
                <p className="text-sm text-gray-500">
                  {t('verification.noCode')}{' '}
                  <button
                    onClick={() => resendOTP()}
                    disabled={isResending}
                    className="text-[#A6001E] font-medium"
                  >
                    {t(
                      isResending
                        ? 'Sending verification code...'
                        : 'verification.resend'
                    )}
                  </button>
                </p>
              )}
            </>
          )}

          {verificationStatus === 'verified' && (
            <>
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  {t('verification.phoneVerified')}
                </h3>
                <p className="text-gray-500">
                  {t('verification.phoneSuccessMessage')}{' '}
                  <span className="font-medium">{phone}</span>{' '}
                  {t('verification.successMessageEnd')}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
