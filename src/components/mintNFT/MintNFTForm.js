import React, { useState } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import axios from 'axios';
import MyNFTContractABI from './MyNFT.json'; // Update this path if necessary

const MintNFTForm = ({ account }) => {
    const [file, setFile] = useState(null);
    const [nftName, setNftName] = useState('');
    const [status, setStatus] = useState('');

    // Replace these with your contract address and Pinata API keys
    const contractAddress = '0xb6538dc5d6c6873fb4a1bec92e5e3031b3d0467d';
    const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
    const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_KEY;

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleNftNameChange = (event) => {
        setNftName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file || !nftName) {
            alert('Please upload an image and provide a name for the NFT');
            return;
        }

        try {
            setStatus('Uploading image to IPFS via Pinata...');
            
            // Step 1: Upload the image to Pinata
            const pinataUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
            let formData = new FormData();
            formData.append('file', file);

            const fileResponse = await axios.post(pinataUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    pinata_api_key: pinataApiKey,
                    pinata_secret_api_key: pinataSecretApiKey,
                },
            });

            const fileHash = fileResponse.data.IpfsHash;
            const tokenURI = `ipfs://${fileHash}`;

            setStatus(`Image uploaded to IPFS with hash: ${fileHash}. Now minting NFT...`);

            // Step 2: Mint the NFT using ethers.js
            if (typeof window.ethereum !== 'undefined') {
                // Request access to MetaMask
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                // Create a provider and get the signer using BrowserProvider
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();

                // Connect to the contract
                const contract = new Contract(contractAddress, MyNFTContractABI.abi, signer);

                // Step 3: Call the mint function
                const mintTx = await contract.mintNFT(account, tokenURI);

                setStatus('Transaction sent. Waiting for confirmation...');
                await mintTx.wait();

                setStatus(`Minting successful! Transaction Hash: ${mintTx.hash}`);
            } else {
                setStatus('Ethereum wallet not detected. Please install MetaMask.');
            }
        } catch (error) {
            console.error('Minting failed:', error);
            setStatus('Minting failed. Please try again.');
        }
    };

    return (
        <div>
            <h1>Mint Your NFT</h1>
            {account ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            NFT Name:
                            <input type="text" value={nftName} onChange={handleNftNameChange} required />
                        </label>
                    </div>
                    <div>
                        <label>
                            Upload Image:
                            <input type="file" onChange={handleFileChange} required />
                        </label>
                    </div>
                    <button type="submit">Mint NFT</button>
                </form>
            ) : (
                <p>Please connect your MetaMask account to mint an NFT.</p>
            )}
            <p>Status: {status}</p>
        </div>
    );
};

export default MintNFTForm;