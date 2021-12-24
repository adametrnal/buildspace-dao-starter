import {ethers} from "ethers";
import sdk from "./1-initialize-sdk.js";
import {readFileSync} from "fs";

//from thirdweb
const app = sdk.getAppModule("0x9776F9Ec0B79bda20b0Ac6F0A4A56d1b00917F01");

(async () => {
    try {
        const bundleDropModule = await app.deployBundleDropModule({
            name: "PSLosersDAO",
            description: "A DAO for friends to organize and pay for trips",
            image: readFileSync("scripts/assets/ps.png"),
            //zero address means no charge
            primarySaleRecipientAddress: ethers.constants.AddressZero,
        });

        console.log(
            "Sucesfully deployed bundleDrop module, address:",
            bundleDropModule.address,
        );
        console.log(
            "bundleDrop metadata:",
            await bundleDropModule.getMetadata(),
        );
    } catch (error) {
        console.log("failed to deploy bundleDrop module", error);
    }
})()