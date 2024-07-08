import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ThreeViewer } from '@/components/ThreeViewer';
import { useAssets } from '@/context/AssetContext';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function ViewAsset() {
  const router = useRouter();
  const { id } = router.query;
  const { assets } = useAssets();
  const [asset, setAsset] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && assets) {
      const foundAsset = assets.find(a => a.id.toString() === id);
      if (foundAsset) {
        setAsset(foundAsset);
        console.log('Asset found:', foundAsset);
      } else {
        console.error('Asset not found');
        setError('Asset not found');
      }
    }
  }, [id, assets]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-600">{error}</p>
          <Link href="/asset-manager">
            <Button className="mt-4">Back to Asset Manager</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading asset...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      <div className="absolute top-4 left-4 z-10">
        <Link href="/asset-manager">
          <Button variant="outline">Back to Asset Manager</Button>
        </Link>
      </div>
      <ThreeViewer modelUrl={asset.url} />
    </div>
  );
}

// Disable the default layout for this page
ViewAsset.getLayout = function getLayout(page) {
  return page;
};