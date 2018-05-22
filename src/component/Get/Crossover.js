import React, { Component } from 'react';
import Plus from '../../plus.png'
import base64 from 'base-64'
import Woo from './Woo'
import Spinner from '../../container/Spinner'

import axios from 'axios'
import { SITE_ROOT, CK, CS  } from '../../config'
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

let x
class  Crossover extends Component{
    constructor() {

        super();
        this.state = {
            data: [],
            loading: false,
            woo:'',
            cats:'',
            selectedDay: undefined,
            catID:'',
            catName: ''


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
        fetch(SITE_ROOT+"/wp-json/wc/v2/products/categories", {
            headers: headers
        })
            .then(response => response.json())
            .then((response) => {
                this.setState({
                    cats: response,

                })

                //console.log(response)
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
    addCat = ( pslug, addcat, catname ) =>{
        this.setState({
            loading: true
        })
        let allWoo = this.state.cats
        let woocat = []

        Object.keys( allWoo ).map( igKey => {

            return  woocat   = [
                ... woocat,
                allWoo[igKey].name
            ]


        })

        // insert / update product based on slug
        if(woocat.includes(catname)){
            console.log('update')
            this.setState({
                loading: false
            })

        }else {
            return fetch(SITE_ROOT+"/wp-json/wc/v2/products/categories",{
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, *!/!*',
                    'Content-Type': 'application/json',
                    "Authorization": "Basic " + base64.encode(CK+":"+CS)

                },
                body: JSON.stringify(addcat)
            }).then(res=>res.json())

                .then(res => {
                    this.setState({
                        loading: false
                    })
                    console.log(res)
                     this.addProduct( pslug, res.id )
                });
        }


    }
    addProduct = ( pslug, catID ) => {
console.log('called')
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

        // insert / update product based on slug
        if(slug.includes(pslug)){
            console.log('update')
            this.setState({
                loading: false
            })

        }else {
            let state = this.props.fetch
            let add
            Object.keys(state).map(igKey => {
                if(typeof state[igKey].ProductName !== 'undefined') {
                    // console.log(state[igKey])
                    let pslug = (state[igKey].ProductName).replace(/\s+/g, '-').toLowerCase();
                     add = {
                        "name": state[igKey].ProductName,
                        "slug": pslug,
                        "type": "variable",
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
                        "categories": [
                            {
                                "id": catID
                            }
                        ],
                        "attributes": [
                            {
                                "name": "size",
                                "position": 0,
                                "visible": true,
                                "variation": true,
                                "options": [
                                    state[igKey].Attrib1
                                ]
                            },
                            {
                                "name": "colour",
                                "position": 0,
                                "visible": true,
                                "variation": true,
                                "options": [
                                    state[igKey].Attrib2
                                ]
                            },
                            {
                                "name": "hand",
                                "position": 0,
                                "visible": true,
                                "variation": true,
                                "options": [
                                    state[igKey].Attrib3
                                ]
                            }
                        ]


                    }
                }
            });

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
    let catID
    catID = this.insertAllcheckCat('catodnesx')
        console.log(catID)
        // retreive or insert cat
        Object.keys( all ).map( igKey => {


          //this.checkCat(all[igKey].categories[0].name)

            let allP  = {
                "name":  all[igKey].name,
                "slug": all[igKey].slug,
                "type": "variable",
                "status": "publish",
                "price":  all[igKey].price,
                "purchasable": true,
                "total_sales": 0,
                "virtual": false,
                "downloadable": false,
                "manage_stock": false,
                "stock_quantity": null,
                "in_stock": true,
                "dimensions": {
                    "colour":  all[igKey].dimensions.colour,
                    "size":  all[igKey].dimensions.size,
                    "hand":  all[igKey].dimensions.hand,
                },
                "categories": [
                    {
                        "id": catID
                    }
                ],
                "attributes": [
                    {
                        "name": "size",
                        "position": 0,
                        "visible": true,
                        "variation": true,
                        "options": [
                            all[igKey].attributes[0].options[0] === '' ? '' : all[igKey].attributes[0].options[0]
                        ]
                    },
                    {
                        "name": "colour",
                        "position": 0,
                        "visible": true,
                        "variation": true,
                        "options": [
                            all[igKey].attributes[1].options[0] === '' ? '' : all[igKey].attributes[1].options[0]
                        ]
                    },
                    {
                        "name": "hand",
                        "position": 0,
                        "visible": true,
                        "variation": true,
                        "options": [
                            all[igKey].attributes[2].options[0] === '' ? '' : all[igKey].attributes[2].options[0]
                        ]
                    }
                ]
            }
            //console.log(all[igKey].title)
           // this.addProduct(allP, all[igKey].slug)

        })

    }

    insertAllcheckCat = (all) => {

        // first step: looping through all data to check for category and to have products one by one
        Object.keys( all ).map( igKey => {
            // first part
           let cat = all[igKey].categories[0].name

            // second part
            let allWoo = this.state.cats
            let catNames = []
            let catName
            let catID
            let catIDs = []
            // second step: check the woo loop for cat
            Object.keys( allWoo ).map( ig => {
                // console.log(allWoo[ig])
                catIDs = [
                    ...catIDs,
                    allWoo[ig].id
                ]
                catNames   = [
                    ... catNames,
                    allWoo[ig].name
                ]

                // step three * A : if we found cat we insert now
                if( allWoo[ig].name === cat ) {
                     catID = allWoo[ig].id
                    let allP  = {
                        "name":  all[igKey].name,
                        "slug": all[igKey].slug,
                        "type": "variable",
                        "status": "publish",
                        "price":  all[igKey].price,
                        "purchasable": true,
                        "total_sales": 0,
                        "virtual": false,
                        "downloadable": false,
                        "manage_stock": false,
                        "stock_quantity": null,
                        "in_stock": true,
                        "dimensions": {
                            "colour":  all[igKey].dimensions.colour,
                            "size":  all[igKey].dimensions.size,
                            "hand":  all[igKey].dimensions.hand,
                        },
                        "categories": [
                            {
                                "id": catID
                            }
                        ],
                        "attributes": [
                            {
                                "name": "size",
                                "position": 0,
                                "visible": true,
                                "variation": true,
                                "options": [
                                    all[igKey].attributes[0].options[0] === '' ? '' : all[igKey].attributes[0].options[0]
                                ]
                            },
                            {
                                "name": "colour",
                                "position": 0,
                                "visible": true,
                                "variation": true,
                                "options": [
                                    all[igKey].attributes[1].options[0] === '' ? '' : all[igKey].attributes[1].options[0]
                                ]
                            },
                            {
                                "name": "hand",
                                "position": 0,
                                "visible": true,
                                "variation": true,
                                "options": [
                                    all[igKey].attributes[2].options[0] === '' ? '' : all[igKey].attributes[2].options[0]
                                ]
                            }
                        ]
                    }
                    //console.log(all[igKey].title)
                    // this.addProduct(allP, all[igKey].slug)
                    console.log('cat found'+catID)
                    //this.insertAll(all, catID)
                }

            })
            console.log(catNames)
            // step three * B : if we dont find it we insert cat first
            if(typeof catID ==='undefined')  {
                console.log('not eq')
                if(catNames.includes(cat)) {
                }else{
                    console.log('not incl')
                   // catNames.push(cat)
                    console.log(cat)
                    let catObj =  {
                        "name": cat
                    };

                    fetch(SITE_ROOT+"/wp-json/wc/v2/products/categories",{
                        method: 'post',
                        headers: {
                            'Accept': 'application/json, text/plain, *!/!*',
                            'Content-Type': 'application/json',
                            "Authorization": "Basic " + base64.encode(CK+":"+CS)

                        },
                        body: JSON.stringify(catObj)
                    }).then((resp)=>{ return resp.json() }).then((json)=>{
                        catID = json.id;
                        let allP  = {
                            "name":  all[igKey].name,
                            "slug": all[igKey].slug,
                            "type": "variable",
                            "status": "publish",
                            "price":  all[igKey].price,
                            "purchasable": true,
                            "total_sales": 0,
                            "virtual": false,
                            "downloadable": false,
                            "manage_stock": false,
                            "stock_quantity": null,
                            "in_stock": true,
                            "dimensions": {
                                "colour":  all[igKey].dimensions.colour,
                                "size":  all[igKey].dimensions.size,
                                "hand":  all[igKey].dimensions.hand,
                            },
                            "categories": [
                                {
                                    "id": catID
                                }
                            ],
                            "attributes": [
                                {
                                    "name": "size",
                                    "position": 0,
                                    "visible": true,
                                    "variation": true,
                                    "options": [
                                        all[igKey].attributes[0].options[0] === '' ? '' : all[igKey].attributes[0].options[0]
                                    ]
                                },
                                {
                                    "name": "colour",
                                    "position": 0,
                                    "visible": true,
                                    "variation": true,
                                    "options": [
                                        all[igKey].attributes[1].options[0] === '' ? '' : all[igKey].attributes[1].options[0]
                                    ]
                                },
                                {
                                    "name": "hand",
                                    "position": 0,
                                    "visible": true,
                                    "variation": true,
                                    "options": [
                                        all[igKey].attributes[2].options[0] === '' ? '' : all[igKey].attributes[2].options[0]
                                    ]
                                }
                            ]
                        }
                        //console.log(all[igKey].title)
                        // this.addProduct(allP, all[igKey].slug)
                        console.log('cat insereted'+catID)
                        // step four: insert product
                        //this.insertAll(all, catID)

                    })


                }
            }




        })
    }


    insertAllInsertCate = (catName) => {
        let catID
        let cat =  {
                 "name": catName
            };

        return fetch(SITE_ROOT+"/wp-json/wc/v2/products/categories",{
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, *!/!*',
                'Content-Type': 'application/json',
                "Authorization": "Basic " + base64.encode(CK+":"+CS)

            },
            body: JSON.stringify(cat)
        }).then((resp)=>{ return resp.json() }).then((json)=>{
             catID = 55;
            return catID;
        })


    }

    insertAllInsertPr = (catid) => {
        console.log('insi'+catid)
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
                    let addcat =  {
                        "name": state[igKey].ProdGroup
                    };

                    let variation = {
                        "default_attributes": [],
                        "variations": [
                            17118,
                            17119,
                            17120
                        ]
                    }

                  /*  all = [
                        ...all,
                        add

                    ]
*/

                    return (

                        <tr key={i++}>
                            <td>{i}</td>
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
                                {/* this.addCat(add, pslug,addcat, state[igKey].ProdGroup) */}
                                <div className="add-product" onClick={() => this.addCat( pslug,addcat, state[igKey].ProdGroup)}><img src={Plus}
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

                    <button className="btn btn-success" onClick={()=>this.insertAllcheckCat(all)}>Insert All Products</button>



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