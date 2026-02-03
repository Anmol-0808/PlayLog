import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="space-y-6 p-8">
      <h1 className="text-4xl font-black">Playlog</h1>

      <Card className="border-2 shadow-[4px_4px_0px_0px_black]">
        <CardContent className="p-6 space-y-4">
          <Badge>Prototype</Badge>
          <p className="text-lg">
            The Best platform for video games.
          </p>
          <Button className="border-2 shadow-[2px_2px_0px_0px_black]">
            Explore
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
