import React, { Component } from 'react';
import Auth from '../component/Auth/Auth'
import {Link} from 'react-router-dom'
import Logo from '../mgd-logo.gif'


let content


class Home extends Component {

    componentDidMount () {

    }
    getToken = () => {
       let token = localStorage.getItem('token');
        if(!token) {
            content = <Auth/>
        }else {
            content = (
                <div className="menu-wrapper">
                    <div>
                        <Link to={'/result'}> <button className="btn btn-success">Manage products</button> </Link>
                    </div>
                    <div>
                        <Link to={'/add'}> <button className="btn btn-success">Manage stock</button>  </Link>
                    </div>
                </div>
            )
        }
        return content
    }

    render() {
        return (
            <div>
                <img src={Logo} alt=""/>
                {this.getToken()}
            </div>
        )
    }


}

export default Home