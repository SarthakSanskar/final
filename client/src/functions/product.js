import axios from 'axios';
const instance = axios.create();

export const getProductsByCount = async (count) => {
  return await axios.get(
        `${process.env.REACT_APP_API}/products/${count}`
      )
};


export const getProduct = async (slug) => {
  return await axios.get(
        `${process.env.REACT_APP_API}/product/${slug}`
      )
};


export const removeProduct = async (slug,authtoken) => {
  return await axios.delete(
        `${process.env.REACT_APP_API}/product/${slug}`,
        { data: {authtoken} }
      )
};
//
//
// export const updateCategory = async (slug,category,authtoken) => {
//   return await axios.put(
//         `${process.env.REACT_APP_API}/category/${slug}`,
//         {authtoken, category}
//       )
// };


export const createProduct = async ( product,authtoken) => {
  return await axios.post(
        `${process.env.REACT_APP_API}/product`,
        {authtoken,product}   
      )
};

export const updateProduct = async (slug, product,authtoken) => {
  return await axios.put(
        `${process.env.REACT_APP_API}/product/${slug}`, 
        { authtoken ,product })};


export const getProducts = async ( sort , order , page) => {
  return await axios.post(
        `${process.env.REACT_APP_API}/products`,
        {sort , order , page}   
        )};

export const getproductsCount = async () => {
  return await axios.get(
        `${process.env.REACT_APP_API}/products/total`
          )};


export const productStar = async (productId, star,authtoken) => {
  return await axios.put(
        `${process.env.REACT_APP_API}/product/star/${productId}`, 
        { authtoken ,star }
        )};


export const getRelated = async (productId) => {
  return await axios.get(
        `${process.env.REACT_APP_API}/products/related/${productId}`
         )};


         export const fetchProductsByFilter = async (arg) => {
          return await axios.post(
                `${process.env.REACT_APP_API}/search/filters` , arg
              )
        };         