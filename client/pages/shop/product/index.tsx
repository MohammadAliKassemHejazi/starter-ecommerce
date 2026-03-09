import React from "react";
import { PageLayout } from "@/components/UI/PageComponents";
import Link from "next/link";

const ProductIndex = () => {
  return (
    <PageLayout
      title="Products"
      subtitle="View our products"
      protected={false}
    >
      <div className="container py-5 text-center">
        <h2>Welcome to the Products Page</h2>
        <p className="lead mt-3">
          To browse all of our available products, please visit the main shop page.
        </p>
        <Link href="/shop" className="btn btn-primary mt-4">
          Go to Shop
        </Link>
      </div>
    </PageLayout>
  );
};

export default ProductIndex;
