import React from 'react';
import { BrowserRouter, Router, Route, Switch } from 'react-router-dom';
import CaddyList from './components/CaddyList';
import RatingForm from './components/RatingForm';
import ThankYou from './components/ThankYou';

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/rate-caddies/:receipt" component={CaddyList} />
                <Route path="/rating-form/:receipt/:chitId/:caddyId/:name" component={RatingForm} />
                <Route path="/thankyou" component={ThankYou} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
