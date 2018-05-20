import React, { Component } from 'react';
import { SITE_ROOT, CK, CS  } from '../../config'
import base64 from 'base-64'



class  Woo extends Component{
    constructor() {

        super();
        this.state = {
            data: [],
            loading: true,
            woo:'',
            selectedDay: undefined,


        }
    }

    componentDidMount () {
        // HTTPS
       let headers = new Headers();
        headers.append("Authorization", "Basic " + base64.encode(CK+":"+CS));

        fetch(SITE_ROOT+"/wp-json/wc/v2/products", {
            headers: headers
        })
            .then(response => response.json())
            .then((response) => {
                    this.setState({
                        woo: response
                    })

                 //console.log(response)
            })
            .catch(e => {
                console.log(e)
            })


    }
    componentDidUpdate() {
        //this.getCross()
        console.log(this.getWoo())

    }

    getWoo = () => {
        let allWoo = this.state.woo
        let slug = []
        Object.keys( allWoo ).map( igKey => {
            return  slug   = [
                    ... slug,
                    allWoo[igKey].slug
                ]
           

        })
        return  slug
    }

    getCross = () => {
        let all = this.props.cross
        let allP
        Object.keys( all ).map( igKey => {
            let allP  = {
                "status": "publish",
                "title":all[igKey].title,
                "content": all[igKey].content
            }

        })
        return allP
    }

    insertAll = () => {

    }




    render () {




        return (

            <div>
                <button className="btn btn-success" onClick={()=>this.insertAll()}>Insert All Products</button>

            </div>

        )
    }
}

export default Woo