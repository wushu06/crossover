import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import Spinner from '../../container/Spinner'
import Plus from '../../plus.png'
import GetCrossover from './Crossover'
import Woo from './Woo'

let style = {
    display: 'none'
};
let spinner =''
class  Get extends Component{
    constructor() {

        super();
        this.handleDayChange = this.handleDayChange.bind(this);
        this.state = {
            data: [],
            loading: true,
            selectedDay: undefined,


        }
    }

    componentDidMount () {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth();
        let yyyy = today.getFullYear();
        today = mm+'-'+dd+'-'+yyyy;
        this.setState({
            loading: false
        })
        


    }
    componentWillUpdate () {


    }

    fetchResult = (date) => {
        const url = "http://majorgolfdirect.com/api.php?date="+date
        fetch(url)
            .then(response => response.json())
            .then((response) => {
                this.setState({
                    data: response,
                    loading: false
                })
                // console.log(response)
            })
            .catch(e => {
                console.log(e)
            })

    }

    addProduct = (add) => {
        console.log( JSON.stringify(add))
        let token = localStorage.getItem('token');
        //console.log(token)
        const requestHeaders = {
            'Authorization': 'Bearer ' + token
        };
        fetch('http://localhost/checkfire/wp-json/wp/v2/product', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, *!/!*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token

            },
            body: JSON.stringify(add)
        }).then(res=>res.json())

            .then(res => console.log(res));
        const clientID = '8JGRHfmeaRFi8NGGmc3qJyv8Soi1QJ'
        const secretID = 'lRwuwJdpXs5tL5CloQ6QewgT5WGr9Y'

    }

    handleDayChange(day) {

        let formatDay = day.toISOString().substring(0, 10)
        formatDay = formatDay.replace(/\//g, "-")
        this.setState({ selectedDay: formatDay});
        this.fetchResult(formatDay )
       style = {
            display: 'block'
        };

    }

    render () {
        const { selectedDay } = this.state;



        if(this.state.loading){
           spinner = <Spinner/>
        }else {
            spinner = ''
        }
        return (
            <div>
                <h4>Received Data</h4>
                {selectedDay && <p>Day: {selectedDay}</p>}
                {!selectedDay && <p><strong>Choose a day</strong></p>}
                <DayPickerInput  onDayChange={this.handleDayChange} />
                <hr/>
                {spinner}
                <div className="Wrapper" style={style}>


                    <GetCrossover fetch={this.state.data}/>

                </div>

            </div>
        )
    }
}

export default Get