import React, {useState,useEffect} from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';
import {
  createSub,
  getSub,
  updateSub
} from '../../../functions/sub';
import {
  getCategories
} from '../../../functions/category';
import { Link } from 'react-router-dom';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';

const SubUpdate = ({match, history}) => {


  const {user} = useSelector((state) => ({ ...state }));

  const [name,setName] = useState('');
  const [loading,setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [parent, setParent ] = useState('');


  useEffect(() => {
      loadCategories();
      loadSub();
  }, []);

  const loadSub = () =>
      getSub(match.params.slug).then((s) => {
        setName(s.data.name);
        setParent(s.data.parent);

      });



  const loadCategories = () =>
      getCategories().then((c) => setCategories(c.data));



  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    updateSub(match.params.slug, {name ,parent}, user.token)
    .then(res => {
      setLoading(false);
      setName('');
      toast.success(`"${res.data.name}" is updated`);
      history.push('/admin/sub');
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
                  <h3> Create Sub Category </h3>
                ) }


                <div className='form-group'>
                  <label>Parent Category</label>
                  <select name='category' className='form-control'  onChange={(e) => setParent(e.target.value) }>
                      <option key='' value=''>Select</option>
                      {categories.length >0 &&
                        categories.map((c) => (
                          <option key={c._id} value={c._id} selected={c._id === parent}>{c.name}</option>))}
                  </select>
                </div>
                {/*JSON.stringify(category) */}


                <CategoryForm name={name} handleSubmit={handleSubmit} setName={setName}  />



            {/*  step 5 */}

        </div>
    </div>
  </div>)
  };

export default SubUpdate;
