var Cryptocoin = artifacts.require("./Cryptocoin.sol");

module.exports = function(deployer) {
  deployer.deploy(Cryptocoin, web3.eth.accounts[1], //accICO
                            100000000 //!!! without decimals ICO -100000000*(10**18)
    );
};

