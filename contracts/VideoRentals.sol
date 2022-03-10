//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VideoRentals is Ownable, ERC20 {
    event Rental(address, address, uint256);
    constructor() ERC20("VHSRentals", "VHS") {
        _mint(msg.sender, 100000000 * 10 ** decimals());
    }
    //todo: should take in the id of the video, then work out the owner from the other contract
    // call as punter
    function rentVideo(address videoOwner, uint256 amount) public {
        // require caller to have enough tokens
        // can't rent off yourself
        // transfer from the caller to the videoOwner address
        transfer(videoOwner, amount * 10 ** decimals());
        //emit Rental(msg.sender, videoOwner, amount);
    }
    function faucet(address recipient, uint256 amount) public onlyOwner {
        // transfer from the caller to recipient address
        transfer(recipient, amount * 10 ** decimals());
    }
}
