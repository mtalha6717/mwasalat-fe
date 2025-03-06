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

export default function ConfirmationPage() {
  const { toast } = useToast();
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
            'Something went wrong while verifying your email. Please try again.',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <CardTitle className="text-2xl md:text-3xl font-bold">
            Email Verification
          </CardTitle>
          <CardDescription className="text-purple-100">
            {verificationStatus === 'pending'
              ? "We're verifying your email address"
              : verificationStatus === 'verified'
              ? 'Your email has been verified'
              : 'There was an issue verifying your email'}
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
                  Verifying your email
                </h3>
                <p className="text-gray-500">
                  We're confirming the email address:{' '}
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
                <h3 className="text-xl font-semibold mb-2">Email Verified!</h3>
                <p className="text-gray-500">
                  Your email address{' '}
                  <span className="font-medium">{email}</span> has been
                  successfully verified.
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
                  Verification Failed
                </h3>
                <p className="text-gray-500">
                  We couldn't verify your email address. Please try again or
                  contact support.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
