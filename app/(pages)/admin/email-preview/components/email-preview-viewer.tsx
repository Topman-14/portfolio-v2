'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { EMAIL_PREVIEW_TEMPLATES, type EmailPreviewTemplateId } from '@/lib/email/preview-templates';

export function EmailPreviewViewer() {
  const [template, setTemplate] = useState<EmailPreviewTemplateId>(
    EMAIL_PREVIEW_TEMPLATES[0].id
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {EMAIL_PREVIEW_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTemplate(t.id)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              template === t.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
        <iframe
          key={template}
          src={`/api/admin/email-preview?t=${template}`}
          title={`${template} preview`}
          className="h-[900px] w-full bg-white"
        />
      </div>
    </div>
  );
}
