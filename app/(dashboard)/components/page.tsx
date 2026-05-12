import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ComponentsDevPage() {
  return (
    <div>
      

      <PageHeader title="Clients" description="Manage client profiles, guarantors, and documents">
          <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          New Client
        </Button>
      </PageHeader>
    </div>
  );
}


function PageHeader({children , title , description}: {children: React.ReactNode , title: string , description: string}){

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">
            {description}
          </p>
        </div>
        <div>
            {children}
        </div>
        
      </div>
  )
}