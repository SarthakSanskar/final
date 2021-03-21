import React, {useState,useEffect} from 'react';
import { auth, googleAuthProvider } from '../../firebase';
import {toast} from 'react-toastify';
import {Button} from 'antd';
import { MailOutlined ,GoogleOutlined } from '@ant-design/icons';
import {useDispatch ,useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
// import {createOrUpdateUser} from '../../functions/auth';
import axios from 'axios';





const Login =({history})=>{

  const [email , setEmail] = useState("sanskartvd786@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({...state}));

  useEffect(() => {
    let intended = history.location.state;
    if(intended){
      return;
    }else{
      if (user && user.token){
        history.push('/');
      }
    }
  },[user, history]);

  let dispatch = useDispatch();

  const roleBasedRedirect = (res) => { 
    // check if intented
    let intended = history.location.state;
    if(intended){
      history.push(intended.from);
    }else{
      if (res.data.role === 'admin'){
        history.push('/admin/dashboard');
      }else {
        history.push('/user/history');
      }
    }
    };
 
  const handleSubmit = async (e) => {
      setLoading(true);
      e.preventDefault();
      // console.table(email,password);
      try{
        const result = await auth.signInWithEmailAndPassword(email,password);
        // console.log(result);
        const {user} = result;
        const idTokenResult = await user.getIdTokenResult();
        // console.log("Sanskar!!!!!!!!!!!!!!!!!!!!!!!");
        // createOrUpdateUser(idTokenResult.token)
        await axios.post(
              'http://localhost:8000/api/create',
              {authtoken: idTokenResult.token})
        .then(
          (res) => {
            console.log("CREATE OR UPDATE RES", res);
            dispatch({
              type :'LOGGED_IN_USER',
              payload: {
                // email : user.email,
                // token : idTokenResult.token,
                name : res.data.name,
                email : res.data.email,
                token : idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              }
            });
            roleBasedRedirect(res);
          })
        .catch((err) => console.log("<<<<<<<<<<<<<OOO MAA GOO ERROR //login//>>>>>>>>>>>>>", err));

        // history.push('/');
      }catch(error) {
        console.log(error);
        toast.error(error.message);
        setLoading(false);
      }
  };


  const googleLogin = async () => {

      auth.signInWithPopup(googleAuthProvider)
            .then(async (result) => {
              const {user} = result;
              console.log("Sanskar!!!!!!!!!!!!!!!!!!!!!!!");
              const idTokenResult = await user.getIdTokenResult();
              // createOrUpdateUser(idTokenResult.token)
              await axios.post(
                    'http://localhost:8000/api/create',
                    {authtoken: idTokenResult.token})
              .then(
                (res) => {
                  console.log("CREATE OR UPDATE RES", res);
                  dispatch({
                    type :'LOGGED_IN_USER',
                    payload: {
                      // email : user.email,
                      // token : idTokenResult.token,
                      name : res.data.name,
                      email : res.data.email,
                      token : idTokenResult.token,
                      role: res.data.role,
                      _id: res.data._id,
                    }
                  });
                  roleBasedRedirect(res);

                })
              .catch((err) => console.log("<<<<<<<<<<<<<OOO MAA GOO ERROR>>>>>>>>>>>>>"));
              // history.push('/');
            })

            .catch((error) => {
              console.log(error);
              toast.error(error.message);
            });

  };

  const loginForm = () => (
    <form onSubmit={handleSubmit} >
      <div className="form-group">
          <input
              type='email'
              className="form-control"
              value={email}
              onChange={e =>setEmail(e.target.value)}
              placeholder="Your Email"

          />
      </div>
      <div className="form-group">
          <input
                type='password'
                className="form-control"
                value={password}
                onChange={e =>setPassword(e.target.value)}
                placeholder="Your password"

            />
      </div>

<br/>
      <Button
        onClick={handleSubmit}
        type='primary'
        shape='round'
        block
        icon={<MailOutlined />}
        className='mb-3'
        size='large'
        disabled={!email || password.length<6}
      >Login with Email&Password </Button>
  </form>
);

  return (
    <div className="container p-5">
      <div className="row">
          <div className="col-md-6 offset-md-3">
            {!loading ? (
                <h4>Login</h4>
             ):(
                <h4 className="text-danger">Loading...</h4>
            )}
            {loginForm()}


            <Button
              onClick={googleLogin}
              type='danger'
              shape='round'
              block
              icon={<GoogleOutlined />}
              className='mb-3'
              size='large'
              disabled={!email || password.length<6}
            >Login with Email&Password </Button>

            <Link to="/forgot/password" className="float-right text-danger">
            Forgot Password
            </Link>

          </div>
      </div>
    </div>
  );
};

export default Login;
