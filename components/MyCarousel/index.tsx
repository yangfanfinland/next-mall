import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Carousel } from 'antd';


const MyCarousel = () => {

    const [ carousel, setCarousel ] = useState([])

    useEffect(() => {
        axios.get("http://localhost:8088/index/carousel", {}).then(res => {
            if (res.data.status == 200) {
                const carouselList = res.data.data
                setCarousel(carouselList);
            }
        })
    })

    return (
        <div className="bw">
            <Carousel autoplay>
                {
                    carousel.map(c => (
                        <img src={c.imageUrl} height={520}/>
                    ))
                }

            </Carousel>
        </div>
    )
}
export default MyCarousel