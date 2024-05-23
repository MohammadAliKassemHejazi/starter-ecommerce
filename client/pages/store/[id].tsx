import Layout from '@/components/Layouts/Layout'
import React, { useEffect } from 'react'
import { useAppDispatch } from "@/store/store";
import { useRouter } from 'next/router';
import { fetchStoreById, fetchAllStores, storeSelector, singleStoreSelector } from '@/store/slices/storeSlice';
import { useSelector } from 'react-redux';
import protectedRoute from '@/components/protectedRoute';

const SingleStore = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = router.query;
  
  // Correctly using the selector to get single store data
  const listOfStores= useSelector(storeSelector);
  const store = useSelector(singleStoreSelector);


  useEffect(() => {
    if (id) {

      const storeId = Array.isArray(id) ? id[0] : id;

      dispatch(fetchStoreById(storeId)).then((response) => {
    
       
      });

      dispatch(fetchAllStores()).then((response) => {
    
      
      });
     
    }
  }, [id, dispatch]);

  return (
    <Layout>
      <p>{store ? JSON.stringify(store) : 'Loading store data...'}</p>
      <div>Number of Stores: {listOfStores?.length}</div>
      <div>SingleStore Component</div>
    </Layout>
  )
}

export default protectedRoute(SingleStore);
