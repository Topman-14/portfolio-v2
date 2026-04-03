'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FileUpload } from '@/components/ui/file-upload';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { CalendarIcon, Check, ChevronsUpDown, Loader2, Plus, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { FieldConfig, SelectOption, FieldComponentProps } from './data';
import { useDebounce } from '@/hooks/use-debounce';

import { useState, useEffect } from 'react';
import { SimpleEditor } from '../text-editor';

export function TagsField({ field, form }: FieldComponentProps) {
  const [inputValue, setInputValue] = useState('');

  const tags = (form.watch(field.name) as string[]) || [];

  const updateTags = (newTags: string[]) => {
    form.setValue(field.name, newTags);
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    updateTags([...tags, trimmed]);
    setInputValue('');
  };

  const removeTag = (index: number) => {
    updateTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) addTag(inputValue);
    }
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <Input
          placeholder={field.placeholder}
          disabled={field.disabled}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          type='button'
          variant='outline'
          size='icon'
          className='shrink-0'
          disabled={field.disabled || !inputValue.trim()}
          onClick={() => addTag(inputValue)}
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className='flex flex-wrap gap-1'>
          {tags.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className='group inline-flex width-fit items-center rounded-md border bg-muted px-2 py-0.5 text-xs transition-all hover:bg-destructive/10 hover:border-destructive/30 relative overflow-hidden cursor-default'
            >
              {tag}
              <button
                type='button'
                onClick={() => removeTag(i)}
                className='max-w-[0] group-hover:ml-1 overflow-hidden group-hover:max-w-fit transition-all text-muted-foreground hover:text-destructive right-1 cursor-pointer '
              >
                <Trash2 className='h-3 w-3' />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

//todo: move these into their own component files, i'm too lazy rn
export function AsyncSelectField({ field, form }: FieldComponentProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (field.fetchOptions) {
      if (Array.isArray(field.fetchOptions)) {
        const filtered = field.fetchOptions.filter((option) =>
          option.label.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
        setOptions(filtered);
      } else if (
        typeof field.fetchOptions === 'function' &&
        debouncedSearchTerm
      ) {
        setLoading(true);
        field
          .fetchOptions(debouncedSearchTerm)
          .then(setOptions)
          .catch((error) => {
            console.error('Failed to fetch options:', error);
            toast.error('Failed to load options');
          })
          .finally(() => setLoading(false));
      }
    }
  }, [debouncedSearchTerm, field.fetchOptions, field]);

  const selectedOption = options.find(
    (option) => option.value === form.watch(field.name)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='justify-between'
          disabled={field.disabled}
        >
          {selectedOption
            ? selectedOption.label
            : field.placeholder || 'Select...'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput
            placeholder={`Search ${field.label.toLowerCase()}...`}
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {loading ? (
              <div className='flex items-center justify-center p-4'>
                <Loader2 className='h-4 w-4 animate-spin' />
              </div>
            ) : (
              <>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        form.setValue(field.name, option.value);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedOption?.value === option.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function SelectField({ field, form }: FieldComponentProps) {
  const [open, setOpen] = useState(false);
  const selectedOption = field.options?.find(
    (option) => option.value === form.watch(field.name)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='justify-between'
          disabled={field.disabled}
        >
          {selectedOption
            ? selectedOption.label
            : field.placeholder || 'Select...'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput
            placeholder={`Search ${field.label.toLowerCase()}...`}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {field.options?.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    form.setValue(field.name, option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedOption?.value === option.value
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function DateField({ field, form }: FieldComponentProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='justify-start text-left font-normal'
          disabled={field.disabled}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {form.watch(field.name) ? (
            format(form.watch(field.name) as Date, 'PPP')
          ) : (
            <span>{field.placeholder || 'Pick a date'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={form.watch(field.name) as Date}
          onSelect={(date) => {
            form.setValue(field.name, date);
            setOpen(false);
          }}
          disabled={field.disabled}
        />
      </PopoverContent>
    </Popover>
  );
}

export function renderField(
  field: FieldConfig,
  form: FieldComponentProps['form']
) {
  const commonProps = {
    placeholder: field.placeholder,
    disabled: field.disabled,
  };

  switch (field.type) {
    case 'text':
    case 'email':
    case 'url':
    case 'password':
      return (
        <Input
          {...commonProps}
          type={field.type === 'text' ? 'text' : field.type}
          {...(form.register(field.name) as object)}
        />
      );

    case 'number':
      return (
        <Input
          {...commonProps}
          type='number'
          min={field.min}
          max={field.max}
          {...(form.register(field.name, { valueAsNumber: true }) as object)}
        />
      );

    case 'textarea':
      return (
        <Textarea {...commonProps} {...(form.register(field.name) as object)} />
      );

    case 'rich-text':
      return (
        <SimpleEditor
          value={(form.watch(field.name) as string) || ""}
          onChange={(value) => form.setValue(field.name, value)}
          placeholder={field.placeholder}
          disabled={field.disabled}
        />
      );

    case 'boolean':
      return (
        <Switch
          checked={(form.watch(field.name) as boolean) || false}
          onCheckedChange={(checked) => form.setValue(field.name, checked)}
          disabled={field.disabled}
        />
      );

    case 'file':
      return (
        <FileUpload
          value={(form.watch(field.name) as string) || ''}
          onChange={(value) => form.setValue(field.name, value)}
          accept={field.accept}
          maxSize={field.maxSize}
          disabled={field.disabled}
        />
      );

    case 'files':
      return (
        <FileUpload
          value={(form.watch(field.name) as string[]) || []}
          onChange={(value) => form.setValue(field.name, value)}
          multiple
          accept={field.accept}
          maxFiles={field.maxFiles}
          maxSize={field.maxSize}
          disabled={field.disabled}
        />
      );

    case 'select':
      return <SelectField field={field} form={form} />;

    case 'async-select':
      return <AsyncSelectField field={field} form={form} />;

    case 'tags':
      return <TagsField field={field} form={form} />;

    case 'date':
      return <DateField field={field} form={form} />;

    default:
      return (
        <Input {...commonProps} {...(form.register(field.name) as object)} />
      );
  }
}
