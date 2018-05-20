import React, {Component} from 'react'

const clientID = '8JGRHfmeaRFi8NGGmc3qJyv8Soi1QJ'
const secretID = 'lRwuwJdpXs5tL5CloQ6QewgT5WGr9Y'
class Auth extends Component
{
    constructor() {
        super();
        this.state = {
            home: '',


        }


    }

    componentDidMount =() => {

        let url = window.location.href
        if(window.location.href.indexOf("token") > -1) {
            let newurl = new URL(url);
            let code = newurl.searchParams.get("token");
            console.log(code);
            localStorage.setItem('token', code);
            window.location.replace('http://localhost:3000')
           // 'Authorization': 'Bearer {base64 encoded 8JGRHfmeaRFi8NGGmc3qJyv8Soi1QJ:lRwuwJdpXs5tL5CloQ6QewgT5WGr9Y}',

          /*  fetch('http://localhost/checkfire/oauth/token', {
                method: 'post',
                headers: new Headers({
                    'Authorization': 'Bearer {base64 encoded '+clientID+':'+secretID+'}',
                    'grant_type': 'authorization_code',
                    'code': code,
                    'redirect_uri':'http://localhost:3000',
                    'client_id': clientID,
                    'client_secret': secretID,
                    'contentType':"application/x-www-form-urlencoded; charset=utf-8",
                    'crossDomain':true,
                    'cache' : true,

            })
            })

                .then(res =>
                    console.log(res)
                )
                .catch(e => {
                    console.log(e)
                })*/
        /* fetch('http://localhost/checkfire/',{
                beforeSend: function(xhr) {
                    // use the right content type
                    xhr.setRequestHeader('Content-Type', 'application/json');
                },
                type: 'POST',
                data: JSON.stringify({
                    "grant_type": "authorization_code",
                    'code': code,
                    "client_id": clientID,
                    "client_secret": secretID
                })

            }).then(res=>res.json())

             .then(res =>
                 console.log(res)
             )
             .catch(e => {
                 console.log(e)
             })*/

        }


    }
    getLogin =(e)=>
    {
        e.preventDefault()

        window.location.replace('http://localhost/checkfire/oauth/authorize?response_type=code&client_id='+clientID+'&redirect_uri=http://localhost/checkfire/redirect.php');

    }

    render() {


        return(
            <section className="wrapper animsitionx" id="page" >
                <form  action="http://localhost/checkfire/oauth/authorize?response_type=code&client_id=MlFENVaYQ0SEh8BftudXO7nSjSB46i&redirect_uri=http://localhost:3000">
                    <input className="btn btn-success" onClick={this.getLogin} type="submit" value="login"/>
                </form>
            </section>
        )
    }


};

export default Auth;