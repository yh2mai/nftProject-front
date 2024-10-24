import React from 'react';
import { useNavigate } from 'react-router-dom';

const NftItem = ({ nft, account }) => {
    const navigate = useNavigate();

    const handleListForSale = () => {
        // Navigate to the form with the selected NFT details
        navigate('/list-for-sale', { state: { nft, account } });
    };

    return (
        <div className="nft-item">
            {nft.image_url ? (
                <img src={nft.image_url} alt={`NFT ${nft.name}`} />
            ) : (
                <p>No image available</p>
            )}
            <p>{nft.name ? nft.name : 'No name available'}</p>
            <button onClick={handleListForSale}>List for Sale</button>
        </div>
    );
};

export default NftItem;
