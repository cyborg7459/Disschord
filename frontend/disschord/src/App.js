import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import axios from 'axios';

import StartupPage from './pages/startupPage/startup-page';
import LoginPage from './pages/loginPage/login-page';
import RegisterPage from './pages/registerPage/register-page';
import MainPage from './pages/mainPage/main-page';

class App extends React.Component {

  state = {
    displayMsg : ""
  }

  async componentDidMount() {
    const data = await axios.get('http://127.0.0.1:8080/api/v1/test', {
      withCredentials: true
    });
    console.log(data.data);
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={StartupPage}/>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/home" render={() => this.props.user.usAuthenticated ? <MainPage/> : <Redirect to="/login"/>} />
        <Route path="*" component={LoginPage}/> 
      </Switch>
    )
  }
}

const mapStateToProps = state => ({
  user : state.user
})

export default withRouter(connect(mapStateToProps)(App));
