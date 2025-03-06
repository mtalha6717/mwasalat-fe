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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? value : 'Search for a college/university...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!w-full justify-start p-0">
        <Command className="justify-start items-start text-left">
          <CommandInput
            placeholder="Search for a college/university..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {searchValue ? (
                <>
                  No university found.
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={() => {
                      onChange(searchValue);
                      setOpen(false);
                    }}
                  >
                    Add "{searchValue}"
                  </Button>
                </>
              ) : (
                'No university found.'
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
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
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
