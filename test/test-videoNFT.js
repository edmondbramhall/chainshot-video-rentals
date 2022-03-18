const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("The VideoNFT contract", function () {
  let contractVHSToken, contractVideoNFT;
  let address1, address2, address3;
  before("deploy the contract instance first", async function () {
    const ContractVideoNFT = await ethers.getContractFactory("VideoNFT");
    contractVideoNFT = await ContractVideoNFT.deploy();
    await contractVideoNFT.deployed();
    const ContractVHSToken = await ethers.getContractFactory("VHSToken");
    contractVHSToken = await ContractVHSToken.deploy(contractVideoNFT.address);
    await contractVHSToken.deployed();
    [address1, address2, address3] = await ethers.provider.listAccounts();
    const rentalPricePerDay = ethers.utils.parseUnits("10", "ether");
    const mintReward = ethers.utils.parseUnits("50", "ether");
    const modReward = ethers.utils.parseUnits("5", "ether");
    await contractVideoNFT.setContractDefaults(vHSToken.address, rentalPricePerDay, mintReward, modReward, 1);
      // await contractVHSToken.approve(contractVideoNFT.address, 100);
    // await contractVHSToken.transferFrom(contractVideoNFT.address, address1, 50);
    //await contractVHSToken.transferFrom(contractVideoNFT.address, address2, 50);
  });
  it("NFT contract should have positive balance", async function() {
    expect((await contractVHSToken.balanceOf(contractVideoNFT.address)) > 0);

  });  
  // it("should revert when renting if sender has insufficent tokens", async function () {
  //     await contractVideoNFT.deployed();
  //     await contractVHSToken.deployed();
  //     expect(contractVideoNFT.rentVideo(contractVHSToken.address, 1, 1)).to.be.reverted;
  // });
});
