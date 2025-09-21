import Layout from "@/components/Layouts/Layout";
import ProtectedRoute from "@/components/protectedRoute";

import React, { useEffect } from "react";


import ParticleComponent from "@/components/UI/home/starsbackground/starsbackground";


import BubbleAnimation from "@/components/UI/home/bubbleanimation/BubbleAnimation";
import { IStoreResponseModel } from "@/models/store.model";

import ProductList from "@/components/UI/General/listingProducts/ListingProducts";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { fetchAllStores, storeSelector } from "@/store/slices/storeSlice";

 




const Home = () => {
 const dispatch = useAppDispatch();
 

  // Fetch list of stores from the selector
  const storesModel : IStoreResponseModel[] | undefined = useSelector(storeSelector);

  // Fetch all stores on component mount
  useEffect(() => {
    dispatch(fetchAllStores());
  }, [dispatch]);


  return (
    <Layout>
      <header className="py-5  border-bottom mb-4 overflow-hidden">
            
        <ParticleComponent></ParticleComponent>
        <BubbleAnimation stores={storesModel!} ></BubbleAnimation>
     
      </header>
        <ProductList ></ProductList>

    </Layout>
  );
}

export default function ProtectedHome() {
  return (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  );
}
