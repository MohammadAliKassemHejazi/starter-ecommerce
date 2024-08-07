import Layout from "@/components/Layouts/Layout";

import React from "react";


type Props = {};


import Image from "next/image";
const ListShop = ({}: Props) => {


  return (
    <Layout>
      
  

<div className="container bg-white">
   
    <div className="row">
        <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
            <div className="product">
               <Image src="https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="" height={350} width={300}/>
                <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                    <li className="icon"><span className="fas fa-expand-arrows-alt"></span></li>
                    <li className="icon mx-3"><span className="far fa-heart"></span></li>
                    <li className="icon"><span className="fas fa-shopping-bag"></span></li>
                </ul>
            </div>
            <div className="tag bg-red">sale</div>
            <div className="title pt-4 pb-1">Winter Sweater</div>
            <div className="d-flex align-content-center justify-content-center">
               <span className="fas fa-star"></span> 
               <span className="fas fa-star"></span>
             <span className="fas fa-star"></span>
              <span className="fas fa-star"></span> 
              <span className="fas fa-star"></span> </div>
            <div className="price">$ 60.0</div>
        </div>
        <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
            <div className="product">
               <Image src="https://images.pexels.com/photos/6764040/pexels-photo-6764040.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="" height={350} width={300}/>
                <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                    <li className="icon"><span className="fas fa-expand-arrows-alt"></span></li>
                    <li className="icon mx-3"><span className="far fa-heart"></span></li>
                    <li className="icon"><span className="fas fa-shopping-bag"></span></li>
                </ul>
            </div>
            <div className="tag bg-black">out of stock</div>
            <div className="title pt-4 pb-1">Denim Dresses</div>
            <div className="d-flex align-content-center justify-content-center"> 
            <span className="fas fa-star"></span> 
            <span className="fas fa-star"></span> 
            <span className="fas fa-star"></span> 
            <span className="fas fa-star"></span> 
            <span className="fas fa-star"></span> </div>
            <div className="price">$ 55.0</div>
        </div>
        <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
            <div className="product">
               <Image src="https://images.pexels.com/photos/914668/pexels-photo-914668.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="" height={350} width={300}/>
                <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                    <li className="icon">
                      <span className="fas fa-expand-arrows-alt"></span></li>
                    <li className="icon mx-3">
                      <span className="far fa-heart"></span></li>
                    <li className="icon"><span className="fas fa-shopping-bag"></span></li>
                </ul>
            </div>
            <div className="tag bg-green">new</div>
            <div className="title pt-4 pb-1"> Empire Waist Dresses</div>
            <div className="d-flex align-content-center justify-content-center"> 
            <span className="fas fa-star"></span> 
            <span className="fas fa-star"></span> 
            <span className="fas fa-star"></span> 
            <span className="fas fa-star"></span> 
            <span className="fas fa-star"></span> </div>
            <div className="price">$ 70.0</div>
        </div>
        <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
            <div className="product">
               <Image src="https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="" height={350} width={300}/>
                <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                    <li className="icon"><span className="fas fa-expand-arrows-alt"></span></li>
                    <li className="icon mx-3"><span className="far fa-heart"></span></li>
                    <li className="icon"><span className="fas fa-shopping-bag"></span></li>
                </ul>
            </div>
            <div className="title pt-4 pb-1">Pinafore Dresses</div>
            <div className="d-flex align-content-center justify-content-center"> <span className="fas fa-star">
              </span> <span className="fas fa-star"></span> 
              <span className="fas fa-star"></span> <span className="fas fa-star"></span> <span className="fas fa-star"></span> </div>
            <div className="price">$ 60.0</div>
        </div>
    </div>
  
</div>

    </Layout>
  );
};

export default ListShop;
