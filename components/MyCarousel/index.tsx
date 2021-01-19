import React, { useEffect, useState } from 'react'
import { Carousel } from 'antd'
import { getCarousel } from '../../api/api'

const MyCarousel = () => {
  const [carousel, setCarousel] = useState([])

  useEffect(() => {
    getCarousel().then((res) => {
      if (res.status == 200) {
        const carouselList = res.data
        setCarousel(carouselList)
      }
    })
  }, [])

  return (
    <div className={`bw`}>
      <Carousel autoplay>
        {carousel.map((c) => (
          <img key={c.id} src={c.imageUrl} height={400} width={800} />
        ))}
      </Carousel>
    </div>
  )
}
export default MyCarousel
