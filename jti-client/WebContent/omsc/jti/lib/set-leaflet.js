document.write('<' + 'script type="text/javascript" src="/omsc/js/lib/proj4js/Proj4js.js"></' + 'script>');
//확인필요 document.write('<' + 'script type="text/javascript" src="/omsc/js/lib/openlayers/OpenLayers.debug.js"></' + 'script>');
document.write('<link rel="stylesheet" href="/omsc/js/lib/jcrop/jquery.Jcrop.min.css" type="text/css" />');
document.write('<' + 'script type="text/javascript" src="/omsc/js/lib/jcrop/jquery.Jcrop.min.js"></' + 'script>');

if(Globals.clientExtDaumKey != ""){
	document.write("<"+"script type=\"text/javascript\" src=\"//apis.daum.net/maps/maps3.js?apikey="+Globals.clientExtDaumKey+"\"></"+"script>\n");
}
if(Globals.clientExtVworldKey != ""){
	document.write("<"+"script type=\"text/javascript\" src=\"http://map.vworld.kr/js/apis.do?type=Base&apiKey="+Globals.clientExtVworldKey+"\"></"+"script>\n");
}

document.write('<link rel="stylesheet" href="/omsc/js/lib/Leaflet-1.0.2/leaflet.css" />');
document.write('<link rel="stylesheet" href="/omsc/js/lib/OpenMapV2/leaflet/control/L.Control.Zoomslider.css" />');
document.write('<link rel="stylesheet" href="/omsc/js/lib/OpenMapV2/leaflet/control/Leaflet.draw/leaflet.draw.css" />');
document.write('<link rel="stylesheet" href="/omsc/js/lib/OpenMapV2/leaflet/control/measure_control/leaflet.measurecontrol.css" />');
L_DISABLE_3D = true;
document.write('<' + 'script type="text/javascript" src="/omsc/js/lib/proj4js/proj4.v1.3.4-compressed.js"></' + 'script>');
document.write('<' + 'script type="text/javascript" src="/omsc/js/lib/Leaflet-1.0.2/leaflet-src.js"></' + 'script>');
document.write('<' + 'script type="text/javascript" src="/omsc/js/lib/OpenMapV2/leaflet/control/L.Control.Zoomslider.js" ></' + 'script>');
document.write('<' + 'script type="text/javascript" src="/omsc/js/lib/OpenMapV2/leaflet/layer/leaflet-google.js"></' + 'script>');
document.write('<' + 'script type="text/javascript" src="/omsc/js/lib/OpenMapV2/leaflet/layer/leaflet-daum.js"></' + 'script>');
document.write('<' + 'script type="text/javascript" src="/omsc/js/lib/OpenMapV2/leaflet/proj4leaflet.js"></' + 'script>');
document.write('<' + 'script type="text/javascript" src="/omsc/js/lib/OpenMapV2/leaflet/wicket.js" ></' + 'script>');
document.write('<' + 'script type="text/javascript" src="/omsc/js/lib/OpenMapV2/leaflet/wicket-leaflet.js" ></' + 'script>');
document.write('<' + 'script type="text/javascript" src="/omsc/js/lib/OpenMapV2/leaflet/control/Leaflet.draw/leaflet.draw-src.js" ></' + 'script>');
document.write('<' + 'script type="text/javascript" src="/omsc/js/lib/OpenMapV2/leaflet/control/L.openmate_measure.js" ></' + 'script>');
document.write('<' + 'script type="text/javascript" src="/omsc/js/lib/OpenMapV2/leaflet/OMLeaflet.js"></' + 'script>');
document.write('<link rel="stylesheet" href="/omsc/js/lib/OpenMapV2/leaflet/leaflet.label.css"/>');
document.write('<' + 'script type="text/javascript" src="/omsc/js/lib/OpenMapV2/leaflet/leaflet.label.js"></' + 'script>');
document.write('<' + 'script type="text/javascript" src="/omsc/js/lib/OpenMapV2/SelfMap.js"></' + 'script>');