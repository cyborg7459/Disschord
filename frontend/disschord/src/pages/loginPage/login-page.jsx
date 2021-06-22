import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { logUserIn, setUser } from '../../redux/user/userActions';

class LoginPage extends React.Component {

    login = async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const credentials = {
            email, 
            password
        }

        const res = await axios.post('http://127.0.0.1:8080/api/v1/users/login', credentials);
        if(res.data.status === "Success") {
            const data = res.data;
            localStorage.setItem('jwt', data.token);
            this.props.logUserIn();
            const user = data.data.user;
            this.props.setUser(user);
            this.props.history.push('/main');
        }
        else {
            alert("Wrong email ID or password");
        }
    }

    render() {
        return (
            <div className="page-container">
                <div className="page-inner">
                    <h1>Wecome to login page</h1>
                    <input type="text" id="email" placeholder="Enter your email adddress" />
                    <input type="password" id="password" placeholder="Enter your password" />
                    <br />
                    <button onClick={this.login}>Login</button>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    logUserIn : () => dispatch(logUserIn()),
    setUser : user => dispatch(setUser(user))
});

export default connect(null, mapDispatchToProps)(LoginPage);