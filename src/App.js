import {
  Route,

  Switch,
  Redirect
} from "react-router-dom/cjs/react-router-dom.min";
import "./App.css";
import SignUp from "./component/SignUp";
import Login from "./component/login/Login";

import ComposeMail from "./component/mail/ComposeMail";
import Inbox from "./component/mail/Inbox";
import { useSelector } from "react-redux";
import FrontPage from "./component/FrontPage";
import SentBox from "./component/mail/SentBox";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <div className="app">
     <FrontPage/>
      <Switch>
      
        <Route exact path="/">
        {!isAuthenticated && <Redirect to='/inbox'/>}
          {isAuthenticated && <Redirect to='/login'/>}
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route exact  path="/composemail">
        {isAuthenticated && <ComposeMail/>}
        {!isAuthenticated && <Redirect to='/login'/>}
         
        </Route>
        <Route exact  path="/sentbox">
        {isAuthenticated && <SentBox/>}
        {!isAuthenticated && <Redirect to='/login'/>}
         
        </Route>
        <Route path="/inbox">
        {isAuthenticated && <Inbox/>}
        {!isAuthenticated && <Redirect to='/login'/>}
         
        </Route>
      </Switch>
    </div>
  );
}

export default App;
