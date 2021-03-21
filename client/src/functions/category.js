import axios from 'axios';
const instance = axios.create();

export const getCategories = async () => {
  return await axios.get(
        `${process.env.REACT_APP_API}/categories`
      )
};


export const getCategory = async (slug) => {
  return await axios.get(
        `${process.env.REACT_APP_API}/category/${slug}`
      )
};


export const removeCategory = async (slug,authtoken) => {
  return await axios.delete(
        `${process.env.REACT_APP_API}/category/${slug}`,
        { data: {authtoken} }
      )
};


export const updateCategory = async (slug,category,authtoken) => {
  return await axios.put(
        `${process.env.REACT_APP_API}/category/${slug}`,
        {authtoken, category}
      )
};


export const createCategory = async (category,authtoken) => {
  return await axios.post(
        `${process.env.REACT_APP_API}/category`,
        {authtoken,category}
      )
};


export const getCategorySubs = async (_id) => {
  return await axios.get(
        `${process.env.REACT_APP_API}/category/subs/${_id}`
      )
};
