import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Plus, Edit, ChevronUp, ChevronDown } from 'lucide-react';
import { ProductDTO, ProductType } from '../../../Services/ProductService';
import "../../../index.css";

interface ProductListProps {
    products?: ProductDTO[];
    productTypes?: ProductType[];
}

const ProductList: React.FC<ProductListProps> = ({ products = [], productTypes = [] }) => {
    const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<keyof ProductDTO | 'productType'>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // Helper to get product type name from ID
    const getProductTypeName = useCallback((productTypeId: number) => {
        return productTypes.find(pt => pt.id === productTypeId)?.name || 'Unknown';
    }, [productTypes]);

    // Reset page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Filter and sort products
    useEffect(() => {
        if (!Array.isArray(products)) {
            console.error('Products is not an array:', products);
            return;
        }

        let result = [...products];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(product =>
                product.name.toLowerCase().includes(term) ||
                getProductTypeName(product.productTypeId).toLowerCase().includes(term)
            );
        }

        result.sort((a, b) => {
            let valueA: string | number | boolean;
            let valueB: string | number | boolean;

            if (sortColumn === 'productType') {
                valueA = getProductTypeName(a.productTypeId);
                valueB = getProductTypeName(b.productTypeId);
            } else {
                valueA = a[sortColumn] as string | number | boolean;
                valueB = b[sortColumn] as string | number | boolean;
            }

            // Handle different data types for sorting
            if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
                return sortDirection === 'asc'
                    ? (valueA === valueB ? 0 : valueA ? -1 : 1)
                    : (valueA === valueB ? 0 : valueA ? 1 : -1);
            } else if (typeof valueA === 'number' && typeof valueB === 'number') {
                return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
            } else {
                // Convert to string for string comparison
                const strA = String(valueA || '');
                const strB = String(valueB || '');
                return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
            }
        });

        setFilteredProducts(result);
    }, [products, searchTerm, sortColumn, sortDirection, getProductTypeName]);

    const toggleSort = (column: keyof ProductDTO | 'productType') => {
        // Reset to page 1 when sort criteria changes
        setCurrentPage(1);

        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const totalPages = Math.ceil(filteredProducts.length / recordsPerPage);
    const displayedProducts = filteredProducts.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

    return (
        <div className="w-full p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
                <Link to="/admin/products/new" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                </Link>
            </div>

            <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search products"
            />

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            {['isActive', 'name', 'productType'].map(column => (
                                <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => toggleSort(column as keyof ProductDTO | 'productType')}>
                                    <div className="flex items-center">
                                        <span>{column === 'isActive' ? 'Status' : column === 'productType' ? 'Product Type' : column.charAt(0).toUpperCase() + column.slice(1)}</span>
                                        <span className="ml-1">
                                            {sortColumn === column && (
                                                sortDirection === 'asc'
                                                    ? <ChevronUp className="w-4 h-4" />
                                                    : <ChevronDown className="w-4 h-4" />
                                            )}
                                        </span>
                                    </div>
                                </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {displayedProducts.length > 0 ? (
                            displayedProducts.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 flex items-center">
                                        {product.isActive ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                        <span className="ml-2 text-sm text-gray-500">{product.isActive ? 'Active' : 'Inactive'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{getProductTypeName(product.productTypeId)}</td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <Link to={`/admin/products/${product.id}`} className="text-blue-600 hover:text-blue-900"><Edit className="h-5 w-5" /></Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No products found matching your search criteria
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="px-3 py-1 bg-gray-300 rounded-md disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="px-3 py-1 bg-gray-300 rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductList;