import {Card ,  Skeleton } from 'antd';
import React from 'react';


const LoadingCard = ({count}) => {
const cards = () => {
    let totalcards = [];

    for(let i = 0 ; i < count ; i++){
        totalcards.push(
            <Card className = 'col-md-4 m-3' key = {i} >
                <Skeleton active></Skeleton>;
            </Card>
        );
    }
    return totalcards;
};
return <div className = 'row pb-5'>{cards()}</div>;
};



export default LoadingCard;