import React, {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthState';
import { getFeed, useFeed } from '../../context/feed/FeedState';

const Profile = () => {

    const { id } = useParams(); // get ID from the URL
    // const [authState, authDispatch] = useAuth();
    // const { isAuthenticated, user } = authState;
    const [feedState, feedDispatch] = useFeed();
    const {feedPosts} = feedState;

    useEffect(() => {
        getFeed(feedDispatch);
    }, [feedDispatch]);
    
    const userPosts = [];

    console.log(feedPosts);
    let numProjects = 0, numPapers = 0, numCompleted = 0, numPending = 0;
    feedPosts.map(post => {
        if(post.user == id) {
            if(post.type === "professional") numPapers++;
            else numProjects++;
            if(post.completed === "yescompleted") numCompleted++;
            else numPending++;
            userPosts.push(post);
        }
    })

    const [user, setUser] = useState(null);
    const getUser = async () => {
        const response = await fetch(`http://localhost:5000/api/users/${id}`, {
            method: "GET",
        });
        const data = await response.json();
        setUser(data);
        // console.log(response);
    };

    useEffect(() => {
        getUser();
    }, [])

    return (
        <div style={{textAlign: "center"}}>
            <h1>Profile</h1>
            {
                user && <h4>{user.name}</h4>
            }
            {
                user && <h4>{user.email}</h4>
            }
            <div style={{boxShadow: "3.84px 3.84px 12.8px rgba(21,46,171,.13)", borderRadius: "10px", margin: "30px 10px", padding: "15px"}}>
                <h1>List of completed Projects/Papers</h1>
                {
                    userPosts.map(post => (
                        post.completed === "yescompleted" && 
                        <div>
                            <Link to={"/feed/"+post._id}>{post.name}{' '}</Link>
                        </div>
                    ))
                }
            </div>

            <div style={{border: "1px solid #d8d7d7", borderRadius: "10px", margin: "30px 10px", padding: "15px"}}>
                <h1>List of ongoing Projects/Papers</h1>
                {
                    userPosts.map(post => (
                        post.completed !== "yescompleted" && 
                        <div>
                            <Link to={"/feed/"+post._id}>{post.name}{' '}</Link>
                        </div>
                    ))
                }
            </div>

            <div style={{boxShadow: "3.84px 3.84px 12.8px rgba(21,46,171,.13)", borderRadius: "10px", margin: "30px 10px", padding: "15px"}}>
                <h1>List of all Projects</h1>
                {
                    userPosts.map(post => (
                        post.type !== "professional" && 
                        <div>
                            <Link to={"/feed/"+post._id}>{post.name}{' '}</Link>
                        </div>
                    ))
                }
            </div>

            <div style={{border: "1px solid #d8d7d7", borderRadius: "10px", margin: "30px 10px", padding: "15px"}}>
                <h1>List of all Papers</h1>
                {
                    userPosts.map(post => (
                        post.type === "professional" && 
                        <div>
                            <Link to={"/feed/"+post._id}>{post.name}{' '}</Link>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Profile