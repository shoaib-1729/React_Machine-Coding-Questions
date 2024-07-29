const Pagination = ({pageNo, setPageNo}) => {
    // array creation for previous 3 buttons.
    const prevThreeBtn = Array
                                    .from({length:3}, (_, index) => (pageNo-1)-index)
                                    .filter((val) => val>0)
                                    .reverse()
    console.log(prevThreeBtn)
    // array creation for next 4 buttons
    const nextFourBtn  = Array.from({length:4}, (_, index) => (pageNo+index))
    console.log(nextFourBtn)
    // concat the  arrays using spread operator, such as if the pageNo is 5,  we want the array would be [2, 3, 4,  5, 6, 7, 8], we want the array sorted with no zeroes and negative number
    const paginationArr = [...prevThreeBtn, ...nextFourBtn]
    // handle next button
   function handleNext(){
     //   increase the current state by one
        setPageNo(pageNo + 1)
   }
    // handle next button
   function handlePrev(){
        //    increase the current state by one
        setPageNo(pageNo - 1)
   }
    return(
        <div className="pagination-container">
             <div onClick={handlePrev} className="page-btn">{"<"}</div>
             {/* map over the pagination array to display buttons, joh button active hai uspar action class laga do, taaki user ko dikhe ki kaun se button par click hua hai */}
             {paginationArr.map((value, index) => {
             return <div onClick={()=>setPageNo(value) } key={index} className={value===pageNo ? "page-btn active" : "page-btn"}>{value}</div>
                     
             })}
             <div onClick={handleNext} className="page-btn">{">"}</div>
        </div>
    )
}

export default Pagination