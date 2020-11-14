import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Carousel } from 'antd'
import { serverUrl } from '../../util/app'


const MyCarousel = () => {

    const [ carousel, setCarousel ] = useState([])

    useEffect(() => {
        axios.get(serverUrl+ "/index/carousel", {}).then(res => {
            if (res.data.status == 200) {
                const carouselList = res.data.data
                setCarousel(carouselList);
            }
        })
    })

    return (
        <div className={`bw`}>
            <Carousel autoplay>
                {
                    carousel.map(c => (
                        <img key={c.id} src={c.imageUrl} height={400} width={800}/>
                    ))
                }

            </Carousel>
        </div>
    )
}
export default MyCarousel