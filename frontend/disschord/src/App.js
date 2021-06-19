import React from 'react';
import axios from 'axios';
import {Route, Switch} from 'react-router-dom';
import StartupPage from './pages/startupPage/startup-page';

class App extends React.Component {

  state = {
    displayMsg : ""
  }

  async componentDidMount() {
    const data = await axios.get('http://localhost:8080/api/v1/test');
    this.setState({
      displayMsg : data.data.message
    })
  }

  render() {
    return (
      <Switch>
        <Route path="/" component={StartupPage}/>
      </Switch>
    )
  }
}

export default App;
