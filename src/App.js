import { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { auth, db } from "./firebase";
import { Button, Input, Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  // console.log(user);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const signUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        //if we just created someone...
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in...
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }
    });
    return () => {
      //perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((item) => ({ id: item.id, post: item.data() }))
        );
      });
  }, []);

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="logo"
              className="logo"
            />
          </center>
          <form className="signUp">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={"username"}
              type="text"
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={"email"}
              type="email"
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={"password"}
              type="password"
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="logo"
              className="logo"
            />
          </center>
          <form className="signUp">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={"email"}
              type="email"
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={"password"}
              type="password"
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <div className="header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="logo"
          className="logo"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="logInUp">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="posts">
        <div className="posts_left">
          {posts.map((item, index) => (
            <Post key={item.id} {...item} user={user} />
          ))}
        </div>
        <div className="posts_right">
          {/* <InstagramEmbed
            url="https://www.instagram.com/p/vjHV0oLsK0/"
            clientAccessToken="421798525635370|73e1a13b1f98305d27e54be26d3fbc1d"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          /> */}
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry, You need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
