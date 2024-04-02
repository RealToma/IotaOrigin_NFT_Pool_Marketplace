import { useEffect, useState, useMemo } from 'react';
import filetype from 'magic-bytes.js';
import { useSubgraphData } from '@/hooks/useSubgraphData';
import { GET_COLLECTION_DEFAULT_IMAGE } from '@/constants/subgraphQueries';
import { IPFS_GATEWAY, IPFS_GATEWAY_TOKEN } from '@/constants';
import { erc721ABI, useProvider } from 'wagmi';
import { Contract } from 'ethers';

async function generateSnapshotImage(buffer: ArrayBuffer) {
  return new Promise((resolve, reject) => {
    // Create an HTML5 video element
    const video = document.createElement('video');
    video.src = URL.createObjectURL(new Blob([buffer], { type: 'video/mp4' }));

    // Wait for the video to be loaded and ready to play
    video.onloadedmetadata = async () => {
      // Create a canvas element
      const canvas = document.createElement('canvas');

      // Set the canvas dimensions to match the video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame onto the canvas
      video.currentTime = 1;
      const context = canvas.getContext('2d')!;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas to a blob
      canvas.toBlob(blob => {
        // Create a blob URL for the generated image
        const blobUrl = URL.createObjectURL(blob!);
        resolve(blobUrl);
      }, 'image/jpeg');
    };

    video.onerror = reject;
  });
}

export const useCollectionIcon = (collectionAddress: string | undefined) => {
  const provider = useProvider();
  const [image, setImage] = useState<string>();
  const [type, setType] = useState<string>();

  const variables = useMemo(
    () => ({
      collectionAddress: collectionAddress?.toLowerCase(),
    }),
    [collectionAddress]
  );

  const data = useSubgraphData(GET_COLLECTION_DEFAULT_IMAGE, variables);

  useEffect(() => {
    if (!data?.nfts || !data?.nfts?.length) {
      return;
    }
    (async () => {
      if (!data?.nfts?.length || !collectionAddress) {
        return;
      }

      try {
        const contract = new Contract(collectionAddress, erc721ABI, provider);
        const uri = await contract.tokenURI(data?.nfts[0]?.identifier);
        const metadataUri =
          uri.replace('ipfs://', IPFS_GATEWAY) +
          (IPFS_GATEWAY_TOKEN !== '' && uri.includes('ipfs://')
            ? '?pinataGatewayToken=' + IPFS_GATEWAY_TOKEN
            : '');
        const metadata = await fetch(metadataUri).then(res => res.json());

        let assetUri =
          metadata?.image?.replace('ipfs://', IPFS_GATEWAY) +
          (IPFS_GATEWAY_TOKEN !== '' && metadata?.image?.includes('ipfs://')
            ? '?img-width=50&pinataGatewayToken=' + IPFS_GATEWAY_TOKEN
            : '?img-width=50');

        const response = await fetch(assetUri);
        const buffer = await response.arrayBuffer();
        var uint8View = new Uint8Array(buffer);
        const type = filetype(uint8View);
        const { typename } = type[0];

        setImage(assetUri);
        setType(typename);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [data?.nfts, collectionAddress, provider]);

  return { image, type };
};
