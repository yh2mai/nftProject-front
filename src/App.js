import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import necessary components for routing
import MintNFTForm from './components/mintNFT/MintNFTForm';
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
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home (NFTs)</Link> {/* Link to home (NFT display) */}
                        </li>
                        <li>
                            <Link to="/mint">Mint NFT</Link> {/* Link to minting page */}
                        </li>
                    </ul>
                </nav>

                <Routes>
                    {/* Route for displaying NFTs */}
                    <Route path="/" element={
                        !account ? (
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
                                                <p>{nft.name ? nft.name : 'No name available'}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No NFTs found for this account.</p>
                                    )}
                                </div>
                            </div>
                        )
                    } />

                    {/* Route for minting new NFTs */}
                    <Route path="/mint" element={<MintNFTForm account={account} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
