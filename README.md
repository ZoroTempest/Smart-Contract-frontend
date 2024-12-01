# MVP Voting System (Assessment)

This Solidity contract implements a **MVP Voting System** that allows users to vote for candidates. The candidate who reaches 3 votes first is declared the **MVP**. This system is designed to be used for voting-based scenarios, where an owner can register candidates, and users can vote for them.

## Description

The **MVP Voting System** includes the following features:

1. **Register Candidates**: The contract owner can register new candidates to the voting system.
2. **Voting**: Users can vote for a registered candidate.
3. **MVP Declaration**: The system automatically declares the first candidate to receive 3 votes as the MVP.
4. **Event Logging**: The contract logs events for candidate registrations, voting actions, and MVP declaration.

### Key Functionalities

- **registerCandidate(string memory _name)**: Allows the contract owner to register new candidates for voting.
- **vote(uint256 _candidateId)**: Enables users to vote for a candidate by their ID. Users can vote only once.
- **getVotes(uint256 _candidateId)**: Returns the current vote count for a specific candidate.
- **getTotalVotes()**: Returns the total number of votes cast across all candidates.

### Events
- **CandidateRegistered(uint256 candidateId, string candidateName)**: Logs when a candidate is successfully registered.
- **Voted(address voter, uint256 candidateId)**: Logs when a user casts a vote for a candidate.
- **MVPDeclared(uint256 candidateId, string candidateName)**: Logs when a candidate reaches 3 votes and is declared the MVP.

### Default Candidates
Upon deployment, 3 default candidates are automatically registered:
- **Lebron James**
- **Kalye Irving**
- **Justin Bulot**

## Getting Started

### Running the Contract

To interact with this contract locally, follow these steps:

1. **Install Dependencies**:  
   Open the project directory in your terminal and run:  
   ```bash
   npm install

2. **Start the Hardhat Node**:  
   Open the project directory in your terminal and run:  
   ```bash
   npx hardhat node

3. **Deploy the Contract**:  
   Open the project directory in your terminal and run:  
   ```bash
   npx hardhat run --network localhost scripts/deploy.js

4. **Launch the Front-End**:  
   Open the project directory in your terminal and run:  
   ```bash
   npm run dev
   
5. **Access the Application**:  
   Open your browser and navigate to:
   ```bash
   http://localhost:3000/

# Authors
Justin Bulot

Email - 202110965@fit.edu.ph

## License
This project is licensed under the MIT License - see the LICENSE.md file for details


This file can be directly used for GitHub, and it includes all the necessary information about the contract, its functionalities, and how to run the project locally. Simply copy this text into a `README.md` file in your project directory.



