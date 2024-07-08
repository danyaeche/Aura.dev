import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Grid, List, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAssets } from "@/context/AssetContext";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Assets() {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const { assets, loading, error, updateAsset, deleteAsset } = useAssets();

  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(assets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    // Update the order in your state or backend
    // For this example, we'll just log the new order
    console.log('New asset order:', items);
  };

  const AssetCard = ({ asset, index }) => (
    <Draggable draggableId={asset.id.toString()} index={index}>
      {(provided) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Card className={viewMode === 'list' ? 'flex items-center' : ''}>
            <CardContent className={`p-4 ${viewMode === 'list' ? 'flex items-center space-x-4' : ''}`}>
              <img
                src={asset.thumbnail}
                alt={asset.name}
                className={viewMode === 'grid' ? 'w-full h-40 object-cover mb-4' : 'w-16 h-16 object-cover'}
              />
              <div className="flex-grow">
                <h3 className="font-semibold">{asset.name}</h3>
                <p className="text-sm text-gray-500">{asset.type}</p>
              </div>
              <div className="flex space-x-2 mt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => handleAssetClick(asset)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{selectedAsset?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <img src={selectedAsset?.thumbnail} alt={selectedAsset?.name} className="w-full h-64 object-cover" />
                      <p className="mt-2">Type: {selectedAsset?.type}</p>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={() => updateAsset(asset.id, { ...asset, name: `${asset.name} (edited)` })}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => deleteAsset(asset.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Draggable>
  );

  if (loading) return <div>Loading assets...</div>;
  if (error) return <div>Error: {error}</div>;

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

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="assets">
          {(provided) => (
            <AnimatePresence>
              <motion.div
                {...provided.droppableProps}
                ref={provided.innerRef}
                layout
                className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'}
              >
                {assets.map((asset, index) => (
                  <AssetCard key={asset.id} asset={asset} index={index} />
                ))}
                {provided.placeholder}
              </motion.div>
            </AnimatePresence>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}