import { ethers } from 'ethers';

const API_BASE_URL = "https://api.opensea.io/api/v2/chain/ethereum/account";
const API_KEY = process.env.REACT_APP_OPENSEA_API_KEY;  // Ensure your OpenSea API key is in .env

// Function to connect MetaMask
export const connectMetaMask = async () => {
    if (window.ethereum) {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const account = await signer.getAddress();  // Corrected for Ethers.js v6
            return account;
        } catch (error) {
            console.error("MetaMask connection error:", error);
            return null;
        }
    } else {
        alert("MetaMask not detected. Please install MetaMask.");
        return null;
    }
};

// Function to fetch NFTs for a connected MetaMask account
export const fetchNFTsForAccount = async (chain, account) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${account}/nfts`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-API-KEY': API_KEY,  // Include your OpenSea API Key
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching NFTs: ${response.statusText}`);
        }

        const data = await response.json();
        return data.nfts || [];
    } catch (error) {
        console.error("Error fetching NFTs:", error);
        return [];
    }
};
