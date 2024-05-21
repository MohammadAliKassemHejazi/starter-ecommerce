import Layout from '@/components/Layouts/Layout'
import React, { useEffect } from 'react'
import { useAppDispatch } from "@/store/store";
import { useRouter } from 'next/router';
import { fetchProductById } from '@/store/slices/shopSlice';
import { IStoreResponseModel } from '@/models/store.model';
import { storeSelector } from '@/store/slices/storeSlice';
import { useSelector } from 'react-redux';

function singelStore() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();
  var store  = useSelector(singelStore);
  var listofproducts = useSelector(storeSelector);
 
  React.useEffect(() => {
    if (id) {
      const storeId = Array.isArray(id) ? id[0] : id;
      dispatch(fetchProductById(storeId)).then((response) => {
       
      });
      dispatch(fetchAllStors()).then((response) => {
       
      });
    }
  }, [id, dispatch]);

  return (
    <Layout>
      <p>{store.name}</p>
      <p>{store.description}</p>
      <p>{store.imgUrl}</p>
      <p>{store.category}</p>
    <div>singelStore</div>
    </Layout>
  )
}

export default singelStore