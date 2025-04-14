import React, { useState, useEffect } from 'react';
import { ProductDTO, ProductType, ProductService, ProductTypeService, TheaterService, Theater, ProductPriceDTO, ProductPriceService } from '../../../Services/ProductService';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../../index.css"

// Helper interface for DateOnly
interface DateOnlyInterface {
    year: number;
    month: number;
    day: number;
    toString(): string;
}

// Helper class for DateOnly compatibility with the API
class DateOnly implements DateOnlyInterface {
    year: number;
    month: number;
    day: number;

    constructor(date: Date) {
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1; // JavaScript months are 0-based
        this.day = date.getDate();
    }

    toString(): string {
        return `${this.year}-${this.month.toString().padStart(2, '0')}-${this.day.toString().padStart(2, '0')}`;
    }

    static fromString(dateStr: string): DateOnly {
        const [year, month, day] = dateStr.split('-').map(num => parseInt(num));
        const date = new Date(year, month - 1, day);
        return new DateOnly(date);
    }
}

const ProductFormPage: React.FC = () => {
    const { id: urlId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNewProduct = urlId === 'new' || !urlId;
    const productId = isNewProduct ? 0 : parseInt(urlId || '0');
    const pageTitle = isNewProduct ? 'Create New Product' : 'Product Details';

    // Main form state
    const [product, setProduct] = useState<ProductDTO>({
        id: 0,
        isActive: true,
        name: '',
        imageData: '', // Initialize as empty Uint8Array
        productTypeId: 0
    });

    // Price information
    const [productPrice, setProductPrice] = useState<ProductPriceDTO>({
        id: 0,
        productId: productId,
        price: 0,
        startDate: new DateOnly(new Date()).toString(),
        endDate: null
    });

    // Reference data
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [selectedTheater, setSelectedTheater] = useState<number>(0);

    // UI state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(isNewProduct);
    const [productTypeName, setProductTypeName] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // For file upload
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);

    // Load reference data (product types, theaters) and product data if editing
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                if (isNewProduct) {
                    // For new product, just load product types and theaters
                    const [productTypesData, theatersData] = await Promise.all([
                        ProductTypeService.getAll(),
                        TheaterService.getAll()
                    ]);
                    setProductTypes(Array.isArray(productTypesData) ? productTypesData : []);
                    setTheaters(Array.isArray(theatersData) ? theatersData : []);
                } else {
                    // For existing product, load product data along with product types and theaters
                    try {
                        const [productData, productTypesData, theatersData] = await Promise.all([
                            ProductService.getById(productId),
                            ProductTypeService.getAll(),
                            TheaterService.getAll()
                        ]);

                        setProduct(productData);
                        setProductTypes(Array.isArray(productTypesData) ? productTypesData : []);
                        setTheaters(Array.isArray(theatersData) ? theatersData : []);

                        // Find and store the product type name for view mode
                        const matchingProductType = productTypesData.find(pt => pt.id === productData.productTypeId);
                        if (matchingProductType) setProductTypeName(matchingProductType.name);

                        // Create image preview if imageData exists
                        if (productData.imageData && productData.imageData.length > 0) {
                            try {
                                // Convert the Uint8Array to a base64 string
                                //const binaryString = Array.from(new Uint8Array(productData.imageData))
                                //    .map(byte => String.fromCharCode(byte))
                                //    .join('');

                                //const base64Image = btoa(binaryString);
                                setImagePreview(`data:${productData.imageType || 'image/jpeg'};base64,${productData.imageData}`);
                            } catch (err) {
                                console.error('Error creating image preview:', err);
                            }
                        }

                        // Fetch product price separately to handle potential issues
                        try {
                            const productPriceData = await ProductPriceService.getByProductId(productId);

                            // Verify productPriceData is an array and not empty
                            if (Array.isArray(productPriceData) && productPriceData.length > 0) {
                                // Get the most recent price using a for loop instead of reduce to avoid potential issues
                                let currentPrice = productPriceData[0];

                                for (let i = 1; i < productPriceData.length; i++) {
                                    const currentDate = new Date(productPriceData[i].startDate);
                                    const latestDate = new Date(currentPrice.startDate);

                                    if (currentDate > latestDate) {
                                        currentPrice = productPriceData[i];
                                    }
                                }

                                setProductPrice(currentPrice);

                                // If there's a theaterId in the price data, set it as selected
                                if (currentPrice.theaterId) {
                                    setSelectedTheater(currentPrice.theaterId);
                                }
                            }
                        } catch (priceError) {
                            console.error('Error fetching product price data:', priceError);
                            // Don't fail the whole form if just the price data fails
                        }
                    } catch (err) {
                        console.error('Error loading product data:', err);
                        setError('Failed to load product data.');
                        throw err; // Rethrow to trigger the outer catch block
                    }
                }
            } catch (err) {
                console.error('Error loading data:', err);
                setError(isNewProduct ? 'Failed to load reference data.' : 'Failed to load product data.');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [productId, isNewProduct]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox separately
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setProduct(prev => ({ ...prev, [name]: checked }));
            return;
        }

        // For select inputs that should be numbers
        if (name === 'productTypeId') {
            setProduct(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
            return;
        }

        // For price field
        if (name === 'price') {
            setProductPrice(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
            return;
        }

        // For date fields
        if (name === 'startDate' || name === 'endDate') {
            if (value) {
                const date = new Date(value);
                const dateOnly = new DateOnly(date);
                setProductPrice(prev => ({ ...prev, [name]: dateOnly.toString() }));
            } else if (name === 'endDate') {
                // Allow endDate to be null
                setProductPrice(prev => ({ ...prev, [name]: null }));
            }
            return;
        }

        // For theater selection
        if (name === 'theaterId') {
            setSelectedTheater(parseInt(value) || 0);
            return;
        }

        // For all other inputs
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);

            // Create preview and convert to base64 for API submission
            const reader = new FileReader();

            // For image preview
            reader.onload = (event) => {
                if (event.target && event.target.result) {
                    const result = event.target.result as string;
                    setImagePreview(result);

                    // Extract the base64 data without the data URL prefix
                    const base64Data = result.split(',')[1];
                    setImageBase64(base64Data);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSaving(true);
            setError(null);
            setSuccessMessage(null);

            // Validate form data
            if (!product.name || product.productTypeId === 0) {
                setError('Please fill in all required fields.');
                setIsSaving(false);
                return;
            }

            if (isNewProduct && !selectedFile) {
                setError('Please select an image file.');
                setIsSaving(false);
                return;
            }

            // Create a deep copy of the product object to avoid modifying the state directly
            const productToSubmit = { ...product };

            // Set image data if we have a base64 string
            if (imageBase64) {
                productToSubmit.imageData = imageBase64;  // Send as base64 string instead of Uint8Array
                productToSubmit.imageType = selectedFile?.type || 'image/jpeg';
            } else if (isNewProduct) {
                setError('Failed to process the image. Please try a different file.');
                setIsSaving(false);
                return;
            }

            try {
                let result;

                if (isNewProduct) {
                    // Create new product
                    console.log("Creating new product:", productToSubmit.name);
                    result = await ProductService.create(productToSubmit);
                    console.log("Product created successfully:", result);
                    setSuccessMessage('Product created successfully!');

                    // If a price was set, create the price record
                    if (productPrice.price > 0 && selectedTheater > 0) {
                        const newPriceData = {
                            ...productPrice,
                            productId: result.id,
                            theaterId: selectedTheater
                        };
                        await ProductPriceService.create(newPriceData);
                    }
                } else {
                    // Update existing product
                    console.log("Updating product with ID:", productId);
                    result = await ProductService.update(productId, productToSubmit);
                    console.log("Product updated successfully:", result);
                    setSuccessMessage('Product updated successfully!');

                    // Update product price if changed
                    if (productPrice.id > 0) {
                        await ProductPriceService.update(productPrice.id, {
                            ...productPrice,
                            theaterId: selectedTheater > 0 ? selectedTheater : productPrice.theaterId
                        });
                    } else if (productPrice.price > 0 && selectedTheater > 0) {
                        // Create new price record
                        const newPriceData = {
                            ...productPrice,
                            productId: productId,
                            theaterId: selectedTheater
                        };
                        await ProductPriceService.create(newPriceData);
                    }

                    setIsEditMode(false); // Return to view mode after successful update
                }

                // If we've created a new product, update our state with the returned data
                if (isNewProduct && result) {
                    setProduct(result);
                }

                // Redirect back to products list after a delay
                setTimeout(() => {
                    navigate('/admin/products');
                }, 2000);
            } catch (saveError) {
                console.error('Error saving product:', saveError);
                if (axios.isAxiosError(saveError) && saveError.response) {
                    const responseData = saveError.response.data;
                    const status = saveError.response.status;
                    console.error('API Error Response:', status, responseData);

                    if (typeof responseData === 'string') {
                        setError(`Server error: ${responseData}`);
                    } else if (responseData.errors) {
                        // Handle validation errors
                        const errorMessages = Object.values(responseData.errors).flat();
                        setError(`Validation error: ${errorMessages.join(', ')}`);
                    } else {
                        setError(`Server error (${status}): ${JSON.stringify(responseData)}`);
                    }
                } else {
                    setError(isNewProduct ? 'Failed to create product.' : 'Failed to update product.');
                }
            }
        } catch (err) {
            console.error('Form submission error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error && !isNewProduct && !product.id) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
                <p>{error}</p>
                <button
                    className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate('/admin/products')}
                >
                    Return to Products List
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {isNewProduct ? pageTitle : isEditMode ? 'Update Product' : pageTitle}
                </h1>
                <div>
                    {!isNewProduct && !isEditMode && (
                        <button
                            onClick={() => setIsEditMode(true)}
                            className="bg-emerald-500 text-white px-4 py-2 rounded"
                        >
                            Edit Product
                        </button>
                    )}
                    {!isNewProduct && isEditMode && (
                        <button
                            onClick={() => setIsEditMode(false)}
                            className="bg-red-400 text-white px-4 py-2 rounded mr-2"
                            disabled={isSaving}
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                </div>
            )}

            {(isEditMode || isNewProduct) ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Active Status */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={product.isActive}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600"
                        />
                        <label htmlFor="isActive" className="ml-2">Active</label>
                    </div>

                    {/* Product Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={product.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    {/* Product Type Selection */}
                    <div>
                        <label htmlFor="productTypeId" className="block text-sm font-medium">
                            Product Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="productTypeId"
                            name="productTypeId"
                            value={product.productTypeId}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        >
                            <option value="">Select a product type</option>
                            {productTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium">
                            Product Image {isNewProduct && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleFileChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            accept="image/*"
                            required={isNewProduct}
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <p className="text-sm font-medium mb-1">Image Preview:</p>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover border rounded"
                                />
                            </div>
                        )}
                    </div>

                    {/* Pricing Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                        <h2 className="text-lg font-medium">Pricing Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={productPrice.price}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="theaterId" className="block text-sm font-medium">
                                    Theater
                                </label>
                                <select
                                    id="theaterId"
                                    name="theaterId"
                                    value={selectedTheater}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                >
                                    <option value="0">All Theaters</option>
                                    {theaters.map(theater => (
                                        <option key={theater.id} value={theater.id}>{theater.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={productPrice.startDate ? productPrice.startDate.toString() : ''}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={productPrice.endDate ? productPrice.endDate.toString() : ''}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                if (isNewProduct) {
                                    navigate('/admin/products');
                                } else {
                                    setIsEditMode(false);
                                }
                            }}
                            className="bg-emerald-600 text-white px-4 py-2 rounded"
                            disabled={isSaving}
                        >
                            {isNewProduct ? 'Cancel' : 'Back to View'}
                        </button>
                        <button
                            type="submit"
                            className="bg-summit text-white px-4 py-2 rounded"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : isNewProduct ? 'Create Product' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    {/* View mode */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center mb-4">
                            <div className={`h-3 w-3 rounded-full mr-2 ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="font-medium">{product.isActive ? 'Active' : 'Inactive'}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                                <h3 className="text-sm text-gray-500">Product Name</h3>
                                <p className="font-medium">{product.name}</p>
                            </div>

                            <div>
                                <h3 className="text-sm text-gray-500">Product Type</h3>
                                <p className="font-medium">{productTypeName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Product Image */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-medium mb-3">Product Image</h2>
                        <div className="flex justify-center">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt={product.name}
                                    className="max-h-64 object-contain"
                                />
                            ) : (
                                <div className="bg-gray-200 w-32 h-32 flex items-center justify-center rounded">
                                    <span className="text-gray-500">No image available</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Price Information */}
                    {productPrice.id > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h2 className="text-lg font-medium mb-3">Price Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm text-gray-500">Price</h3>
                                    <p className="font-medium">${productPrice.price.toFixed(2)}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm text-gray-500">Theater</h3>
                                    <p className="font-medium">
                                        {theaters.find(t => t.id === productPrice.theaterId)?.name || 'All Theaters'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h3 className="text-sm text-gray-500">Start Date</h3>
                                    <p className="font-medium">{productPrice.startDate ? productPrice.startDate.toString() : '-'}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm text-gray-500">End Date</h3>
                                    <p className="font-medium">
                                        {productPrice.endDate ? productPrice.endDate.toString() : <span className="text-gray-400 italic">Not specified</span>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Back button */}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={() => navigate('/admin/products')}
                            className="bg-summit text-white px-4 py-2 rounded"
                        >
                            Back to Products
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductFormPage;