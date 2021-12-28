import { useEffect, useMemo, useState } from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0x6AEDC6e7aAb7e2cead9d37B9C60817De1bD7Cba6",
);

const tokenModule = sdk.getTokenModule(
  "0xf01Da5A7183a533442597378cC119b49014431A5",
);

const App = () => {
  const {connectWallet, address, error, provider } = useWeb3();
  console.log("Hello Address:", address);

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  const signer = provider ? provider.getSigner() : undefined;
  const [isClaiming, setIsClaiming] = useState(false);

  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  const [memberAddresses, setMemberAddresses] = useState([]);

  //sugar to shorten someones wallet address so we don't show the whole thing
  const shortenAddress = (str) => {
    return str.substring(0,6) + "..." + str.substring(str.length - 4);
  };

  //grabs all the addresses of our members that hold the NFT
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    bundleDropModule
    .getAllClaimerAddresses("0")
    .then((addresess) => {
      console.log("Members addresses", addresess)
      setMemberAddresses(addresess);
    })
    .catch((err) => {
      console.error("failed to get member list", err);
    });
  }, [hasClaimedNFT]);
 
  // This useEffect grabs the # of token each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grab all the balances.
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("Amounts", amounts)
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error("failed to get token amounts", err);
      });
  }, [hasClaimedNFT]);

  // Now, we combine the memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If the address isn't in memberTokenAmounts, it means they don't
          // hold any of our token.
          memberTokenAmounts[address] || 0,
          18,
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    if (!address) {
      return;
    }
    console.log ("NFT Address", address)
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
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
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
