import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, File } from "lucide-react";
import { ThreeViewer } from '@/components/ThreeViewer';

export default function AssetManager() {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // Do something with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
        // Here you would typically send this to your backend
        // For now, we'll just add it to our local state
        setAssets(prevAssets => [...prevAssets, {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          // In a real app, you'd generate this on the server
          url: URL.createObjectURL(file)
        }]);
      };
      reader.readAsArrayBuffer(file);
    });
    
    toast({
      title: "Files uploaded",
      description: `${acceptedFiles.length} file(s) have been uploaded.`,
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

      <Card>
        <CardHeader>
          <CardTitle>Upload 3D Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer">
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
            {assets.length === 0 ? (
              <p>No assets uploaded yet.</p>
            ) : (
              <ul className="space-y-2">
                {assets.map((asset, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
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
    </div>
  );
}