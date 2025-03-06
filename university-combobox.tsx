'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTranslation } from 'react-i18next';

interface UniversityComboboxProps {
  universities: string[];
  value: string;
  onChange: (value: string) => void;
}

export function UniversityCombobox({
  universities,
  value,
  onChange,
}: UniversityComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const { t, i18n } = useTranslation();
  
  // Determine text direction based on current language
  const isRtl = i18n.language === 'ar';
  const directionClass = isRtl ? 'text-right' : 'text-left';
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${directionClass}`}
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {value ? value : t('form.college')}
          <ChevronsUpDown className={`${isRtl ? 'mr-2' : 'ml-2'} h-4 w-4 shrink-0 opacity-50`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!w-full justify-start p-0" align={isRtl ? 'end' : 'start'}>
        <Command className={`justify-start items-start ${directionClass}`} dir={isRtl ? 'rtl' : 'ltr'}>
          <CommandInput
            placeholder={t('form.college')}
            value={searchValue}
            onValueChange={setSearchValue}
            className={directionClass}
          />
          <CommandList>
            <CommandEmpty>
              {searchValue ? (
                <>
                  {isRtl ? 'لم يتم العثور على جامعة.' : 'No university found.'}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={() => {
                      onChange(searchValue);
                      setOpen(false);
                    }}
                  >
                    {isRtl ? `إضافة "${searchValue}"` : `Add "${searchValue}"`}
                  </Button>
                </>
              ) : (
                isRtl ? 'لم يتم العثور على جامعة.' : 'No university found.'
              )}
            </CommandEmpty>
            <CommandGroup className="max-h-60 w-full overflow-auto">
              {universities.map((university) => (
                <CommandItem
                  key={university}
                  value={university}
                  onSelect={() => {
                    onChange(university);
                    setOpen(false);
                  }}
                  className={directionClass}
                >
                  <Check
                    className={cn(
                      `${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4`,
                      value === university ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {university}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
