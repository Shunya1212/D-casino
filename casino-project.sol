// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Roulette {
    address public owner;

    // コンストラクタがpayableになっているため、デプロイ時にコントラクトにETHを送ることが可能
    constructor() payable {
        owner = msg.sender;
    }

    event BetResult(bool win);

    // プレイヤーが数字を選択して賭ける関数
function placeBet(uint guess, uint result) public payable returns (bool)  {
    require(msg.value ==  0.000000000000000005 ether, "Bet amount must be  0.000000000000000005 ETH");
    require(guess % 2 == 0 || guess % 5 == 0, "You can only bet on multiples of 2, 5, or 10.");

    bool chercker = false;
    
    // 10の倍数の場合、掛け金の10倍を返す
    if (guess == 10 && result % 10 == 0) {
        chercker = true;
    }
    // 5の倍数の場合、掛け金の5倍を返す
    else if (guess == 5 && result % 5 == 0) {
        chercker = true;
    }
    // 2の倍数の場合、掛け金の2倍を返す
    else if (guess == 2 && result % 2 == 0) {
        chercker = true;
    }
    
    if (chercker = true) {
        payable(msg.sender).transfer(msg.value * guess);
        
    }
    return chercker;
    
}


    // コントラクトの残高を確認する関数。オーナーのみが実行可能。
    function getBalance() public view returns (uint) {
        // require(msg.sender == owner, "Only the owner can check the balance.");
        return address(this).balance;
    }

    // コントラクトを破棄し、残高をオーナーに送る関数。オーナーのみが実行可能。
    function destroy() public {
        require(msg.sender == owner, "Only the owner can destroy this contract.");
        payable(owner).transfer(address(this).balance);
    }
}
