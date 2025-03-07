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
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './components/ui/language-switcher';
import { universitiesData } from './lib/common';

export default function FascinatingForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState('');

  // Get universities in the current language
  const [universities, setUniversities] = useState<
    Array<{ label: string; lat: number; lon: number }>
  >([]);

  // Update universities list when language changes
  useEffect(() => {
    const currentLanguage = i18n.language;
    const languageKey = currentLanguage === 'ar' ? 'ar' : 'en';

    const translatedUniversities = universitiesData.map((uni) => ({
      label: uni[languageKey],
      lat: uni.lat,
      lon: uni.lon,
    }));

    setUniversities(translatedUniversities);
  }, [i18n.language]);

  // Form validation schema with translations
  const formSchema = yup.object({
    college: yup.string().required(t('form.validation.collegeRequired')),
    phone: yup
      .string()
      .required(t('form.validation.phoneRequired'))
      .matches(
        /^(\+968)?(9\d{7}|(2|4|5)\d{7})$/,
        t('form.validation.phoneInvalid')
      ),
    email: yup
      .string()
      .required(t('form.validation.emailRequired'))
      .email(t('form.validation.emailInvalid')),
    location: yup
      .object({
        lat: yup.number().required(),
        lng: yup.number().required(),
      })
      .required(t('form.validation.locationRequired')),
    address: yup.string(),
  });

  type FormValues = yup.InferType<typeof formSchema>;

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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          form.setValue('location', newLocation);

          if (isLoaded) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: newLocation }, (results, status) => {
              if (status === 'OK' && results && results[0]) {
                const newAddress = results[0].formatted_address;
                setAddress(newAddress);
                form.setValue('address', newAddress);
              } else {
                console.error('Geocoder failed due to: ' + status);
                toast({
                  title: 'Address Lookup Failed',
                  description: t('form.messages.addressLookupFailed'),
                  variant: 'destructive',
                });
              }
            });
          }
        },
        () => {
          console.error('Error getting current location');
          toast({
            title: 'Location Error',
            description: t('form.messages.locationError'),
            variant: 'destructive',
          });

          // Fallback location
          const fallbackLocation = { lat: 23.588, lng: 58.3829 }; // Muscat, Oman
          setLocation(fallbackLocation);
          form.setValue('location', fallbackLocation);
        }
      );
    } else {
      toast({
        title: 'Geolocation Not Supported',
        description: t('form.messages.geolocationNotSupported'),
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    form.reset(form.getValues());
  }, [i18n.language, form]);

  const handleLocationSelect = (
    newLocation: { lat: number; lng: number },
    newAddress: string
  ) => {
    setLocation(newLocation);
    setAddress(newAddress);
    form.setValue('location', newLocation);
    form.setValue('address', newAddress);
  };

  const findCollegeCoordinates = (collegeName: string) => {
    const currentLanguage = i18n.language;
    const languageKey = currentLanguage === 'ar' ? 'ar' : 'en';

    const college = universitiesData.find(
      (uni) => uni[languageKey] === collegeName
    );

    return college ? { lat: college.lat, lon: college.lon } : null;
  };

  const onSubmit = async (data: FormValues) => {
    const { location, ...rest } = data;
    setIsSubmitting(true);

    const collegeCoords = findCollegeCoordinates(rest.college);

    const {
      success,
      data: response,
      message,
    } = await apiPost('forms', {
      ...rest,
      userLatitude: location?.lat,
      userLongitude: location?.lng,
      collegeLatitude: collegeCoords?.lat,
      collegeLongitude: collegeCoords?.lon,
    });

    if (success) {
      toast({
        title: t('form.toast.successTitle'),
        description: t('form.toast.successEmail'),
      });
      form.reset();
      router.push('/verify-phone?phone=' + encodeURIComponent(rest.phone));
    } else {
      toast({
        title: t('form.toast.errorTitle'),
        description: message || t('form.toast.errorDefault'),
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  const directionClass = i18n.language === 'ar' ? 'rtl-form' : '';
  const isArabic = i18n.language === 'ar';

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8 flex items-center justify-center ${directionClass}`}
    >
      <LanguageSwitcher />

      <Card className="w-full max-w-4xl shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-b from-[#A6001E] to-[#A6001E]/50 text-white">
          <CardTitle className="text-xl md:text-xl font-bold">
            {t('form.title')}
          </CardTitle>
          <CardDescription className="text-purple-100">
            <p className="mb-2">{t('form.subTitle')}</p>
            <p className="mb-1">{t('form.description')}</p>
            <p>{t('form.subDescription')}</p>
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
                      {t('form.college')}
                    </FormLabel>
                    <FormControl>
                      <UniversityCombobox
                        universities={universities.map(
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
                        {t('form.phone')}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={t('form.phoneFormat')} {...field} />
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
                        {t('form.email')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t('form.emailFormat')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                {isArabic ? (
                  <div className="flex justify-between items-center">
                    <Button
                      type="button"
                      onClick={getCurrentLocation}
                      className="flex items-center gap-1 bg-[#A6001E] border-[#A6001E] text-white hover:bg-[#8A0017]"
                    >
                      <MapPin size={16} />
                      <span>{t('form.locateMe')}</span>
                    </Button>
                    <Label className="text-lg font-medium">
                      {t('form.location')}
                    </Label>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-medium">
                      {t('form.location')}
                    </Label>
                    <Button
                      type="button"
                      onClick={getCurrentLocation}
                      className="flex items-center gap-1 bg-[#A6001E] border-[#A6001E] text-white hover:bg-[#8A0017]"
                    >
                      <MapPin size={16} />
                      <span>{t('form.locateMe')}</span>
                    </Button>
                  </div>
                )}
                <div className="h-[300px] rounded-md overflow-hidden border">
                  {isLoaded ? (
                    <MapComponent
                      center={location}
                      onLocationSelect={handleLocationSelect}
                      currentAddress={address}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-100">
                      {t('form.loadingMap')}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {t('form.coordinates')}: {location.lat.toFixed(6)},{' '}
                  {location.lng.toFixed(6)}
                </p>
                {address && (
                  <p className="text-sm text-gray-700 font-medium">
                    {t('form.selectedAddress')}: {address}
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
                className="w-full bg-[#A6001E] hover:bg-[#8A0017] text-white font-medium py-2"
              >
                {isSubmitting ? t('form.submitting') : t('form.submit')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
