import { FieldConfig } from '@/components/ui/generic-form';

export const profileFields: FieldConfig[] = [
  {
    name: 'image',
    label: 'Profile photo',
    type: 'file',
    accept: 'image/*',
    maxSize: 5,
    colSpan: 3,
  },
  {
    name: 'name',
    label: 'Display name',
    type: 'text',
    placeholder: 'Name shown on blog posts',
    colSpan: 1,
  },
  {
    name: 'bio',
    label: 'Bio',
    type: 'textarea',
    placeholder: 'Short author bio for the blog sidebar',
    colSpan: 3,
  },
  {
    name: 'twitterUrl',
    label: 'X (Twitter) URL',
    type: 'url',
    placeholder: 'https://x.com/...',
    colSpan: 1,
  },
  {
    name: 'linkedinUrl',
    label: 'LinkedIn URL',
    type: 'url',
    placeholder: 'https://linkedin.com/in/...',
    colSpan: 1,
  },
  {
    name: 'githubUrl',
    label: 'GitHub URL',
    type: 'url',
    placeholder: 'https://github.com/...',
    colSpan: 1,
  },
  {
    name: 'websiteUrl',
    label: 'Website URL',
    type: 'url',
    placeholder: 'https://...',
    colSpan: 1,
  },
];

export function emptyToNull(value: string | null | undefined) {
  const t = typeof value === 'string' ? value.trim() : '';
  return t || null;
}
