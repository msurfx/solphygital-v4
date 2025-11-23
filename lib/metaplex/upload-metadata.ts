import { Umi } from '@metaplex-foundation/umi';

export async function uploadMetadata(umi: Umi, data: any) {
  return await umi.uploader.uploadJson(data);
}