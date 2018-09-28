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
var balanceAcc2After;
var balanceAccICOBefore;

contract('Cryptocoin functionality tests - 02',function (accounts) {

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

    describe('Account transfers the tokens to other account, there are enough   tokens '
                +'\r\n Expected behaviour: The attempt is successful. And the transfer has to happen', function(){
        it('02.01_transfer_from_accICO_account_to_other_account', function() {
  
  
            return MyERC20.balanceOf.call(accounts[2]).then(function(callResult){
                //console.log('balanceAcc2Before',callResult.toNumber());
                balanceAcc2Before = callResult.toNumber();
                return MyERC20.balanceOf.call(AccICO);
            }).then(function(callResult){
                //console.log('balanceAccICOBefore',callResult.toNumber());
                balanceAccICOBefore = callResult.toNumber();
                return MyERC20.transfer(accounts[2],amount_transfer,{from: AccICO, gasPrice: web3.toWei(1,"Gwei")});
            }).then(function(txResult){
                //console.log('transfer happened');
                event=txResult.logs.find(e => e.event === 'Transfer').event;
                return MyERC20.balanceOf(accounts[2]);

            }).then(function(callResult){
                balanceAcc2After=callResult;
                //console.log('balanceAcc2After=', callResult);
                assert.equal(callResult.minus(balanceAcc2Before)
                        ,amount_transfer, 'ERROR  of   token transfer');
            });   
        });
         


        it('02.01.01_transfer_from_accICO_account_to_other_account_Check_event', function() {
             assert.equal(event,'Transfer', "the event has to be @Transfer@");
                       
        });
  
        it('02.01.02_transfer_from_accICO_account_to_other_account_Check_balance of sender', function() {

            return MyERC20.balanceOf.call(AccICO).then(function(callResult){
                //console.log('balanceAccICOAfter',callResult);
                //balanceAcc2Before = callResult.toNumber();
                //res=balanceAccICOBefore.minus(callResult);
                assert.equal(callResult.add(amount_transfer).minus(balanceAccICOBefore),0,"the transfer is incorrect!!!"); 
            });        
        });        
 
    });

    describe('Account tries to transfer the tokens to other when the account is 0 or the account has not enough balance'
                +'\r\n Expected behaviour: The attempts are failed. And the transfers have not happen', function(){
        it('02.02_transfer_from_accICO_to_0', function() {
  
  
                
                    return MyERC20.transfer('0x0000000000000000000000000000000000000000',amount_transfer,{from: accounts[2], gasPrice: web3.toWei(1,"Gwei")}).catch(function(err) {
                                console.log("ERROR! - OK. The transfer has not happened.", err.toString());
              
            }).then(function(txResult){
                return MyERC20.balanceOf(accounts[2]);

            }).then(function(callResult){
                //console.log('balanceAcc2After=', callResult);
                //console.log('balanceAcc2Before=', balanceAcc2After);
                
                assert.equal(callResult.minus(balanceAcc2After),0
                        , 'the balance has changed!!!');
            });   
        });
        

        it('02.03_transfer_the_tokens_Amount_of transfer is more than the balance', function() {
  
  
                
                    return MyERC20.transfer(accounts[3],amount_transfer+1,{from: accounts[2], gasPrice: web3.toWei(1,"Gwei")}).catch(function(err) {
                                console.log("ERROR! - OK. The transfer has not happened.", err.toString());
              
            }).then(function(txResult){
                return MyERC20.balanceOf(accounts[2]);

            }).then(function(callResult){
                //console.log('balanceAcc2After=', callResult);
                //console.log('balanceAcc2before=', balanceAcc2After);
                assert.equal(callResult.minus(balanceAcc2After),0
                        , 'the balance has changed!!!');
            });   
        });
 
    });


});







                  



   

