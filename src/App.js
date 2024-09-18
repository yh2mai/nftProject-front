import React, { useState, useEffect } from 'react';
import { connectMetaMask, fetchNFTsForAccount } from './metamask';

function App() {
    const [account, setAccount] = useState(null);
    const [nfts, setNFTs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAccount = async () => {
            const acc = await connectMetaMask();
            if (acc) {
                setAccount(acc);
                try {
                    const fetchedNFTs = await fetchNFTsForAccount('ethereum', acc);
                    setNFTs(fetchedNFTs);
                } catch (fetchError) {
                    setError(fetchError.message);
                }
            }
        };
        loadAccount();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="App">
            {!account ? (
                <button onClick={connectMetaMask}>Login with MetaMask</button>
            ) : (
                <div>
                    <h1>NFTs for Account: {account}</h1>
                    <div className="nft-list">
                        {nfts && nfts.length > 0 ? (
                            nfts.map((nft, index) => (
                                <div key={index} className="nft-item">
                                    {/* Check if the image property exists before rendering */}
                                    {nft.image_url ? (
                                        <img src={nft.image_url} alt={`NFT ${index}`} />
                                    ) : (
                                        <p>No image available</p>
                                    )}
                                    <p>{nft.name? nft.name : 'No name available'}</p>
                                </div>
                            ))
                        ) : (
                            <p>No NFTs found for this account.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
