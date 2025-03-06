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

// Define university data with both English and Arabic names
const universitiesData = [
  { 
    en: "Sultan Qaboos University", 
    ar: "جامعة السلطان قابوس", 
    lat: 23.5957, 
    lon: 58.1778 
  },
  { 
    en: "Military Technical College", 
    ar: "الكلية التقنية العسكرية", 
    lat: 23.5923, 
    lon: 58.2843 
  },
  { 
    en: "College of Shariaa Science", 
    ar: "كلية العلوم الشرعية", 
    lat: 23.6127, 
    lon: 58.2111 
  },
  { 
    en: "Directorate of External Scholarships", 
    ar: "مديرية البعثات الخارجية", 
    lat: 23.5880, 
    lon: 58.2850 
  },
  { 
    en: "Directorate of Internal Scholarships", 
    ar: "مديرية البعثات الداخلية", 
    lat: 23.5890, 
    lon: 58.2855 
  },
  { 
    en: "A'Seeb Vocational College", 
    ar: "كلية السيب المهنية", 
    lat: 23.6703, 
    lon: 58.1889 
  },
  { 
    en: "Saham Vocational College", 
    ar: "كلية صحم المهنية", 
    lat: 24.1721, 
    lon: 56.8862 
  },
  { 
    en: "Ibri Vocational College", 
    ar: "كلية عبري المهنية", 
    lat: 23.2155, 
    lon: 56.5177 
  },
  { 
    en: "Sur Vocational College", 
    ar: "كلية صور المهنية", 
    lat: 22.5667, 
    lon: 59.5289 
  },
  { 
    en: "Shinas Vocational College", 
    ar: "كلية شناص المهنية", 
    lat: 24.7421, 
    lon: 56.4658 
  },
  { 
    en: "Al-Buraimi Vocational College", 
    ar: "كلية البريمي المهنية", 
    lat: 24.2516, 
    lon: 55.7529 
  },
  { 
    en: "Al-Khabourah Vocational College for Marine Sciences", 
    ar: "كلية الخابورة المهنية للعلوم البحرية", 
    lat: 23.9763, 
    lon: 57.0949 
  },
  { 
    en: "University of Technology and Applied Sciences - Rustaq", 
    ar: "جامعة التقنية والعلوم التطبيقية - الرستاق", 
    lat: 23.3907, 
    lon: 57.4244 
  },
  { 
    en: "University of Technology and Applied Sciences - Suhar", 
    ar: "جامعة التقنية والعلوم التطبيقية - صحار", 
    lat: 24.3473, 
    lon: 56.7456 
  },
  { 
    en: "University of Technology and Applied Sciences - Nizwa", 
    ar: "جامعة التقنية والعلوم التطبيقية - نزوى", 
    lat: 22.9333, 
    lon: 57.5333 
  },
  { 
    en: "University of Technology and Applied Sciences - Ibri", 
    ar: "جامعة التقنية والعلوم التطبيقية - عبري", 
    lat: 23.2249, 
    lon: 56.5159 
  },
  { 
    en: "University of Technology and Applied Sciences - Sur", 
    ar: "جامعة التقنية والعلوم التطبيقية - صور", 
    lat: 22.5667, 
    lon: 59.5289 
  },
  { 
    en: "University of Technology and Applied Sciences - Salalah", 
    ar: "جامعة التقنية والعلوم التطبيقية - صلالة", 
    lat: 17.0151, 
    lon: 54.0924 
  },
  { 
    en: "University of Technology and Applied Sciences - Muscat", 
    ar: "جامعة التقنية والعلوم التطبيقية - مسقط", 
    lat: 23.6100, 
    lon: 58.5400 
  },
  { 
    en: "University of Technology and Applied Sciences - Musun'ah", 
    ar: "جامعة التقنية والعلوم التطبيقية - المصنعة", 
    lat: 23.7613, 
    lon: 57.5512 
  },
  { 
    en: "University of Technology and Applied Sciences - Shinas", 
    ar: "جامعة التقنية والعلوم التطبيقية - شناص", 
    lat: 24.7421, 
    lon: 56.4658 
  },
  { 
    en: "University of Technology and Applied Sciences - Ibraa", 
    ar: "جامعة التقنية والعلوم التطبيقية - إبراء", 
    lat: 22.7415, 
    lon: 58.5356 
  },
  { 
    en: "Health Science Institute", 
    ar: "معهد العلوم الصحية", 
    lat: 23.5907, 
    lon: 58.4148 
  },
  { 
    en: "Pharmacy", 
    ar: "كلية الصيدلة", 
    lat: 23.5917, 
    lon: 58.4158 
  },
  { 
    en: "Nursing - Muscat Branch", 
    ar: "التمريض - فرع مسقط", 
    lat: 23.5927, 
    lon: 58.4168 
  },
  { 
    en: "Nursing - South Batinah Branch", 
    ar: "التمريض - فرع جنوب الباطنة", 
    lat: 23.3907, 
    lon: 57.4244 
  },
  { 
    en: "Nursing - North Batinah Branch", 
    ar: "التمريض - فرع شمال الباطنة", 
    lat: 24.3473, 
    lon: 56.7456 
  },
  { 
    en: "Nursing - Dakhiliya Branch", 
    ar: "التمريض - فرع الداخلية", 
    lat: 22.9333, 
    lon: 57.5333 
  },
  { 
    en: "Nursing - Al Dhahirah Branch", 
    ar: "التمريض - فرع الظاهرة", 
    lat: 23.2000, 
    lon: 56.5000 
  },
  { 
    en: "Nursing - Ibraa Branch", 
    ar: "التمريض - فرع إبراء", 
    lat: 22.7415, 
    lon: 58.5356 
  },
  { 
    en: "Nursing - South Shargiya Branch", 
    ar: "التمريض - فرع جنوب الشرقية", 
    lat: 22.5667, 
    lon: 59.5289 
  },
  { 
    en: "Nursing - Dhofar Branch", 
    ar: "التمريض - فرع ظفار", 
    lat: 17.0151, 
    lon: 54.0924 
  },
  { 
    en: "Oman Health Information Management Institute", 
    ar: "معهد عمان لإدارة المعلومات الصحية", 
    lat: 23.6100, 
    lon: 58.5400 
  },
  { 
    en: "College of Banking and Financial Studies", 
    ar: "كلية الدراسات المصرفية والمالية", 
    lat: 23.5822, 
    lon: 58.4000 
  },
  { 
    en: "Suhar University", 
    ar: "جامعة صحار", 
    lat: 24.3473, 
    lon: 56.7456 
  },
  { 
    en: "Majan University College", 
    ar: "كلية مجان الجامعية", 
    lat: 23.5950, 
    lon: 58.4508 
  },
  { 
    en: "National University of Science & Technology", 
    ar: "الجامعة الوطنية للعلوم والتكنولوجيا", 
    lat: 23.5923, 
    lon: 58.2843 
  },
  { 
    en: "Mazoon College", 
    ar: "كلية مزون", 
    lat: 23.5913, 
    lon: 58.2853 
  },
  { 
    en: "Sur University College", 
    ar: "كلية صور الجامعية", 
    lat: 22.5667, 
    lon: 59.5289 
  },
  { 
    en: "Middle East College", 
    ar: "كلية الشرق الأوسط", 
    lat: 23.5968, 
    lon: 58.1778 
  },
  { 
    en: "Al Buraimi University College", 
    ar: "كلية البريمي الجامعية", 
    lat: 24.2516, 
    lon: 55.7529 
  },
  { 
    en: "Scientific College of Design", 
    ar: "الكلية العلمية للتصميم", 
    lat: 23.5933, 
    lon: 58.2863 
  },
  { 
    en: "Modern College of Commerce and Science", 
    ar: "الكلية الحديثة للتجارة والعلوم", 
    lat: 23.5822, 
    lon: 58.4000 
  },
  { 
    en: "Oman College Tourism", 
    ar: "كلية عمان للسياحة", 
    lat: 23.5943, 
    lon: 58.2883 
  },
  { 
    en: "Oman College for Management and Technology", 
    ar: "كلية عمان للإدارة والتكنولوجيا", 
    lat: 23.6244, 
    lon: 58.0057 
  },
  { 
    en: "Muscat College", 
    ar: "كلية مسقط", 
    lat: 23.5832, 
    lon: 58.4010 
  },
  { 
    en: "International College of Engineering & Management", 
    ar: "الكلية الدولية للهندسة والإدارة", 
    lat: 23.5953, 
    lon: 58.2893 
  },
  { 
    en: "National College of Automotive Technology", 
    ar: "الكلية الوطنية لتكنولوجيا السيارات", 
    lat: 23.5577, 
    lon: 58.1951 
  },
  { 
    en: "Dhofar University", 
    ar: "جامعة ظفار", 
    lat: 17.0151, 
    lon: 54.0924 
  },
  { 
    en: "Gulf College", 
    ar: "كلية الخليج", 
    lat: 23.5587, 
    lon: 58.1961 
  },
  { 
    en: "National University of Science Technology", 
    ar: "الجامعة الوطنية للعلوم والتكنولوجيا", 
    lat: 24.3483, 
    lon: 56.7466 
  },
  { 
    en: "Al Bayan College", 
    ar: "كلية البيان", 
    lat: 23.6244, 
    lon: 58.0057 
  },
  { 
    en: "Arab Open University", 
    ar: "الجامعة العربية المفتوحة", 
    lat: 23.5597, 
    lon: 58.1971 
  },
  { 
    en: "A'Sharqiyah University", 
    ar: "جامعة الشرقية", 
    lat: 22.6910, 
    lon: 58.5469 
  },
  { 
    en: "University of Buraimi", 
    ar: "جامعة البريمي", 
    lat: 24.2526, 
    lon: 55.7539 
  },
  { 
    en: "Global College of Engineering and Technology", 
    ar: "الكلية العالمية للهندسة والتكنولوجيا", 
    lat: 23.5842, 
    lon: 58.4020 
  },
  { 
    en: "Nizwa University", 
    ar: "جامعة نزوى", 
    lat: 22.9343, 
    lon: 57.5343 
  },
  { 
    en: "German University of Technology", 
    ar: "الجامعة الألمانية للتكنولوجيا", 
    lat: 23.6254, 
    lon: 58.0067 
  },
  { 
    en: "Oman Medical College", 
    ar: "كلية عمان الطبية", 
    lat: 23.5979, 
    lon: 58.4251 
  },
  { 
    en: "Muscat University", 
    ar: "جامعة مسقط", 
    lat: 23.6028, 
    lon: 58.2888 
  }
];

export default function FascinatingForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState('');
  
  // Get universities in the current language
  const [universities, setUniversities] = useState<Array<{label: string, lat: number, lon: number}>>([]);
  
  // Update universities list when language changes
  useEffect(() => {
    const currentLanguage = i18n.language;
    const languageKey = currentLanguage === 'ar' ? 'ar' : 'en';
    
    const translatedUniversities = universitiesData.map(uni => ({
      label: uni[languageKey],
      lat: uni.lat,
      lon: uni.lon
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
        /^(\+968[- ]?)?(9\d{2}[- ]?\d{3}[- ]?\d{2}|(2|4|5)\d{2}[- ]?\d{3}[- ]?\d{2})$/,
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
          const fallbackLocation = { lat: 23.5880, lng: 58.3829 }; // Muscat, Oman
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
      uni => uni[languageKey] === collegeName
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
        description: response?.isEmailSent
          ? t('form.toast.successEmail')
          : t('form.toast.successDefault'),
      });
      form.reset();
    } else {
      toast({
        title: t('form.toast.errorTitle'),
        description:
          message || t('form.toast.errorDefault'),
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  const directionClass = i18n.language === 'ar' ? 'rtl-form' : '';
  const isArabic = i18n.language === 'ar';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8 flex items-center justify-center ${directionClass}`}>
      <LanguageSwitcher />

      <Card className="w-full max-w-4xl shadow-xl overflow-hidden">
        <CardHeader className="bg-[#A6001E] text-white">
          <CardTitle className="text-2xl md:text-3xl font-bold">
            {t('form.title')}
          </CardTitle>
          <CardDescription className="text-purple-100">
            {t('form.description')}
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
                        universities={universities.map(university => university.label)}
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
                    <Label className="text-lg font-medium">{t('form.location')}</Label>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-medium">{t('form.location')}</Label>
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



