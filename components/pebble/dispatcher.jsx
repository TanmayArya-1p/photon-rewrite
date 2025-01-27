import React, { useEffect  , useState} from 'react';
import * as api from './api';


//have a background taskas well as set itnerval


export default function PebbleDispatcher(props) {


    async function dummy() {
        // let res = await axios.get("http://windows.taildd0d1a.ts.net:5000/ping")
        // console.log(res.data)
        try{
            await api.login("67926aa4e5fe7e9979ff270f", "123")
            await new Promise(resolve => setTimeout(resolve, 1000));
            await api.createSession("123")
        }
        catch(e) {
            console.log(e)
        }
    }

    useEffect(() => {

        dummy()
        console.log(1)
    } , [])


    return <></>
}
    