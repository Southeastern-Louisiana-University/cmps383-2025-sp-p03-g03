import React, { useState, useMemo } from "react";

// Define an interface for the items inside "CustomDetails"
//interface CustomDetail {
//    Date: string;
//    Customer: string;
//    Quantity: number;
//    TotalAmount: number;
//}

// Define an interface for your product objects
interface Product {
    id: number;
    Category: string;
    //Company: string;
    Product: string;
    Description: string;
    Price: number;
    //CustomDetails: CustomDetail[];
}

// Define the products array with the Product[] type
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
        //CustomDetails: [
        //    {
        //        Date: "2023-09-05",
        //        Customer: "Alice Johnson",
        //        Quantity: 3,
        //        TotalAmount: 267,
        //    },
        //    {
        //        Date: "2023-09-03",
        //        Customer: "Bob Brown",
        //        Quantity: 2,
        //        TotalAmount: 178,
        //    },
        //],
    },
    {
        id: 3,
        Category: "Tickets",
       // Company: "Penguin Books",
        Product: "Child Ticket",
        Description: "Children ages 3 to 11",
        Price: 12,
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
    //{
    //    id: 6,
    //    Category: "Clothing",
    //    Company: "Adidas",
    //    Product: "Sneakers",
    //    Description: "Stylish sneakers for everyday wear",
    //    Price: 75,
    //    CustomDetails: [
    //        {
    //            Date: "2023-09-07",
    //            Customer: "Michael Lee",
    //            Quantity: 2,
    //            TotalAmount: 150,
    //        },
    //    ],
    //},
    //{
    //    id: 7,
    //    Category: "Electronics",
    //    Company: "Samsung",
    //    Product: "4K Smart TV",
    //    Description: "High-quality 4K television with smart features",
    //    Price: 799,
    //    CustomDetails: [
    //        {
    //            Date: "2023-09-08",
    //            Customer: "Sophia Anderson",
    //            Quantity: 1,
    //            TotalAmount: 799,
    //        },
    //    ],
    //},
    //{
    //    id: 8,
    //    Category: "Home Appliances",
    //    Company: "LG",
    //    Product: "Front-Load Washer",
    //    Description: "Efficient front-load washing machine",
    //    Price: 599,
    //    CustomDetails: [
    //        {
    //            Date: "2023-09-09",
    //            Customer: "William Taylor",
    //            Quantity: 1,
    //            TotalAmount: 599,
    //        },
    //    ],
    //},
    //{
    //    id: 9,
    //    Category: "Books",
    //    Company: "HarperCollins",
    //    Product: "To Kill a Mockingbird",
    //    Description: "Classic novel by Harper Lee",
    //    Price: 15,
    //    CustomDetails: [
    //        {
    //            Date: "2023-09-10",
    //            Customer: "Olivia Martinez",
    //            Quantity: 3,
    //            TotalAmount: 45,
    //        },
    //    ],
    //},
    //{
    //    id: 10,
    //    Category: "Clothing",
    //    Company: "H&M",
    //    Product: "Denim Jeans",
    //    Description: "Stylish denim jeans for men and women",
    //    Price: 49,
    //    CustomDetails: [
    //        {
    //            Date: "2023-09-11",
    //            Customer: "James Johnson",
    //            Quantity: 2,
    //            TotalAmount: 98,
    //        },
    //    ],
    //},
    //{
    //    id: 11,
    //    Category: "Electronics",
    //    Company: "Sony",
    //    Product: "Wireless Headphones",
    //    Description: "High-quality wireless headphones with noise cancellation",
    //    Price: 249,
    //    CustomDetails: [
    //        {
    //            Date: "2023-09-12",
    //            Customer: "Liam Jackson",
    //            Quantity: 1,
    //            TotalAmount: 249,
    //        },
    //    ],
    //},
    //{
    //    id: 12,
    //    Category: "Home Appliances",
    //    Company: "KitchenAid",
    //    Product: "Stand Mixer",
    //    Description: "Powerful stand mixer for baking and cooking",
    //    Price: 299,
    //    CustomDetails: [
    //        {
    //            Date: "2023-09-13",
    //            Customer: "Ava Harris",
    //            Quantity: 1,
    //            TotalAmount: 299,
    //        },
    //    ],
    //},
    //{
    //    id: 13,
    //    Category: "Books",
    //    Company: "Random House",
    //    Product: "The Catcher in the Rye",
    //    Description: "Classic novel by J.D. Salinger",
    //    Price: 10,
    //    CustomDetails: [
    //        {
    //            Date: "2023-09-14",
    //            Customer: "Noah Martinez",
    //            Quantity: 4,
    //            TotalAmount: 40,
    //        },
    //    ],
    //},
    //{
    //    id: 14,
    //    Category: "Clothing",
    //    Company: "Zara",
    //    Product: "Leather Jacket",
    //    Description: "Stylish leather jacket for men and women",
    //    Price: 129,
    //    CustomDetails: [
    //        {
    //            Date: "2023-09-15",
    //            Customer: "Sophia Wilson",
    //            Quantity: 2,
    //            TotalAmount: 258,
    //        },
    //    ],
    //},
    //{
    //    id: 15,
    //    Category: "Electronics",
    //    Company: "Bose",
    //    Product: "Bluetooth Speaker",
    //    Description: "Portable Bluetooth speaker with excellent sound quality",
    //    Price: 129,
    //    CustomDetails: [
    //        {
    //            Date: "2023-09-16",
    //            Customer: "Mason Davis",
    //            Quantity: 3,
    //            TotalAmount: 387,
    //        },
    //    ],
    //},
    //{
    //    id: 16,
    //    Category: "Books",
    //    Company: "Simon & Schuster",
    //    Product: "1984",
    //    Description: "Dystopian novel by George Orwell",
    //    Price: 14,
    //    CustomDetails: [
    //        {
    //            Date: "2023-09-18",
    //            Customer: "Lucas Taylor",
    //            Quantity: 5,
    //            TotalAmount: 70,
    //        },
    //    ],
    //},
    //{
    //    id: 17,
    //    Category: "Clothing",
    //    Company: "Forever 21",
    //    Product: "Summer Dress",
    //    Description: "Casual summer dress for women",
    //    Price: 29,
    //    CustomDetails: [
    //        {
    //            Date: "2023-09-19",
    //            Customer: "Aiden Brown",
    //            Quantity: 4,
    //            TotalAmount: 116,
    //        },
    //    ],
    //},
    //{
    //    id: 18,
    //    Category: "Electronics",
    //    Company: "Microsoft",
    //    Product: "Xbox Series X",
    //    Description: "Next-gen gaming console by Microsoft",
    //    Price: 499,
    //    CustomDetails: [
    //        {
    //            Date: "2023-09-20",
    //            Customer: "Luna Garcia",
    //            Quantity: 1,
    //            TotalAmount: 499,
    //        },
    //    ],
    //},
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

const CardTableCustomers: React.FC = () => {
    const [productList] = useState<Product[]>(products);
    const [rowsLimit] = useState<number>(5);

    // Show a slice of the productList on initial load
    const [rowsToShow, setRowsToShow] = useState<Product[]>(
        productList.slice(0, rowsLimit)
    );

    // Store an array of null just to map for pagination. Could also store indexes if desired.
    const [customPagination, setCustomPagination] = useState<null[]>([]);
    const [totalPage] = useState<number>(Math.ceil(productList.length / rowsLimit));
    const [currentPage, setCurrentPage] = useState<number>(0);

    // Go to next page
    const nextPage = (): void => {
        const startIndex = rowsLimit * (currentPage + 1);
        const endIndex = startIndex + rowsLimit;
        const newArray = products.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(currentPage + 1);
    };

    // Go to the specific page by index
    const changePage = (value: number): void => {
        const startIndex = value * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = products.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(value);
    };

    // Go to previous page
    const previousPage = (): void => {
        const startIndex = (currentPage - 1) * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = products.slice(startIndex, endIndex);
        setRowsToShow(newArray);

        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else {
            setCurrentPage(0);
        }
    };

    // Build the pagination array once (if data doesn't change)
    useMemo(() => {
        setCustomPagination(Array(Math.ceil(productList.length / rowsLimit)).fill(null));
    }, [productList.length, rowsLimit]);

    return (
        <div className="min-h-screen h-full bg-white flex items-center justify-center pt-10 pb-14">
            <div className="w-full max-w-4xl px-2">
                <div>
                    <h1 className="text-2xl font-medium">Tailwind Table With Pagination</h1>
                </div>
                <div className="w-full overflow-x-scroll md:overflow-auto max-w-7xl 2xl:max-w-none mt-2">
                    <table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border">
                        <thead className="rounded-lg text-base text-white font-semibold w-full">
                            <tr className="bg-[#222E3A]/[6%]">
                                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                                    ID
                                </th>
                                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                                    Category
                                </th>
                                <th className="py-3 px-3 justify-center gap-1 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                                    Company
                                </th>
                                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                                    Product
                                </th>
                                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                                    Description
                                </th>
                                <th className="flex items-center py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap gap-1">
                                    Price
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowsToShow.map((data, index) => (
                                <tr
                                    className={`${index % 2 === 0 ? "bg-white" : "bg-[#222E3A]/[6%]"
                                        }`}
                                    key={data.id}
                                >
                                    <td
                                        className={`py-2 px-3 font-normal text-base ${index === 0
                                            ? "border-t-2 border-black"
                                            : index === rowsToShow.length
                                                ? "border-y"
                                                : "border-t"
                                            } whitespace-nowrap`}
                                    >
                                        {data.id}
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
                                        {/*{data.Company}*/}
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
                <div className="w-full flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-1.5 px-1 items-center">
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
                            {/* Previous Button */}
                            <li
                                className={`prev-btn flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${currentPage === 0
                                    ? "bg-[#cccccc] pointer-events-none"
                                    : "cursor-pointer"
                                    }`}
                                onClick={previousPage}
                            >
                                <img
                                    src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg"
                                    alt="Left arrow"
                                />
                            </li>

                            {/* Page Numbers */}
                            {customPagination.map((_, index) => (
                                <li
                                    key={index}
                                    className={`flex items-center justify-center w-[36px] rounded-[6px] h-[34px] border-[1px] border-solid border-[2px] bg-[#FFFFFF] cursor-pointer ${currentPage === index
                                        ? "text-blue-600 border-sky-500"
                                        : "border-[#E4E4EB]"
                                        }`}
                                    onClick={() => changePage(index)}
                                >
                                    {index + 1}
                                </li>
                            ))}

                            {/* Next Button */}
                            <li
                                className={`flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${currentPage === totalPage - 1
                                    ? "bg-[#cccccc] pointer-events-none"
                                    : "cursor-pointer"
                                    }`}
                                onClick={nextPage}
                            >
                                <img
                                    src="https://www.tailwindtap.com/assets/travelagency-admin/rightarrow.svg"
                                    alt="Right arrow"
                                />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardTableCustomers;
