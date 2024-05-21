import Layout from '@/components/Layouts/Layout'
import React, { useEffect } from 'react'
import { useAppDispatch } from "@/store/store";
import { useRouter } from 'next/router';
import { fetchStoreById ,fetchAllStores} from '@/store/slices/storeSlice';
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
      dispatch(fetchStoreById(storeId)).then((response) => {
       
      });
      dispatch(fetchAllStores()).then(() => {
       
      });
    }
  }, [id, dispatch]);

  return (
    <Layout>
      <p>{store}</p>
      <div>{listofproducts?.length}</div>
    <div>singelStore</div>
    </Layout>
  )
}

export default singelStore