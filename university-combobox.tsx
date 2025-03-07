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
  
  const isRtl = i18n.language === 'ar';
  const directionClass = isRtl ? 'text-right' : 'text-left';
  
  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between ${directionClass}`}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {value ? value : t('form.placeHolder')}
            <ChevronsUpDown className={`${isRtl ? 'mr-2' : 'ml-2'} h-4 w-4 shrink-0 opacity-50`} />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0 w-full" 
          align={isRtl ? "end" : "start"} 
          sideOffset={4}
          alignOffset={0}
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <Command className="w-full" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="w-full">
              <CommandInput
                placeholder={t('form.placeHolder')}
                value={searchValue}
                onValueChange={setSearchValue}
                className={`${directionClass} w-full`}
              />
            </div>
            <CommandList className="max-h-60 w-full overflow-auto">
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
              <CommandGroup className="w-full">
                {universities.map((university) => (
                  <CommandItem
                    key={university}
                    value={university}
                    onSelect={() => {
                      onChange(university);
                      setOpen(false);
                    }}
                    className={`${directionClass} w-full`}
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
    </div>
  );
}
