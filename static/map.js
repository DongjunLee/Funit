var container = document.getElementById('map');
var options = {
    center: new daum.maps.LatLng(lunitPos.y-0.003, lunitPos.x),
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


