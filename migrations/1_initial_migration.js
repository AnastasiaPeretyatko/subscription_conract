const MyToken = artifacts.require("MyToken");
const MyContract = artifacts.require("MyContract");

module.exports = async function (deployer) {
  // Развертывание токена
  await deployer.deploy(MyToken);

  const myToken = await MyToken.deployed();
  
  // Развертывание контракта с токеном
  await deployer.deploy(MyContract, myToken.address);
};
