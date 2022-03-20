import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";

import axios from 'axios';
import { Icon, Col, Card, Row, Checkbox } from 'antd';
import Meta from 'antd/lib/card/Meta';

import ImageSlider from '../../utils/ImageSlider';

import CheckBox from './Section/CheckBox';
import { continents } from './Section/Datas';

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(4)
    const [PostSize, setPostSize] = useState(0)

    const [Filters, setFilters] = useState({
        continents : [],
        price: []
    })

    useEffect(()=> {

        let body = {
            skip: Skip,
            limit: Limit
        }

        getProducts(body)
    }, [])

    const getProducts = (body) => {
        axios.post('/api/product/products', body)
            .then(response => {
                if(response.data.success) {
                    setPostSize(response.data.postSize)
                    
                    if(body.loadMore) {
                        setProducts([...Products, ...response.data.productInfo])
                    } else {
                        setProducts(response.data.productInfo)
                    }
                } else {
                    alert('상품을 가져오는 데 실패했습니다.')
                }
            })
    }

    const loadMoreHandler = () => {

        let skip = Skip + Limit
    
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }
        getProducts(body)
        setSkip(skip)
    }
    

    const renderCards = Products.map((product, index) => {
        return (
            <Col lg={6} md={8} xs={24} key={index}>
                <Card
                    cover={<ImageSlider images={product.images}/>}
                >
                    <Meta 
                        title={product.title}
                        description={`$${product.price}`}
                    />
                </Card>
            </Col>
        )
    })

    const showFilteredResults = (filters) => {
        // getProduct를 사용해서 필터링 된 데이터 가져오기

        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }

        getProducts(body)
        setSkip(0)
    }

    const handleFilters = (filters, category) => {
        // category는 Continents / Price를 구분하기 위함

        const newFilters = { ...Filters }
        newFilters[category] = filters

        showFilteredResults(newFilters)
    }

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>Let's Travel Anywhere <Icon type="rocket" /></h2>
            </div>

            {/* Filter */}
            
            {/* CheckBox */}
            <CheckBox list={continents} handleFilters={filters => handleFilters(filters, "continents")} />

            {/* RadioBox */}


            {/* Search */}

            {/* Cards */}
            <Row gutter={[16, 16]}>
                {
                    renderCards
                }
            </Row>
            
            {
                PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>
            }
            
        </div>
    )
}

export default LandingPage
