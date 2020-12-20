import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import './Post.css'
import { db } from "./firebase";
import firebase from "firebase";

function Post({id, post:{caption, username, imageUrl},user}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    const postComment = (e) =>{
        e.preventDefault();
        db.collection("posts").doc(id).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment('');
    }

    useEffect(() => {
        let unsubscribe;
        if(id){
            unsubscribe = db
                .collection("posts")
                .doc(id)
                .collection('comments')
                .orderBy('timestamp','desc')
                .onSnapshot((snapshot)=>{
                    setComments(snapshot.docs.map((item)=>item.data()))
                })
        }
        return () => {
            unsubscribe()
        }
    }, [id])

    return (
        <div className="post">
            <div className="user">
                <Avatar 
                    className="avatar"
                    alt="avatar"
                    src={imageUrl}
                />
                <h3>{username}</h3>
            </div>
            <img className="image" src={imageUrl} alt="usere"/>
            <h4 className="text"><strong>{username}</strong> {caption}</h4>

            {
                <div className="postComments">
                    {comments.map((item,index)=>{
                        return (
                            <p key={index}>
                                <strong>{item.username}</strong>{item.text}
                            </p>
                        )
                    })}
                </div>
            }

            {user && (
                <form className="postComment">
                <input onChange={(e)=>setComment(e.target.value)} value={comment} placeholder="Write a comment..." className="comment" type="text"/>
                <button onClick={postComment} disabled={!comment} type="submit" className="comment_btn">Post</button>
            </form>
            )}
        </div>
    )
}

export default Post
