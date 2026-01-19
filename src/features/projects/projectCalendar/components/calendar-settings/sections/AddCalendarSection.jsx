import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";

export default function AddCalendarSection() {
  return (
    <CardWrapper title="Add / Import Calendar" icon="Plus">

      <div className="space-y-8">

        <Tabs defaultValue="import" className="w-full">
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="import">Import / Export</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-8">

            {/* Import Box */}
            <div className="border border-dashed border-border rounded-lg p-8 text-center bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Select a calendar file from your computer
              </p>
              <Button size="sm" className="mt-4">
                Select File
              </Button>
            </div>

            {/* Export Row */}
            <div className="flex items-center justify-between border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Export all calendars
              </p>
              <Button size="sm" variant="outline">
                Export
              </Button>
            </div>

          </TabsContent>
        </Tabs>

      </div>
    </CardWrapper>
  );
}
