#  Cryptocoin Insurance smart contract
![Smart contract deployed on Rinkeby test network](https://img.shields.io/badge/deployed-Rinkeby-orange.svg)  
Etherscan Rinkeby links:  
[Cryptocoin](soon)  

* [General](#general)
* [Special metods(functions)](#contracts-special-metods-review)
* [Testing](#testing)
* [Deploy](#deploy)
* [Program and Test Methodology (en)](soon)  

## General
  Information system consist of one ERC20 - compatible token processing smart contract - **Cryptocoin**. All tokens intended for distribution are emitted at the time of Cryptocoin smart contract deployment. After deploy all this tokens keeped on single wallet - **accICO**.  

## Contracts special metods review  

#### Transfer ownership
Two-step-change-ownership pattern is implemented, where the ownership needs to be claimed.  
Current owner (with its key)  send  0 ETH transaction with transferOwnership(newOwner), where newOwner is address of new owner.  
After that new owner must send  0 ETH transaction with claimOwnership(). The ownership will be finally changed  when   this  second transaction be confirmed. 

####  reclaimToken(token)
Contract owner can claim any tokens that transfered to this contract address.

## Testing
  Unit tests for this smart contracts have designed with Truffle framework. Please, use [original recommendation](https://truffleframework.com/docs) for Truffle/node install. All tests are in the `./test` folder. 
 
* for start  **all** truffle tests in the root  test  folder please clone repository in your folder and then:
```bash
 cd ./smartcontracts
 truffle develop  
 truffle test 
 ```

## Deploy
### PreDeploy
There are 2 separate addresses used for these smart contract. Please
Prepare 2 Ethereum accounts:  
1. _Owner_ - deploy smart contracts from this address  and  use for call onlyOwner methods (see source code);
2. _accICO_ - all tokens for  sale;
Please, keep secret keys very safely !!!  

### Deploy
1. Deploy **Cryptocoin** smart  contract. Specify the appropriate adress and totalSupply token amount in the constructor parameters.  

Ok - now your smart contract (and  coin) ready for long happy life. Good Luck!!!
