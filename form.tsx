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
import { useToast } from './hooks/use-toast';

const universitiesWithCoordinates = [
  { label: 'Harvard University', lat: 42.374443, lon: -71.116943 },
  { label: 'Stanford University', lat: 37.42823, lon: -122.168861 },
  {
    label: 'Massachusetts Institute of Technology',
    lat: 42.360091,
    lon: -71.09416,
  },
  {
    label: 'University of California, Berkeley',
    lat: 37.871853,
    lon: -122.258423,
  },
  { label: 'University of Oxford', lat: 51.754816, lon: -1.254367 },
  { label: 'University of Cambridge', lat: 52.204267, lon: 0.114908 },
  {
    label: 'California Institute of Technology',
    lat: 34.137658,
    lon: -118.125269,
  },
  { label: 'Princeton University', lat: 40.343094, lon: -74.655073 },
  { label: 'Yale University', lat: 41.316324, lon: -72.922343 },
  { label: 'Columbia University', lat: 40.807536, lon: -73.962573 },
  { label: 'University of Chicago', lat: 41.788608, lon: -87.598713 },
  { label: 'University of Michigan', lat: 42.278044, lon: -83.738224 },
  { label: 'Cornell University', lat: 42.453449, lon: -76.473503 },
  { label: 'University of Pennsylvania', lat: 39.952219, lon: -75.193214 },
  { label: 'Johns Hopkins University', lat: 39.329901, lon: -76.620515 },
];

// Form validation schema
const formSchema = yup.object({
  college: yup.string().required('College/University is required'),
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
      college: '',
      phone: '',
      email: '',
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
    const college = universitiesWithCoordinates.find(
      (item) => item.label === rest.college
    );
    const {
      success,
      data: response,
      message,
    } = await apiPost('forms', {
      ...rest,
      userLatitude: location?.lat,
      userLongitude: location?.lng,
      collegeLatitude: college?.lat,
      collegeLongitude: college?.lon,
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
                name="college"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">
                      College/University
                    </FormLabel>
                    <FormControl>
                      <UniversityCombobox
                        universities={universitiesWithCoordinates?.map(
                          (university) => university.label
                        )}
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
