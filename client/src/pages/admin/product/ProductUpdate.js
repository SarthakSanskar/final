import React, {useState,useEffect} from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';
import { getProduct, updateProduct } from '../../../functions/product';
import {getCategories, getCategorySubs} from '../../../functions/category';
import FileUpload from '../../../components/forms/FileUpload';
import {LoadingOutlined} from '@ant-design/icons'
import ProductUpdateForm from '../../../components/forms/ProductUpdateForm';
import {useParams} from 'react-router-dom';


const initState = {
    title: '',
    description: '',
    price: '',
    category: '',
    subs: [],
    shipping: '',
    quantity: '',
    images: [],
    colors: ["Black", 'Brown', "Silver", "Blue", 'White'],
    brands: ["Apple", 'Microsoft', "Samsung", "Lenovo", 'ASUS'],
    color: '',
    brand: ''
  }




const ProductUpdate = ({match , history}) => {


//state
    const [values, setValues] = useState(initState);
    const [subOptions, setSubOptions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [arrayOfSubs, setArrayOfSubIds] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [loading, setLoading] = useState(false);
// redux
    const {user} = useSelector((state) => ({...state}));
//router
    const {slug} = match.params;


    useEffect(() => {
      loadProduct();
      loadCategories();
    },[])

const loadProduct = () => {
   getProduct(slug)
   .then(p => {
     // console.log('Single Product' ,p)
     // 1 load single product
     setValues({...values, ...p.data});
     // 2 load single prodict category subs
     getCategorySubs(p.data.category._id)
     .then(res => {
       setSubOptions(res.data) // on first load
     })
     // 3 prepare array of sub ids to show default sub values in antd design Select
     let arr = []
     p.data.subs.map((s) => {
       arr.push(s._id)
     })
    //  console.log("ARR", arr)
     setArrayOfSubIds((prev) => arr) //& this special syntax we can replace existing prev values by new arr values  //required for ant design select to work
   })
 }

 const loadCategories = () =>
      getCategories().then((c) => {
      // console.log("GET CATEGARY IN UPDATED PRODUCTS" , c.data);
      setCategories(c.data);
      });  


    const handleSubmit = (e) => { 
      e.preventDefault();
      // console.log("@@@@@@@" , e.target.value)
      setLoading(true)
      values.subs = arrayOfSubs;
      values.category = selectedCategory ? selectedCategory : values.category;
      // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$", values)

      updateProduct(slug , values , user.token)
      .then( res => {
        setLoading(false);
        toast.success(` "${res.data.title}" is updated`);
        history.push('/admin/products');
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(err.response.data.err);
      })

    };

    const handleChange = (e) => {
      //
      setValues({...values, [e.target.name]: e.target.value })
      // console.log(e.target.name, '-------------', e.target.value);
    }

    const handleCategoryChange = (e) => {
      e.preventDefault();
      console.log('CLICKED CATEGORY', e.target.value);
      setValues({...values, subs: []});

      setSelectedCategory(e.target.value);

      getCategorySubs(e.target.value)
      .then(res => {
        console.log('Sub Options on Category', res);
        setSubOptions(res.data);
      });

      console.log('Existing Category values.category', values.category);


      // if user click back to the orignal category
      // show its sub category in default
      if (values.category._id === e.target.value) {
      loadProduct();
      }
      // clear sub category when category is changed
      setArrayOfSubIds([]);

    }



  return (
    <div className='container-fluid'>
      <div className='row'>
          <div className='col-md-2'>
              <AdminNav />
          </div>
          <div className='col'>
          {loading? <LoadingOutlined className='text-danger h1 mt-2' /> :<h3>Product Update</h3>}
              <hr />
              {/* {JSON.stringify(values)} */}

              <div className='p-3'>
                <FileUpload values={values} setValues={setValues} setLoading={setLoading} />
              </div>

              < ProductUpdateForm
                      handleChange={handleChange}
                      handleSubmit={handleSubmit}
                      handleCategoryChange={handleCategoryChange}
                      subOptions={subOptions}
                      // showSub={showSubs}
                      categories={categories}
                      setValues={setValues}
                      arrayOfSubs = {arrayOfSubs}
                      setArrayOfSubIds = {setArrayOfSubIds}  
                      values={values}
                      selectedCategory = {selectedCategory}
              />
            <hr />
          </div>
      </div>
  </div>
  )
}

export default ProductUpdate;
