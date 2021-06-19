import React from 'react';
import axios from 'axios';

class RegisterPage extends React.Component {
    render() {
        return (
            <div className="page-container">
                <div className="page-inner">
                    <h1>Wecome to register page</h1>
                    <input type="text" id="name" placeholder="Enter your name"/>
                    <input type="text" id="email" placeholder="Enter your email adddress" />
                    <input type="password" id="password" placeholder="Enter your password" />
                    <input type="password" id="passconf" placeholder="Enter password again" />
                </div>
            </div>
        )
    }
}

export default RegisterPage;