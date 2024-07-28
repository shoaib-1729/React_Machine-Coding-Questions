import { useRef } from "react"
import { useEffect } from "react"
import { useState } from "react"
/*
1. Features of TypeAhead:
    1.1 Suggestions on queries using Debouncing
    1.2 Abort Network Calls using abort controller
    1.3 Seeing unmounting in react
    1.4 Caching
2. Important:
    2.1 What does Debouncing and Abort helps us achieve?
    2.2 How caching is achieved?
    2.3 How debouncing and abort is achieved?
*/

// states for app
const STATE = {
    LOADING: "LOADING",
    ERROR: "ERROR",
    SUCCESS: "SUCCESS"
}
const TypeAhead = () => {
    // creating abort controller instance
    const abortController = new AbortController()
    const {signal} = abortController
    // useRef hook for remembering cache
    const cache = useRef({})
    // states for query input
    const [query, setQuery] = useState("")
    // states for showing fetched data on UI as user types
    const [result, setResult] = useState([])
    // states for showing api fetch status (loading, error, success)
    const [status, setStatus] = useState(STATE.LOADING)
    // api call using useEffect on change of query that is when the user types
    useEffect(() => {
        const fetchData = async () => {
     try{
        setStatus(STATE.LOADING)
        // check agar cache mei hai tab phir se call matt lagao, cache mei se retrieve karke dedo.
        if(cache.current[query]){
            console.log("Retrieved from cache")
            setResult(cache.current[query])
            // ui par show karwado
            setStatus(STATE.SUCCESS)
            return;
        }
            const resp = await fetch(`https://dummyjson.com/products/search?q=${query}&limit=10`, {signal})
            const data = await resp.json()
            console.log('API Called...')
            // populate the fetched data inside the state
            setResult(data?.products)
            // jab result aa gaya toh data cache mei bhi store karwalo
            cache.current[query] = data?.products
            // jab deta aa gaya hai tan status ko success set kardo.
            setStatus(STATE.SUCCESS)
            // console.log(data);
    }
    catch(error){
        // abort error bhi error mai hi count hoga, mujhe usko error mei count nahi karwana
        if(error.name !== "AbortError"){
            // agar data fetch nahi hua toh status ko error set kardo
            setStatus(STATE.ERROR)
        }
        console.log(error)
    }
}
    // call that function, optimization ke liye isko kar keystroke par call matt karwaao, instead kuch delay  ke baad karwao jab user ruk jaaye type karna
    const timerId =  setTimeout(fetchData, 1000);

    // jab component unmount ho jaata hai tab use effect ka return wala code chalega
    return () => {
        // pichle wale timer ki id clear kardo
        clearTimeout(timerId)
        // abort request, debouncing ka use tab ho raha jab user delay se pehle call kar de raha, toh pehle wale timerID ko data de rahe
        // abort ka use-case tab aayega jab component unmount hi gaya aur request chali gayi hai, yeh case tab aayega jab user kaafi jaldi type karega aur 1 second rukega aur phir type karne lagg jaayega, us case mei humei previous keystrokes ki koi need nhi hai.
        abortController.abort()
    }

}, [query])

    return(
        <div>
            <input
            value={query}
            type="text"
            onChange={(e) => setQuery(e.target.value)}/>
                {/* // status show karwao */}
                {(status === STATE.LOADING) && (<div>Loading...</div>)}
                {(status === STATE.ERROR) && (<div>Error Occurred...</div>)}
        <ul>
        {
            // result tabhi dikhao tab status success ke equal ho
            (status === STATE.SUCCESS) &&
               ( /* showing results on UI */
                result.map((products) => {
                // ul tabhi dikhao jab status success ke equal ho
                return <li key={products?.id}>{products?.title}</li>
                }))
        }
        </ul>
        </div>
    )
}
export default TypeAhead