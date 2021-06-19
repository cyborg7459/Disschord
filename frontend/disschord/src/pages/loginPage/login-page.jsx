import React from 'react';
import axios from 'axios';

class LoginPage extends React.Component {

    login = async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const credentials = {
            email, 
            password
        }

        const res = await axios.post('http://127.0.0.1:8080/api/v1/users/login', credentials);
        console.log(res);
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

export default LoginPage;