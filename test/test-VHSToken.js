const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("The VHSToken contract", function () {
  let contractVHSToken, contractVideoNFT;
  before("deploy the contract instance first", async function () {
    const ContractVideoNFT = await ethers.getContractFactory("VideoNFT");
    contractVideoNFT = await ContractVideoNFT.deploy();
    await contractVideoNFT.deployed();
    const ContractVHSToken = await ethers.getContractFactory("VHSToken");
    contractVHSToken = await ContractVHSToken.deploy(contractVideoNFT.address);
    await contractVHSToken.deployed();
  });  
  it("transfers balance to NFT contract when deployed", async function () {
    const expectedBalance = ethers.utils.parseUnits("100000000", "ether").toString();
    const actualBalance = await contractVHSToken.balanceOf(contractVideoNFT.address);
    expect(actualBalance).to.be.not.undefined;
    expect(actualBalance).to.be.not.null;
    expect(actualBalance).to.equal(expectedBalance);
  });
});
