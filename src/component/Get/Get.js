import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import Spinner from '../../container/Spinner'
import Plus from '../../plus.png'




let style = {
    display: 'none'
};
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
    insertAll = (all) => {
       // console.log(JSON.stringify(all))
      //  this.addProduct(all)
        Object.keys( all ).map( igKey => {
            let allP  = {
                "status": "publish",
                "title":all[igKey].title,
                "content": all[igKey].content
            }
            this.addProduct(allP)
        })

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
        let all = []
        const { selectedDay } = this.state;
       // console.log(this.state.data)
        let state = this.state.data
        let i = 1;
        let styleNumber  = []
        let data =  Object.keys( state ).map( igKey => {

          // console.log(state[igKey])
           let AllData  = {
               "status": "publish",
               "title":state[igKey].ProductName,
               "content": state[igKey].SalesPrice,
               "Attrib1": state[igKey].Attrib1,
               "Attrib2":state[igKey].Attrib2,
               "Attrib3":state[igKey].Attrib3,
               "Brand":state[igKey].Brand,
               "MRRP":state[igKey].MRRP,
               "ProdGroup":state[igKey].ProdGroup,
               "ProductID":state[igKey].ProductID,
               "ProductName":state[igKey].ProductName,
               "SalesPrice":state[igKey].SalesPrice,
               "StyleNumber":state[igKey].StyleNumber,
               "SubGroup" :state[igKey].SubGroup,
               "WebSalesPrice" : state[igKey].WebSalesPrice
           }
           let add  = {
               "status": "publish",
               "title":state[igKey].ProductName,
               "content": state[igKey].SalesPrice,
           }
           let num =  state[igKey].StyleNumber
            styleNumber = [
               ... styleNumber,
               state[igKey].StyleNumber
           ]

            all =[
                ...all,
                {

                    "status": "publish",
                    "title":state[igKey].ProductName,
                    "content": state[igKey].SalesPrice
                }

            ]


           return (

               <tr key={state[igKey].ProductID}>
                   <td>{i++}</td>
                   <td>{state[igKey].ProductID}</td>
                   <td>{state[igKey].ProductName}</td>
                   <td>{state[igKey].Brand}</td>
                   <td>{state[igKey].SalesPrice}</td>
                   <td>{state[igKey].ProdGroup}</td>
                   <td>{state[igKey].SubGroup}</td>
                   <td>{state[igKey].Attrib1}</td>
                   <td>{state[igKey].Attrib2}</td>
                   <td>{state[igKey].Attrib3}</td>
                   <td>{state[igKey].StyleNumber}</td>
                   <td><div className="add-product"  onClick={()=> this.addProduct(add)}><img src={Plus} alt=""/></div> </td>
               </tr>
           )

        })
       // console.log(styleNumber)
        let spinner = ''
        if(this.state.loading){
           spinner = <Spinner/>
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

                    <div>
                        <button className="btn btn-success" onClick={()=>this.insertAll(all)}>Insert All Products</button>
                    </div>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <td>N</td>
                            <td>ProductID</td>
                            <td>ProductName</td>
                            <td>Brand</td>
                            <td>SalesPrice</td>
                            <td>ProdGroup</td>
                            <td>SubGroup</td>
                            <td>Attrib1</td>
                            <td>Attrib2</td>
                            <td>Attrib3</td>
                            <td>StyleNumber</td>
                            <td>Add</td>
                        </tr>
                        </thead>
                        <tbody>

                        {data}

                        </tbody>

                    </table>
                </div>


            </div>
        )
    }
}

export default Get