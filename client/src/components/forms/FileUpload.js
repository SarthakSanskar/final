import React from 'react';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {Avatar ,Badge} from 'antd';


const FileUpload = ({values, setValues, setLoading}) => {

  const {user} = useSelector((state) => ({...state}));

  const fileUploadAndResize = (e) => {
    // steps
    console.log(e.target.files);
    // resize
    let files = e.target.files;
    let allUploadedFiles = values.images;


    if (files) {
      setLoading(true);
      for (let i=0; i< files.length; i++){
        Resizer.imageFileResizer(files[i],720,720,'JPEG', 100, 0, (uri) => {
          //
          console.log("###########", uri , "#####################");
          axios.post(`${process.env.REACT_APP_API}/uploadimages`, {image: uri, authtoken :user? user.token: '' ,})
          .then(res => {
            console.log('IMAGE UPLOAD RESPONSE DATA', res);
            setLoading(false);
            allUploadedFiles.push(res.data);
            setValues({...values, images : allUploadedFiles});
          })
          .catch(err => {
            setLoading(false);
            console.log('CLOUDINARY UPLOAD ERROR');
          })
        }, 'base64'
      )
      }
    }

  }


  const handleImageRemove = (public_id) => {
    setLoading(true);
    console.log('remove image', public_id);
    const {images} = values;
    let filteredImages = images.filter((item) => {
      return item.public_id !== public_id;
    });
    setValues({...values, images: filteredImages});
    axios.post(`${process.env.REACT_APP_API}/removeimage`,{public_id, authtoken :user? user.token: '' ,})
    .then((res) => {
      console.log("THEN WORKED IN IMAGE REMOVE");
      setLoading(false);

    })
    .catch((err) => {
      setLoading(false);
      console.log('Cloudinary Frontend error', err);
    })
  }


  return (
    <>
      <div className='row'>
          {values.images.map((imag) => (
            <Badge count='X' key={imag.public_id} onClick={() => handleImageRemove(imag.public_id)} style={{cursor: 'pointer'}}>
            <Avatar shape='square' src={imag.url} size={100} className='ml-3' />
            </Badge>
          ))}
      </div>
      <div className='row'>
        <label className='btn btn-info btn-raised '>Choose file to upload
        <input type='file' multiple accept='images/*' hidden onChange={fileUploadAndResize} />
        </label>
      </div>
  </>
)}

export default FileUpload;
