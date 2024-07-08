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

  useEffect(() => {
    if (id && assets) {
      const foundAsset = assets.find(a => a.id.toString() === id);
      if (foundAsset) {
        setAsset(foundAsset);
      } else {
        console.error('Asset not found');
      }
    }
  }, [id, assets]);

  if (!asset) {
    return <div>Loading asset...</div>;
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