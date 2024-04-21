// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Roulette {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // 賭けを受け付ける
    function placeBet() public payable {
        require(msg.value == 0.000005 ether, "Bet amount must be 0.5 ETH");
        // ランダムな結果を生成する（簡略化のために固定値を使用）
        bool win = (block.timestamp % 2 == 0);

        if (win) {
            // 勝った場合は賭け金の2倍を支払う
            payable(msg.sender).transfer(msg.value * 2);
        }
    }

    // コントラクトの残高を確認する
    function getBalance() public view returns (uint) {
        require(msg.sender == owner, "Only the owner can check the balance.");
        return address(this).balance;
    }

    // コントラクトを破棄して残高をオーナーに送る
    function destroy() public {
        require(msg.sender == owner, "Only the owner can destroy this contract.");
        payable(owner).transfer(address(this).balance);
    }
}
