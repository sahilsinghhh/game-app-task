import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import RefreshIcon from '@material-ui/icons/Refresh';
import Counter from './Counter';
import Box from '@material-ui/core/Box';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';


const useStyles = makeStyles({
    root: {
        width: 250,
        margin: 30,
        boxShadow: "1px 15px 25px #ada9a9",
    },
});

const Dashboard = () => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false)
    const [post, setPost] = useState([])
    const [error, setError] = useState('')
    const [isAnUpdate, setIsAnUpdate] = useState(false);
    const [totalLikes, setTotalLikes] = useState(0);

    const CheckGamesLocalStoarage = () => {
        let returnVal = false;
        const data = JSON.parse(localStorage.getItem("gameList"));
        if (data) {
            returnVal = true;
        }
        return returnVal;
    }

    const calculateSum = (games) => {
        var msgTotal = games.reduce(function (prev, cur) {
            return prev + cur.likes;
        }, 0);

        return msgTotal;
    }
    useEffect(() => {
        debugger
        if (!CheckGamesLocalStoarage()) {
            setLoading(true);
            axios.get('http://localhost:4000/games')
                // .then(response=>console.log(response.data.games))
                .then(response => {
                    setLoading(false)
                    setPost(response.data.games)
                    setError('')
                })

                .catch(error => {
                    setLoading(false)
                    setPost({})
                    setError('Error 404 page not found')
                })
        } else {

            const gamePosts = JSON.parse(localStorage.getItem("gameList"));
            setPost(gamePosts);
            const sum = calculateSum(gamePosts);
            setTotalLikes(sum)
        }
    }, [])

    // Maintaining Update of GameData in Localstorage.
    useEffect(() => {

        if (isAnUpdate) {
            localStorage.setItem("gameList", JSON.stringify(post));
            // Calculating Sum of All likes.
            const sum = calculateSum(post);
            setTotalLikes(sum);
            setIsAnUpdate(false);
        }
    }, [isAnUpdate])

    // This handler will be passed to child component to Update the like of respective game.
    const LikeManager = (numberOfLikes, id) => {
        
    // Update your parent state with the help of incoming id.
        let newArray = [...post];
        const elementsIndex = post.findIndex(
            element => element.id === id
        );
        newArray[elementsIndex].likes = numberOfLikes;
        setPost(newArray);
        setIsAnUpdate(true)
    }

    return (
        <>
            <Typography gutterBottom variant="h3" component="h3" style={{ color: '#f50057' }} >
                Nes Classic Video Games
            </Typography>
            <div>
                <Box display="flex" justifyContent="flex-start" m={2} >
                    <Button variant="contained" color="secondary" onClick={() => window.location.reload(false)}>
                        <RefreshIcon /> Refresh
                    </Button>
                </Box>


                <Box display="flex" justifyContent="flex-end" m={2} style={{ position: "relative", bottom: '30px' }}>
                    <Button variant="contained" color="secondary" mr={5} style={{ marginRight: "10px" }} onClick={() => window.location.reload(false)}>
                        <ThumbUpAltIcon /><span style={{ marginLeft: '20px' }}>{totalLikes}</span>
                    </Button>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload(false)
                        }
                        }><RefreshIcon />
                        Reset
                    </Button>
                </Box>
            </div>

            <div className="dashBoardSection" style={{ display: "flex", flexWrap: 'wrap', width: "100%", marginLeft: '30px' }}>
                {loading ? <CircularProgress /> :
                    post.map(list => (

                        <Card className={classes.root}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    alt="Contemplative Reptile"
                                    height="200"
                                    image={list.image}

                                    title="game"
                                />
                            <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        <div style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                            {list.name}
                                        </div>
                                    </Typography>
                                    <Counter likeManager={LikeManager} gameData={list} />
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                {error ? error : null}
            </div>

        </>
    )
}

export default Dashboard


