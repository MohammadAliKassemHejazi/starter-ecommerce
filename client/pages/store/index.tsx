import Layout from '@/components/Layouts/Layout'
import React, { useEffect } from 'react'
import { useAppDispatch } from "@/store/store";

import {  fetchAllStores, storeSelector, } from '@/store/slices/storeSlice';
import { useSelector } from 'react-redux';
import protectedRoute from '@/components/protectedRoute';

const Stores = () => {
  const dispatch = useAppDispatch();

  
  // Correctly using the selector to get single store data
  const listOfStores= useSelector(storeSelector);



  useEffect(() => {
 
      dispatch(fetchAllStores())

  },[dispatch]);

  return (
    <Layout>

      <div>Number of Stores: {listOfStores?.length}</div>
      <div>SingleStore Component</div>
      <p>{listOfStores ? JSON.stringify(listOfStores) : 'Loading store data...'}</p>
    </Layout>
  )
}

export default protectedRoute(Stores);
