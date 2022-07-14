import Head from 'next/head'
// import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'
import { useEffect, useRef, useState } from 'react'
import Web3Modal from "web3modal";
import { providers, Contract, utils, } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { NFT_CONTRACT_ADDRESS, NFT_abi, WHITELIST_abi, WHITELIST_CONTRACT_ADDRESS } from "../constants";
import Link from 'next/link'
import navStyles from '../styles/Navbar.module.css'
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri'

export default function Home() {

  const [toggleMenu, setToggleMenu] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  const [address, setAddress] = useState("")
  const web3ModalRef = useRef();



  //MINT Functions

  const presaleMint = async () => {
    try {
      
      const signer = await getProviderOrSigner(true);
      
      const whitelistContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_abi,
        signer
      );
    
      const tx = await whitelistContract.presaleMint({
        value: utils.parseEther("0.015"),
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      const _tokenIds = nftContract.tokenIds();
      setTokenIdsMinted(_tokenIds.toString());
      window.alert("You successfully minted a EXC NFT!");
      

    } catch (err) {
      console.error(err);
    }
  };


  const getTokenIdsMinted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_abi, provider);
      const _tokenIds = await nftContract.tokenIds();
      setTokenIdsMinted(_tokenIds.toString());
      console.log("tokenIds", _tokenIds);
    } catch (err) {
      console.error(err);
    }
  };


  //END



 //WHITELIST FUNCTIONS

  const addAddressToWhitelist = async () => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        WHITELIST_abi,
        signer
      );
      // call the addAddressToWhitelist from the contract
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      // get the updated number of addresses in the whitelist
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        WHITELIST_abi,
        provider
      );
      // call the numAddressesWhitelisted from the contract
      const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      // We will need the signer later to get the user's address
      // Even though it is a read transaction, since Signers are just special kinds of Providers,
      // We can use it in it's place
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        WHITELIST_abi,
        signer
      );
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      // call the whitelistedAddresses from the contract
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  //END



  //Connect and Provider functions

  const getProviderOrSigner = async (needSigner = false) => {


    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Mumbai");
      throw new Error("Change network to Mumbai");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }


    return web3Provider;
  };
  
  const providerOptions = {
    binancechainwallet: {
      package:true,
    },
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          80001: "https://rpc-mumbai.matic.today",
        },
        chainId: 80001,
      },
    },
  };


  const connectWallet = async () => {
    try {
      web3ModalRef.current = new Web3Modal({
        providerOptions,
        cacheProvider: false,
        disableInjectedProvider: false,
      });
      const signer = await getProviderOrSigner(true);
      const userAddress = await signer.getAddress();
      setWalletConnected(true);
      setAddress(userAddress)
      // getTokenIdsMinted();
      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
      

      console.log("Wallet Connected");
    } catch (err) {
      console.error(err);
    }
  };


  const onDisconnect = async () => {
    try {
      await web3ModalRef.current.clearCachedProvider();
      setWalletConnected(false);
      console.log("Disconnected");

    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions,
        cacheProvider: false,
        disableInjectedProvider: false,
      });
      // getTokenIdsMinted();
      // connectWallet();
      
    }


  }, [walletConnected]);

  //END


  //Render UI buttons

  const renderButton = () => {
      if(!walletConnected){
        return (
          <div className={navStyles.navbar_button}>
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>
        )
      } 
      if(walletConnected) {
        return(
          <div className={navStyles.navbar_button}>
            <button onClick={onDisconnect}>Disconnect</button>
          </div>
        )
      }
  }

  const renderMenuButton = () => {
      if(!walletConnected){
        return (
          <div className={navStyles.navbar_menu_container_button}>
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>
        )
      } 
      if(walletConnected) {
        return(
          <div className={navStyles.navbar_menu_container_button}>
            <button onClick={onDisconnect}>Disconnect</button>
          </div>
        )
      }
  }

  const renderWhitelistButton = () => {
    if(walletConnected) {
      if(joinedWhitelist){
        return (
          <h3>Proceed to the Mint Page</h3>
        );
      } else if (loading){
        return <button>Loading...</button>
      } else if (numberOfWhitelisted >= 7){
        return <h3>No more Whitelist Spots available</h3>
      }else {
        return (
        <button onClick={addAddressToWhitelist}>Join Whitelist</button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet}>Connect Wallet</button>
      )
    }
  }

  const renderWelcome = () => {
    if(walletConnected) {
      return <a href={`https://mumbai.polygonscan.com/address/${address}`} target="_blank" rel="noreferrer"><h4>Welcome {address}</h4></a>
    }
  }

  const renderMint = () => {
    if(walletConnected){
      if (joinedWhitelist){
        return (<button onClick={presaleMint}>MINT ΞXC</button>)
      }else if(loading){
        return (<button>Loading...</button>)
      }else if(tokenIdsMinted >= 7){
        return <h3>No more EXC NFT left</h3>
      }else{
        return(<h3>Please Join the Whitelist above</h3>)
      }
    }else{
      return (<h3>Connect your wallet in order to Mint</h3>)
    }
  }

  //END

  return (
    <div className={styles.container}>
      <Head>
        <title>ΞXC NFT project</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={navStyles.navContainer}>
        <div className={navStyles.navbar}>
          <div className={navStyles.navbar_links}>
              <div className={navStyles.navbar_links_logo}>
                  <Link href="/" passHref><h1> ΞXC NFT</h1></Link>
              </div>
              <div className={navStyles.navbar_links_container}>
                <a href="#Mint"><p>Mint ΞXC</p></a>
                <p>Stake ΞXC</p>
                <p>NFT Marketplace</p>
                <a href='#footer'><p>Contact</p></a>
                <p>Learn More...</p>
              </div>
          </div>
          {renderButton()}
          <div className={navStyles.navbar_menu}>
            {toggleMenu 
            ? <RiCloseLine color="#fff" size={26} onClick ={() => (setToggleMenu(false))}/>
            : <RiMenu3Line color="#fff" size={26} onClick ={() => (setToggleMenu(true))}/>
            }

            {toggleMenu && (
              <div className={navStyles.navbar_menu_container}>
                <div className={navStyles.navbar_menu_links}>
                    <>
                    <a href="#Mint"><p>Mint ΞXC</p></a>
                        <p>Stake ΞXC</p>
                        <p>NFT Marketplace</p>
                        <a href='#footer'><p>Contact</p></a>
                        <p>Learn More...</p>
                    </>
                    {renderMenuButton()}
                </div>
              </div>
            )}
          </div>
      </div>
    </div>

      <div className={styles.main} id="home">
        <div className={styles.main_content}>
            <h1 className={styles.main_text}>Join the ΞXC NFT Whitelist today !</h1>
              {renderWelcome()}
            <p>Click the button below to claim a whitelist spot in order to Mint a ΞXC NFT on the Polygon Mumbai Network. Only 7 Whitelist spots available for 7 random and unique ΞXC NFT. Follow the instructions below the button to add Polygon Mumbai to your Metamask Wallet</p>
          <div className={styles.mint_button}>
             {renderWhitelistButton()}
             <h3>{numberOfWhitelisted}/7 Whitelisted</h3>
            <a href='https://portal.thirdweb.com/guides/get-matic-on-polygon-mumbai-testnet-faucet' target="_blank" rel="noreferrer"><p>click here to add Polygon to your Metamask</p></a>
          </div>
        </div>
        <div className={styles.mainImage}>
            <a href='https://opensea.io/collection/to-be-free-boundless' target="_blank" rel="noreferrer"><img src='./saturns.jpeg' alt="'Frost' The Snow Fiend by Saturns_soul" href="google.com"/> </a>
          </div>
      </div>

      <div className={styles.mintpage} id="Mint">
        <div className={styles.mintPage_content}>
          <h1>Tap the button below to Mint a random ΞXC NFT and claim your rewards</h1>
          <p>Mint a random NFT on the Polygon Mumbai Network in order to get access to the staking protocol and the DAO for more opportunities</p>
          {renderMint()}
          <h3>{tokenIdsMinted}/7 Minted</h3>
        </div>
      </div>
    </div>
  )
}
