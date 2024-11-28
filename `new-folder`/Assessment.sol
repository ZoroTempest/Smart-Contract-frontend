// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Assessment {
    struct MenuItem {
        string name;
        uint16 price; // For credits
    }

    mapping(uint => MenuItem) public menu;
    mapping(address => uint) private credits;

    address public owner;

    event CreditsPurchased(address indexed customer, uint amount);
    event ItemPurchased(address indexed customer, string itemName, uint16 price);

    constructor() {
        owner = msg.sender;

        // Initialize the menu
        menu[1] = MenuItem("Spanish Latte", 120);
        menu[2] = MenuItem("White Chocolate Mocha", 150);
        menu[3] = MenuItem("Americano", 100);
        menu[4] = MenuItem("Dirty Matcha", 160);
        menu[5] = MenuItem("Cafe Mocha", 130);
        menu[6] = MenuItem("Caramel Macchiato", 175);
    }

    function purchaseCredits() public payable {
        require(msg.value > 0, "Send ETH to purchase credits.");
        uint purchasedCredits = msg.value / 1e15; // 1 ETH = 1,000 credits
        credits[msg.sender] += purchasedCredits;

        emit CreditsPurchased(msg.sender, purchasedCredits);
    }

    function getCredits() public view returns (uint) {
        return credits[msg.sender];
    }

    function purchaseItem(uint itemId) public {
        require(menu[itemId].price > 0, "Invalid item.");

        uint16 itemPrice = menu[itemId].price;
        string memory itemName = menu[itemId].name;

        if (credits[msg.sender] < itemPrice) {
            revert("Insufficient credits to purchase this item.");
        }

        // Deduct credits and check post-condition
        uint initialCredits = credits[msg.sender];
        credits[msg.sender] -= itemPrice;
        assert(credits[msg.sender] == initialCredits - itemPrice);

        // Emit the ItemPurchased event
        emit ItemPurchased(msg.sender, itemName, itemPrice);
    }
}
