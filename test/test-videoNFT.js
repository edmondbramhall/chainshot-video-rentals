const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("The VideoNFT contract", function () {
  let contractVHSToken, contractVideoNFT;
  let address1, address2, address3;
  let totalSupply;
  before("deploy the contract instance first", async function () {
    const ContractVHSToken = await ethers.getContractFactory("VHSToken");
    contractVHSToken = await ContractVHSToken.deploy();
    await contractVHSToken.deployed();
    totalSupply = contractVHSToken.totalSupply();
    const ContractVideoNFT = await ethers.getContractFactory("VideoNFT");
    contractVideoNFT = await ContractVideoNFT.deploy(contractVHSToken.address);
    await contractVideoNFT.deployed();
    [address1, address2, address3] = await ethers.provider.listAccounts();
    const rentalPricePerDay = ethers.utils.parseUnits("10", "ether");
    const mintReward = ethers.utils.parseUnits("50", "ether");
    const modReward = ethers.utils.parseUnits("5", "ether");
    await contractVideoNFT.setContractDefaults(rentalPricePerDay, mintReward, modReward, 1);
  });
  it("NFT contract should have correct balance", async function() {
    //console.log(await ethers.utils.formatEther(contractVHSToken.balanceOf(contractVideoNFT.address)), ethers.utils.formatEther(totalSupply));
    expect((await contractVHSToken.balanceOf(contractVideoNFT.address)) > 0);
    expect((await contractVHSToken.balanceOf(contractVideoNFT.address)) === totalSupply);
  });
  it("should revert when setting contract defaults if values invalid", async function(){
    //expect(contractVideoNFT.rentVideo(contractVHSToken.address, 1, 1)).to.be.reverted;
  });
});
