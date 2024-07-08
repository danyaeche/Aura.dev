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
        { id: 1, name: "Character Model", type: "3D Model", thumbnail: "/api/placeholder/200/200", version: 1, comments: [] },
        { id: 2, name: "Grass Texture", type: "Texture", thumbnail: "/api/placeholder/200/200", version: 1, comments: [] },
        { id: 3, name: "Sci-Fi Props", type: "3D Model", thumbnail: "/api/placeholder/200/200", version: 1, comments: [] },
        { id: 4, name: "Metal Material", type: "Material", thumbnail: "/api/placeholder/200/200", version: 1, comments: [] },
        { id: 5, name: "Vehicle Model", type: "3D Model", thumbnail: "/api/placeholder/200/200", version: 1, comments: [] },
        { id: 6, name: "Wood Texture", type: "Texture", thumbnail: "/api/placeholder/200/200", version: 1, comments: [] },
      ]), 1000));
      setAssets(response);
    } catch (err) {
      setError('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const addAsset = (asset) => {
    setAssets(prevAssets => [...prevAssets, { ...asset, id: Date.now(), version: 1, comments: [] }]);
  };

  const updateAsset = (id, updatedAsset) => {
    setAssets(prevAssets => prevAssets.map(asset => 
      asset.id === id ? { ...asset, ...updatedAsset, version: asset.version + 1 } : asset
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
        ? { ...asset, comments: [...asset.comments, { id: Date.now(), text: comment, createdAt: new Date() }] } 
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
      shareAsset
    }}>
      {children}
    </AssetContext.Provider>
  );
};