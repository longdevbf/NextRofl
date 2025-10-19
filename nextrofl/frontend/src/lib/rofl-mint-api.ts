const ROFL_ENDPOINT = process.env.NEXT_PUBLIC_ROFL_ENDPOINT || 'http://localhost:8080';

export interface MintNFTRequest {
  recipient: string;
  metadataUri: string;
}

export interface MintNFTResponse {
  status: 'success' | 'error' | 'processing';
  txHash?: string;
  recipient?: string;
  message?: string;
}

export interface IPFSUploadResponse {
  success: boolean;
  ipfsUrl: string;
  ipfsHash: string;
  filename: string;
  size: number;
  type: string;
}

// Upload image to IPFS via API route
export async function uploadImageToIPFS(file: File): Promise<IPFSUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload-ipfs', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const result: IPFSUploadResponse = await response.json();
    return result;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw error;
  }
}

// Upload metadata JSON to IPFS
export async function uploadMetadataToIPFS(metadata: object): Promise<IPFSUploadResponse> {
  // Convert metadata object to JSON blob
  const jsonBlob = new Blob([JSON.stringify(metadata, null, 2)], { 
    type: 'application/json' 
  });
  const file = new File([jsonBlob], 'metadata.json', { type: 'application/json' });

  return uploadImageToIPFS(file);
}

// Create and upload complete metadata to IPFS
export async function createAndUploadMetadata(
  name: string,
  description: string,
  imageUrl: string
): Promise<string> {
  const metadata = {
    name,
    description,
    image: imageUrl,
    attributes: [
      {
        trait_type: "Encrypted",
        value: "true"
      },
      {
        trait_type: "Platform",
        value: "Oasis ROFL"
      },
      {
        trait_type: "Created",
        value: new Date().toISOString()
      }
    ]
  };

  const result = await uploadMetadataToIPFS(metadata);
  return result.ipfsUrl;
}

export async function mintNFT(request: MintNFTRequest): Promise<MintNFTResponse> {
  try {
    console.log('Sending mint request to ROFL:', request);
    
    const response = await fetch(`${ROFL_ENDPOINT}/mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: MintNFTResponse = await response.json();
    console.log('ROFL mint response:', result);
    
    return result;
  } catch (error) {
    console.error('Error calling ROFL mint API:', error);
    return { 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Utility function để tạo metadata URI từ form data (legacy - giữ lại cho backward compatibility)
export function createMetadataUri(name: string, description: string, imageUrl: string): string {
  const metadata = {
    name,
    description,
    image: imageUrl,
    attributes: [
      {
        trait_type: "Encrypted",
        value: "true"
      },
      {
        trait_type: "Platform", 
        value: "Oasis ROFL"
      }
    ]
  };
  
  const jsonString = JSON.stringify(metadata);
  const base64 = btoa(jsonString);
  return `data:application/json;base64,${base64}`;
}