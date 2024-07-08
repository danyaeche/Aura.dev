import React, { createContext, useContext, useState, useEffect } from 'react';

const AssetContext = createContext();

export const useAssets = () => useContext(AssetContext);

export const AssetProvider = ({ children }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      // Simulating API call
      const response = await new Promise(resolve => setTimeout(() => resolve([
        { id: 1, name: "Character Model", type: "3D Model", fileType: "glb", thumbnail: "/api/placeholder/200/200", version: 1, tags: ["character", "fantasy"], comments: [], versions: [{ id: 1, createdAt: new Date().toISOString() }] },
        { id: 2, name: "Grass Texture", type: "Texture", fileType: "png", thumbnail: "/api/placeholder/200/200", version: 1, tags: ["nature", "ground"], comments: [], versions: [{ id: 1, createdAt: new Date().toISOString() }] },
        { id: 3, name: "Sci-Fi Props", type: "3D Model", fileType: "obj", thumbnail: "/api/placeholder/200/200", version: 1, tags: ["sci-fi", "props"], comments: [], versions: [{ id: 1, createdAt: new Date().toISOString() }] },
        { id: 4, name: "Metal Material", type: "Material", fileType: "mtl", thumbnail: "/api/placeholder/200/200", version: 1, tags: ["metal", "shiny"], comments: [], versions: [{ id: 1, createdAt: new Date().toISOString() }] },
        { id: 5, name: "Vehicle Model", type: "3D Model", fileType: "fbx", thumbnail: "/api/placeholder/200/200", version: 1, tags: ["vehicle", "transport"], comments: [], versions: [{ id: 1, createdAt: new Date().toISOString() }] },
      ]), 1000));
      setAssets(response);
    } catch (err) {
      setError('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const addAsset = (asset) => {
    setAssets(prevAssets => [...prevAssets, { 
      ...asset, 
      id: Date.now(), 
      version: 1, 
      comments: [],
      tags: [],
      versions: [{ id: 1, createdAt: new Date().toISOString() }]
    }]);
  };

  const updateAsset = (id, updatedAsset) => {
    setAssets(prevAssets => prevAssets.map(asset => 
      asset.id === id ? { 
        ...asset, 
        ...updatedAsset, 
        version: asset.version + 1,
        versions: [...asset.versions, { id: asset.versions.length + 1, createdAt: new Date().toISOString() }]
      } : asset
    ));
  };

  const deleteAsset = (id) => {
    setAssets(prevAssets => prevAssets.filter(asset => asset.id !== id));
  };

  const reorderAssets = (startIndex, endIndex) => {
    const result = Array.from(assets);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setAssets(result);
  };

  const addComment = (assetId, comment) => {
    setAssets(prevAssets => prevAssets.map(asset => 
      asset.id === assetId 
        ? { ...asset, comments: [...asset.comments, { id: Date.now(), text: comment, createdAt: new Date().toISOString() }] } 
        : asset
    ));
  };

  const addTag = (assetId, tag) => {
    setAssets(prevAssets => prevAssets.map(asset =>
      asset.id === assetId
        ? { ...asset, tags: [...new Set([...asset.tags, tag])] }
        : asset
    ));
  };

  const removeTag = (assetId, tag) => {
    setAssets(prevAssets => prevAssets.map(asset =>
      asset.id === assetId
        ? { ...asset, tags: asset.tags.filter(t => t !== tag) }
        : asset
    ));
  };

  const shareAsset = (assetId, recipientEmail) => {
    // In a real app, this would send an API request to share the asset
    console.log(`Sharing asset ${assetId} with ${recipientEmail}`);
  };

  return (
    <AssetContext.Provider value={{ 
      assets, 
      loading, 
      error, 
      addAsset, 
      updateAsset, 
      deleteAsset, 
      reorderAssets,
      addComment,
      addTag,
      removeTag,
      shareAsset
    }}>
      {children}
    </AssetContext.Provider>
  );
};