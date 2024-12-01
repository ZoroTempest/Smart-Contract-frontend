import { useState, useEffect } from "react";
import { ethers } from "ethers";
import votingSystemABI from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function VotingPage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [votingContract, setVotingContract] = useState(undefined);
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address
  const votingABI = votingSystemABI.abi; // Import ABI of the voting contract

  // Initialize and get the connected wallet and account
  const getWallet = async () => {
    if (window.ethereum) {
      console.log("MetaMask detected");
      setEthWallet(window.ethereum);
    } else {
      console.log("MetaMask is not installed");
      alert("Please install MetaMask to interact with this application.");
      return;
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  // Handle account changes
  const handleAccount = (account) => {
    if (account && account.length > 0) {
      console.log("Account connected: ", account[0]);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  // Connect account to MetaMask
  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);
    getVotingContract();
  };

  // Get the contract instance from the Ethereum provider
  const getVotingContract = () => {
    if (!ethWallet || !account) {
      console.log("Cannot get contract: ethWallet or account is not set");
      return;
    }

    console.log("Setting up contract...");
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();

    try {
      const contract = new ethers.Contract(contractAddress, votingABI, signer);
      console.log("Contract set:", contract);
      setVotingContract(contract);
    } catch (error) {
      console.error("Error setting up contract:", error);
    }
  };

  // Fetch candidates from the smart contract
  const fetchCandidates = async () => {
    if (votingContract) {
      console.log("votingContract is defined");
      try {
        const candidatesCount = await votingContract.candidatesCount();
        console.log("Candidates Count:", candidatesCount.toString());
        let loadedCandidates = [];
        for (let i = 1; i <= candidatesCount; i++) {
          const candidate = await votingContract.candidates(i);
          console.log("Candidate:", candidate);
          loadedCandidates.push({
            id: i,
            name: candidate.name,
            voteCount: candidate.voteCount.toString(),
            isMVP: candidate.isMVP, // Store MVP status
          });
        }
        setCandidates(loadedCandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    } else {
      console.log("votingContract is undefined");
    }
  };

  // Listen for MVP events
  useEffect(() => {
    if (votingContract) {
      votingContract.on("MVPDeclared", (candidateId, candidateName) => {
        console.log(`MVP declared: ${candidateName} with ID: ${candidateId}`);
        setCandidates((prevCandidates) =>
          prevCandidates.map((candidate) =>
            candidate.id === candidateId
              ? { ...candidate, isMVP: true } // Update isMVP field
              : candidate
          )
        );
      });
    }
    return () => {
      if (votingContract) {
        votingContract.removeListener("MVPDeclared");
      }
    };
  }, [votingContract]);

  // Fetch total votes from the smart contract
  const fetchTotalVotes = async () => {
    if (votingContract) {
      try {
        const totalVotes = await votingContract.getTotalVotes();
        setTotalVotes(totalVotes.toNumber());
      } catch (error) {
        console.error("Error fetching total votes:", error);
      }
    }
  };

  // Vote for a candidate
  const voteForCandidate = async (candidateId) => {
    if (votingContract && account) {
      try {
        const tx = await votingContract.vote(candidateId);
        await tx.wait();
        fetchCandidates();
        fetchTotalVotes();
      } catch (error) {
        console.error("Error voting:", error);
      }
    }
  };

  // Render UI based on user state (whether connected to MetaMask or not)
  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this Voting System.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your MetaMask wallet</button>;
    }

    return (
      <div>
        <h3>Choose a candidate and cast your vote</h3>
        <div>
          {candidates.map((candidate) => (
            <div key={candidate.id}>
              <p>
                {candidate.name}: {candidate.voteCount} votes
              </p>
              <p>{candidate.isMVP ? "MVP!" : ""}</p> {/* Display MVP status */}
              <button onClick={() => voteForCandidate(candidate.id)}>
                Vote for {candidate.name}
              </button>
            </div>
          ))}
        </div>
        <p>Total Votes: {totalVotes}</p>
        <p>
          MVP:{" "}
          {candidates.find((candidate) => candidate.isMVP)
            ? candidates.find((candidate) => candidate.isMVP).name
            : "No MVP yet"}
        </p> {/* Display MVP name */}
      </div>
    );
  };

  useEffect(() => {
    console.log("Checking wallet...");
    getWallet();
  }, []);

  useEffect(() => {
    if (account) {
      getVotingContract();
    }
  }, [account]);

  useEffect(() => {
    if (votingContract && account) {
      fetchCandidates();
      fetchTotalVotes();
    }
  }, [votingContract, account]);

  return (
    <main className="container">
      <h1>Voting System</h1>
      {initUser()}
    </main>
  );
}
