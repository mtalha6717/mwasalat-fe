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
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Loader2, AlertCircle } from 'lucide-react';
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from '@/components/ui/input-otp';

import apiGet from '@/lib/network/apiGet';
import { useToast } from '@/hooks/use-toast';

export default function ConfirmationPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const [otp, setOtp] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<
    'initial' | 'pending' | 'verified' | 'error'
  >('initial');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 4-digit OTP code.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setVerificationStatus('pending');

    try {
      // Replace with your actual API endpoint for OTP verification
      const { success, message, err } = await apiGet('verify-otp', {
        otp,
        email,
      });
      
      setVerificationStatus(success ? 'verified' : 'error');
      
      if (!success) {
        toast({
          title: message || "Verification Failed",
          description: err || "The OTP code you entered is incorrect or expired. Please try again.",
          variant: 'destructive',
        });
      }
    } catch (error) {
      setVerificationStatus('error');
      toast({
        title: "Verification Error",
        description: "Something went wrong while verifying your code. Please try again.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl overflow-hidden">
        <CardHeader className="bg-[#A6001E] text-white">
          <CardTitle className="text-2xl md:text-3xl font-bold">
            Phone Verification
          </CardTitle>
          <CardDescription className="text-purple-100">
            {verificationStatus === 'initial' 
              ? "Enter the verification code sent to your phone"
              : verificationStatus === 'pending'
              ? "Verifying your code..."
              : verificationStatus === 'verified'
              ? 'Your email has been verified'
              : 'There was an issue verifying your phone'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
          {(verificationStatus === 'initial' || verificationStatus === 'error') && (
            <>
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100">
                <Mail className="h-10 w-10 text-indigo-600" />
              </div>
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold mb-2">
                  Enter Verification Code
                </h3>
                <p className="text-gray-500 mb-4">
                  We've sent a 4-digit verification code to:{' '}
                  <span className="font-medium">{phone}</span>
                </p>
                
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={isSubmitting}
                  containerClassName="justify-center"
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
                disabled={otp.length !== 6 || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Phone"
                )}
              </Button>
              
              <p className="text-sm text-gray-500">
                Didn't receive a code? <a href="#" className="text-[#A6001E] font-medium">Resend code</a>
              </p>
            </>
          )}

          {verificationStatus === 'pending' && (
            <>
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Verifying your code
                </h3>
                <p className="text-gray-500">
                  Please wait while we verify your information.
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
              <Button 
                className="w-full bg-[#A6001E] hover:bg-[#8e0019]"
                onClick={() => window.location.href = '/dashboard'}
              >
                Continue to Dashboard
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
