// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Assessment {
    // Struct to define a Candidate
    struct Candidate {
        string name;       // Name of the candidate
        uint256 voteCount; // Number of votes received by the candidate
        bool isMVP;        // Track if the candidate has become the MVP
    }

    // Mapping to store candidates using their ID as key
    mapping(uint256 => Candidate) public candidates;
    
    // Mapping to track if an address has voted
    mapping(address => bool) public voters;

    // Variables to track the number of candidates and total votes
    uint256 public candidatesCount;
    uint256 public totalVotes;

    // Address of the contract owner (only owner can register candidates)
    address public owner;

    // Event to log the registration of candidates, votes, and MVP declaration
    event CandidateRegistered(uint256 candidateId, string candidateName);
    event Voted(address voter, uint256 candidateId);
    event MVPDeclared(uint256 candidateId, string candidateName);

    // Modifier to restrict certain functions to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can register candidates.");
        _; // Placeholder for function execution
    }

    // Constructor that sets the owner and registers default candidates
    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
        // Register 3 default candidates upon deployment
        registerDefaultCandidates();
    }

    // Internal function to register 3 default candidates (Lebron James, Kalye Irving, Justin Bulot)
    function registerDefaultCandidates() internal {
        registerCandidate("Lebron James");
        registerCandidate("Kalye Irving");
        registerCandidate("Justin Bulot");
    }

    // Function to register a new candidate, only callable by the contract owner
    function registerCandidate(string memory _name) public onlyOwner {
        candidatesCount++; // Increment candidate count
        candidates[candidatesCount] = Candidate(_name, 0, false); // Add new candidate
        emit CandidateRegistered(candidatesCount, _name); // Emit event for candidate registration
    }

    // Function for a user to vote for a candidate
    function vote(uint256 _candidateId) public {
        // Ensure the candidate ID is valid
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");
        
        // If the sender is not the owner, ensure they haven't already voted
        if (msg.sender != owner) {
            require(!voters[msg.sender], "You have already voted.");
        }
        
        // Increment vote count for the chosen candidate
        candidates[_candidateId].voteCount++;
        
        // Increment the total number of votes
        totalVotes++;
        
        // Mark the voter as having voted (unless the voter is the owner)
        if (msg.sender != owner) {
            voters[msg.sender] = true;
        }
        
        // Emit event for the vote
        emit Voted(msg.sender, _candidateId);
        
        // Check if the candidate has reached 3 votes and declare them as MVP
        checkForMVP(_candidateId);
    }

    // Function to check if a candidate has reached 3 votes and declare them as MVP
    function checkForMVP(uint256 _candidateId) internal {
        // Ensure the candidate ID is valid
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");
        
        // Check if the candidate has received 3 votes
        if (candidates[_candidateId].voteCount >= 3 && !candidates[_candidateId].isMVP) {
            candidates[_candidateId].isMVP = true; // Mark the candidate as MVP
            emit MVPDeclared(_candidateId, candidates[_candidateId].name); // Emit event for MVP declaration
        }
    }

    // Function to get the number of votes for a specific candidate
    function getVotes(uint256 _candidateId) public view returns (uint256) {
        // Ensure the candidate ID is valid
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");
        
        // Return the vote count for the specified candidate
        return candidates[_candidateId].voteCount;
    }

    // Function to get the total number of votes across all candidates
    function getTotalVotes() public view returns (uint256) {
        return totalVotes; // Return the total votes cast
    }
}
