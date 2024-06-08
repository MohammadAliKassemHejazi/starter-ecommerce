import Layout from '@/components/Layouts/Layout'
import React, { useEffect } from 'react'
import { useAppDispatch } from "@/store/store";
import { useRouter } from 'next/router';
import {  fetchAllStores, storeSelector, singleStoreSelector } from '@/store/slices/storeSlice';
import { useSelector } from 'react-redux';
import protectedRoute from '@/components/protectedRoute';

const Stores = () => {
  const dispatch = useAppDispatch();

  
  // Correctly using the selector to get single store data
  const listOfStores= useSelector(storeSelector);



  useEffect(() => {
 



      dispatch(fetchAllStores())
     
  
  },[]);

  return (
    <Layout>

      <div>Number of Stores: {listOfStores?.length}</div>
      <div>SingleStore Component</div>
    </Layout>
  )
}

export default protectedRoute(Stores);
