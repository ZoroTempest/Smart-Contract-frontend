# Bukid Cafe POS

This Solidity contract implements a **Point of Sale (POS)** system for a coffee shop. Customers can purchase credits using Ether and use these credits to buy items from a predefined menu.

## Description

The **Bukid Cafe POS** system includes the following features:
1. **Purchase Credits**: Customers send Ether to the contract and receive credits (1 ETH = 100 credits).
2. **View Credits**: Customers can check their current credit balance.
3. **Menu System**: The contract maintains a list of menu items with their prices in credits.
4. **Purchase Items**: Customers can spend their credits to purchase items from the menu.
5. **Event Logging**: The contract logs events for credit purchases and item purchases.

### Current Menu
- Spanish Latte: 120 credits
- White Chocolate Mocha: 150 credits
- Americano: 100 credits
- Dirty Matcha: 160 credits
- Cafe Mocha: 130 credits
- Caramel Macchiato: 175 credits


## Getting Started

### Running the Contract

To interact with this contract locally, follow these steps:
Open three terminals first on your project directory



1. **Start the NPM**:  
   Open the project directory in your terminal and run:  
   ```bash
   npm i (1st terminal)


2. **Start the hardhat node**:  
   Open the project directory in your terminal and run:  
   ```bash
   npx hardhat node (2nd terminal)

3. **Deploy the contract**:  
   Open the project directory in your terminal and run:  
   ```bash
   npx hardhat run --network localhost scripts/deploy.js (3rd terminal)


4. **Launch the front-end**:  
   Open the project directory in your terminal and run:  
   ```bash
   npm run dev (1st terminal)


5. **Access the application**:  
   Open on your browser and navigate to:  
   ```bash
   [(http://localhost:3000/)


   
# Authors
Justin Bulot

Email - 202110965@fit.edu.ph

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

   

