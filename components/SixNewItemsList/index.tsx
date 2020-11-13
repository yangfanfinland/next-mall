import React, { useEffect, useState } from 'react'
import axios from 'axios'


const SixNewItemsList = ({ categoryList }) => {
    const [ sixNewItemsList, setSixNewItemsList ] = useState([])

    useEffect(() => {
        const renderCategorys = async ()=> {
            var rootCatHtml = "";
            var serverUrl = "http://localhost:8088";
            let newSixNewItemsList = []

            for (var i = 0; i < categoryList.length; i++) {

                var cat = categoryList[i];
                rootCatHtml += '' +
                    '<li class="appliance js_toggle relative">' +
                    '<div class="category-info">' +
                    '<h3 class="category-name b-category-name">' +
                    '<i><img src="/static/' + cat.logo + '"></i>' +
                    '<a class="ml-22" title="' + cat.name + '">' + cat.name + '</a>' +
                    '</h3>' +
                    '<em>&gt;</em></div>' +
                    '<div class="menu-item menu-in top">' +
                    '<div class="area-in">' +
                    '<div class="area-bg">' +
                    '<div class="menu-srot">' +
                    '<div class="sort-side" rootCatId="' + cat.id + '"></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<b class="arrow"></b>' +
                    '</li>';

                var rootCat = categoryList[i];
                if (rootCat == undefined || rootCat == null || rootCat == '') {
                    return;
                }
                var rootCatId = rootCat.id;
                const res = await axios.get(serverUrl + '/index/sixNewItems/' + rootCatId, {})
                if (res.data.status == 200) {
                    var sixNewItemsListTemp = res.data.data
                    newSixNewItemsList.push(sixNewItemsListTemp[0])
                }
                setSixNewItemsList([...newSixNewItemsList]);
            }
            var $leftNav = $('#js_climit_li');
            $leftNav.html(rootCatHtml);

            $("li").hover(async function () {
                $(".category-content .category-list li.first .menu-in").css("display",
                    "none");
                $(".category-content .category-list li.first").removeClass("hover");

                var meLi = $(this);

                var subWapper = $(this).children("div.menu-in").children("div.area-in")
                    .children("div.area-bg").children("div.menu-srot").children(
                        "div.sort-side");
                // console.log(subWapper.html());
                var subCatHtml = subWapper.html();
                var rootCatId = subWapper.attr("rootCatId");
                // console.log(rootCatId);
                // 如果该节点下没有内容，则发起请求查询子分类并且渲染到页面，如果有的话就不查询了（懒加载模式）
                if (subCatHtml == null || subCatHtml == '' || subCatHtml == undefined) {
                    if (rootCatId != undefined && rootCatId != null && rootCatId != '') {
                        // 根据root分类id查询该分类下的所有子分类
                        const res = await axios.get(serverUrl + '/index/subCat/' + rootCatId, {});
                        if (res.data.status == 200) {
                            var catList = res.data.data
                            // this.catList = catList;
                            // debugger;
                            var subRenderHtml = '';
                            for (var i = 0; i < catList.length; i++) {
                                var cat = catList[i];
                                subRenderHtml += '' +
                                    '<dl class="dl-sort">' +
                                    '<dt><span title="' + cat.name + '">' +
                                    cat.name + '</span></dt>';

                                // 拼接第三级分类
                                var subCatList = cat.subCatList;
                                for (var j = 0; j < subCatList.length; j++) {
                                    var subCat = subCatList[j];
                                    subRenderHtml += '<dd><a title="' + subCat
                                        .subName + '" href="catItems.html?searchType=catItems&catId='+ subCat.subId +'" target="_blank"><span>' +
                                        subCat.subName + '</span></a></dd>'
                                }

                                subRenderHtml += '</dl>';
                            }
                            subWapper.html(subRenderHtml);
                            meLi.addClass("hover");
                            meLi.children("div.menu-in").css("display",
                                "block");
                        }
                    }
                } else {
                    $(this).addClass("hover");
                    $(this).children("div.menu-in").css("display", "block");
                }

                // $(this).addClass("hover");
                // $(this).children("div.menu-in").css("display", "block")
            }, function () {
                $(this).removeClass("hover")
                $(this).children("div.menu-in").css("display", "none")
            });
        };
        renderCategorys();
    }, [])

    return (
        <>
        {
            sixNewItemsList.map(rootCat => (
                <>
                    <div className="am-container ">
                        <div className="shopTitle ">
                            <h4>{rootCat.rootCatName}</h4>
                            <h3>{rootCat.slogan}</h3>
                        </div>
                    </div>
                    <div className="am-g am-g-fixed floodFour">
                        <div className="am-u-sm-5 am-u-md-4 text-one list" style={{ backgroundColor: 'background-color:' + rootCat.bgColor}}>
                            <a href="javascript:void(0);">
                                <img src={rootCat.catImage} />
                            </a>
                            <div className="triangle-topright"></div>
                        </div>
                        <div className="am-u-sm-7 am-u-md-4 text-two sug">
                            <div className="outer-con ">
                                <div className="title ">
                                    {rootCat.simpleItemList[0].itemName}
                                </div>
                            </div>
                            <a href={'item.html?itemId=' + rootCat.simpleItemList[0].itemId} target="_blank">
                                <img src={rootCat.simpleItemList[0].itemUrl} style= {{ width: "170px", height: "170px" }} />
                            </a>
                        </div>
                        <div className="am-u-sm-7 am-u-md-4 text-two">
                            <div className="outer-con ">
                                <div className="title ">
                                    {rootCat.simpleItemList[1].itemName}
                                </div>
                            </div>
                            <a href={'item.html?itemId=' + rootCat.simpleItemList[1].itemId} target="_blank">
                                <img src={rootCat.simpleItemList[1].itemUrl} style= {{ width: "170px", height: "170px" }} />
                            </a>
                        </div>
                        <div className="am-u-sm-3 am-u-md-2 text-three big" >
                            <div className="outer-con " >
                                <div className="title ">
                                    {rootCat.simpleItemList[2].itemName}
                                </div>
                            </div>
                            <a href={'item.html?itemId=' + rootCat.simpleItemList[2].itemId} target="_blank">
                                <img src={rootCat.simpleItemList[2].itemUrl} style= {{ width: "170px", height: "170px" }} />
                            </a>
                        </div>
                        <div className="am-u-sm-3 am-u-md-2 text-three sug">
                            <div className="outer-con ">
                                <div className="title ">
                                    {rootCat.simpleItemList[3].itemName}
                                </div>
                            </div>
                            <a href={'item.html?itemId=' + rootCat.simpleItemList[3].itemId} target="_blank">
                                <img src={rootCat.simpleItemList[3].itemUrl} style= {{ width: "170px", height: "170px" }} />
                            </a>
                        </div>
                        <div className="am-u-sm-3 am-u-md-2 text-three ">
                            <div className="outer-con ">
                                <div className="title ">
                                    {rootCat.simpleItemList[4].itemName}
                                </div>
                            </div>
                            <a href={'item.html?itemId=' + rootCat.simpleItemList[4].itemId} target="_blank">
                                <img src={rootCat.simpleItemList[4].itemUrl} style= {{ width: "170px", height: "170px" }} />
                            </a>
                        </div>
                        <div className="am-u-sm-3 am-u-md-2 text-three last big ">
                            <div className="outer-con ">
                                <div className="title ">
                                    {rootCat.simpleItemList[5].itemName}
                                </div>
                            </div>
                            <a href={'item.html?itemId=' + rootCat.simpleItemList[5].itemId} target="_blank">
                                <img src={rootCat.simpleItemList[5].itemUrl} style= {{ width: "170px", height: "170px" }} />
                            </a>
                        </div>
                    </div>
                    <div className="clear "></div>
                </>
            ))
        }
        </>
    )
}

export default SixNewItemsList