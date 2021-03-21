import React, {useState,useEffect} from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';
import {
  createSub,
  getSubs,
  removeSub
} from '../../../functions/sub';
import {
  getCategories
} from '../../../functions/category';
import { Link } from 'react-router-dom';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';

const SubCreate = () => {


  const {user} = useSelector((state) => ({ ...state }));

  const [name,setName] = useState('');
  const [loading,setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [subs, setSubs ] = useState([]);

  const [keyword, setKeyword] = useState('');


  useEffect(() => {
      loadCategories();
      loadSubs();
  }, []);

  const loadSubs = () =>
      getSubs().then((s) => setSubs(s.data));

  const loadCategories = () =>
      getCategories().then((c) => setCategories(c.data));



  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    createSub({name ,parent: category}, user.token)
    .then(res => {
      setLoading(false);
      setName('');
      toast.success(`"${res.data.name}" is created`);
      loadSubs();
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
      if (err.response.status === 400) toast.error(err.response.data);
    })
  }


  const handleRemove = async (slug) => {
    let answer = window.confirm('Delete..?');
    // console.log(answer);
    if (answer){
      setLoading(true);
      console.log(user.token);
      removeSub(slug,user.token)
      .then((res) => {
        setLoading(false);
        toast.success(`${res.data.name} deleted`);
        loadSubs();
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast.error(err.response.data);
        setLoading(false);}
      })
    }
  }

  // Step 3
  // const handleSearchChange = (e) => {
  //   e.preventDefault();
  //   setKeyword(e.target.value.toLowerCase())
  // };
/*// Step 4 */
  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

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
                  <select name='category' className='form-control'  onChange={(e) => setCategory(e.target.value) }>
                      <option key='' value=''>Select</option>
                      {categories.length >0 && categories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
                  </select>
                </div>
                {/*JSON.stringify(category) */}


                <CategoryForm name={name} handleSubmit={handleSubmit} setName={setName}  />


                {/*step 2  and step 3 */}
                < LocalSearch keyword={keyword} setKeyword={setKeyword} />


            {/*  step 5 */}
                {subs.filter(searched(keyword)).map((c) => (
                    <div className='alert alert-info' key={c._id}>
                        {c.name} {" "}
                        <span onClick={() => handleRemove(c.slug)} className='btn btn-sm float-right'>
                            <DeleteOutlined className='text-danger' />
                        </span>{" "}
                        <Link to={`/admin/sub/${c.slug}`}>
                            <span className='btn btn-sm float-right'>
                                < EditOutlined  />
                            </span>
                        </Link>
                    </div>
                ))}
        </div>
    </div>
  </div>)
  };

export default SubCreate;
