import React from 'react'


const Recommendation = () => {
    return (
        <div className="am-g am-g-fixed recommendation">
            <div className="clock am-u-sm-3">
                <img src="/static/course/2019.png" style={{marginTop: "36px"}}></img>
                <p style={{fontWeight: "bold"}}>实战<br/>推荐</p>
            </div>

            <div className="am-u-sm-4 am-u-lg-3 ">
                <div className="info ">
                    <h3>分布式架构实战</h3>
                    <h4>SpringBoot仿抖音</h4>
                </div>
                <div className="recommendationMain one">
                    <a href="https://coding.imooc.com/class/217.html" target="_blank">
                        <img src="/static/course/douyin.jpg"></img>
                    </a>
                </div>
            </div>
            <div className="am-u-sm-4 am-u-lg-3 ">
                <div className="info ">
                    <h3>Netty聊天实战</h3>
                    <h4>SpringBoot仿微信</h4>
                </div>
                <div className="recommendationMain two">
                    <a href="https://coding.imooc.com/class/261.html" target="_blank">
                        <img src="/static/course/weixin.jpg"></img>
                    </a>
                </div>
            </div>
            <div className="am-u-sm-4 am-u-lg-3 ">
                <div className="info ">
                    <h3>分布式协调中间件</h3>
                    <h4>Zookeeper入门</h4>
                </div>
                <div className="recommendationMain three">
                    <a href="https://coding.imooc.com/class/201.html" target="_blank">
                        <img src="/static/course/zk.jpg"></img>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Recommendation