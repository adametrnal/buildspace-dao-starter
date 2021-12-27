import { useEffect, useMemo, useState } from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0x6AEDC6e7aAb7e2cead9d37B9C60817De1bD7Cba6",
);

const App = () => {
  const {connectWallet, address, error, provider } = useWeb3();
  console.log("Hello Address:", address);

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  const signer = provider ? provider.getSigner() : undefined;
  const [isClaiming, setIsClaiming] = useState(false);


  useEffect(() => {
    if (!address) {
      return;
    }
    
    // Check if the user has our NFT
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        if (balance.gt(0)){
          setHasClaimedNFT(true);
          console.log("The user has our NFT!")
        } else {
          setHasClaimedNFT(false);
          console.log("This user doesn't yet have our NFT!")
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to get nft balance", error);
      });
  }, [address]);

  useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  if(!address) {
    return (
      <div className="landing">
        <h1>Welcome to PSLosersDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>PSLosers DAO Member Page</h1>
        <p>Congratulations on being a member</p>
      </div>
    );
  };

  const mintNft = () => {
    setIsClaiming(true);
    //this call mints it to the user's wallet
    bundleDropModule
    .claim("0", 1)
    .catch((err) => {
      console.error("failed to claim", err);
      setIsClaiming(false);
    })
    .finally(() => {
      setIsClaiming(false);
      setHasClaimedNFT(true);
      console.log(`Successfully Miinted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`);
    });
  }

  return (
    <div className="mint-nft">
      <h1>Mint your free PSLosers DAO NFT</h1>
      <button
        disabled={isClaiming}
        onClick={() => mintNft()}>
          {isClaiming ? "Minting..." : "Mint your NFT (FREE)"}
        </button>
    </div>
  );
};

export default App;
