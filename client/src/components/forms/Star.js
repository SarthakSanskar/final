import React from 'react'
import StarRatings from 'react-star-ratings'

const Star = ({starClicks , numberOfStar}) => (<>
    <StarRatings
        changeRating = {() => starClicks(numberOfStar)}
        numberOfStars = {numberOfStar}
        starDimension = "20px"
        starSpacing = '2px'
        starHoverColor = 'red'
        starEmptyColor = 'red'
    />
    <br />
</>
);

export default Star;