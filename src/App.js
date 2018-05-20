import React, { Component } from 'react';
import {Route} from 'react-router'
import Home from './container/Home'
import Get from './component/Get/Get'
import Post from './component/Post/Post'

import './App.css';

class App extends Component {


  render() {
      let allRoutes= ''

      let token = localStorage.getItem('token');
      if(token) {
        allRoutes = (
            <div>
                <Route path={'/result'} component={Get}/>
                <Route path={'/add'} component={Post}/>
            </div>

        )
      }
    return (
      <div className="App">
        <Route path={'/'} component={Home}/>
          {allRoutes}
      </div>
    );
  }
}

export default App;
