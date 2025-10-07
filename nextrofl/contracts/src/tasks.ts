import { bech32 } from "bech32";
import { task } from "hardhat/config";
import dotenv from "dotenv";
import "@nomicfoundation/hardhat-ethers";

task("deploy", "Deploy the contract")
    .addPositionalParam("roflAppId", "Rofl App ID")
    .setAction(async ({ roflAppId }, hre) => {
        const { prefix, words } = bech32.decode(roflAppId);
        if (prefix !== "rofl") {
            throw new Error(`Malformed ROFL app identifier: ${roflAppId}`);
        }
        const [deployer] = await hre.ethers.getSigners();
        const rawAppID = new Uint8Array(bech32.fromWords(words));
        const MintFactory = await hre.ethers.getContractFactory("MintNFT");
        const mint = await MintFactory.connect(deployer).deploy(rawAppID);
        await mint.waitForDeployment();
        console.log(`Contract deployed to: ${await mint.getAddress()} with ROFL App ID: ${roflAppId}`);
});
//npx hardhat deploy rofl1qpz66733pwjttfrwef79zwthslrlak7fayvsa6fm --network sapphire_testnet
//address: 0x4B9c329FDF246391849eC0dc65318445FfD2141F

