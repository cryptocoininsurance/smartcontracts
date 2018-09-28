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
var amount_transfer=1000;
var balanceAcc2Before;
var balanceAcc4Before;
var balanceAcc2After;
var balanceAccICOBefore;
var allowance_before;

contract('Cryptocoin functionality tests - 03',function (accounts) {

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


describe('Account tries to give the allowance to account 0'
                +'\r\n Expected behaviour: The attempt is failed. The allowance is not gotten', function(){
        it('03.01_to give the allowance_to account 0', function() {

          return MyERC20.approve('0x0000000000000000000000000000000000000000', amount_transfer, 
                                    {from: accounts[2], gasPrice: web3.toWei(1,"Gwei")}).catch(function(err) {
                                        console.log("ERROR! - OK. The allowance is not gotten.", err.toString());
              
            }).then(function(txResult){
                return true;
            });
        });

        it('03.02_to_increase the allowance_to account 0', function() {

          return MyERC20.increaseAllowance('0x0000000000000000000000000000000000000000', amount_transfer, 
                                    {from: accounts[2], gasPrice: web3.toWei(1,"Gwei")}).catch(function(err) {
                                        console.log("ERROR! - OK. The allowance is not gotten.", err.toString());
              
            }).then(function(txResult){
                return true;
            });
        });

        it('03.03_to_decrease the allowance_to account 0', function() {

          return MyERC20.decreaseAllowance('0x0000000000000000000000000000000000000000', amount_transfer, 
                                    {from: accounts[2], gasPrice: web3.toWei(1,"Gwei")}).catch(function(err) {
                                        console.log("ERROR! - OK. The allowance is not gotten.", err.toString());
              
            }).then(function(txResult){
                return true;
            });
        });
    });

    
    describe('Account tries to give the allowance to account. Account of spender is not 0'
                +'\r\n Expected behaviour: The attempt is successful. The allowance is gotten', function(){

            it('03.04_to approve_2_to_3', function() {
        
                return MyERC20.allowance(accounts[2], accounts[3]).then(function(callResult){
                    //console.log('allowance_before',callResult);
                    allowance_before = callResult.toNumber();
                    return MyERC20.approve(accounts[3], amount_transfer, {from: accounts[2], gasPrice: web3.toWei(1,"Gwei")});
                }).then(function(txResult){
                    event=txResult.logs.find(e => e.event === 'Approval').event;
                    return MyERC20.allowance(accounts[2], accounts[3]);
                }).then(function(callResult){
                    //console.log('allowance_after',callResult);
                    assert.equal(callResult.minus(allowance_before),amount_transfer, 'the allowance has to be granted!');
                });
            });

            it('03.04.01_to approve_2_to_3_Check_event', function() {
                assert.equal(event,'Approval', "the event has to be @Approval@");
                       
            });

            it('03.05_to increase allowance_2_to_3', function() {
        
                return MyERC20.allowance(accounts[2], accounts[3]).then(function(callResult){
                   // console.log('allowance_before',callResult);
                    allowance_before = callResult.toNumber();
                    return MyERC20.increaseAllowance(accounts[3], 10, {from: accounts[2], gasPrice: web3.toWei(1,"Gwei")});
                }).then(function(txResult){
                    event=txResult.logs.find(e => e.event === 'Approval').event;
                    return MyERC20.allowance(accounts[2], accounts[3]);
                }).then(function(callResult){
                    //console.log('allowance_after',callResult);
                    assert.equal(callResult.minus(allowance_before),10, 'the allowance has to be increased');
                });
            });

            it('03.05.01_to increase allowance_2_to_3_Check_event', function() {
                assert.equal(event,'Approval', "the event has to be @Approval@");
                       
            });

            it('03.06_to decrease allowance_2_to_3', function() {
        
                return MyERC20.allowance(accounts[2], accounts[3]).then(function(callResult){
                    //console.log('allowance_before',callResult);
                    allowance_before = callResult.toNumber();
                    return MyERC20.decreaseAllowance(accounts[3], 20, {from: accounts[2], gasPrice: web3.toWei(1,"Gwei")});
                }).then(function(txResult){
                    event=txResult.logs.find(e => e.event === 'Approval').event;
                    return MyERC20.allowance(accounts[2], accounts[3]);
                }).then(function(callResult){
                    //console.log('allowance_after',callResult);
                    assert.equal(callResult.add(20).minus(allowance_before),0, 'the allowance has to be decreased');
                });
            });

            it('03.05.01_to decrease allowance_2_to_3_Check_event', function() {
                assert.equal(event,'Approval', "the event has to be @Approval@");
                       
            });
        });

    describe('Account has gotten the tokens. Then spender of account tries call method @transferFrom@ in some cases when the transfer has not to happen'
                +'\r\n Expected behaviour: The attempts is failed. The transfers have not to happen', function(){
            it('03.06_transfer_from_accICO_account_to_other_account', function() {
  
  
                return MyERC20.balanceOf.call(accounts[2]).then(function(callResult){
                    //console.log('balanceAcc2Before',callResult.toNumber());
                    balanceAcc2Before = callResult.toNumber();
                    return MyERC20.balanceOf.call(AccICO);
                }).then(function(callResult){
                    //console.log('balanceAccICOBefore',callResult.toNumber());
                    balanceAccICOBefore = callResult.toNumber();
                    return MyERC20.transfer(accounts[2],amount_transfer,{from: AccICO, gasPrice: web3.toWei(1,"Gwei")});
                }).then(function(txResult){
                    return MyERC20.balanceOf(accounts[2]);
                }).then(function(callResult){
                    balanceAcc2After=callResult;
                   // console.log('balanceAcc2After=', callResult);
                    assert.equal(callResult.minus(balanceAcc2Before)
                            ,amount_transfer, 'ERROR  of   token transfer');
                });   
            }); 

            it('03.07_transferFrom_from_acc2_to account 0', function() {
                return MyERC20.transferFrom(accounts[2],'0x0000000000000000000000000000000000000000',amount_transfer,{from: accounts[3], 
                                gasPrice: web3.toWei(1,"Gwei")}).catch(function(err) {
                                    console.log("ERROR! - OK. The transfer has not happened.", err.toString());
                  
                }).then(function(txResult){
                    return MyERC20.balanceOf(accounts[2]);

                }).then(function(callResult){
                   // console.log('balanceAcc2After=', callResult);
                    
                    assert.equal(callResult.minus(balanceAcc2After),0 
                            , 'the balance is changed!');
                });   
            });

            it('03.08_transferFrom_from_acc2_to other account. The amount of  the transfer  is more  than the allowance amount ', function() {
                return MyERC20.allowance(accounts[2], accounts[3]).then(function(callResult){
                    //console.log('allowance_before=',callResult);

                    return MyERC20.transferFrom(accounts[2],accounts[4],amount_transfer,{from: accounts[3], 
                                gasPrice: web3.toWei(1,"Gwei")}).catch(function(err) {
                                    console.log("ERROR! - OK. The transfer has not happened.", err.toString());
                    });
                }).then(function(txResult){
                    return MyERC20.balanceOf(accounts[2]);

                }).then(function(callResult){
                    //console.log('balanceAcc2After=', callResult);
                    assert.equal(callResult.minus(balanceAcc2After),0 
                          , 'the balance is changed!');
                });   
            });


            it('03.09_transferFrom_from_acc2_to other account. The amount of the transfer  is more than the balance amount ', function() {
                return MyERC20.increaseAllowance(accounts[3], 20, {from: accounts[2], gasPrice: web3.toWei(1,"Gwei")}).then(function(txResult){
                    return MyERC20.allowance(accounts[2], accounts[3]);
                }).then(function(callResult){    
                    //console.log('allowance_before!!!!=',callResult);

                    return MyERC20.transferFrom(accounts[2],accounts[4],amount_transfer+10,{from: accounts[3], 
                                gasPrice: web3.toWei(1,"Gwei")}).catch(function(err) {
                                    console.log("ERROR! - OK. The transfer has not happened.", err.toString());
                    });
                }).then(function(txResult){
                    return MyERC20.balanceOf(accounts[2]);

                }).then(function(callResult){
                  //  console.log('balanceAcc2After=', callResult);
                    assert.equal(callResult.minus(balanceAcc2After),0 
                           , 'the balance is changed!');
                });   
            });
    });

    describe('Account has gotten the tokens. Then spender of account tries call method @transferFrom@  when the transfer has to happen'
                +'\r\n Expected behaviour: The attempt is successful. The transfer has to happen', function(){

            it('03.10_transferFrom_from_acc2_to other account. There are all conditions to happen the transfer', function() {

                return MyERC20.allowance(accounts[2], accounts[3]).then(function(callResult){    
                   // console.log('allowance_before_______________=',callResult);
                    allowance_before=callResult;
                    return MyERC20.balanceOf(accounts[4]);
                 }).then(function(callResult){
                    //console.log('balanceAcc4Before=', callResult);
                    balanceAcc4Before=callResult;
                    return MyERC20.transferFrom(accounts[2],accounts[4],100,{from: accounts[3], 
                                gasPrice: web3.toWei(1,"Gwei")});
                }).then(function(txResult){
                    event=txResult.logs.find(e => e.event === 'Transfer').event;
                    return MyERC20.balanceOf(accounts[2]);

                }).then(function(callResult){
                   // console.log('balanceAcc2After=', callResult);
                    assert.equal(callResult.add(100).minus(balanceAcc2After),0 
                           , 'ERROR  of   token transfer');
                });   
            });


            it('03.10.1_transferFrom_from_acc2_to other account. There are all conditions to happen the transfer. Check event', function() {
                assert.equal(event,'Transfer', "the event has to be @Transfer@");
            });

            
            it('03.10.2_transferFrom_from_acc2_to other account. There are all conditions to happen the transfer. Check balance of account4', function() {
                     return MyERC20.balanceOf(accounts[4]).then(function(callResult){    
                    //console.log('balanceAcc4After=',callResult);
                    
                    assert.equal(callResult.minus(balanceAcc4Before),100, "ERROR  of   token transfer");
                });
            });

            it('03.10.3_transferFrom_from_acc2_to other account. There are all conditions to happen the transfer. Check allowance', function() {
                     return MyERC20.allowance(accounts[2], accounts[3]).then(function(callResult){    
                    //console.log('allowance_after______________=',callResult);
                    //console.log('allowance_before______________=',allowance_before);
                    //return true;
                    assert.equal(callResult.add(100).minus(allowance_before), 0, "ERROR  of   token transfer via call of method @transferFrom@");
                });
            });


    });


});







                  



   

