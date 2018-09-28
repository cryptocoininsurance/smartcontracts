var Cryptocoin = artifacts.require("./Cryptocoin.sol");
var MyERC20;
var gasUsedwei=0;
var gasUsed=0;
var _totalSupply;
var event;
var event1;
var owner_old;
var owner_new;
var cnt;
var AccICO;
var balanceAccContractBefore;
var amount_transfer=10;
var balanceAcc8Before;
var balanceAcc9Before;

contract('Cryptocoin functionality tests - 01',function (accounts) {

    // body...
    //accounts[1], //accTDE
    //accounts[2], //accASTON
    //accounts[3], //accFoundation
    //accounts[4], //Advisors
    //accounts[5], //accBounty
    //accounts[6], //accTeam1
    //accounts[7], //accTeam2
    //accounts[8], //accTeam3

    before( function() {
        return Cryptocoin.deployed().then(function(instance){
            MyERC20 = instance;
            //have got count of tokens issue
            return MyERC20.totalSupply(); 
        }).then(function(callResult){
            _totalSupply=callResult;
            return MyERC20.accICO.call();
        }).then(function(callResult){
            AccICO=callResult;
            return true;
        });
    });

    describe('Another user (not owner) tries to change contract owner. '
                +'\r\n Expected behaviour: The attempt is failed. And the owner has not changed', function(){
         it('01.00_not owner_calls_method_of change of owner', function() {
                    owner_new=accounts[9];
                    return MyERC20.transferOwnership(owner_new, {from: accounts[1], gasPrice: web3.toWei(1,"Gwei")}).catch(function(err) {
                                console.log("ERROR! - OK. Only owner can run method of change of owner", err.toString());

               }).then(function() {
                    return MyERC20.pendingOwner.call();
                }).then(function(callResult){
                    assert.equal(callResult,'0x0000000000000000000000000000000000000000', 'The change of owner has to start' );                
                });
        });
    });


    describe('The owner tries to change contract owner . '
                +'\r\n Expected behaviour: The process of owner changing had started. But owner had not changed. The additional steps are required', function(){
        it('01.01_owner_calls', function() {
                return MyERC20.owner.call().then(function(callResult){
                    owner_old=callResult;
                    owner_new=accounts[9];
                    return MyERC20.transferOwnership(owner_new, {from: owner_old, gasPrice: web3.toWei(1,"Gwei")});
            }).then(function() {
                    return MyERC20.pendingOwner.call();
                }).then(function(callResult){
                    assert.equal(callResult,owner_new, 'The change of owner has not started' );
                });
        });

        it('01.01.0_check_the owner_after_first_action', function() {
                return MyERC20.owner.call().then(function(callResult){
                    assert.equal(callResult,owner_old, 'the owner has changed! ');
                    
                });
            });
    });



    describe('Another user (not new owner) tries to end the change  of contract owner. '
                +'\r\n Expected behaviour: The attempt is failed', function(){
        it('01.01.1_not new owner_tries_to_change user after first action', function() {
                return MyERC20.claimOwnership({from: accounts[1], gasPrice: web3.toWei(1,"Gwei")}).catch(function(err) {
                                console.log("ERROR! - OK. Only owner_new can end the change of contract owner", err.toString());

               });
           });
    });

    describe(' The new owner completes the change of owner. '
                +'\r\n Expected behaviour: the sender of this transaction is new owner', function(){
        it('01.01.2_new_owner_is_finishing_the change of owner', function() {
                return MyERC20.claimOwnership({from: owner_new, gasPrice: web3.toWei(1,"Gwei")}).
                    then(function(txResult) {
                      //  console.log('txResult', txResult);
                    cnt=0;
                    for (var i = 0; i < txResult.logs.length; i++) {
                        var log = txResult.logs[i];
                        if (log.event == "OwnershipTransferred") {
                          cnt+=1;
                        }
                    }
                assert.notEqual(cnt, 0, 'The change of owner has not happen');
                });
            });

        it('01.01.3_check_owner_after_second_action', function() {
                return MyERC20.owner.call().then(function(callResult){
                    //console.log('owner=', callResult);
                    assert.equal(callResult,owner_new, 'the owner has not changed!');
                    
                });
            });

          it('01.01.4_check_pendingOwner', function() {
                    return MyERC20.pendingOwner.call().then(function(callResult){
                    assert.equal(callResult,'0x0000000000000000000000000000000000000000', 'The change of owner has ended incorrectly!' );                
                });
        });
    });


    describe(' AccICO account transfers tokens to contract address '
                +'\r\n Expected behaviour: The transfer has to happen', function(){
        it('01.01.5_transfer_tokens_to_this_contract', function() {
            return MyERC20.balanceOf(MyERC20.address).then(function(callResult){
                //console.log('balance_1', callResult.toNumber());
                balanceAccContractBefore=callResult;
                return MyERC20.transfer(MyERC20.address,amount_transfer,
                                           {from: AccICO, gasPrice: web3.toWei(1,"Gwei")});

            }).then(function (txResult){
                return MyERC20.balanceOf(MyERC20.address)
            }).then(function (callResult){    
                assert.equal(callResult.minus(balanceAccContractBefore)
                    ,amount_transfer, 'ERROR  of   token transfer to contract address');
            });
        });

       it('01.01.6_Other account tries to get_tokens_from_address_of_this_contract', function() {
            return MyERC20.balanceOf(accounts[8]).then(function(callResult){
                //console.log('accounts[8]=', callResult.toNumber());
                balanceAcc8Before=callResult;
                return MyERC20.reclaimToken(MyERC20.address,
                                           {from: accounts[8], gasPrice: web3.toWei(1,"Gwei")}).catch(function(err) {
                                console.log("ERROR! - OK. The tokens are not gotten", err.toString());

               });

            }).then(function (txResult){
                return MyERC20.balanceOf(accounts[8])
            }).then(function (callResult){    
                //console.log('balance_acc8_after=', callResult.toNumber());
                assert.equal(callResult.minus(balanceAcc8Before)
                    ,0, 'Other user can use the tokens of contract address!');
                  //return true;
            });
        });

       it('01.01.7_Owner account tries to get_tokens_from_address of this_contract', function() {
            return MyERC20.balanceOf(owner_new).then(function(callResult){
                //console.log('balanceAcc9Before=', callResult.toNumber());
                balanceAcc9Before=callResult;
                return MyERC20.reclaimToken(MyERC20.address,
                                           {from: owner_new, gasPrice: web3.toWei(1,"Gwei")});

            }).then(function (txResult){
                event=txResult.logs.find(e => e.event === 'Transfer').event;
                return MyERC20.balanceOf(owner_new);
            }).then(function (callResult){    
                //console.log('balance_acc9_after=', callResult.toNumber());
                assert.equal(callResult.minus(balanceAcc9Before)
                    ,amount_transfer, 'Owner can not use the tokens of contract address!');
                 // return true;
            });
        });

        it('01.01.8_Owner account tries to get_tokens_from_address of this_contract_Check_event=Transfer', function() {
                        //console.log('event=', event);
            assert.equal(event,'Transfer', "the event has to be @Transfer@");
                       
                });

    });

});







                  



   

