import * as api from './api.jsx';
import {pebbleStore} from './stores.js';


async function AppendNewImage(asset) {
    let peb = await api.pebbleCreate("idontcareabouthash", "lol")
    console.log("APPENDING NEW LOCAL PEBBLE",peb)
    pebbleStore.setState({pebbles: {...pebbleStore.getState().pebbles, [peb.id]: asset}})
    console.log("PEBBLE STORE" , pebbleStore.getState())
}



module.exports = {AppendNewImage}
