import { useState, useEffect } from "react";
import { ethers } from "ethers";
import assessment_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [assessment, setAssessment] = useState(undefined);
  const [credits, setCredits] = useState(0);
  const [menu, setMenu] = useState([]);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Deployed address
  const assessmentABI = assessment_abi.abi;

  // Get the wallet (MetaMask)
  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);

      // Wait for the wallet to be ready
      if (ethWallet) {
        const accounts = await ethWallet.request({ method: "eth_accounts" });
        handleAccount(accounts);
      }
    } else {
      console.log("MetaMask is not installed!");
    }
  };

  // Handle account connection
  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  // Connect MetaMask account
  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);
    getAssessmentContract();
  };

  // Get the contract instance
  const getAssessmentContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const assessmentContract = new ethers.Contract(contractAddress, assessmentABI, signer);
    setAssessment(assessmentContract);
  };

  // Get the menu items from the contract
  const getMenu = async () => {
    if (assessment) {
      const menuItems = [];
      for (let i = 1; i <= 6; i++) { // Assume 6 items in the menu
        const item = await assessment.menu(i);
        menuItems.push({ name: item.name, price: item.price });
      }
      setMenu(menuItems);
    }
  };

  // Get the user's credits from the contract
  const getCredits = async () => {
    if (assessment && account) {
      try {
        const userCredits = await assessment.getCredits();
        setCredits(userCredits.toNumber());  // Update credits state correctly
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
    }
  };

  // Purchase credits with ETH
  const purchaseCredits = async (amount) => {
    if (assessment) {
      try {
        // Sending the transaction to purchase credits
        const tx = await assessment.purchaseCredits({
          value: ethers.utils.parseEther(amount),
        });

        // Wait for the transaction to be mined and confirmed
        await tx.wait();

        // Now, fetch the updated credits after the transaction
        getCredits(); // This should now reflect the correct credits
      } catch (error) {
        console.error("Error purchasing credits:", error);
      }
    }
  };

  // Purchase an item from the menu
  const purchaseItem = async (itemId) => {
    if (assessment) {
      try {
        const tx = await assessment.purchaseItem(itemId);
        await tx.wait(); // Wait for transaction confirmation
        getCredits(); // Update credits after purchase
      } catch (error) {
        console.error("Error purchasing item:", error);
      }
    }
  };

  // Initialize the user
  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this service.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your MetaMask wallet</button>;
    }

    if (credits === undefined) {
      getCredits();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Credits: {credits}</p>
        <div>
          <h3>Menu:</h3>
          {menu.map((item, index) => (
            <div key={index}>
              <p>
                {item.name} - {item.price} credits
              </p>
              <button onClick={() => purchaseItem(index + 1)}>Buy {item.name}</button>
            </div>
          ))}
        </div>
        <button onClick={() => purchaseCredits("0.1000")}>Buy 1000 Credits</button>
      </div>
    );
  };

  // Effect to initialize wallet and account
  useEffect(() => {
    getWallet();
  }, [ethWallet]);

  // Effect to get the menu once the contract is initialized
  useEffect(() => {
    if (assessment) {
      getMenu();
    }
  }, [assessment]);

  // Effect to listen for account changes in MetaMask
  useEffect(() => {
    if (ethWallet) {
      ethWallet.on("accountsChanged", (accounts) => {
        handleAccount(accounts);
        getCredits(); // Re-fetch credits if account changes
      });
    }
  }, [ethWallet]);

  return (
    <main className="container">
      <header>
        <h1>Welcome to Bukid Cafe!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
