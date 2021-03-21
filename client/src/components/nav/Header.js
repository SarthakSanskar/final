import React ,{useState} from 'react';

import { Menu } from 'antd';
import {  AppstoreOutlined,LogoutOutlined, SettingOutlined, UserOutlined, UserAddOutlined , ShoppingOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom';

import firebase from 'firebase';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import Search from '../forms/Search';


const { SubMenu, Item } = Menu;    //can also be written as Menu.SubMenu  (Destruct )

const Header = () => {
  const [current, setCurrent] = useState('Home');
  let dispatch = useDispatch()
  let {user} = useSelector((state) => ({ ...state }));

  let history = useHistory();


  const handleClick = (e)=>{
    console.log(e.key);
    setCurrent(e.key)
  };

  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type:"LOGOUT",
      payload: null,
    });
    history.push('/login');
  };

    return (
      <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
        <Item key="Home" icon={<AppstoreOutlined />}>
          <Link to="/">Home</Link>
        </Item>

        <Item key="shop" icon={<ShoppingOutlined />}>
          <Link to="/shop">Shop</Link>
        </Item>
 
        {
          !user &&  (<>
                      <Item key="register" icon={<UserAddOutlined />} className="float-right">
                    <Link to="/register">Register</Link>
                    </Item>
                    <Item key="login" icon={<UserOutlined />} className="float-right">
                    <Link to="/login">Login</Link>
                    </Item>
              </>)
        }



        { /* Dropdown */   }
        {
          user && (
                  <SubMenu key="SubMenu" icon={<SettingOutlined />} className="float-right" title={user.email && user.email.split('@')[0]} >


                  {user && user.role === "subscriber" &&(
                    <Item key="setting:1">
                          <Link to="/user/history">Dashboard</Link>
                    </Item>

                  )}

                  {user && user.role === "admin" &&(
                    <Item key="setting:1">
                          <Link to="/admin/dashboard">Dashboard</Link>
                    </Item>

                  )}


                    <Item icon={<LogoutOutlined />} onClick={logout}>LogOut</Item>
                </SubMenu>
              )
        }
      <span className = 'float-right p-1'>
        <Search />
      </span>
      </Menu>
    );
  }

export default Header;
