import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import { FieldConfig } from '@/components/ui/generic-form/data';
import { UploadedFile } from '@/components/ui/file-upload';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string | null | undefined) => {
  if (!name) return 'U';

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return (parts[0][0] + (parts[0][1] || '')).toUpperCase();
  }

  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export function generateSchema(
  fields: FieldConfig[]
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;
    let isOptional = false;

    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'rich-text':
      case 'email':
      case 'url':
      case 'password':
        fieldSchema = z.string();
        if (field.type === 'email') {
          fieldSchema = (fieldSchema as z.ZodString).email(
            'Invalid email address'
          );
        }
        if (field.type === 'url') {
          const urlSchema = (fieldSchema as z.ZodString).url('Invalid URL');
          if (!field.required) {
            fieldSchema = z
              .union([urlSchema, z.literal(''), z.null()])
              .optional();
            isOptional = true;
          } else {
            fieldSchema = urlSchema;
          }
        }
        break;
      case 'number':
        fieldSchema = z.number();
        if (field.min !== undefined) {
          fieldSchema = (fieldSchema as z.ZodNumber).min(field.min);
        }
        if (field.max !== undefined) {
          fieldSchema = (fieldSchema as z.ZodNumber).max(field.max);
        }
        break;
      case 'boolean':
        fieldSchema = z.boolean();
        break;
      case 'date':
        fieldSchema = z.date();
        break;
      case 'file':
        fieldSchema = z.string();
        break;
      case 'files':
        fieldSchema = z.array(z.string());
        break;
      case 'tags':
        fieldSchema = z.array(z.string());
        break;
      case 'select':
      case 'async-select':
        fieldSchema = z.string();
        break;
      default:
        fieldSchema = z.string();
    }

    if (!field.required && !isOptional) {
      fieldSchema = fieldSchema.optional();
    }

    schemaObject[field.name] = fieldSchema;
  });

  return z.object(schemaObject);
}

export const uploadToCloudinary = async (file: File): Promise<UploadedFile> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );
  formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    originalName: file.name,
  };
};

export const uploadToS3 = async (file: File): Promise<UploadedFile> => {
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  });

  if (!res.ok) throw new Error('Failed to get upload URL');

  const { presignedUrl, fileUrl } = await res.json();

  const uploadRes = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!uploadRes.ok) throw new Error('Upload failed');

  return { url: fileUrl, publicId: fileUrl, originalName: file.name };
};

export const extractPublicId = (url: string): string => {
  const matches = new RegExp(/\/v\d+\/(.+)\./).exec(url);
  return matches ? matches[1] : '';
};

export const extractFileName = (url: string): string => {
  //but why new regexp, hmmn sonarqube??
  const matches = url.match(/\/([^/]+)\.[^.]+$/);
  return matches ? matches[1] : 'file';
};

export const isImage = (url: string) =>
  /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);

export function cleanErrorMsg(error: Error): string {
  const lines = error.message.split('\n');
  const lastLine = lines.at(-1)?.trim();

  return lastLine &&
    !lastLine.includes('__TURBOPACK__') &&
    !lastLine.includes('.js:')
    ? lastLine
    : 'An unexpected error occurred';
}

export const isDev = process.env.NEXT_PUBLIC_NODE_ENV === 'development';