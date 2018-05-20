import React, { Component } from 'react';
import Plus from '../../plus.png'
import base64 from 'base-64'
import Woo from './Woo'
import Spinner from '../../container/Spinner'

import axios from 'axios'
import { SITE_ROOT, CK, CS  } from '../../config'
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');


class  Crossover extends Component{
    constructor() {

        super();
        this.state = {
            data: [],
            loading: false,
            woo:'',
            selectedDay: undefined,


        }
    }

    componentWillMount() {
        let headers = new Headers();
        headers.append("Authorization", "Basic " + base64.encode(CK+":"+CS));

        fetch(SITE_ROOT+"/wp-json/wc/v2/products?per_page=100", {
            headers: headers
        })
            .then(response => response.json())
            .then((response) => {
                this.setState({
                    woo: response,

                })

               console.log(response)
            })
            .catch(e => {
                console.log(e)
            })
    }


    componentDidUpdate() {


    }

    fetchResult = (date) => {
        const url = SITE_ROOT+date
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

    addVariableProduct = (variable, ProductID) => {

         fetch(SITE_ROOT+"/wp-json/wc/v2/products/"+ProductID+"/variations",{
         method: 'post',
         headers: {
         'Accept': 'application/json, text/plain, *!/!*',
         'Content-Type': 'application/json',
         "Authorization": "Basic " + base64.encode(CK+":"+CS)

         },
         body: JSON.stringify(variable)
         }).then(res=>res.json())

         .then(res => console.log(res));
    }

    checkProductExists = (sku) => {

    }
    addProduct = (add, pslug ) => {
        console.log(add)
        this.setState({
            loading: true
        })
        let allWoo = this.state.woo
        let slug = []
        Object.keys( allWoo ).map( igKey => {
            return  slug   = [
                ... slug,
                allWoo[igKey].slug
            ]


        })
        //console.log(slug)
        if(slug.includes(pslug)){
            console.log('update')
            this.setState({
                loading: false
            })
        }else {
            fetch(SITE_ROOT+"/wp-json/wc/v2/products",{
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, *!/!*',
                    'Content-Type': 'application/json',
                    "Authorization": "Basic " + base64.encode(CK+":"+CS)

                },
                body: JSON.stringify(add)
            }).then(res=>res.json())

                .then(res => {
                    this.setState({
                        loading: false
                    })
                    console.log(res)
                });
        }



       /* */



     //  this.addVariableProduct(variable, responseID)


    }

    insertAll = (all) => {
        this.setState({
            loading: true
        })
        let allWoo = this.state.woo
        let slug = []
        Object.keys( allWoo ).map( igKey => {
            return  slug   = [
                ... slug,
                allWoo[igKey].slug
            ]


        })

        Object.keys( all ).map( igKey => {
            console.log(all[igKey].title)
            let allP  = {
                "status": "publish",
                "name":all[igKey].name,
                "slug":all[igKey].slug,
            }
            //console.log(all[igKey].title)
            this.addProduct(allP, all[igKey].slug)

        })

    }


    render () {

        let all = []
        let data = ''
        // console.log(this.state.data)
        let state = this.props.fetch

        let i = 1;
        let styleNumber  = []

        if( this.state.loading ){

        }

             data = Object.keys(state).map(igKey => {
                 if(typeof state[igKey].ProductName !== 'undefined') {
                     // console.log(state[igKey])
                     let pslug = (state[igKey].ProductName).replace(/\s+/g, '-').toLowerCase();

                     let AllData = {
                        "status": "publish",
                        "title": state[igKey].ProductName,
                        "content": state[igKey].SalesPrice,
                        "Attrib1": state[igKey].Attrib1,
                        "Attrib2": state[igKey].Attrib2,
                        "Attrib3": state[igKey].Attrib3,
                        "Brand": state[igKey].Brand,
                        "MRRP": state[igKey].MRRP,
                        "ProdGroup": state[igKey].ProdGroup,
                        "ProductID": state[igKey].ProductID,
                        "ProductName": state[igKey].ProductName,
                        "SalesPrice": state[igKey].SalesPrice,
                        "StyleNumber": state[igKey].StyleNumber,
                        "SubGroup": state[igKey].SubGroup,
                        "WebSalesPrice": state[igKey].WebSalesPrice
                    }
                    let add = {
                        "name": state[igKey].ProductName,
                        "slug": pslug,
                        "type": "simple",
                        "status": "publish",
                        "price": state[igKey].SalesPrice,
                        "purchasable": true,
                        "total_sales": 0,
                        "virtual": false,
                        "downloadable": false,
                        "manage_stock": false,
                        "stock_quantity": null,
                        "in_stock": true,
                        "dimensions": {
                            "colour": state[igKey].Attrib1,
                            "size": state[igKey].Attrib2,
                            "hand": state[igKey].Attrib3,
                        },


                        "attributes": [
                            {
                                "id": 5,
                                "name": "hand",
                                "position": 0,
                                "visible": true,
                                "variation": true,
                                "options": [
                                    "Right Hand"
                                ]
                            },
                            {
                                "id": 6,
                                "name": "shaft",
                                "position": 0,
                                "visible": true,
                                "variation": true,
                                "options": [
                                    "Regular"
                                ]
                            },
                            {
                                "id": 9,
                                "name": "loft",
                                "position": 0,
                                "visible": true,
                                "variation": true,
                                "options": [
                                    "3",
                                    "4",
                                    "5"
                                ]
                            }
                        ]


                    }
                    let variation = {
                        "default_attributes": [],
                        "variations": [
                            17118,
                            17119,
                            17120
                        ]
                    }

                    all = [
                        ...all,
                        {

                            "status": "publish",
                            "name": state[igKey].ProductName,
                            "slug": pslug,
                        }

                    ]


                    return (

                        <tr key={i++}>
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
                            <td>
                                <div className="add-product" onClick={() => this.addProduct(add, pslug)}><img src={Plus}
                                                                                                              alt=""/>
                                </div>
                            </td>
                        </tr>
                    )
                }
            })
        let spinner
        if( this.state.loading ){
            spinner = <Spinner/>
        }else {
            spinner = ''
        }

        return (

                <div>
                    {spinner}

                    <button className="btn btn-success" onClick={()=>this.insertAll(all)}>Insert All Products</button>



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

        )
    }
}

export default Crossover