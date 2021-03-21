import React from 'react'
import { Card } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import mantuPhoto from '../../images/mantu.jpeg';
import { Link } from 'react-router-dom';
import { showAverage } from '../../functions/rating';

const { Meta } = Card;

const ProductCard = ({ product }) => {
    // destructure
    const { images, title, description, slug , price } = product;
    return (
        <>
            {product && product.ratings && product.ratings.length > 0 ? showAverage(product) : <div className='text-center pt-1 pb-3' > No Rating Yet</div>}
            <Card
                cover={
                    <img src={images && images.length ? images[0].url : mantuPhoto}
                        style={{ height: '150px', objectFit: 'cover' }}
                        className='p-1 m-3' />}

                actions={[
                    <Link to={`product/${slug}`}>
                        <EyeOutlined className='text-warning' /><br /> View Product
                </Link>,
                    <>
                        <ShoppingCartOutlined className='text-danger' /><br /> Add To Cart ,
                </>,
                ]}
            >

                <Meta title={`${title} - $${price}`} description={`${description && description.substring(0, 29)}....`} />



            </Card>
        </>
    )
};


export default ProductCard;