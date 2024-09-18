import React, { useState } from 'react';

const MintNFTForm = ({ account }) => {
    const [file, setFile] = useState(null);
    const [nftName, setNftName] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleNftNameChange = (event) => {
        setNftName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!file || !nftName) {
            alert("Please upload an image and provide a name for the NFT");
            return;
        }

        // Call function to mint NFT using MetaMask, Pinata, or any other service.
        console.log(`Minting NFT for account: ${account}`);
        // Add minting logic here
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
        </div>
    );
};

export default MintNFTForm;
