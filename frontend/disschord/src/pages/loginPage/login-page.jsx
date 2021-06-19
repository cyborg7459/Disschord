import React from 'react';
import axios from 'axios';

class LoginPage extends React.Component {
    render() {
        return (
            <div className="page-container">
                <div className="page-inner">
                    <h1>Wecome to login page</h1>
                    <input type="text" id="email" placeholder="Enter your email adddress" />
                    <input type="password" id="password" placeholder="Enter your password" />
                </div>
            </div>
        )
    }
}

export default LoginPage;