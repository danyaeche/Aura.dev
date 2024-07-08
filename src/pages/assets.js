import { useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Grid, List, Filter, Eye, Edit, Trash2, Share2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAssets } from "@/context/AssetContext";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useToast } from "@/components/ui/use-toast";
import ProtectedRoute from '@/components/ProtectedRoute';
import { z } from 'zod';

const commentSchema = z.string().min(1, "Comment cannot be empty").max(500, "Comment is too long");

export default function Assets() {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { assets, loading, error, updateAsset, deleteAsset, reorderAssets, addComment, shareAsset } = useAssets();
  const { toast } = useToast();

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || asset.type === filterType)
  );

  const handleAssetClick = useCallback((asset) => {
    setSelectedAsset(asset);
  }, []);

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;
    reorderAssets(result.source.index, result.destination.index);
    toast({
      title: "Assets Reordered",
      description: "The order of your assets has been updated.",
    });
  }, [reorderAssets, toast]);

  const handleDeleteAsset = useCallback((id) => {
    deleteAsset(id);
    toast({
      title: "Asset Deleted",
      description: "The asset has been successfully deleted.",
    });
  }, [deleteAsset, toast]);

  const handleAddComment = useCallback((assetId, comment) => {
    try {
      commentSchema.parse(comment);
      addComment(assetId, comment);
      toast({
        title: "Comment Added",
        description: "Your comment has been added to the asset.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.errors[0].message,
        variant: "destructive",
      });
    }
  }, [addComment, toast]);

  const handleShareAsset = useCallback((assetId, recipientEmail) => {
    shareAsset(assetId, recipientEmail);
    toast({
      title: "Asset Shared",
      description: `The asset has been shared with ${recipientEmail}.`,
    });
  }, [shareAsset, toast]);

  const AssetCard = useCallback(({ asset, index }) => (
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
                <p className="text-sm text-gray-500 dark:text-gray-400">{asset.type}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Version: {asset.version}</p>
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
                      <p className="mt-2">Version: {selectedAsset?.version}</p>
                      <div className="mt-4">
                        <h4 className="font-semibold">Comments:</h4>
                        {selectedAsset?.comments.map(comment => (
                          <p key={comment.id} className="text-sm">{comment.text}</p>
                        ))}
                        <Input
                          placeholder="Add a comment..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment(selectedAsset.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={() => updateAsset(asset.id, { ...asset, name: `${asset.name} (edited)` })}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteAsset(asset.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleShareAsset(asset.id, 'example@email.com')}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddComment(asset.id, 'New comment')}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Draggable>
  ), [viewMode, handleAssetClick, selectedAsset, updateAsset, handleDeleteAsset, handleShareAsset, handleAddComment]);

  if (loading) return <div>Loading assets...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Assets</h1>
          <Button>Upload New Asset</Button>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Input 
              placeholder="Search assets..." 
              className="w-64" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="3D Model">3D Model</SelectItem>
                <SelectItem value="Texture">Texture</SelectItem>
                <SelectItem value="Material">Material</SelectItem>
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
                  {filteredAssets.map((asset, index) => (
                    <AssetCard key={asset.id} asset={asset} index={index} />
                  ))}
                  {provided.placeholder}
                </motion.div>
              </AnimatePresence>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </ProtectedRoute>
  );
}