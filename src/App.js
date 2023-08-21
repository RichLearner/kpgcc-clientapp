import React from 'react';
import { BrowserRouter, Router, Route, Switch, Redirect  } from 'react-router-dom';
import CaddyList from './components/CaddyList';
import RatingForm from './components/RatingForm';
import ThankYou from './components/ThankYou';

function App() {
    const weburl = "/";
    return (
        <BrowserRouter>
            <Switch>
                <Route path={weburl+"rate-caddies/:receipt"} component={CaddyList} />
                <Route path={weburl+"rating-form/:receipt/:chitId/:caddyId/:name"} component={RatingForm} />
                <Route path={weburl+"thankyou"} component={ThankYou} />
                {/* Default route */}
                <Route path={weburl} component={CaddyList}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
