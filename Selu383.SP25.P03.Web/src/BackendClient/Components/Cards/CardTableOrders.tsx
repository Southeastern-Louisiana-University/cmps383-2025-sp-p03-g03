import React, { useState, useMemo, useEffect } from "react";


interface CardTableProps {
    color?: "light" | "dark";
}


// Define the shape of CustomDetails, if needed
//interface CustomDetail {
//    Date: string;
//    Customer: string;
//    Quantity: number;
//    TotalAmount: number;
//}

// Define the shape of each product
interface Product {
    id: number;
    Category: string;
    //Company: string;
    Product: string;
    Description: string;
    Price: number;
    //CustomDetails?: CustomDetail[];
}

const products: Product[] = [
    {
        id: 1,
        Category: "Tickets",
        //Company: "Apple",
        Product: "General Admission",
        Description: "Adult Ticket",
        Price: 13,
        //CustomDetails: [
        //    {
        //        Date: "2023-09-05",
        //        Customer: "John Doe",
        //        Quantity: 2,
        //        TotalAmount: 1998,
        //    },
        //    {
        //        Date: "2023-09-04",
        //        Customer: "Jane Smith",
        //        Quantity: 1,
        //        TotalAmount: 999,
        //    },
        //],
    },
    {
        id: 2,
        Category: "Tickets",
        //Company: "Nike",
        Product: "Senior Ticket",
        Description: "Age 60 or older with valid Id",
        Price: 8,
    //    CustomDetails: [
    //        {
    //            Date: "2023-09-05",
    //            Customer: "Alice Johnson",
    //            Quantity: 3,
    //            TotalAmount: 267,
    //        },
    //        {
    //            Date: "2023-09-03",
    //            Customer: "Bob Brown",
    //            Quantity: 2,
    //            TotalAmount: 178,
    //        },
    //    ],
    },
    {
        id: 3,
        Category: "Tickets",
        //Company: "Penguin Books",
        Product: "Child Ticket",
        Description: "Children ages 3 to 11",
        Price: 8,
        //CustomDetails: [
        //    {
        //        Date: "2023-09-02",
        //        Customer: "Ella Williams",
        //        Quantity: 5,
        //        TotalAmount: 60,
        //    },
        //],
    },
    //{
    //    id: 4,
    //    Category: "Home Appliances",
    //    Company: "Samsung",
    //    Product: "Smart Refrigerator",
    //    Description: "Refrigerator with smart features and spacious design",
    //    Price: 14,
    //    CustomDetails: [
    //        {
    //            Date: "2023-09-05",
    //            Customer: "David Wilson",
    //            Quantity: 1,
    //            TotalAmount: 14,
    //        },
    //    ],
    //},
    //{
    //    id: 5,
    //    Category: "Electronics",
    //    Company: "Sony",
    //    Product: "PlayStation 5",
    //    Description: "Next-gen gaming console",
    //    Price: 499,
    //    CustomDetails: [
    //        {
    //            Date: "2023-09-06",
    //            Customer: "Sarah Davis",
    //            Quantity: 1,
    //            TotalAmount: 499,
    //        },
    //    ],
    //},
    //// ... rest of the product objects (truncated for brevity)
    //{
    //    id: 19,
    //    Category: "Home Appliances",
    //    Company: "Cuisinart",
    //    Product: "Coffee Maker",
    //    Description: "Programmable coffee maker for coffee lovers",
    //    Price: 69,
    //    CustomDetails: [
    //        {
    //            Date: "2023-09-21",
    //            Customer: "Eli Johnson",
    //            Quantity: 2,
    //            TotalAmount: 138,
    //        },
    //    ],
    //},
];

//React.FC<CardTableProps> = ({ color = "light" })

const CardTableOrders: React.FC<CardTableProps> = ({ color = "light" }) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [productList, setProductList] = useState<Product[]>(products);
    const [rowsLimit] = useState<number>(5);

    // The slice of products shown on the current page
    const [rowsToShow, setRowsToShow] = useState<Product[]>(
        productList.slice(0, rowsLimit)
    );

    // Pagination
    const [customPagination, setCustomPagination] = useState<null[]>([]);
    const [activeColumn, setActiveColumn] = useState<string[]>(["Price"]);
    const [sortingColumn, setSortingColumn] = useState<string[]>(["Price"]);
    const [totalPage, setTotalPage] = useState<number>(
        Math.ceil(productList.length / rowsLimit)
    );
    const [currentPage, setCurrentPage] = useState<number>(0);

    // Search products by keyword
    const searchProducts = (keyword: string): void => {
        const lowerKeyword = keyword.toLowerCase();
        setSearchValue(lowerKeyword);
        if (lowerKeyword !== "") {
            const results = products.filter((product) => {
                return (
                    product.Category.toLowerCase().includes(lowerKeyword) ||
                    //product.Company.toLowerCase().includes(lowerKeyword) ||
                    product.Product.toLowerCase().includes(lowerKeyword) ||
                    product.Description.toLowerCase().includes(lowerKeyword) ||
                    product.Price.toString().toLowerCase().includes(lowerKeyword)
                );
            });
            setProductList(results);
            setRowsToShow(results.slice(0, rowsLimit));
            setCurrentPage(0);
            setTotalPage(Math.ceil(results.length / rowsLimit));
            setCustomPagination(Array(Math.ceil(results.length / rowsLimit)).fill(null));
        } else {
            clearData();
        }
    };

    // Clear the search input and reset data to the default sorted order
    const clearData = (): void => {
        setSearchValue("");
        const sortedProducts = products.slice().sort((a, b) => a.Price - b.Price);
        setProductList(sortedProducts);
        setRowsToShow(sortedProducts.slice(0, rowsLimit));
        setCustomPagination(Array(Math.ceil(products.length / rowsLimit)).fill(null));
        setTotalPage(Math.ceil(products.length / rowsLimit));
        setCurrentPage(0);
    };

    // Sort column either ascending/descending
    const sortByColumn = (column: keyof Product, changeSortingColumn = true): void => {
        if (column !== "Price") {
            // String sort
            if (sortingColumn.includes(column)) {
                // Descending
                const sortData = productList
                    .slice()
                    .sort((a, b) =>
                        b[column].toString().localeCompare(a[column].toString())
                    );
                setRowsToShow(
                    sortData.slice(currentPage * rowsLimit, (currentPage + 1) * rowsLimit)
                );
                if (changeSortingColumn) {
                    setSortingColumn([]);
                    setProductList(sortData);
                }
            } else {
                // Ascending
                const sortData = productList
                    .slice()
                    .sort((a, b) =>
                        a[column].toString().localeCompare(b[column].toString())
                    );
                setRowsToShow(
                    sortData.slice(currentPage * rowsLimit, (currentPage + 1) * rowsLimit)
                );
                if (changeSortingColumn) {
                    setProductList(sortData);
                    setSortingColumn([column]);
                }
            }
        } else {
            // Numeric sort for Price
            if (sortingColumn.includes("Price")) {
                // Descending
                const sortedProducts = productList.slice().sort((a, b) => b.Price - a.Price);
                setRowsToShow(
                    sortedProducts.slice(
                        currentPage * rowsLimit,
                        (currentPage + 1) * rowsLimit
                    )
                );
                if (changeSortingColumn) {
                    setSortingColumn([]);
                    setProductList(sortedProducts);
                }
            } else {
                // Ascending
                const sortedProducts = productList.slice().sort((a, b) => a.Price - b.Price);
                setRowsToShow(
                    sortedProducts.slice(
                        currentPage * rowsLimit,
                        (currentPage + 1) * rowsLimit
                    )
                );
                if (changeSortingColumn) {
                    setSortingColumn([column]);
                    setProductList(sortedProducts);
                }
            }
        }
        setActiveColumn([column]);
    };

    // Next page
    const nextPage = (): void => {
        const startIndex = rowsLimit * (currentPage + 1);
        const endIndex = startIndex + rowsLimit;
        // Note: If you want next page of the *sorted/filtered* list, slice from productList:
        const newArray = productList.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(currentPage + 1);
    };

    // Go to a specific page
    const changePage = (value: number): void => {
        const startIndex = value * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = productList.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(value);
    };

    // Previous page
    const previousPage = (): void => {
        const startIndex = (currentPage - 1) * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = productList.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else {
            setCurrentPage(0);
        }
    };

    // Initialize pagination array once
    useMemo(() => {
        setCustomPagination(Array(Math.ceil(productList.length / rowsLimit)).fill(null));
    }, [productList.length, rowsLimit]);

    // On mount: sort the data initially by Price ascending
    useEffect(() => {
        const sortedProducts = products.slice().sort((a, b) => a.Price - b.Price);
        setProductList(sortedProducts);
        setRowsToShow(sortedProducts.slice(0, rowsLimit));
    }, [rowsLimit]);

    const getTableHeaderClass = () => {
        return `px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ${color === "light"
            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700"
            }`;
    };

    return (
        <div className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"
            }`}>

            {/*<div className="w-full max-w-5xl px-2">*/}
            {/*    <div>*/}
            {/*        <h1 className="text-2xl font-medium">Products</h1>*/}
            {/*    </div>*/}

            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className={`font-semibold text-lg ${color === "light" ? "text-blueGray-700" : "text-white"
                            }`}> Orders
                        </h3>
                    </div>


                    {/* Search Bar */}
                    <div className="flex justify-end bg-[#222E3A]/[6%] px-2 mt-2 py-2 border-2 border-b-0 border-black">
                        <div className="px-2 bg-white py-3 rounded-lg">
                            <div className="flex items-center gap-2">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10.2741 9.05133C11.1214 7.89518 11.5009 6.46176 11.3366 5.03784C11.1724 3.61391 10.4766 2.3045 9.38841 1.37157C8.30022 0.438638 6.8999 -0.0490148 5.4676 0.0061742C4.0353 0.0613632 2.67666 0.655324 1.66348 1.66923C0.650303 2.68313 0.0573143 4.0422 0.00315019 5.47454C-0.0510139 6.90687 0.437641 8.30685 1.37135 9.39437C2.30506 10.4819 3.61497 11.1768 5.03901 11.34C6.46305 11.5032 7.8962 11.1227 9.05174 10.2746H9.05087C9.07712 10.3096 9.10512 10.3428 9.13662 10.3752L12.5054 13.744C12.6694 13.9081 12.892 14.0004 13.1241 14.0005C13.3562 14.0006 13.5789 13.9085 13.7431 13.7444C13.9072 13.5803 13.9995 13.3578 13.9996 13.1256C13.9997 12.8935 13.9076 12.6709 13.7435 12.5067L10.3747 9.13796C10.3435 9.10629 10.3098 9.07704 10.2741 9.05046V9.05133ZM10.4999 5.68783C10.4999 6.31982 10.3754 6.94562 10.1335 7.5295C9.89169 8.11338 9.5372 8.6439 9.09032 9.09078C8.64344 9.53767 8.11291 9.89215 7.52903 10.134C6.94515 10.3759 6.31936 10.5003 5.68737 10.5003C5.05538 10.5003 4.42959 10.3759 3.84571 10.134C3.26183 9.89215 2.7313 9.53767 2.28442 9.09078C1.83754 8.6439 1.48305 8.11338 1.2412 7.5295C0.999349 6.94562 0.87487 6.31982 0.87487 5.68783C0.87487 4.41148 1.3819 3.1874 2.28442 2.28488C3.18694 1.38236 4.41102 0.875332 5.68737 0.875332C6.96372 0.875332 8.1878 1.38236 9.09032 2.28488C9.99284 3.1874 10.4999 4.41148 10.4999 5.68783Z"
                                        fill="black"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    className="max-w-[150px] text-sm bg-transparent focus:ring-0 border-transparent outline-none placeholder:text-black text-black w-[85%]"
                                    placeholder="Keyword Search"
                                    onChange={(e) => searchProducts(e.target.value)}
                                    value={searchValue}
                                />
                                <svg
                                    stroke="currentColor"
                                    fill="black"
                                    className={`text-black cursor-pointer ${searchValue.length > 0 ? "visible" : "invisible"
                                        }`}
                                    strokeWidth="0"
                                    viewBox="0 0 1024 1024"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                    onClick={clearData}
                                >
                                    <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>



                {/* Table */}
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead
                            className={`rounded-lg text-base text-white font-semibold w-full ${rowsToShow.length > 0 ? "border-b-0" : "border-b-2 border-black"
                                }`}
                        >
                            <tr className="bg-[#222E3A]/[6%] border-x-2 border-t-2 border-black">
                                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                                    ID
                                </th>
                                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap group min-w-[156px]">
                                    <div className="flex items-center">
                                        <svg
                                            className={`w-4 h-4 cursor-pointer ${activeColumn.includes("Category")
                                                ? "text-black"
                                                : "text-[#BCBDBE] group-hover:text-black rotate-180"
                                                } ${sortingColumn.includes("Category")
                                                    ? "rotate-180"
                                                    : "rotate-0"
                                                }`}
                                            onClick={() => sortByColumn("Category")}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                            />
                                        </svg>
                                        <span
                                            className="cursor-pointer pl-1"
                                            onClick={() => sortByColumn("Category")}
                                        >
                                            Category
                                        </span>
                                    </div>
                                </th>
                                <th className="py-3 px-3 flex items-center text-[#212B36] sm:text-base font-bold whitespace-nowrap group min-w-[157px]">
                                    <svg
                                        className={`w-4 h-4 cursor-pointer ${activeColumn.includes("Company")
                                            ? "text-black"
                                            : "text-[#BCBDBE] group-hover:text-black rotate-180"
                                            } ${sortingColumn.includes("Company")
                                                ? "rotate-180"
                                                : "rotate-0"
                                            }`}
                                        //onClick={() => sortByColumn("Company")}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                        />
                                    </svg>
                                    <span
                                        className="cursor-pointer pl-1"
                                        //onClick={() => sortByColumn("Company")}
                                    >
                                        Company
                                    </span>
                                </th>
                                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap group min-w-[197px]">
                                    <div className="flex items-center">
                                        <svg
                                            className={`w-4 h-4 cursor-pointer ${activeColumn.includes("Product")
                                                ? "text-black"
                                                : "text-[#BCBDBE] group-hover:text-black rotate-180"
                                                } ${sortingColumn.includes("Product")
                                                    ? "rotate-180"
                                                    : "rotate-0"
                                                }`}
                                            onClick={() => sortByColumn("Product")}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                            />
                                        </svg>
                                        <span
                                            className="cursor-pointer pl-1"
                                            onClick={() => sortByColumn("Product")}
                                        >
                                            Product
                                        </span>
                                    </div>
                                </th>
                                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap min-w-[366px]">
                                    Description
                                </th>
                                <th className="flex items-center py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap group">
                                    <svg
                                        className={`w-4 h-4 cursor-pointer ${sortingColumn.includes("Price") ? "rotate-180" : "rotate-0"
                                            } ${activeColumn.includes("Price")
                                                ? "text-black"
                                                : "text-[#BCBDBE] group-hover:text-black rotate-180"
                                            }`}
                                        onClick={() => sortByColumn("Price")}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                        />
                                    </svg>
                                    <span
                                        className="cursor-pointer pl-1"
                                        onClick={() => sortByColumn("Price")}
                                    >
                                        Price
                                    </span>
                                </th>
                            </tr>
                        </thead>

                        <tbody className="text-left border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            {rowsToShow.map((data, index) => (
                                <tr
                                    className={`${index % 2 === 0 ? "bg-white" : "bg-[#222E3A]/[6%]"
                                        }`}
                                    key={index}
                                >
                                    <td
                                        className={`py-2 px-3 font-normal text-base ${index === 0
                                            ? "border-t-2 border-black"
                                            : index === rowsToShow.length
                                                ? "border-y"
                                                : "border-t"
                                            } whitespace-nowrap`}
                                    >
                                        {rowsLimit * currentPage + index + 1}
                                    </td>
                                    <td
                                        className={`py-2 px-3 font-normal text-base ${index === 0
                                            ? "border-t-2 border-black"
                                            : index === rowsToShow.length
                                                ? "border-y"
                                                : "border-t"
                                            } whitespace-nowrap`}
                                    >
                                        {data.Category}
                                    </td>
                                    <td
                                        className={`py-2 px-3 font-normal text-base ${index === 0
                                            ? "border-t-2 border-black"
                                            : index === rowsToShow.length
                                                ? "border-y"
                                                : "border-t"
                                            } whitespace-nowrap`}
                                    >
                                        {data.Company}
                                    </td>
                                    <td
                                        className={`py-2 px-3 text-base font-normal ${index === 0
                                            ? "border-t-2 border-black"
                                            : index === rowsToShow.length
                                                ? "border-y"
                                                : "border-t"
                                            } whitespace-nowrap`}
                                    >
                                        {data.Product}
                                    </td>
                                    <td
                                        className={`py-2 px-3 text-base font-normal ${index === 0
                                            ? "border-t-2 border-black"
                                            : index === rowsToShow.length
                                                ? "border-y"
                                                : "border-t"
                                            } min-w-[250px]`}
                                    >
                                        {data.Description}
                                    </td>
                                    <td
                                        className={`py-5 px-4 text-base font-normal ${index === 0
                                            ? "border-t-2 border-black"
                                            : index === rowsToShow.length
                                                ? "border-y"
                                                : "border-t"
                                            }`}
                                    >
                                        {"$" + data.Price}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div
                    className={`w-full justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-2.5 px-1 items-center ${productList.length > 0 ? "flex" : "hidden"
                        }`}
                >
                    <div className="text-lg">
                        Showing{" "}
                        {currentPage === 0 ? 1 : currentPage * rowsLimit + 1} to{" "}
                        {currentPage === totalPage - 1
                            ? productList.length
                            : (currentPage + 1) * rowsLimit}{" "}
                        of {productList.length} entries
                    </div>
                    <div className="flex">
                        <ul
                            className="flex justify-center items-center gap-x-[10px] z-30"
                            role="navigation"
                            aria-label="Pagination"
                        >
                            <li
                                className={`prev-btn flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${currentPage === 0
                                    ? "bg-[#cccccc] pointer-events-none"
                                    : "cursor-pointer"
                                    }`}
                                onClick={previousPage}
                            >
                                <img
                                    src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg"
                                    alt="Prev Page"
                                />
                            </li>
                            {customPagination.map((_, index) => (
                                <li
                                    className={`flex items-center justify-center w-[36px] rounded-[6px] h-[34px] border-[1px] border-solid border-[2px] bg-[#FFFFFF] cursor-pointer ${currentPage === index
                                        ? "text-blue-600 border-sky-500"
                                        : "border-[#E4E4EB]"
                                        }`}
                                    onClick={() => changePage(index)}
                                    key={index}
                                >
                                    {index + 1}
                                </li>
                            ))}
                            <li
                                className={`flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${currentPage === totalPage - 1
                                    ? "bg-[#cccccc] pointer-events-none"
                                    : "cursor-pointer"
                                    }`}
                                onClick={nextPage}
                            >
                                <img
                                    src="https://www.tailwindtap.com/assets/travelagency-admin/rightarrow.svg"
                                    alt="Next Page"
                                />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardTableOrders;
