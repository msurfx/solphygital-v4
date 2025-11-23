import { create, ruleSet } from '@metaplex-foundation/mpl-core';
import { generateSigner } from '@metaplex-foundation/umi';
import { uploadMetadata } from './upload-metadata';

export async function mintCoreNFT(umi: any, params: any) {
  const asset = generateSigner(umi);

  const metadata = {
    name: params.name,
    description: params.description || `${params.name} by ${params.artistName}`,
    image: params.mediaUrl,
    external_url: params.socialLink,
    attributes: [
      { trait_type: 'Artist', value: params.artistName },
      { trait_type: 'Price', value: `${params.price} SOL` },
    ],
    properties: {
      files: [{ uri: params.mediaUrl, type: params.mediaType }],
      category: params.mediaType.startsWith('video') ? 'video' : 'audio',
    },
  };

  const uri = await uploadMetadata(umi, metadata);

  await create(umi, {
    asset,
    name: params.name,
    uri,
    plugins: [{
      type: 'Royalties',
      basisPoints: 500,
      creators: [{ address: umi.identity.publicKey, percentage: 100 }],
      ruleSet: ruleSet('None'),
    }],
  }).sendAndConfirm(umi);

  return {
    mintAddress: asset.publicKey.toString(),
    explorer: `https://explorer.solana.com/address/${asset.publicKey}?cluster=devnet`,
  };
}