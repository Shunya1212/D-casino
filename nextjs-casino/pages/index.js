import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

import { Roulette, useRoulette } from 'react-hook-roulette';
const options = [2, 5, 10];

const items = [
  { name: '1', style: { backgroundColor: "#64b031"} },
  { name: '2' },
  { name: '3' },
  { name: '4' },
  { name: '5' },
  { name: '6' },
  { name: '7' },
  { name: '8' },
  { name: '9' },
  { name: '10' },
  { name: '11' },
  { name: '12' },
  { name: '13' },
  { name: '14' },
  { name: '15' },
  { name: '16' },
  { name: '17' },
  { name: '18' },
  { name: '19' },
  { name: '20' },
];

const Home = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [betStatus, setBetStatus] = useState('');
  const {roulette, onStart, onStop, result } = useRoulette({ items });
  const [selectedNumber, setSelectedNumber] = useState(options[2]);
  const [betResult, setBetResult] = useState('Will you be Rich or Poor?');
  const [multiplier, setMultiplier] = useState(false);

  useEffect(() => {
    const ethereum = window.ethereum;
    if (ethereum) {
      ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || '');
      });
    }
  }, []);

  useEffect(() => {
    if (result !== null) {  // 結果が設定されたら自動的に賭けを行う
      placeBet();
    }
  }, [result]); 

  const initializeWeb3 = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        setBetStatus('Connected');
      } catch (error) {
        setBetStatus('Error connecting to MetaMask');
      }
    } else {
      setBetStatus('Please install MetaMask');
    }
  };

  const placeBet = async () => {
    setMultiplier(false);
    setBetResult('');
    setBetStatus('');

    if (!web3) {
      setBetStatus('Please connect to MetaMask first');
      return;
    }

    const contractAddress = '0x85054D4d16Dffa57db64380836283229C72AaFb5';
    const contractABI = [
      {
        "inputs": [],
        "stateMutability": "payable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "bool",
            "name": "win",
            "type": "bool"
          }
        ],
        "name": "BetResult",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "destroy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "guess",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "result",
            "type": "uint256"
          }
        ],
        "name": "placeBet",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "payable",
        "type": "function"
      }
    ]

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    setBetStatus('Placing bet...');
    
    try {
      const guess = parseInt(result, 10);
      const response = await contract.methods.placeBet(selectedNumber, guess).send({
        from: account,
        value: web3.utils.toWei(' 0.000000000000000005', 'ether'),
        gas: 2000000 // Adjust the gas limit based on the requirement
      });
      // If the promise resolves successfully, it means the transaction was sent. Now you can set up an event listener for the confirmation.
      setBetStatus('Bet placed successfully!');

      if (guess % selectedNumber != 0) {
        setBetResult('Haha! You are LOSER');
      } else {
        setBetResult('Congrats, You are WINNER');
      }
      
    } catch (error) {
      setBetStatus('Error placing bet: ' + error.message);
    } 
  };

  return (
    <div className='checkeredBackground'>
      <div className="mt-2 vstack items-center">
      <Roulette roulette={roulette} className="roulette-background" />
      <select value={selectedNumber} onChange={(e) => setSelectedNumber(Number(e.target.value))}>
        {options.map((number) => (
          <option key={number} value={number}>
            {number}
          </option>
        ))}
      </select>
      <div className="hstack">
        <button type="button" onClick={onStart}>
          Start
        </button>
        <button type="button" onClick={onStop}>
          Stop
        </button>
      </div>
      <p>Result: {result}</p>
      {betStatus && <p>{betStatus}</p>}
      <p>{betResult}</p>
      <button onClick={initializeWeb3}>Connect to MetaMask</button>
      
    </div>
      {/* <button onClick={placeBet} disabled={!account}>Place Bet (0.0005 ETH)</button> */}
    </div>
  );
};

export default Home;

