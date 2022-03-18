//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VHSToken is Ownable, ERC20 {
    // constructor(address nftContractAddress) ERC20("VHSToken", "VHS") {
    //     _mint(nftContractAddress, 100000000 * 10 ** decimals());
    // }
    constructor() ERC20("VHSToken", "VHS") {
        _mint(msg.sender, 100000000 * 10 ** decimals());
    }
}
