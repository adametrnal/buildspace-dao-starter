import sdk from "./1-initialize-sdk.js";

const bundleDrop = sdk.getBundleDropModule(
    "0x6AEDC6e7aAb7e2cead9d37B9C60817De1bD7Cba6",
);

(async () => {
    try {
        const claimConditionFactory = bundleDrop.getClaimConditionFactory();

        claimConditionFactory.newClaimPhase({
            startTime: new Date(),
            maxQuantity: 35,
            maxQuantityPerTransaction: 1,
        });

        await bundleDrop.setClaimCondition(0, claimConditionFactory);
        console.log("Succesfully set claim condition on bundle drop", bundleDrop.address);
    } catch (error) {
        console.error("failed to set claim condition", error);
    }
})()