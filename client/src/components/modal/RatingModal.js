import React, { useState } from 'react';
import {Modal,Button} from 'antd';
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';
import {StarOutlined} from '@ant-design/icons';
import {useHistory , useParams} from 'react-router-dom';

const RatingModal = ({children}) => {
    const {user} = useSelector((state) => ({ ...state}) );
    const [modalVisible , setModalVisible] = useState(false);

    let history = useHistory();
    let {slug } = useParams();

    const handleModal = () => {
        if( user && user.token){
            setModalVisible(true)
        }else {
            history.push({
                pathname: '/login',
                state  : {from :`/product/${slug}`}
            });
        }
    };

    return(
        <>
        <div onClick = {handleModal}>
            <StarOutlined className = 'text-danger'/><br/> {user ? 'Infrastructure' : 'Login To See'}
        </div>
        <Modal title = 'Infrastructure'
            centered
            visible = {modalVisible}
            onOk = {() => {
                setModalVisible(false);
                toast.success('Thanks for your Review...');
            }}
            onCancel = {() => setModalVisible(false)}
            >
             
            {children}
        </Modal>
        </>
    )
}


export default RatingModal;