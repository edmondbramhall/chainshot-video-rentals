const { ethers } = require("hardhat");
const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
chai.use(require('chai-bignumber')());

describe("The VideoNFT contract", function () {
  let contractVHSToken, contractVideoNFT;
  let address1, address2, address3;
  let totalSupply;
  before("deploy the contract instance first", async function () {
    const ContractVHSToken = await ethers.getContractFactory("VHSToken");
    contractVHSToken = await ContractVHSToken.deploy();
    await contractVHSToken.deployed();
    totalSupply = await contractVHSToken.totalSupply();
    const ContractVideoNFT = await ethers.getContractFactory("VideoNFT");
    contractVideoNFT = await ContractVideoNFT.deploy(contractVHSToken.address);
    await contractVideoNFT.deployed();
    await contractVHSToken.transfer(contractVideoNFT.address, totalSupply);
    [address1, address2, address3] = await ethers.provider.listAccounts();
    const defaultRentalPricePerDay = ethers.utils.parseUnits("10", "ether");
    const mintReward = ethers.utils.parseUnits("50", "ether");
    const modReward = ethers.utils.parseUnits("5", "ether");
    await contractVideoNFT.setContractDefaults(defaultRentalPricePerDay, mintReward, modReward, 1);
  });
  it("NFT contract should have correct initial balance", async function() {
    const balance = await contractVHSToken.balanceOf(contractVideoNFT.address);
    assert.equal(balance.toString(), totalSupply.toString());
  });
  it("should update contract defaults when setContractDefaults is called", async function(){
    const defaultRentalPricePerDay = ethers.utils.parseUnits("20", "ether");
    const mintReward = ethers.utils.parseUnits("100", "ether");
    const modReward = ethers.utils.parseUnits("10", "ether");
    const requiredMods = 3;
    await contractVideoNFT.setContractDefaults(defaultRentalPricePerDay, mintReward, modReward, requiredMods);
    const updatedDefaultRentalPricePerDay = await contractVideoNFT.defaultRentalPricePerDay();
    expect(updatedDefaultRentalPricePerDay.toString()).to.be.equal(defaultRentalPricePerDay.toString());
    const updatedModerationReward = await contractVideoNFT.moderationReward();
    expect(updatedModerationReward.toString()).to.be.equal(modReward.toString());
    const updatedMintReward = await contractVideoNFT.mintReward();
    expect(updatedMintReward.toString()).to.be.equal(mintReward.toString());
    const updatedNumberOfModsRequired = await contractVideoNFT.numberOfModsRequired();        
    expect(updatedNumberOfModsRequired.toString()).to.be.equal(requiredMods.toString());
  });
  it("should revert when setting contract defaults if any value is less than zero", async function(){
    const defaultRentalPricePerDay = ethers.utils.parseUnits("20", "ether");
    const mintReward = ethers.utils.parseUnits("100", "ether");
    const modReward = ethers.utils.parseUnits("10", "ether");
    const requiredMods = 3;
    await expect(contractVideoNFT.setContractDefaults(0, mintReward, modReward, requiredMods)).to.be.reverted;
    await expect(contractVideoNFT.setContractDefaults(defaultRentalPricePerDay, 0, modReward, requiredMods)).to.be.reverted;
    await expect(contractVideoNFT.setContractDefaults(defaultRentalPricePerDay, mintReward, 0, requiredMods)).to.be.reverted;
    await expect(contractVideoNFT.setContractDefaults(defaultRentalPricePerDay, mintReward, modReward, 0)).to.be.reverted;
  });
  it("should transfer mint reward to NFT owner on minting", async function() {
    await contractVideoNFT.setContractDefaults(10, 10, 10, 10);
    const beforeAddress1Balance = await contractVHSToken.balanceOf(address1);
    await contractVideoNFT.safeMint(address1, "blah");
    const afterAddress1Balance = await contractVHSToken.balanceOf(address1);
    expect(afterAddress1Balance).to.equal(beforeAddress1Balance + 10); 
  });
  it("should emit Minted event on minting", async function() {
    let response = await contractVideoNFT.safeMint(address1, "blah");
    let receipt = await response.wait();
    // query the logs for the FallbackCalled event
    const topic = contractVideoNFT.interface.getEventTopic('Minted');
    const log = receipt.logs.find(x => x.topics.indexOf(topic) >= 0);
    const deployedEvent = contractVideoNFT.interface.parseLog(log);
    assert(deployedEvent, "Expected the Minted event to be emitted.");    
  });
  it("should allow safeMint to be called by the owner", async function(){
    await expect(contractVideoNFT.safeMint(address1, "blah")).to.not.be.reverted;
  })
  it("should not allow safeMint to be called by a non-owner", async function(){
    await expect(contractVideoNFT.safeMint(address1, "blah", { from: address2 })).to.be.reverted;
  })
});
