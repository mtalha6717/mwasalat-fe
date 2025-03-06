'use client';

import { CardFooter } from '@/components/ui/card';

import { useState, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapComponent } from './map-component';
import { UniversityCombobox } from './university-combobox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import apiPost from '@/lib/network/apiPost';
import { toast, useToast } from './hooks/use-toast';

// Sample list of colleges/universities
const universities = [
  'Harvard University',
  'Stanford University',
  'Massachusetts Institute of Technology',
  'University of California, Berkeley',
  'University of Oxford',
  'University of Cambridge',
  'California Institute of Technology',
  'Princeton University',
  'Yale University',
  'Columbia University',
  'University of Chicago',
  'University of Michigan',
  'Cornell University',
  'University of Pennsylvania',
  'Johns Hopkins University',
];

// Form validation schema
const formSchema = yup.object({
  description: yup.string().required('Description is required'),
  college: yup.string().required('College/University is required'),
  name: yup.string().required('Name is required'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^(\+968[- ]?)?(9\d{2}[- ]?\d{3}[- ]?\d{2}|(2|4|5)\d{2}[- ]?\d{3}[- ]?\d{2})$/,
      'Please enter a valid Omani phone number'
    ),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  location: yup
    .object({
      lat: yup.number().required(),
      lng: yup.number().required(),
    })
    .required('Location is required'),
  address: yup.string(),
});

type FormValues = yup.InferType<typeof formSchema>;

export default function FascinatingForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState('');

  const form = useForm<FormValues>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      description: '',
      college: '',
      phone: '',
      email: '',
      name: '',
      location: { lat: 0, lng: 0 },
      address: '',
    },
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  useEffect(() => {
    // Get current location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          form.setValue('location', newLocation);
        },
        () => {
          console.error('Error getting current location');
          // Default to a fallback location if geolocation fails
          const fallbackLocation = { lat: 40.7128, lng: -74.006 }; // New York City
          setLocation(fallbackLocation);
          form.setValue('location', fallbackLocation);
        }
      );
    }
  }, [form]);

  const handleLocationSelect = (
    newLocation: { lat: number; lng: number },
    newAddress: string
  ) => {
    setLocation(newLocation);
    setAddress(newAddress);
    form.setValue('location', newLocation);
    form.setValue('address', newAddress);
  };

  const onSubmit = async (data: FormValues) => {
    const { location, ...rest } = data;
    setIsSubmitting(true);
    const {
      success,
      data: response,
      message,
    } = await apiPost('forms', {
      ...rest,
      userLatitude: location?.lat,
      userLongitude: location?.lng,
    });

    if (success) {
      toast({
        title: 'Information submitted successfully',
        description: response?.isEmailSent
          ? "We've sent a confirmation email to your email address."
          : 'Thank you for submitting your information.',
      });
      form.reset();
    } else {
      toast({
        title: 'Something went wrong',
        description:
          message || "We couldn't submit your information. Please try again.",
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-4xl shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <CardTitle className="text-2xl md:text-3xl font-bold">
            Registration Form
          </CardTitle>
          <CardDescription className="text-purple-100">
            Please fill out all the required information below
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-6 p-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Name</FormLabel>
                    <FormControl>
                      <Input type="name" placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself..."
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="college"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">
                      College/University
                    </FormLabel>
                    <FormControl>
                      <UniversityCombobox
                        universities={universities}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+96896555067" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-lg font-medium">Location</Label>
                <div className="h-[300px] rounded-md overflow-hidden border">
                  {isLoaded ? (
                    <MapComponent
                      center={location}
                      onLocationSelect={handleLocationSelect}
                      currentAddress={address}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-100">
                      Loading map...
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Current coordinates: {location.lat.toFixed(6)},{' '}
                  {location.lng.toFixed(6)}
                </p>
                {address && (
                  <p className="text-sm text-gray-700 font-medium">
                    Selected address: {address}
                  </p>
                )}
                {form.formState.errors.location && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.location.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
