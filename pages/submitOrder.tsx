import React from "react"
import HtmlHead from "../components/HtmlHead"
import SearchArea from "../components/SearchArea"
import { withRouter } from 'next/router'
import axios from 'axios'
import { serverUrl } from '../util/app'
import Address from "../components/SubmitOrderPage/Address"
import GoodsArea from "../components/SubmitOrderPage/GoodsArea"

const SubmitOrder = () => {
    return (
        <>
            <HtmlHead title={'提交订单'}/>
            <SearchArea noSearch={true}/>
            <div className={`bw`}>
                <Address/>
                <GoodsArea/>
            </div>
        </>
    )
}

SubmitOrder.getInitialProps = async ({ ctx }) => {
    const { selectedItemSpecIds } = ctx.query
  
    let itemInfo

    return {
      itemInfo,
    }
  }

export default withRouter(SubmitOrder)