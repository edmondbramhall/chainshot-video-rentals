const fs = require('fs');

async function main() {
  const VideoRentals = await hre.ethers.getContractFactory("VideoRentals");
  const accounts = await hre.ethers.provider.listAccounts();
  const videoRentals = await VideoRentals.deploy(accounts);

  await videoRentals.deployed();

  console.log("VideoRentals deployed to:", videoRentals.address);

  const config = {
    address: videoRentals.address
  }

  fs.writeFileSync("./app/__config.json", JSON.stringify(config, null, 2));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });