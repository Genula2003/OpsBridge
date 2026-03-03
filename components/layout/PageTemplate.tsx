import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageTransition } from "./PageTransition";

interface PageTemplateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function PageTemplate({ title, description, action, children }: PageTemplateProps) {
  return (
    <PageTransition>
      <div className="flex flex-col gap-8 h-full">
        <SectionHeader title={title} description={description} action={action} />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </PageTransition>
  );
}
