"use strict";

var lunitPos = {x: 127.03754804500247, y: 37.49554194844735};

// keyword meta data table
var keyword_meta_data = {
    'food-korean' : '한식',
    'food-chinese' : '중식',
    'food-japanese' : '일식',
    'food-eng' : '양식',
    'food-fastfood' : '패스트푸드',
    'food-snack' : '분식',
	'food-bread' : '브래드',
	'food-pizza' : '피자',
    'food-asian' : '아시안',
    'price-high' : '초과',
    'price-normal' : '적당',
    'price-cheap' : '여유',
    'taste-spicy' : '매운',
    'taste-best' : '맛집',
	'distance-far' : '멀다',
	'distance-close' : '가깝다',
    'etc-many' : '단체',
    'etc-delivery' : '배달'
};

var isLoaded = false;
var queryParam = new Array();
var markers = new Array();
var infowindows = new Array();
var isFilterToggled = false;

$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#filter_list").toggleClass("toggled");
	isFilterToggled = true;
});

$("#food_list").bind('touchstart',function(e){
	if (isFilterToggled) {
		$("#filter_list").removeClass("toggled");
	}
});

$("#init-param").click(function(e) {
    e.preventDefault();
    clearParam();
});

for(var key in keyword_meta_data) {

    // add attribute for find it later
    $("#" + key).attr('data-meta-data-key', key)
    // set click event
    $("#" + key).click(function(e, elem) {

        var target = $(this);
        e.preventDefault();

        target.toggleClass("active");
        editParam(target);
    });
}

function clearParam(){
    if(isLoaded){
        queryParam = new Array();
		filterManageArr = [];
		var currentFilter = $("#current-filter");
		currentFilter.text("");

		updateResult();
    }
}

var filterManageArr = [];

function editParam(button){
	var metaData = "#" + keyword_meta_data[button.attr('data-meta-data-key')];

    if (isLoaded) {
        if (metaData != null) { 
            var idx = queryParam.indexOf(metaData);
            if (idx==-1) {
                queryParam.push(metaData);
            } else {
                queryParam.splice(idx, 1);
            }
        }
        var currentFilter = $("#current-filter");
		
		if (filterManageArr.includes(button.html())) {
			if (filterManageArr.length == 1) {
				filterManageArr = []
			}

			var itemIndex = filterManageArr.indexOf(button.html());
			filterManageArr.splice(itemIndex, itemIndex);
		} else {
			filterManageArr.push(button.html());
		}

		console.log(filterManageArr);

		currentFilter.text("");
		filterManageArr.forEach(function(item, index) {
			currentFilter.append(item);
		});
		updateResult();
    }
}

function detectmob() { 
    if( navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
    ){ return true; }
    else { return false; }
}

function urlSpaceReplace(s){
    return(s.split(' ').join('%20'));
}

function degToRad(deg) {
    return deg * Math.PI / 180; 
}

function radTodeg(rad) {
    return rad * 180 / Math.PI;
}

var isMobile = detectmob();
var isLoaded = false;

var resultDiv = document.getElementById("query_result");
var container = document.getElementById('map');
var foodDiv = document.getElementById('food_list');

if (isMobile) {
//	$("#food_map").hide();
//	$("#food_pick").show();
	container.style.height = "60vh";
	foodDiv.style.marginTop = container.style.height; 
	foodDiv.style.height = "40vh";
	foodDiv.style.marginLeft = '10px';
} else {
	$("#menu-toggle").hide();
}

var options = {
	center: new daum.maps.LatLng(lunitPos.y, lunitPos.x),
	level: 3
};

var map = new daum.maps.Map(container, options);
var mapTypeControl = new daum.maps.MapTypeControl();
map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);

var zoomControl = new daum.maps.ZoomControl();
map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);

var jo, filtered; // json data를 저장할 변수

var imageSrc = "https://media.rocketpunch.com/cache/37/e0/37e03cc5d2fb5ad0c6cf96fd1ca59ecc.png",
	imageSize = new daum.maps.Size(28, 28), // 마커이미지의 크기입니다
	imageOption = {offset: new daum.maps.Point(17, 20)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption)

var marker = new daum.maps.Marker({
	position: new daum.maps.LatLng(lunitPos.y, lunitPos.x),
	image: markerImage
});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);

$.ajax({
	method: "GET",
	url: "http://saturns.lunit.io:7777/api/food/",
}).done(function(data) {
	jo = data;
    isLoaded = true;
    updateResult();
});

function clearResult(){
    for (var i = 0; i < markers.length; i++){
        markers[i].setMap(null);
    }
    resultDiv.innerHTML = '';
    markers = new Array();
}


var selectedMarker = undefined;
var selectedMarkerAlpha = 1

function setAnimationMarker(marker) {
    if(selectedMarker != undefined)
        selectedMarker.setOpacity(1.0);

    selectedMarker = marker;
}

setInterval(function() {

    if(selectedMarker == undefined) {
        return;
    }

    selectedMarker.setOpacity(selectedMarkerAlpha)
    selectedMarkerAlpha -=0.01;
    if(selectedMarkerAlpha <= 0) {
        selectedMarkerAlpha = 1.0;
    }
}, 10)

function updateResult(){
    clearResult();
    var dat = new Array();
    for (var k in jo.results) {
        var count = 0;
        var passed = false;
        if (queryParam.length==0) {
            passed = true;
        } else {
            for(var i = 0; i < queryParam.length; i++) {
                if(jo.results[k].tag.indexOf(queryParam[i]) != -1) {
                    count++;
                }
            }
        }
        if(passed || count > 0){
            var r = new Object();
            r.title = jo.results[k].name;
            r.latlng = new daum.maps.LatLng(jo.results[k].y, jo.results[k].x);
            r.tag = jo.results[k].tag;
            r.content = jo.results[k].content;
            r.y = jo.results[k].y;
            r.x = jo.results[k].x;
            r.except = jo.results[k].except;
            dat.push(r);
        }
    }

    if(dat.length==0){
        var nDiv = document.createElement('div');
        nDiv.style.cssText = 'text-align: center;position: relative;top: 50%;transform: translateY(-50%);';
        nDiv.innerHTML = '<h4>표시할 데이터가 없어요 ㅠㅠ</h4>';
        query_result.appendChild(nDiv);
    }

    markers = new Array();

    for (var i=0;i<dat.length;i++) {
        var marker = new daum.maps.Marker({
            position: dat[i].latlng
        });

        marker.setMap(map);
        markers.push(marker);  // push marker in array

        var open_event_name = 'mouseover';
        var infoWindowOptions = {};

        if(isMobile) {
            infoWindowOptions['content'] = '<p class="map-info"><span class="title">'
            + dat[i].title + '</span><br>' + '<a href="#result-' + i + '">바로가기</a></p>';

            infoWindowOptions['removable'] = true;
            open_event_name = 'click';
        }
        else {
            infoWindowOptions['content'] = '<p class="map-info"><span class="title">'
            + dat[i].title + '</span><br>' + '<span class="tags">' + dat[i].tag
            + '</span></p>';
        }

        marker.infoWindow = new daum.maps.InfoWindow(infoWindowOptions);
        marker.datIndex = i

        // open event
        daum.maps.event.addListener(marker, open_event_name, (function(marker) {
            return function() {
                for(var i in markers) {
                    markers[i].infoWindow.close();
                }

                marker.infoWindow.open(map, marker);
            }
        })(marker));

        // add close event in desktop view & click event to show info
        if(!isMobile){
            daum.maps.event.addListener(marker, 'mouseout', (function(marker) {
                return function() {
                    marker.infoWindow.close();
                }
            })(marker));

            daum.maps.event.addListener(marker, 'click', (function(marker) {
                return function() {
                    window.location.hash = '#result-' + marker.datIndex;
                }
            })(marker));
        }

        var tDiv = document.createElement('div');

        tDiv.setAttribute('id', 'result-' + i);
        var link = 'http://map.daum.net/link/to/'+urlSpaceReplace(dat[i].title)+','+dat[i].y+','+dat[i].x;

        tDiv.className += "result"
        var theta = lunitPos.x - dat[i].x;
        marker.dist = Math.sin(degToRad(lunitPos.y)) * Math.sin(degToRad(dat[i].y)) + Math.cos(degToRad(lunitPos.y))
          * Math.cos(degToRad(dat[i].y)) * Math.cos(degToRad(theta));
        marker.dist = Math.acos(marker.dist);
        marker.dist = radTodeg(marker.dist);
        marker.dist = marker.dist * 60 * 1.1515;
        marker.dist = marker.dist * 1.609344;
        marker.dist = marker.dist * 1000.0;

        if(dat[i].except == undefined) {
            tDiv.innerHTML = (
					'<div class="line"></div><br/>' +
						'<h4 class="title">'+dat[i].title+'</h4>' +
						'<p class="tag">' + dat[i].tag + "</p>" + 
						'<p class="content">'+dat[i].content.split("\n").join("<br/>")+'</p>' +
						'<div class="link"><a href="' + link +'" target="_blank">길찾기</a>' +
						'|' + 
						'<a href="#" class="marker-window-link" data-marker-index="' + i +'">장소보기</a>' +
						'| ' + parseInt(marker.dist) + 'm (약 '+ parseInt(marker.dist/60) +'분)' + 
					'</div>');

            query_result.appendChild(tDiv);
        }
    }

    $('.marker-window-link').click(function() {
        var marker_index = $(this).attr('data-marker-index');
        var marker = markers[marker_index];

        map.panTo(marker.getPosition());
        map.setLevel(3);

        for(var i in markers) {
            markers[i].infoWindow.close();
        }

        setAnimationMarker(marker);
        marker.infoWindow.open(map, marker);
    });

    var pDiv = document.createElement('div');
    pDiv.style.height="2em";
    query_result.appendChild(pDiv);
}
