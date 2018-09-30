#  Cryptocoin Insurance smart contract
![Smart contract deployed on Rinkeby test network](https://img.shields.io/badge/Rinkeby-deployed-green.svg)
![Smart contract waiting for deploy in Ethereum MainNet network](https://img.shields.io/badge/Mainnet-waiting-orange.svg)  
[Etherscan Rinkeby, deployed Cryptocoin](https://rinkeby.etherscan.io/address/0x0b229369f9093bcdc42e4b4a645817bb93f93baf#code)  

* [General](#general)
* [Special metods(functions)](#contracts-special-metods-review)
* [Deploy](#deploy)
* [Testing](#testing)
* [The program and methodology of testing](https://docs.google.com/spreadsheets/d/1nyZdzjfAawgaKJfSwIX6bcg4GlMDSro2N62A6v5ysuo/edit?usp=sharing)
* [Testing log](20180930_test.log)

## General
  Information system consist of one ERC20 - compatible token processing smart contract - **Cryptocoin**. All tokens intended for distribution are emitted at the time of Cryptocoin smart contract deployment. After deploy all this tokens keeped on single wallet - **accICO**.  

## Contracts special metods review  

#### Transfer ownership
Two-step-change-ownership pattern is implemented, where the ownership needs to be claimed.  
Current owner (with its key)  send 0 ETH transaction with transferOwnership(newOwner), where _newOwner_ is address of new owner.  
After that new owner must send  0 ETH transaction with claimOwnership(). The ownership will be finally changed  when this second transaction be confirmed. 

####  reclaimToken(token)
Contract owner can claim any tokens that transfered to this contract address.

## Testing
  Unit tests for this smart contracts have designed with Truffle framework. Please, use [original recommendation](https://truffleframework.com/docs) for Truffle/node install. All tests are in the `./test` folder. 
 
* for start  **all** truffle tests in the root test  folder please clone repository in your folder and then:
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
1. Deploy **Cryptocoin** smart  contract from _Owner_ account. Specify the appropriate adress(_accICO_) and _totalSupply_ token amount in the constructor parameters. 

Ok - now your smart contract (and  coin) ready for long happy life. Good Luck!!!


Used Rinkeby accounts:
```
Owner
0DBBE8E4AE425A6D2687F1A7E3BA17BC98C673636790F1B8AD91193C05875EF1
0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef

accICO
ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f
0xf17f52151EbEF6C7334FAD080c5704D77216b732
```
