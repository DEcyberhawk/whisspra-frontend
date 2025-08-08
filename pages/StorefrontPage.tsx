
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, MarketplaceItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StorefrontHeader from '../components/storefront/StorefrontHeader';
import StorefrontItemCard from '../components/storefront/StorefrontItemCard';
import PurchaseItemModal from '../components/marketplace/PurchaseItemModal';

const API_URL = 'http://localhost:5000/api';

const StorefrontPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { theme } = useTheme();
    const [creator, setCreator] = useState<User | null>(null);
    const [items, setItems] = useState<MarketplaceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);

    const fetchData = async () => {
        if (!userId) {
            setError("Creator not found.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/store/${userId}`);
            if (!response.ok) {
                throw new Error('Could not load creator storefront.');
            }
            const data = await response.json();
            setCreator(data.creator);
            setItems(data.items);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    return (
        <div className={`${theme} bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 min-h-screen font-sans antialiased`}>
            {selectedItem && <PurchaseItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onPurchaseSuccess={fetchData} />}

            <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-700/[0.05] dark:bg-grid-slate-700/[0.2] [mask-image:linear-gradient(to_bottom,white_10%,transparent_100%)]"></div>
            <div className="relative z-10">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    {loading && <div className="text-center py-20">Loading Storefront...</div>}
                    {error && <div className="text-center py-20 text-red-400">Error: {error}</div>}
                    {!loading && !error && creator && (
                        <>
                            <StorefrontHeader creator={creator} />
                            <div className="mt-12">
                                <h2 className="text-2xl font-bold text-white mb-6">Products</h2>
                                {items.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {items.map(item => (
                                            <StorefrontItemCard key={item._id} item={item} onSelect={() => setSelectedItem(item)} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-slate-800/50 rounded-lg border border-dashed border-slate-700">
                                        <p className="text-slate-400">{creator.name} hasn't listed any items yet.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default StorefrontPage;
