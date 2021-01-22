import React from 'react'
import Head from 'next/head.js'

const HtmlHead = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

export default HtmlHead
