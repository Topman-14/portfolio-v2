import { EmailPreviewViewer } from './components/email-preview-viewer';

export default function AdminEmailPreviewPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <p className="text-muted-foreground">
          Preview the transactional emails sent from this site.
        </p>
      </div>

      <EmailPreviewViewer />
    </div>
  );
}
