import axios from 'axios';

// TypeScript interfaces
export interface ProductDTO {
    id: number;
    isActive: boolean;
    name: string;
    productTypeId: number;
    imageData:  string; // Accept string for base64 data
    imageType?: string;
}

export interface ProductType {
    id: number;
    name: string;
}

export interface Theater {
    id: number;
    active: boolean;
    name: string;
    address1?: string;
    address2?: string;
    city?: string;
    zip?: string;
    phone1?: string;
    phone2?: string;
}

export interface ProductPriceDTO {
    id: number;
    productId: number;
    theaterId?: number;
    price: number;
    startDate: string;
    endDate: string | null;
}

// Reference to logger from the imported module
import { logger } from './LoggerForServices'; // Make sure to create or import this

// Add request/response interceptors for debugging
axios.interceptors.request.use(
    config => {
        // Don't log large binary data
        const logData = config.data && config.data.imageData && typeof config.data.imageData !== 'string' ?
            { ...config.data, imageData: '[Binary data]' } : config.data;

        logger.request(
            config.method?.toUpperCase() || 'UNKNOWN',
            config.url || 'UNKNOWN URL',
            logData || null
        );
        return config;
    },
    error => {
        logger.error('Request failed to send', error);
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        logger.success(`Response received [${response.status}] from ${response.config.url}`);
        return response;
    },
    error => {
        if (error.response) {
            logger.error(`API Error [${error.response.status}] from ${error.config?.url}`, error);
        } else if (error.request) {
            logger.error('No response received from server', error);
        } else {
            logger.error('Request configuration error', error);
        }
        return Promise.reject(error);
    }
);

// Base API URLs
const PRODUCT_API_URL = '/api/Product';
const PRODUCT_TYPE_API_URL = '/api/ProductTypes';
const THEATER_API_URL = '/api/Theater';
const PRODUCT_PRICE_API_URL = '/api/ProductPrice';

// Helper function to handle API errors
const handleApiError = (error: unknown, context: string): never => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            // Server responded with an error status
            logger.error(
                `${context} failed with status ${error.response.status}`,
                error
            );

            // Log the response data if available
            if (error.response.data) {
                logger.error('Error response data:', error.response.data);
            }
        } else if (error.request) {
            // Request was made but no response
            logger.error(
                `${context} failed - no response received from server`,
                error
            );
        } else {
            // Error in setting up the request
            logger.error(
                `${context} failed - request setup error`,
                error
            );
        }
    } else {
        // Non-Axios error
        logger.error(
            `${context} failed with non-axios error`,
            error
        );
    }
    throw error;
};

// Product service methods
export const ProductService = {
    // Get all products
    getAll: async (): Promise<ProductDTO[]> => {
        try {
            logger.info(`Fetching all products from ${PRODUCT_API_URL}`);

            // Add timestamp to URL to prevent caching issues
            const cacheBuster = `?_=${new Date().getTime()}`;
            const url = `${PRODUCT_API_URL}${cacheBuster}`;

            const response = await axios.get<ProductDTO[]>(url);

            // Log response details
            logger.success(`Retrieved ${response.data.length} products`);
            if (response.data.length === 0) {
                logger.warn('No products returned from API');
            } else {
                logger.info('First few products:', response.data.slice(0, 3).map(p => ({
                    ...p,
                    imageData: p.imageData ? '[Image data present]' : null
                })));
            }

            return response.data;
        } catch (error) {
            return handleApiError(error, 'Fetching all products');
        }
    },

    // Get a single product by ID
    getById: async (id: number): Promise<ProductDTO> => {
        try {
            logger.info(`Fetching product with ID ${id}`);
            const response = await axios.get<ProductDTO>(`${PRODUCT_API_URL}/${id}`);
            logger.success(`Retrieved product ${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Fetching product with ID ${id}`);
        }
    },

    // Create a new product
    create: async (product: Omit<ProductDTO, 'id'>): Promise<ProductDTO> => {
        try {
            logger.info('Creating new product', {
                ...product,
                imageData: product.imageData ? '[Image data present]' : null
            });

            const response = await axios.post<ProductDTO>(PRODUCT_API_URL, product);
            logger.success('Product created successfully', {
                ...response.data,
                imageData: response.data.imageData ? '[Image data present]' : null
            });
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Creating new product');
        }
    },

    // Update an existing product
    update: async (id: number, product: ProductDTO): Promise<ProductDTO> => {
        try {
            logger.info(`Updating product ${id}`, {
                ...product,
                imageData: product.imageData ? '[Image data present]' : null
            });

            const response = await axios.put<ProductDTO>(`${PRODUCT_API_URL}/${id}`, product);
            logger.success(`Product ${id} updated successfully`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Updating product ${id}`);
        }
    },

    // Delete a product
    delete: async (id: number): Promise<void> => {
        try {
            logger.info(`Deleting product ${id}`);
            await axios.delete(`${PRODUCT_API_URL}/${id}`);
            logger.success(`Product ${id} deleted successfully`);
        } catch (error) {
            handleApiError(error, `Deleting product ${id}`);
        }
    },

    // Toggle product active status
    toggleActive: async (id: number, active: boolean): Promise<ProductDTO> => {
        try {
            logger.info(`Toggling active status of product ${id} to ${active}`);

            // Construct the proper payload
            const payload = { active: active };

            const response = await axios.patch<ProductDTO>(`${PRODUCT_API_URL}/${id}/toggle-active`, payload);

            logger.success(`Product ${id} active status toggled to ${active}`);

            // Make sure to return the updated product object from the response
            return response.data;
        } catch (error) {
            return handleApiError(error, `Toggling active status for product ${id}`);
        }
    },
};

// ProductType service methods
export const ProductTypeService = {
    getAll: async (): Promise<ProductType[]> => {
        try {
            logger.info('Fetching all product types');
            const response = await axios.get<ProductType[]>(PRODUCT_TYPE_API_URL);
            logger.success(`Retrieved ${response.data.length} product types`);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Fetching all product types');
        }
    }
};

// Theater service methods
export const TheaterService = {
    getAll: async (): Promise<Theater[]> => {
        try {
            logger.info('Fetching all theaters');
            const response = await axios.get<Theater[]>(THEATER_API_URL);
            logger.success(`Retrieved ${response.data.length} theaters`);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Fetching all theaters');
        }
    },

    getById: async (id: number): Promise<Theater> => {
        try {
            logger.info(`Fetching theater with ID ${id}`);
            const response = await axios.get<Theater>(`${THEATER_API_URL}/${id}`);
            logger.success(`Retrieved theater ${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Fetching theater with ID ${id}`);
        }
    }
};

// ProductPrice service methods
export const ProductPriceService = {
    getAll: async (): Promise<ProductPriceDTO[]> => {
        try {
            logger.info('Fetching all product prices');
            const response = await axios.get<ProductPriceDTO[]>(PRODUCT_PRICE_API_URL);
            logger.success(`Retrieved ${response.data.length} product prices`);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Fetching all product prices');
        }
    },

    getByProductId: async (productId: number): Promise<ProductPriceDTO[]> => {
        try {
            logger.info(`Fetching prices for product ID ${productId}`);
            const response = await axios.get<ProductPriceDTO[]>(`${PRODUCT_PRICE_API_URL}/product/${productId}`);
            logger.success(`Retrieved ${response.data.length} prices for product ${productId}`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Fetching prices for product ID ${productId}`);
        }
    },

    create: async (productPrice: Omit<ProductPriceDTO, 'id'>): Promise<ProductPriceDTO> => {
        try {
            logger.info('Creating new product price', productPrice);
            const response = await axios.post<ProductPriceDTO>(PRODUCT_PRICE_API_URL, productPrice);
            logger.success('Product price created successfully', response.data);
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Creating new product price');
        }
    },

    update: async (id: number, productPrice: ProductPriceDTO): Promise<ProductPriceDTO> => {
        try {
            logger.info(`Updating product price ${id}`, productPrice);
            const response = await axios.put<ProductPriceDTO>(`${PRODUCT_PRICE_API_URL}/${id}`, productPrice);
            logger.success(`Product price ${id} updated successfully`);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Updating product price ${id}`);
        }
    }
};