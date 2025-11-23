import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore } from '@metaplex-foundation/mpl-core';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { generateSigner, signerIdentity } from '@metaplex-foundation/umi';

const rpc = process.env.NEXT_PUBLIC_HELIUS_RPC || 'https://api.devnet.solana.com';

export function getUmi() {
  const umi = createUmi(rpc).use(mplCore()).use(irysUploader());

  // Temp signer for server-side minting
  const keypair = generateSigner(umi);
  umi.use(signerIdentity(keypair));

  return { umi, keypair };
}