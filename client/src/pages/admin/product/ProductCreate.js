import React, {useState,useEffect} from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';
import {
  createProduct,
} from '../../../functions/product';
import {getCategories, getCategorySubs} from '../../../functions/category';
import FileUpload from '../../../components/forms/FileUpload';
import {LoadingOutlined} from '@ant-design/icons'


import ProductCreateForm from '../../../components/forms/ProductCreateForm';

const initState = {
    title: '',
    description: '',
    price: '',
    category: '',
    categories: [],
    subs: [],
    shipping: '',
    quantity: '',
    images: [],
    colors: ["Black", 'Brown', "Silver", "Blue", 'White'],
    brands: ["Apple", 'Microsoft', "Samsung", "Lenovo", 'ASUS'],
    color: '',
    brand: ''
  }

const ProductCreate = () => {
  const [values, setValues] = useState(initState);
  const [subOptions, setSubOptions] = useState([]);
  const [showSubs, setShowSubs] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      loadCategories();
  }, []);

  const loadCategories = () =>
      getCategories().then((c) => setValues({...values, categories: c.data}));



// redux
    const {user} = useSelector((state) => ({...state}));

    const handleSubmit = (e) => {
      e.preventDefault();
      createProduct(values, user.token)
      .then(res => {
        console.log(res);
        toast.success("Product Create Completed");
        window.alert(`${res.data.title} is created`);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        // if (err.response.status === 400) toast.error(err.response.data);
        toast.error(err.response.data.err);
      })
    }

    const handleChange = (e) => {
      //
      setValues({...values, [e.target.name]: e.target.value })
      // console.log(e.target.name, '-------------', e.target.value);
    }


    const handleCategoryChange = (e) => {
      e.preventDefault();
      console.log('CLICKED CATEGORY', e.target.value);
      setValues({...values, subs: [], category: e.target.value });
      getCategorySubs(e.target.value)
      .then(res => {
        console.log('Sub Options on Category', res);
        setSubOptions(res.data);
      })
      setShowSubs(true);

    }


  return (
    <div className='container-fluid'>
      <div className='row'>
          <div className='col-md-2'>
              <AdminNav />
          </div>

          <div className='col'>
              {loading? <LoadingOutlined className='text-danger h1 mt-2' /> :<h3>Product Create</h3>}
              <hr />
              {/* JSON.stringify(values.images)*/}


              <div className='p-3'>
                <FileUpload values={values} setValues={setValues} setLoading={setLoading} />
              </div>

              <ProductCreateForm
                      handleChange={handleChange}
                      handleSubmit={handleSubmit}
                      handleCategoryChange={handleCategoryChange}
                      subOptions={subOptions}
                      showSub={showSubs}
                      setValues={setValues}
                      values={values} />
          </div>
      </div>
  </div>
  )
}

export default ProductCreate;
