// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VideoNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    enum ModerationStatus { Unverified, Pending, Accepted, Rejected }
    
    struct ModerationInfo {
        ModerationItem[] moderations;
        ModerationStatus status;
    }

    struct ModerationItem {
        uint256 tokenId;
        address moderator;
        ModerationStatus status;
    }

    // Has the contract had its initial values set? This will only be false if 
    // setERC20ContractDefaults hasn't yet been called the first time
    bool private contractInitialized;
    // the contract address of the token we're transacting with in this contract, 
    // ie VHS (but the owner could change this later to a different token) 
    address public erc20ContractAddress; 
    uint256 public defaultRentalPricePerDay;
    uint256 public moderationReward;
    uint256 public mintReward;
    IERC20 private ERC20Contract;
    uint8 public numberOfModsRequired; 
    // moderation data arranged per token id
    mapping (uint256 => ModerationInfo) public moderatedTokens;
    // pricing data arranged per token id
    mapping (uint256 => uint256) public tokenRentalPricesPerDay;
    // "successful moderations" count arranged per moderator address
    mapping (address => uint256) public modsTotalByAddress;
    // rentals arranged by address, then token id to expiry timestamp
    mapping (address => mapping (uint256 => uint256)) public rentals;

    event Minted(uint256, address);
    event Rented(uint256, address, address, uint256);
    event ModerationComplete(uint256, ModerationInfo);

    modifier ifDefaultsAreSet {
        require(contractInitialized, "Function called until contract defaults are set.");
        _;
    }

    constructor() ERC721("VideoNFT", "VHSN") {
    }

    // housekeeping functions called by the owner
    function setContractDefaults(address _erc20ContractAddress, uint256 _defaultRentalPricePerDay, uint256 _mintReward, uint256 _moderationReward, uint8 _requiredMods) external onlyOwner {
        require(_erc20ContractAddress != address(0), "ERC20 contract address must be supplied.");
        require(_erc20ContractAddress != address(this), "ERC20 contract address must be supplied.");
        require(_defaultRentalPricePerDay > 0);
        require(_moderationReward > 0);
        require(_mintReward > 0);
        require(_requiredMods > 0);
        erc20ContractAddress = _erc20ContractAddress;
        IERC20 erc20Contract = IERC20(erc20ContractAddress);
        //todo: use ERC165 to check that the supplied contract really is a token contract
        //require(erc20Contract.supportsInterface('0x36372b07'), "The contract address supplied must be an ERC20 contract.");
        ERC20Contract = erc20Contract;
        defaultRentalPricePerDay = _defaultRentalPricePerDay;
        moderationReward = _moderationReward;
        mintReward = _mintReward;
        numberOfModsRequired = _requiredMods;        
        contractInitialized = true;
    }

    // other functions called by the owner 
    function safeMint(address to, string memory uri) public ifDefaultsAreSet onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        ERC20Contract.transfer(to, mintReward);
        emit Minted(tokenId, to);
    }

    function moderateVideo(ModerationItem[] memory items) external ifDefaultsAreSet {
        // todo: we know how many moderations each address has done, so perhaps we could
        // weight their moderation by the level of their community involvement
        require(balanceOf(msg.sender) > 0, "The moderator must own at least one VHS NFT.");
        for (uint i = 0; i < items.length; i++) {
            uint256 thisTokenId = items[i].tokenId;
            require(_exists(thisTokenId), "The token id supplied does not exist.");
            // todo: require sender to have not already moderated this item
            // todo: ignore if this item has already recieved sufficient moderation
            // set moderation value for this token/sender combo
            moderatedTokens[thisTokenId].moderations.push(items[i]);
            // check whether a sufficient number of moderations have occurred
            if (moderatedTokens[thisTokenId].moderations.length == numberOfModsRequired) {
                // todo: refactor this into function
                // assume status is accepted
                ModerationStatus finalStatus = ModerationStatus.Accepted;
                for (uint j = 0; j < moderatedTokens[thisTokenId].moderations.length; j++) {
                    if (moderatedTokens[thisTokenId].moderations[j].status == ModerationStatus.Rejected) {
                        finalStatus = ModerationStatus.Rejected;
                        break;
                    }
                }
                moderatedTokens[thisTokenId].status = finalStatus;
                // pay the moderators
                for (uint k = 0; k < moderatedTokens[thisTokenId].moderations.length; k++) {
                    // get the address of this moderator
                    address moderatorAddress = moderatedTokens[thisTokenId].moderations[k].moderator;
                    // increment that moderators "successful moderations" count so we have a reference for
                    // how useful they are to the community without having to examine all the moderations
                    // by token
                    modsTotalByAddress[moderatorAddress]++;
                    ERC20Contract.transfer(moderatorAddress, rewardAmount);
                }
                emit ModerationComplete(thisTokenId, moderatedTokens[thisTokenId]);
            }
        }
    }  

    // functions called by NFT owners
    function changeRentalPricePerDay(uint256 tokenId, uint256 amount) external ifDefaultsAreSet {
        require(_exists(tokenId), "The token id supplied does not exist.");
        require(ownerOf(tokenId) == msg.sender, "Only the owner of an NFT can change its rental price.");
        tokenRentalPricesPerDay[tokenId] = amount;
    }

    // functions called by anyone
    function rentVideo(uint256 tokenId, uint8 _days) external ifDefaultsAreSet {
        require(_exists(tokenId), "The token id supplied does not exist.");
        require(_days > 0, "Days rented may not be zero.");
        address tokenOwner = ownerOf(tokenId);
        uint256 amount = rentalPricePerDay(tokenId) * _days;
        // todo: calculate expiry
        uint256 expiry = block.timestamp;
        require(ERC20Contract.balanceOf(msg.sender) >= amount, "The video renter doesn't have enough tokens to watch this video.");
        require(tokenOwner != msg.sender, "You can't rent an NFT from yourself.");
        // todo: transfer 90% from the caller to the videoOwner address
        // todo: transfer 10% to the owner of this contract
        ERC20Contract.transferFrom(msg.sender, tokenOwner, amount);
        rentals[msg.sender][tokenId] = expiry;
        emit Rented(tokenId, msg.sender, tokenOwner, amount);
    }

    function rentalPricePerDay(uint256 tokenId) public view ifDefaultsAreSet returns (uint256) {
        require(_exists(tokenId), "The token id supplied does not exist.");
        uint256 price = tokenRentalPricesPerDay[tokenId];
        if (price == 0)
            return defaultRentalPricePerDay;
        return price;
    }

    function hasRental(uint256 tokenId) external view ifDefaultsAreSet returns (bool) {
        require(_exists(tokenId), "The token id supplied does not exist.");
        uint256 expiry = rentals[msg.sender][tokenId];
        if (expiry == 0)
            return false;
        if (expiry < block.timestamp)
            return false;
        return true;
    }

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
