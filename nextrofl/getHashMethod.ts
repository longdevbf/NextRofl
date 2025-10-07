import { keccak256 } from 'js-sha3';

function getMethodId(signature: string): Promise<string> {
    const hash = keccak256(signature);
    return Promise.resolve(hash.substring(0, 8)); // Lấy 4 bytes đầu (8 hex characters)
}
async function main() {
    // Tính method ID cho mintNFT
    const mintMethodId = await getMethodId('mintNFT(address,string)');
    console.log('mintNFT method ID:', mintMethodId);
}

main().catch(console.error);