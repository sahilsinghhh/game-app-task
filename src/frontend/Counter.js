import React, { useState } from 'react'
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import Button from '@material-ui/core/Button';


export default function LikeComponent ({likeManager,gameData}) {
    const initialCount = Number(gameData.likes)
    const [count, setCount] = useState(initialCount)


    const handleLike = () => {  
        setCount(count+1);
        likeManager(count+1,gameData.id)
    }

    return (
        <div>
 
            <Button variant="outlined" color="secondary" onClick={handleLike} >
                <ThumbUpAltOutlinedIcon /> &nbsp;{count} &nbsp;like 
            </Button>
        </div>
    )
}

