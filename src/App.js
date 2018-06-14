import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import PerformHash from './components/PerformHash';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container-fluid">
          <ul className="nav">
            <li className="nav-item">
              <Link to="/write" className="nav-link">Write credit details</Link>
            </li>
            <li className="nav-item">
              <Link to="/read" className="nav-link">Check</Link>
            </li>
          </ul>
          <div className="row">
            <div className="col-6 col-xs-12">
              <Route 
                exact 
                path="/" 
                render={(props) => <PerformHash {...props} type="write" />} 
              />
              <Route 
                exact 
                path="/write" 
                render={(props) => <PerformHash {...props} type="write" />} 
              />
              <Route 
                exact 
                path="/read" 
                render={(props) => <PerformHash {...props} type="read" />} 
              />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
