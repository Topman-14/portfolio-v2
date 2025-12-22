/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export type FieldType = 
  | "text" 
  | "textarea" 
  | "rich-text"
  | "boolean" 
  | "file" 
  | "files" 
  | "select" 
  | "async-select" 
  | "date" 
  | "number" 
  | "email" 
  | "url"
  | "password";

export interface SelectOption {
  label: string;
  value: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: unknown;
  colSpan?: 1 | 2 | 3; 
  options?: SelectOption[]; 
  fetchOptions?: SelectOption[] | ((searchTerm: string) => Promise<SelectOption[]>); 
  accept?: string; 
  maxFiles?: number; 
  maxSize?: number; 
  min?: number; 
  max?: number; 
  minHeight?: number; 
}

export interface GenericFormProps {
  fields: FieldConfig[];
  onSubmit: (data: any) => Promise<void> | void;
  schema?: z.ZodSchema;
  defaultValues?: Record<string, unknown>;
  submitText?: string;
  isLoading?: boolean;
  className?: string;
  itemName?: string;
  callBackRoute?: string;
}

export interface FieldComponentProps {
  field: FieldConfig;
  form: {
    register: (name: string, options?: unknown) => unknown;
    watch: (name: string) => unknown;
    setValue: (name: string, value: unknown) => void;
  };
}
