// Import plugin và toolbox
import "@oasisprotocol/sapphire-hardhat";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

export default {
  solidity: "0.8.28",
  networks: {
    sapphire_testnet: {
      type: "http",           // Kết nối JSON-RPC
      chainType: "l1",        // Mạng layer1 (Sapphire giống Ethereum layer-1)
      url: process.env.SAPPHIRE_TESTNET_RPC_URL || "https://testnet.sapphire.oasis.io",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 0x5aff,        // Chain ID của Sapphire Testnet (23295):contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
    },
  },
};
