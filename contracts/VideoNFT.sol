// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VideoNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    event Minted(uint256, address);
    event Rented(uint256, address, address, uint256);

    constructor() ERC721("VideoNFT", "VHSN") {
    }
    
    function safeMint(address erc20ContractAddress, address to, string memory uri, uint256 rentalReward) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        // _safeMint(to, tokenId);
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        IERC20(erc20ContractAddress).transfer(to, rentalReward);
        emit Minted(tokenId, to);
    }

    //todo: should take in the id of the video, then work out the owner from the other contract
    // call as punter
    function rentVideo(address erc20ContractAddress, uint256 tokenId, uint256 amount) external {
        //require(IERC20(erc20ContractAddress).balanceOf(msg.sender) >= amount, "The video renter doesn't have enough tokens to watch this video.");
        // require caller to have enough tokens
        //require(msg.sender)
        // can't rent off yourself
        // transfer from the caller to the videoOwner address
        IERC20(erc20ContractAddress).transferFrom(msg.sender, ownerOf(tokenId), amount);
        emit Rented(tokenId, msg.sender, ownerOf(tokenId), amount);
    }

    // need a function to drain funds? eg if someone sends ether to contract
    // need self destruct function

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
