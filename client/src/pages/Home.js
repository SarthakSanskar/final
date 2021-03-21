import React from 'react';
// import { getProducts, getProduct,  getProductsByCount, removeProduct } from '../functions/product';
// import ProductCard from '../components/cards/ProductCard';
import Jumbotron from '../components/cards/Jumbotron';
// import LoadingCard from '../components/cards/LoadingCard';
import NewArrivals from '../components/Home/NewArrivals';
import BestSeller from '../components/Home/BestSeller';
import CategoryList from '../components/category/CategoryList';
import SubList from '../components/sub/SubList';

const Home = () => {
  return (
    <>
      <div className="jumbotron text-danger h1 font-weight-bold text-center">
        <Jumbotron text={['New Arrivals', 'Best Seller', 'Latest Product']} />
      </div>

      <h4 className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
        New Arrivals
      </h4>
      <NewArrivals />
      <h4 className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
        Best Seller
      </h4>
      <BestSeller/>

      <h4 className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
        Categories
      </h4>
      <CategoryList/>

      <h4 className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
        Sub Categories
      </h4>
      <SubList/>
      <br/>
      <br/>
    </>
  );
};

export default Home;
