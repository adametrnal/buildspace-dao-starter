import sdk from "./1-initialize-sdk.js";
import {readFileSync} from "fs";

const bundleDrop = sdk.getBundleDropModule(
    "0x6AEDC6e7aAb7e2cead9d37B9C60817De1bD7Cba6",
);

(async () => {
    try {
        await bundleDrop.createBatch([
            {
                name: "PPJ",
                description: "The elusive PPJ wil grant access to the PSLosersDAO",
                image: readFileSync("scripts/assets/ppj.png"),
            },
        ]);
        console.log(" Succesfully created a new NFT in the drop!");
    } catch (error) {
        console.log("failed to create the new NFT", error);
    }
})()
