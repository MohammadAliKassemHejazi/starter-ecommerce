import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";

import React from "react";


import ParticleComponent from "@/components/UI/home/starsbackground/starsbackground";


import BubbleAnimation from "@/components/UI/home/bubbleanimation/BubbleAnimation";
import { IStoreResponseModel } from "@/models/store.model";

import ProductList from "@/components/UI/General/listingProducts/ListingProducts";

 
const storesModel : IStoreResponseModel[] =  [
  { name: 'Store 1',description : "" ,categoryId:"",imgUrl:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pepsi_2023.svg/800px-Pepsi_2023.svg.png"},
  {  name: 'Store 2',description : "" ,categoryId:"",imgUrl:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pepsi_2023.svg/800px-Pepsi_2023.svg.png" },
  {  name: 'Store 3',description : "" ,categoryId:"" ,imgUrl:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pepsi_2023.svg/800px-Pepsi_2023.svg.png"},
  { name: 'Store 4' ,description : "" ,categoryId:"",imgUrl:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pepsi_2023.svg/800px-Pepsi_2023.svg.png"},
  {  name: 'Store 5',description : "" ,categoryId:"" ,imgUrl:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pepsi_2023.svg/800px-Pepsi_2023.svg.png"},
  {  name: 'Store 6',description : "" ,categoryId:"" ,imgUrl:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pepsi_2023.svg/800px-Pepsi_2023.svg.png"},
  {  name: 'Store 7' ,description : "" ,categoryId:"",imgUrl:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pepsi_2023.svg/800px-Pepsi_2023.svg.png"},
  { name: 'Store 8' ,description : "" ,categoryId:"",imgUrl:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pepsi_2023.svg/800px-Pepsi_2023.svg.png"},
  {  name: 'Store 9' ,description : "" ,categoryId:"",imgUrl:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pepsi_2023.svg/800px-Pepsi_2023.svg.png"},
  {  name: 'Store 10',description : "" ,categoryId:"" ,imgUrl:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pepsi_2023.svg/800px-Pepsi_2023.svg.png"},
  { name: 'Store 11',description : "" ,categoryId:"",imgUrl:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pepsi_2023.svg/800px-Pepsi_2023.svg.png" },
  { name: 'Store 12',description : "" ,categoryId:"",imgUrl:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pepsi_2023.svg/800px-Pepsi_2023.svg.png" },

];



const Home = () => {

  return (
    <Layout>
      <header className="py-5  border-bottom mb-4 overflow-hidden">
            
        <ParticleComponent></ParticleComponent>
        <BubbleAnimation stores={storesModel} ></BubbleAnimation>
     
      </header>
     <ProductList ></ProductList>

    </Layout>
  );
};

export default protectedRoute(Home);




