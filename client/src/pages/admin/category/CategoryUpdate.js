import React, {useState,useEffect}  from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';
import {
  updateCategory,
  getCategory
} from '../../../functions/category';
import CategoryForm from '../../../components/forms/CategoryForm';



const CategoryUpdate = ({ history, match }) => {
  const {user} = useSelector((state) => ({ ...state }));

  const [name,setName] = useState('');
  const [loading,setLoading] = useState(false);

  useEffect(() => {
      // console.log(match);
      loadCategory();
  }, []);

  const loadCategory = () =>
      getCategory(match.params.slug).then((c) => setName(c.data.name));



  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    updateCategory(match.params.slug, {name}, user.token)
    .then(res => {
      setLoading(false);
      setName('');
      toast.success(`"${res.data.name}" is updated`);
      history.push('/admin/category');
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
      if (err.response.status === 400) toast.error(err.response.data);
    })
  }


  return(
  <div className='container-fluid'>
    <div className='row'>
        <div className='col-md-2'>
            <AdminNav />
        </div>
        <div className='col'>
                {loading ?(
                  <h3 className='text-danger'> Loading... </h3>
                ) : (
                  <h3> Update Category </h3>
                ) }
                <CategoryForm  name={name} handleSubmit={handleSubmit} setName={setName}   />
            <hr/>

        </div>
    </div>
  </div>)
};

export default CategoryUpdate;
