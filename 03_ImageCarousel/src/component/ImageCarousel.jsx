import { useState,useEffect, useRef } from "react"
import {data} from "../utils/constants"

console.log(data)
// set data length
const DATA_LENGTH = data.length;

const ImageCarousel = () => {
    // states for index for images
    const [index, setIndex] = useState(0);
    // problem with intervalId:  state update par component re-render hoga aur intervalId wapas se undefined ho jaayegi. Is problem ko solve karne ke liye ki re-render par intervalId change naa ho, value usko yaad rahe, hum useRef hook ka use kerege.
    // let intervalId;
    // using  useRef hook to remember intervalId across all re-renders
    const ref = useRef(null)

    // setInterval waali functionality
    useEffect(() => {
        // ye bss component mount hone waqt run hoga, updation phase mei nahi.
        // console.log(index + "inside use-effect")
        // jab pehli baar component mount hoga tab setInterval chalao.
        // problem with setInterval : setInterval ek async function hai, jo har second ke baad handleNext ko call kar raha jo ki state update kar raha hai, state update hone par component dobaara load hoga aur state update hogi, par setInterval humesha state ki value wahi se lega joh humne initially set kar rakhi thi useState mei. React kehta hai ki state ke andat function use karo aoise async cases mei jaha value update ho.
        ref.current  =  setInterval(handleNext, 1000);
        // component unmount ho jaane par, pehle wali timerId clear do clean up function mei.
        return () => {
            clearInterval(ref.current)
        }
    }, [])

    // console.log(index + "on render")
    function handleNext(){
        // console.log(index + " inside handle next callback")
        // using function inside state, the function gives you access to the updated state.
        setIndex((prevIndex) => {
            if(prevIndex === DATA_LENGTH -1){
                return 0;
            }
                return prevIndex + 1;
        })
        // edge case:  last image mei next matt karo, wapas first image par bhej do.
        // if(index === DATA_LENGTH-1){
        //     setIndex(0)
        // }
        // else{
        //     setIndex(index + 1);
        // }
    }
    function handlePrev(){
        // edge case: agar first image hai toh previous par click karne par wapas last image par bhej do
        if(index === 0){
            setIndex(DATA_LENGTH-1)
        }
        else{
            setIndex(index - 1)
        }
    }
    // ja bhi container par mouse hover ho setInterval rok do
    function handleMouseEnter(){
       clearInterval(ref.current);
    }
    // ja bhi container se mouse hat jaaye, tab continue kardo setInterval ko
    function handleMouseLeave(){
       //  dobaare interval set kardo, wahi same jaise next button par kiya tha
       ref.current  =  setInterval(handleNext, 1000);
    }
    return(
          <div>
                <h1 className="head">Image Carousel Component (LLD)</h1>
                <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="container">
                    <div
                    onClick={handlePrev}
                    className="left-btn">
                        {">"}
                    </div>
                        <img src={data[index].download_url}  alt="" />
                    <div
                    onClick={handleNext} 
                    className="right-btn">
                    {"<"}
                    </div>
            </div>
        </div>
    )
}

export default ImageCarousel