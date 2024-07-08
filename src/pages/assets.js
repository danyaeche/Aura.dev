import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, List, Filter } from "lucide-react";

export default function Assets() {
  const [viewMode, setViewMode] = useState('grid');

  // Mock data for assets
  const assets = [
    { id: 1, name: "Asset 1", type: "3D Model", thumbnail: "/api/placeholder/200/200" },
    { id: 2, name: "Asset 2", type: "Texture", thumbnail: "/api/placeholder/200/200" },
    { id: 3, name: "Asset 3", type: "3D Model", thumbnail: "/api/placeholder/200/200" },
    { id: 4, name: "Asset 4", type: "Material", thumbnail: "/api/placeholder/200/200" },
    { id: 5, name: "Asset 5", type: "3D Model", thumbnail: "/api/placeholder/200/200" },
    { id: 6, name: "Asset 6", type: "Texture", thumbnail: "/api/placeholder/200/200" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Assets</h1>
        <Button>Upload New Asset</Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Input placeholder="Search assets..." className="w-64" />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="3d-model">3D Model</SelectItem>
              <SelectItem value="texture">Texture</SelectItem>
              <SelectItem value="material">Material</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'}>
        {assets.map((asset) => (
          <Card key={asset.id} className={viewMode === 'list' ? 'flex items-center' : ''}>
            <CardContent className={`p-4 ${viewMode === 'list' ? 'flex items-center space-x-4' : ''}`}>
              <img
                src={asset.thumbnail}
                alt={asset.name}
                className={viewMode === 'grid' ? 'w-full h-40 object-cover mb-4' : 'w-16 h-16 object-cover'}
              />
              <div>
                <h3 className="font-semibold">{asset.name}</h3>
                <p className="text-sm text-gray-500">{asset.type}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}