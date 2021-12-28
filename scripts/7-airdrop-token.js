import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// This is the address to our ERC-1155 membership NFT contract.
const bundleDropModule = sdk.getBundleDropModule(
  "0x6AEDC6e7aAb7e2cead9d37B9C60817De1bD7Cba6",
);

// This is the address to our ERC-20 token contract.
const tokenModule = sdk.getTokenModule(
  "0xf01Da5A7183a533442597378cC119b49014431A5",
);

(async () => {
  try {
    // Grab all the addresses of people who own our membership NFT, which has 
    // a tokenId of 0.
    const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0");
  
    if (walletAddresses.length === 0) {
      console.log(
        "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!",
      );
      process.exit(0);
    }
    
    // Loop through the array of addresses.
    const airdropTargets = walletAddresses.map((address) => {
      // Pick a random # between 10 and 100.
      const randomAmount = Math.floor(Math.random() * (100 - 10 + 1) + 100);
      console.log("✅ Going to airdrop", randomAmount, "tokens to", address);
      
      // Set up the target.
      const airdropTarget = {
        address,
        // Remember, we need 18 decimal placees!
        amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
      };
  
      return airdropTarget;
    });
    
    // Call transferBatch on all our airdrop targets.
    console.log("🌈 Starting airdrop...")
    await tokenModule.transferBatch(airdropTargets);
    console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");
  } catch (err) {
    console.error("Failed to airdrop tokens", err);
  }
})();