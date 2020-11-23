import React from "react"
import HtmlHead from "../components/HtmlHead"
import SearchArea from "../components/SearchArea"
import Shopcart from "../components/ShopcartPage/Shopcart"

const Car = () => {
    return (
        <>
            <HtmlHead title={'购物车'}/>
            <SearchArea/>
            <Shopcart/>
        </>
    )
}


export default Car