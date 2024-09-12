import React, { useState, useEffect } from 'react';
import { BrowserProvider, formatEther } from 'ethers';  // Use BrowserProvider in ethers v6

const App = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  // Function to connect to MetaMask
  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setAccount(account);

        // Create a provider and fetch balance
        const provider = new BrowserProvider(window.ethereum);  // Use BrowserProvider
        const balance = await provider.getBalance(account);  // Fetch balance
        setBalance(formatEther(balance));  // Format the fetched balance
      } catch (error) {
        console.error("MetaMask connection error: ", error);
      }
    } else {
      alert('MetaMask is not installed!');
    }
  };

  // Function to disconnect from MetaMask (simulated)
  const disconnectMetaMask = () => {
    setAccount(null);
    setBalance(null);
  };

  useEffect(() => {
    // Optional: Auto-connect if MetaMask is already connected
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          connectMetaMask();
        } else {
          disconnectMetaMask();
        }
      });
    }
  }, []);

  return (
    <div>
      <header>
        {account ? (
          <div style={{ textAlign: 'right' }}>
            <p>Account: {account}</p>
            <p>Balance: {balance} ETH</p>
            <button onClick={disconnectMetaMask}>Logout</button>
          </div>
        ) : (
          <button onClick={connectMetaMask}>Login with MetaMask</button>
        )}
      </header>
      <main>
        <h1>Welcome to the NFT Exchange</h1>
        {/* Add your main app content here */}
      </main>
    </div>
  );
};

export default App;
