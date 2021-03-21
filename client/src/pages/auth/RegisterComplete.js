import React, {useState, useEffect} from 'react';
import { auth } from '../../firebase';
import {toast} from 'react-toastify';
import {useDispatch ,useSelector} from 'react-redux';
// import {createOrUpdateUser} from '../../functions/auth';
import axios from 'axios';



const RegisterComplete =({history})=>{

        const [email , setEmail] = useState("");
        const [password, setPassword] = useState("");

        // const { user } = useSelector((state) => ({...state}));


        useEffect( () => {
          setEmail(localStorage.getItem('emailForRegistration'));
          // console.log(window.location.href);
        }, []);

        let dispatch = useDispatch();

        const handleSubmit = async (e) => {
            e.preventDefault();    //prevent from reload of the page

            //validation
            if (!email || !password){
              toast.error('Email and password is required');
              return;
            }

            if (password.length < 6){
              toast.error('Password must be atleast 6 characters long');
              return;
            }


            try{
              const result = await auth.signInWithEmailLink(email, window.location.href);
              // console.log("result", result);
              if (result.user.emailVerified){

                //remove email from localStorage
                  window.localStorage.removeItem('emailForRegistration');

                // get userid token
                  let user = auth.currentUser;
                  await user.updatePassword(password);
                  const idTokenResult = await user.getIdTokenResult();
                  console.log('user', user, 'idTokenResult', idTokenResult);
                //redux store


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
                        })
                      .catch((err) => console.log("<<<<<<<<<<<<<OOO MAA GOO ERROR ///RegisterComplete///>>>>>>>>>>>>>"));
                // redirect
                history.push('/');
              }
            }
            catch (error){
              console.log(error);
              toast.error(error.message);
            }
        };




        const completeRegistrationForm = () => (
          <form onSubmit={handleSubmit} >
            <input
                  type='email'
                  className="form-control"
                  value={email}
                  onChange={e =>setEmail(e.target.value)}
                  disabled
              />

            <input
                  type='password'
                  className="form-control"
                  value={password}
                  onChange={e =>setPassword(e.target.value)}
                  placeholder="Password"
                  autoFocus
              />
              <br/>

            <button type="submit" className="btn btn-raised">Complete Registration</button>
        </form>
      );

        return (
          <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                  <h4>Register Complete</h4>
                  {completeRegistrationForm()}
                </div>
            </div>
          </div>
        );
      };

export default RegisterComplete;
