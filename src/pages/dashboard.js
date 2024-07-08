import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image, Tag, Folder } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Total Assets", value: "1,234", icon: Image },
    { title: "Labels", value: "56", icon: Tag },
    { title: "Folders", value: "23", icon: Folder },
    { title: "Storage Used", value: "45.6 GB", icon: Upload },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Aura Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Activity list will be implemented here.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button>
              <Upload className="mr-2 h-4 w-4" /> Upload New Asset
            </Button>
            <Button variant="outline">
              <Folder className="mr-2 h-4 w-4" /> Create New Folder
            </Button>
            <Button variant="outline">
              <Tag className="mr-2 h-4 w-4" /> Manage Labels
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}