require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});
module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./app/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 31337
    },    
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.VITE_PRIVATE_KEY]
    },
    ropsten: {
      url: process.env.ROPSTEN_URL,
      accounts: [process.env.VITE_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: { 
      rinkeby: "MIU56BADFVZU71TP1W3Y9HVHP6NP5R96CK" 
    }
  }
};
