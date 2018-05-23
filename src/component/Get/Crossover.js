import React, { Component } from 'react';
import Plus from '../../plus.png'
import base64 from 'base-64'
import Spinner from '../../container/Spinner'
import { SITE_ROOT, CK, CS  } from '../../config'


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
        fetch(SITE_ROOT+"/wp-json/wc/v2/products/categories?per_page=100", {
            headers: headers
        })
            .then(response => response.json())
            .then((response) => {
                this.setState({
                    cats: response,

                })


            })
            .catch(e => {
                console.log(e)
            })
    }



    addVariableProduct = ( ProductID, variable) => {
        console.log('insert variable'+ProductID)
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


    addCat = ( pslug, addcat, catname ) =>{
        this.setState({
            loading: true
        })
        let allWoo = this.state.cats
        let woocat = []
        let catWname = []
        let catID

        Object.keys( allWoo ).map( igKey => {

            catWname = [
                ...catWname,
                {[allWoo[igKey].name] : allWoo[igKey].id}
            ]

            return  woocat   = [
                ... woocat,
                allWoo[igKey].name
            ]



        })
        // insert / update product based on slug
        if(woocat.includes(catname)){
            console.log('update cat')
            this.setState({
                loading: false
            })
            catWname.map( i => {
                catID = i[catname]
                if(typeof catID !== 'undefined') {
                    this.addProduct( pslug, catID )
                }
            })

        }else {
            console.log('insert cat')
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
        this.setState({
            loading: true
        })
        let allWoo = this.state.woo
        let slug = []
        let postWid = []
        let postID

        Object.keys( allWoo ).map( igKey => {
           // console.log(pslug +'=' + allWoo[igKey].slug)
            postWid = [
                ...postWid,
                {[allWoo[igKey].slug] : allWoo[igKey].id}
            ]
            return  slug   = [
                ... slug,
                allWoo[igKey].slug
            ]


        })

        // insert / update product based on slug
        if(slug.includes(pslug)){
            console.log('update post')
            this.setState({
                loading: false
            })
            postWid.map( i => {
                postID = i[pslug]
                if(typeof postID !== 'undefined') {
                    let state = this.props.fetch
                    Object.keys(state).map(ig => {
                        let pslugV = (state[ig].ProductName).replace(/\s+/g, '-').toLowerCase();

                        if(pslugV === pslug) {
                            let p = state[ig].SalesPrice
                            let variation = {
                                "regular_price": p.toString(),
                                "attributes": [
                                    {
                                        "name": "size",
                                        "option": state[ig].Attrib1

                                    },
                                    {
                                        "name": "colour",
                                        "option": state[ig].Attrib2

                                    },
                                    {

                                        "name": "hand",
                                        "option": state[ig].Attrib3
                                    }
                                ]
                            }
                            this.addVariableProduct(postID, variation)
                        }
                    })
                }
            })



        }else {
            console.log('insert post')
            let state = this.props.fetch
            let add
            Object.keys(state).map(igKey => {
                if(typeof state[igKey].ProductName !== 'undefined') {
                    let pslugC = (state[igKey].ProductName).replace(/\s+/g, '-').toLowerCase();
                     if(pslugC === pslug) {
                         add = {
                             "name": state[igKey].ProductName,
                             "slug": pslugC,
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
                }
            });

            if(typeof add !== 'undefined') {

                fetch(SITE_ROOT + "/wp-json/wc/v2/products", {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, *!/!*',
                        'Content-Type': 'application/json',
                        "Authorization": "Basic " + base64.encode(CK + ":" + CS)

                    },
                    body: JSON.stringify(add)
                }).then(res => res.json())

                    .then(res => {
                        this.setState({
                            loading: false
                        })
                        console.log(res)
                    });
            }
        }



    }





    insertAll = () => {
        this.setState({
            loading: true
        })
        let state = this.props.fetch
        Object.keys(  state ).map( igKey => {
            let pslug = (state[igKey].ProductName).replace(/\s+/g, '-').toLowerCase();
            let addcat =  {
                "name": state[igKey].ProdGroup
            };

            this.addCat( pslug,addcat, state[igKey].ProdGroup)
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

                    <button className="btn btn-success" onClick={()=>this.insertAll()}>Insert All Products</button>



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