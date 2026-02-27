import React, { useEffect } from "react";
import ParticleComponent from "@/components/UI/home/starsbackground/starsbackground";
import BubbleAnimation from "@/components/UI/home/bubbleanimation/BubbleAnimation";
import { IStoreResponseModel } from "@/models/store.model";
import ProductList from "@/components/UI/General/listingProducts/ListingProducts";
import FeaturedStores from "@/components/UI/home/FeaturedStores";
import PromotionalBanner from "@/components/UI/home/PromotionalBanner";
import LatestArticles from "@/components/UI/home/LatestArticles";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { fetchPublicStores, selectPublicStores, fetchPublicArticles } from "@/store/slices/publicSlice";
import { PageLayout } from "@/components/UI/PageComponents";
import ProtectedRoute from "@/components/protectedRoute";

const Home = () => {
  const dispatch = useAppDispatch();
  
  // Fetch list of stores from the public selector
  const storesModel: IStoreResponseModel[] | undefined = useSelector(selectPublicStores);

  // Fetch all public stores and articles on component mount
  useEffect(() => {
    dispatch(fetchPublicStores());
    dispatch(fetchPublicArticles());
  }, [dispatch]);

  const HeroSection = () => (
    <header className="py-5 border-bottom mb-4 overflow-hidden">
      <ParticleComponent />
      <BubbleAnimation stores={storesModel || []} />
    </header>
  );

  return (
    <PageLayout title="Welcome" subtitle="Discover amazing products from our stores" protected={false}>
      <HeroSection />
      <FeaturedStores />
      <ProductList />
      <PromotionalBanner />
      <LatestArticles />
    </PageLayout>
  );
};
export default function ProtectedHome() {
  return (
    <ProtectedRoute><Home></Home></ProtectedRoute>
  )
}
