import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import { IArticleModelWithUser } from "@/models/article.model";
import { requestAllArticles } from "@/services/articleService";
import { GetServerSideProps } from "next";
import React from "react";
import styles from "./Home.module.css";

import ParticleComponent from "@/components/UI/home/starsbackground/starsbackground";
import { setAuthHeaders } from "@/utils/httpClient";

import { IProductModel } from "@/models/product.model";
import BubbleAnimation from "@/components/UI/home/bubbleanimation/BubbleAnimation";
import { IStoreResponseModel } from "@/models/store.model";
import ArticleList from "@/components/UI/General/listingArticles/ArticleList";
import ProductList from "@/components/UI/General/listingProducts/ListingProducts";
type Props = {
  articles?: IArticleModelWithUser[];
};
 
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



const Home = ({ articles }: Props) => {

  return (
    <Layout>
      <header className="py-5  border-bottom mb-4 overflow-hidden">
            
        <ParticleComponent></ParticleComponent>
        <BubbleAnimation stores={storesModel} ></BubbleAnimation>
     
      </header>
     <ProductList ></ProductList>

    <ArticleList articles={articles!}></ArticleList>
    </Layout>
  );
};

export default protectedRoute(Home);

export const getServerSideProps: GetServerSideProps = async (context:any) => {
    const headers = context.req.headers;
 setAuthHeaders(headers);
  const articles = await requestAllArticles();
  return {
    props: {
      articles,
    },
  };
};


