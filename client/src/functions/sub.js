import axios from 'axios';
const instance = axios.create();

export const getSubs = async () => {
  return await axios.get(
        `${process.env.REACT_APP_API}/subs`
      )
};


export const getSub = async (slug) => {
  return await axios.get(
        `${process.env.REACT_APP_API}/sub/${slug}`
      )
};


export const removeSub = async (slug,authtoken) => {
  return await axios.delete(
        `${process.env.REACT_APP_API}/sub/${slug}`,
        { data: {authtoken} }
      )
};


export const updateSub = async (slug,sub,authtoken) => {
  return await axios.put(
        `${process.env.REACT_APP_API}/sub/${slug}`,
        {authtoken, sub}
      )
};


export const createSub = async (sub,authtoken) => {
  return await axios.post(
        `${process.env.REACT_APP_API}/sub`,
        {authtoken,sub}
      )
};
