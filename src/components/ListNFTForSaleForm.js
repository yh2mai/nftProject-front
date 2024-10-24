import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ListNFTForSaleForm = () => {
    const [price, setPrice] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { nft, account } = location.state; // Get NFT and account from the passed state

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/nfts/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    owner: account,
                    nftName: nft.name,
                    tokenId: nft.identifier,
                    price,
                    imageUrl: nft.image_url,
                }),
            });

            if (response.ok) {
                alert('NFT listed for sale successfully!');
                navigate('/listings'); // Redirect to listings page after successful listing
            } else {
                const errorData = await response.json();
                alert(`Error listing NFT: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error listing NFT:', error);
            alert('Failed to list NFT for sale.');
        }
    };

    return (
        <div>
            <h2>List {nft.name} for Sale</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Price (ETH):
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                    />
                </label>
                <button type="submit">List for Sale</button>
            </form>
        </div>
    );
};

export default ListNFTForSaleForm;
