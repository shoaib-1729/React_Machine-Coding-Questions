// Post component contains Images, Pagination Component
import axios from 'axios';
import Pagination from './Pagination';
import { useState } from 'react';
import { useEffect } from 'react';

const Post = () => {
    // state for image
    const [imageData, setImageData] = useState([])
    // state for changing  page number on button click, yeh state pagination mei set hogi
    const [pageNo, setPageNo] = useState(1)
    // console.log(imageData);
    // call the api to fetch image when components mounts
    useEffect(() => {
                        axios
                            .get(`https://picsum.photos/v2/list?page=${pageNo}&limit=5`)
                            .then((resp) => setImageData(resp?.data))
                            .catch((err) => console.log(err))
                            console.log('API Called...')
        }, [pageNo])
    return (
        <div className="container">
            <h1>Pagination Component (LLD)</h1>
            {/* image fetch  */}
            <div className="post-container">
                {/* map over the image data stored in state variable to fetch each image from the array returned from the network call */}
                {(imageData) && imageData.map((image) =>{
                     return <img key={image?.id} src={image?.download_url}  alt="" />
            }) }
            </div>
            <Pagination pageNo={pageNo} setPageNo={setPageNo} />
        </div>
    )
}

export default Post