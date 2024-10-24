import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MintNFTForm from './components/mintNFT/MintNFTForm';
import NftListings from './components/NftListings';
import NftItem from './components/NftItem';
import ListNFTForSaleForm from './components/ListNFTForSaleForm'; // Import the new form component
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
                            <Link to="/">Home (NFTs)</Link>
                        </li>
                        <li>
                            <Link to="/mint">Mint NFT</Link>
                        </li>
                        <li>
                            <Link to="/listings">Listings</Link>
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route
                        path="/"
                        element={
                            !account ? (
                                <button onClick={connectMetaMask}>Login with MetaMask</button>
                            ) : (
                                <div>
                                    <h1>NFTs for Account: {account}</h1>
                                    <div className="nft-list">
                                        {nfts && nfts.length > 0 ? (
                                            nfts.map((nft, index) => (
                                                <NftItem key={index} nft={nft} account={account} />
                                            ))
                                        ) : (
                                            <p>No NFTs found for this account.</p>
                                        )}
                                    </div>
                                </div>
                            )
                        }
                    />
                    <Route path="/mint" element={<MintNFTForm account={account} />} />
                    <Route path="/listings" element={<NftListings />} />
                    <Route path="/list-for-sale" element={<ListNFTForSaleForm />} /> {/* Route for listing form */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
