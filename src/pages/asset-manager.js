import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, File, Info } from "lucide-react";
import { ThreeViewer } from '@/components/ThreeViewer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AssetManager() {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
        setAssets(prevAssets => [...prevAssets, {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          url: URL.createObjectURL(file)
        }]);
        setIsLoading(false);
        toast({
          title: "File Uploaded",
          description: `${file.name} has been successfully uploaded.`,
        });
      };
      reader.readAsArrayBuffer(file);
    });
  }, [toast]);

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">3D Asset Manager</h1>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How to use the 3D Asset Manager</AlertTitle>
        <AlertDescription>
          Upload your 3D models by dragging and dropping files or clicking the upload area. 
          Supported formats include .3ds, .obj, .glb, .gltf, .stl, and .fbx. 
          Once uploaded, you can view your models in the 3D viewer below.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading assets...</p>
            ) : assets.length === 0 ? (
              <p>No assets uploaded yet.</p>
            ) : (
              <ul className="space-y-2">
                {assets.map((asset, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                    <span className="flex items-center">
                      <File className="mr-2" size={20} />
                      {asset.name}
                    </span>
                    <Button onClick={() => setSelectedAsset(asset)}>View</Button>
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
            {selectedAsset ? (
              <ThreeViewer modelUrl={selectedAsset.url} />
            ) : (
              <p>Select an asset to view</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="advanced-features">
          <AccordionTrigger>Advanced Features</AccordionTrigger>
          <AccordionContent>
            <p>Coming soon: Asset editing, version control, and more advanced management features.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}