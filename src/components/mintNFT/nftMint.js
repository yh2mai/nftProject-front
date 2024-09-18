import { ethers } from 'ethers';

// Your deployed contract address and ABI
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS';
const CONTRACT_ABI = [
  // Add your contract ABI here
];

export const mintNFT = async (ipfsHash) => {
  const tokenURI = `https://ipfs.io/ipfs/${ipfsHash}`;
  
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    try {
      const tx = await contract.mintNFT(await signer.getAddress(), tokenURI);
      await tx.wait(); // Wait for the transaction to be confirmed
      console.log('NFT minted successfully: ', tx);
    } catch (error) {
      console.error('Error minting NFT: ', error);
      throw error;
    }
  } else {
    throw new Error('MetaMask is not installed');
  }
};
