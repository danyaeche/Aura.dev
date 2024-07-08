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
      // In a real application, this would be an API call
      const response = await new Promise(resolve => setTimeout(() => resolve([
        { id: 1, name: "Character Model", type: "3D Model", thumbnail: "/api/placeholder/200/200" },
        { id: 2, name: "Grass Texture", type: "Texture", thumbnail: "/api/placeholder/200/200" },
        { id: 3, name: "Sci-Fi Props", type: "3D Model", thumbnail: "/api/placeholder/200/200" },
        { id: 4, name: "Metal Material", type: "Material", thumbnail: "/api/placeholder/200/200" },
        { id: 5, name: "Vehicle Model", type: "3D Model", thumbnail: "/api/placeholder/200/200" },
        { id: 6, name: "Wood Texture", type: "Texture", thumbnail: "/api/placeholder/200/200" },
      ]), 1000));
      setAssets(response);
    } catch (err) {
      setError('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const addAsset = (asset) => {
    setAssets(prevAssets => [...prevAssets, { ...asset, id: Date.now() }]);
  };

  const updateAsset = (id, updatedAsset) => {
    setAssets(prevAssets => prevAssets.map(asset => 
      asset.id === id ? { ...asset, ...updatedAsset } : asset
    ));
  };

  const deleteAsset = (id) => {
    setAssets(prevAssets => prevAssets.filter(asset => asset.id !== id));
  };

  return (
    <AssetContext.Provider value={{ assets, loading, error, addAsset, updateAsset, deleteAsset }}>
      {children}
    </AssetContext.Provider>
  );
};