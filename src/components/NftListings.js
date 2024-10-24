import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NftListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the listing data from the backend
        axios.get('http://localhost:5000/api/nfts/listings')
            .then(response => {
                setListings(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the NFT listings!", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>All NFT Listings</h1>
            <div className="nft-listings">
                {listings.length === 0 ? (
                    <p>No NFTs listed yet</p>
                ) : (
                    listings.map(listing => (
                        <div key={listing.tokenId} className="nft-listing">
                            <h2>{listing.nftName}</h2>
                            <img src={listing.imageUrl} alt={listing.nftName} width="200px" />
                            <p>Price: {listing.price} ETH</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NftListings;
