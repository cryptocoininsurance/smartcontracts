var Cryptocoin = artifacts.require("./Cryptocoin.sol");
var MyERC20;
var gasUsedwei=0;
var gasUsed=0;
var _totalSupply;
var event;
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

contract('Cryptocoin functionality tests - 04',function (accounts) {

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


    describe('Account burns their own tokens. The Token amount is more than the balance amount'
                    +'\r\n Expected behaviour: The attempt is failed. totalSupply and balance of account have not decreased', function(){
            it('04.00_burn their own tokens unsuccessfully', function() {
                    return MyERC20.balanceOf.call(AccICO).then(function(callResult){
                        balanceAccICOBefore=callResult;
                        //console.log('balanceAccICOBefore=', balanceAccICOBefore);
                    return MyERC20.burn(balanceAccICOBefore.add(10), {from: AccICO, 
                                        gasPrice: web3.toWei(1,"Gwei")}).catch(function(err) {
                                    console.log("ERROR! - OK. The burning has not happened.", err.toString());
                               });       
                }).then(function(txResult){
                    return MyERC20.balanceOf(AccICO);
                }).then(function(callResult){
                    //console.log('balanceAccICOAfter=', callResult);
                    assert.equal(callResult.minus(balanceAccICOBefore),0 
                                   , 'the balance has changed!!!');

                });
            });


              it('04.03_burn their own tokens unsuccessfully. Check totalSupply', function() {
                return MyERC20.totalSupply().then(function(callResult){
                    //console.log('_totalSupply_after=', callResult);
                    assert.equal(callResult.minus(_totalSupply),0, "totalSupply has changed!!!");
                });
            });

    });



    describe('Account burns their own tokens'
                    +'\r\n Expected behaviour: The attempt is successful. totalSupply and balance of account have decreased', function(){
            it('04.01_burn their own tokens successfully', function() {
                    return MyERC20.balanceOf.call(AccICO).then(function(callResult){
                        balanceAccICOBefore=callResult;
                        //console.log('balanceAccICOBefore=', balanceAccICOBefore);
                    return MyERC20.burn(balanceAccICOBefore, {from: AccICO, 
                                        gasPrice: web3.toWei(1,"Gwei")});
                }).then(function(txResult){
                    event=txResult.logs.find(e => e.event === 'Transfer').event;
                    return MyERC20.balanceOf(AccICO);
                }).then(function(callResult){
                    //console.log('balanceAccICOAfter=', callResult);
                    assert.equal(callResult,0 
                                   , 'ERROR  of   burning of token');

                });
            });

             it('04.02_burn their own tokens successfully. Check event', function() {
                assert.equal(event,'Transfer', "the event has to be @Transfer@");
            });
            

              it('04.03_burn their own tokens successfully. Check totalSupply', function() {
                return MyERC20.totalSupply().then(function(callResult){
                    //console.log('_totalSupply_after=', callResult);
                    assert.equal(callResult,0, "totalSupply has not decreased during burning time");
                });
            });

    });


});







                  



   

