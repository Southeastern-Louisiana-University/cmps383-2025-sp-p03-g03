import React, { useEffect } from "react";
import CardTableProducts from "../../Cards/CardTableProducts";

const Products: React.FC = () => {
  useEffect(() => {
    console.log("Products page mounted");
    console.log("Current URL:", window.location.pathname);
  }, []);

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full mb-12 px-4">
        <h2 className="text-2xl font-semibold mb-4">Product Management</h2>
        <CardTableProducts color="light" />
      </div>
    </div>
  );
};

export default Products;