﻿import React from 'react';
import logo from '../styles/KotaPermai (R).JPG';
import '../styles/css/CaddyList.css';

const ThankYou = () => {
    return (
        <div className="container">
            <img src={logo} alt="Logo" className="logo"/>
            <h1>Thank You for Your Rating!</h1>
            <p>Your rating has been submitted successfully.</p>
        </div>
    );
};

export default ThankYou;