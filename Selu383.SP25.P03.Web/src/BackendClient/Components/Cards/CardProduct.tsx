import React, { FC } from 'react';
import { Product } from '../Constants/types';


interface ProductCardProps {
    product: Product;
    onAddToCart?: (productId: number) => void;
}

const CardProduct: FC<ProductCardProps> = ({ product, onAddToCart }) => {
    const { id, name, description, price, imageUrl, inStock, rating } = product;

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-48 object-cover"
                />
                {!inStock && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 text-sm rounded-full">
                        Out of Stock
                    </span>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                    {name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {description}
                </p>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-gray-900">
                        ${price.toFixed(2)}
                    </span>
                    <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                            <svg
                                key={index}
                                className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => onAddToCart?.(id)}
                    disabled={!inStock}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${inStock
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
};

export default CardProduct;
