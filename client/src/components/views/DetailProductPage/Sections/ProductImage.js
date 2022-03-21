import React, { useEffect, useState } from 'react'
import ImageGallery from 'react-image-gallery';

function ProductImage(props) {

  const [Images, setImages] = useState([])

  useEffect(() => {

    if(props.detail.images && props.detail.images.length > 0 ) {
      let images = []

      props.detail.images.map(item => {
        images.push({
          original: `http://localhost:5000/${item}`,
          thumbnail: `http://localhost:5000/${item}`
        })
      })

      setImages(images)
    }
  }, [props.detail])

  // props.detail 없으면 이미지를 가져오지 못함 → return() 렌더링 후 useEffect 실행 → [] 이면 props.detail.images가 없는 것으로 판단한다 
  // [props.detail] 은 props.detail 값이 바뀔 때마다 useEffect 실행을 나타낸다

  return (
    <div>
        <ImageGallery items={Images} />
    </div>
  )
}

export default ProductImage