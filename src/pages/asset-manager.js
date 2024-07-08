import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, File, Info, Tag, X, RotateCcw, HelpCircle } from "lucide-react";
import { ThreeViewer } from '@/components/ThreeViewer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAssets } from '@/context/AssetContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ErrorBoundary from '@/components/ErrorBoundary';

export default function AssetManager() {
  const { assets, addAsset, updateAsset, addTag, removeTag } = useAssets();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [sortCriteria, setSortCriteria] = useState('name');
  const [filterType, setFilterType] = useState('all');
  const [filterSize, setFilterSize] = useState('all');
  const [showHelp, setShowHelp] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles) => {
    setIsLoading(true);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => {
        setIsLoading(false);
        toast({
          title: "File Reading Aborted",
          description: "The file reading process was aborted.",
          variant: "destructive",
        });
      };
      reader.onerror = () => {
        setIsLoading(false);
        toast({
          title: "File Reading Failed",
          description: "There was an error reading the file.",
          variant: "destructive",
        });
      };
      reader.onload = () => {
        const url = URL.createObjectURL(file);
        addAsset({
          name: file.name,
          type: file.type.startsWith('model') ? '3D Model' : 'Other',
          fileType: file.name.split('.').pop(),
          size: file.size,
          lastModified: file.lastModified,
          url: url,
          version: 1,
          history: [{ version: 1, date: new Date().toISOString(), description: 'Initial upload' }],
          tags: []
        });
        setIsLoading(false);
        toast({
          title: "File Uploaded",
          description: `${file.name} has been successfully uploaded.`,
        });
      };
      reader.readAsArrayBuffer(file);
    });
  }, [addAsset, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/3ds': ['.3ds'],
      'model/obj': ['.obj'],
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf'],
      'model/stl': ['.stl'],
      'model/fbx': ['.fbx'],
    }
  });

  const handleAddTag = (assetId) => {
    if (newTag.trim()) {
      addTag(assetId, newTag.trim());
      setNewTag('');
    }
  };

  const handleRemoveTag = (assetId, tag) => {
    removeTag(assetId, tag);
  };

  const handleRename = (assetId, newName) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      updateAsset(assetId, { 
        name: newName,
        version: (asset.version || 0) + 1,
        history: [
          ...(asset.history || []),
          { version: (asset.version || 0) + 1, date: new Date().toISOString(), description: 'Renamed asset' }
        ]
      });
    }
  };

  const sortedAssets = [...assets].sort((a, b) => {
    if (sortCriteria === 'name') return a.name.localeCompare(b.name);
    if (sortCriteria === 'size') return a.size - b.size;
    if (sortCriteria === 'date') return new Date(b.lastModified) - new Date(a.lastModified);
    return 0;
  });

  const filteredAssets = sortedAssets.filter(asset => 
    (filterType === 'all' || asset.type === filterType) &&
    (filterSize === 'all' || 
     (filterSize === 'small' && asset.size < 1000000) ||
     (filterSize === 'medium' && asset.size >= 1000000 && asset.size < 10000000) ||
     (filterSize === 'large' && asset.size >= 10000000))
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">3D Asset Manager</h1>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How to use the 3D Asset Manager</AlertTitle>
        <AlertDescription>
          Upload your 3D models by dragging and dropping files or clicking the upload area. 
          Supported formats include .3ds, .obj, .glb, .gltf, .stl, and .fbx. 
          Once uploaded, you can view your models in the 3D viewer, add tags, and manage your assets.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Upload 3D Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-primary transition-colors">
            <input {...getInputProps()} />
            {
              isDragActive ?
                <p>Drop the files here ...</p> :
                <p>Drag 'n' drop some files here, or click to select files</p>
            }
            <Upload className="mx-auto mt-4" size={48} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Select value={sortCriteria} onValueChange={setSortCriteria}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="date">Date</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="3D Model">3D Model</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSize} onValueChange={setFilterSize}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="small">Small (&lt;1MB)</SelectItem>
              <SelectItem value="medium">Medium (1-10MB)</SelectItem>
              <SelectItem value="large">Large (&gt;10MB)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => setShowHelp(true)}>
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click for help on using the 3D viewer</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading assets...</p>
            ) : filteredAssets.length === 0 ? (
              <p>No assets uploaded yet.</p>
            ) : (
              <ul className="space-y-2">
                {filteredAssets.map((asset) => (
                  <li key={asset.id} className="flex items-center justify-between p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                    <span className="flex items-center">
                      <File className="mr-2" size={20} />
                      {asset.name}
                    </span>
                    <div className="flex space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">Edit</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Asset: {asset.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="assetName">Asset Name</Label>
                                    <Input
                                      id="assetName"
                                      value={asset.name}
                                      onChange={(e) => handleRename(asset.id, e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="newTag">Add Tag</Label>
                                    <div className="flex space-x-2">
                                      <Input
                                        id="newTag"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Enter new tag"
                                      />
                                      <Button onClick={() => handleAddTag(asset.id)}>Add</Button>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Current Tags</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {asset.tags && asset.tags.map((tag, index) => (
                                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                                          {tag}
                                          <button onClick={() => handleRemoveTag(asset.id, tag)} className="ml-1 text-blue-600 hover:text-blue-800">
                                            <X size={14} />
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Version History</Label>
                                    <ul className="mt-2 space-y-2">
                                      {asset.history && asset.history.map((version, index) => (
                                        <li key={index} className="text-sm">
                                          Version {version.version}: {version.description} ({new Date(version.date).toLocaleString()})
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit asset details and tags</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button onClick={() => setSelectedAsset(asset)}>View</Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View asset in 3D viewer</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3D Viewer</CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorBoundary>
              {selectedAsset ? (
                <ThreeViewer modelUrl={selectedAsset.url} />
              ) : (
                <p>Select an asset to view</p>
              )}
            </ErrorBoundary>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to Use the 3D Viewer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p><strong>Rotate:</strong> Click and drag with the left mouse button.</p>
            <p><strong>Pan:</strong> Click and drag with the right mouse button, or use the arrow buttons.</p>
            <p><strong>Zoom:</strong> Use the mouse wheel, or the zoom slider.</p>
            <p><strong>Reset View:</strong> Click the "Reset View" button to return to the default position.</p>
            <p><strong>Wireframe:</strong> Toggle the wireframe mode to see the model's structure.</p>
            <p><strong>Fullscreen:</strong> Enter or exit fullscreen mode for a better view.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Accordion type="single" collapsible>
        <AccordionItem value="advanced-features">
          <AccordionTrigger>Advanced Features</AccordionTrigger>
          <AccordionContent>
            <p>Coming soon: More advanced editing features, version control, and collaborative tools.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}