import React, { useState, useEffect } from 'react';
import { ProductService, ProductTypeService, ProductDTO, ProductType } from '../../../Services/ProductService';
import ProductList from './ProductList';
import { AlertCircle } from 'lucide-react';
import "../../../index.css";

const ProductListPage: React.FC = () => {
    const [products, setProducts] = useState<ProductDTO[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all required data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch products and product types sequentially with proper error handling
                let productsData: ProductDTO[] = [];
                let productTypesData: ProductType[] = [];

                try {
                    productsData = await ProductService.getAll();
                } catch (err) {
                    console.error('Error fetching products:', err);
                    setError('Failed to load products. Please try again later.');
                }

                try {
                    productTypesData = await ProductTypeService.getAll();
                } catch (err) {
                    console.error('Error fetching product types:', err);
                    // Don't override the previous error if there was one
                    if (!error) {
                        setError('Failed to load product type data. Some functionality may be limited.');
                    }
                }

                setProducts(Array.isArray(productsData) ? productsData : []);
                setProductTypes(Array.isArray(productTypesData) ? productTypesData : []);
            } catch (err) {
                setError('Failed to load data. Please try again later.');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Including error in the dependency array as it's used in the effect
    }, [error]); // Add error to dependency array to fix the ESLint warning

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-red-700">{error}</span>
                    </div>
                </div>
            )}

            <ProductList
                products={products}
                productTypes={productTypes}
            />
        </div>
    );
};

export default ProductListPage;