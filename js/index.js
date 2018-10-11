$(document).ready(function () {
    let map, tiandituLayer,tianMarkerLayer,markerlayer,marker,drawPointLayer,vector,visualAngleVector;
    let drawPoint,drawLine;
    init();

    function init() {
        if (!document.createElement('canvas').getContext) {
            sweetAlert(
                '请输入数字',
                'error'
            )
            return;
        }
        map = new SuperMap.Map("map", {
            controls: [
                new SuperMap.Control.Navigation(),
                new SuperMap.Control.Zoom(),
            ],
            allOverlays: true
        });

        // 图层列表，矢量天地图，天地图标签图层，矢量图层vector，标绘图层marker
        tiandituLayer = new SuperMap.Layer.Tianditu();
        tianMarkerLayer = new SuperMap.Layer.Tianditu();
        tianMarkerLayer.layerType = "cva";
        tianMarkerLayer.isLabel = true;
        drawPointLayer = new SuperMap.Layer.Vector("drawPointLayer");
        vector = new SuperMap.Layer.Vector("vector");
        markerlayer = new SuperMap.Layer.Markers( "Markers" );

        //加载矢量要素控件
        drawLine = new SuperMap.Control.DrawFeature(drawPointLayer, SuperMap.Handler.Path, {multi: true});
        map.addControl(drawLine);

        //加载图层
        map.addLayers([tiandituLayer, tianMarkerLayer,vector,drawPointLayer,markerlayer]);
        map.setCenter(new SuperMap.LonLat(116.39124932927,39.907126017136),16);

        //地图事件
        map.events.on({ "click": mapClick });
    }

    //初始化默认摄像头的数据信息
    let cameraData = {
        cameraType: 'dome',
        centerPoint:new SuperMap.Geometry.Point(116.39124932927,39.907126017136),
        sheleterPointArray:[],
        radius: 200,
        origin: 140,
        angle: 0,
    };
    //加载摄像头的基本信息画扫描区域
    _addVector(cameraData);

    /**
     * 点击出现标绘，获取坐标点
     * @param e
     */
    function mapClick(e) {
        let lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));

        $("input[name='lon']").val(lonlat.lon);
        $("input[name='lat']").val(lonlat.lat);

        markerlayer.removeMarker(marker);
        let size = new SuperMap.Size(44, 40);
        let offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
        let icon = new SuperMap.Icon('../libs/SuperMap/theme/images/marker-gold.png', size, offset);
        marker = new SuperMap.Marker(lonlat, icon);
        markerlayer.addMarker(marker);

        if(cameraData.sheleterPointArray.length != 0)
        {
            cameraData.sheleterPointArray = [];
        }
        cameraData.centerPoint = new SuperMap.Geometry.Point(lonlat.lon,lonlat.lat);
        _addVector(cameraData);
    }

    /**
     * 初始化页面得到地图中心点坐标并定位
     */
        getCenter();
        function getCenter(){
        let lonLat = map.getCenter();
        $("input[name='lon']").val(lonLat.lon);
        $("input[name='lat']").val(lonLat.lat);

        markerlayer.removeMarker(marker);
        let size = new SuperMap.Size(44, 40);
        let offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
        let icon = new SuperMap.Icon('../libs/SuperMap/theme/images/marker-gold.png', size, offset);
        marker = new SuperMap.Marker(lonLat, icon);
        markerlayer.addMarker(marker);
    }
    /**
     * 输入坐标，点击确定按钮定位地图上
     */
    function positionMap(lon,lat) {
        if(patternNumber(lon) == true && patternNumber(lon)==true)
        {
            let lonlat = new SuperMap.LonLat(lon,lat);
            map.zoomTo(14);
            map.panTo(lonlat);
            map.zoomTo(16);
            markerlayer.removeMarker(marker);
            let size = new SuperMap.Size(44, 40);
            let offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
            let icon = new SuperMap.Icon('../libs/SuperMap/theme/images/marker-gold.png', size, offset);
            marker = new SuperMap.Marker(lonlat, icon);
            markerlayer.addMarker(marker);
        }
        else{
            sweetAlert(
                '请输入数字',
                'error'
            )
        }
    }

    /**
     * 填充数据到页面菜单上
     */
    PutDataInMenu();
    function PutDataInMenu() {

        $("input[name='options'][id='dome']").attr("checked",'checked');
        $("input[name='lon']").val(cameraData.centerPoint.x);
        $("input[name='lat']").val(cameraData.centerPoint.y);
        $("input[name='positionAngle']").val(cameraData.angle);    //方位角度
        $("input[name='visualDistance']").val(cameraData.radius);  //视角半径
        $("input[name='visualAngle']").val(cameraData.origin);      //视角范围
    }
    /**
     * 触发change事件，实时获得输入数据
     * @type {{}}
     */
    //获取摄像头类型
    $("input[name='options']").change(function () {
        cameraData.cameraType = this.value;
        _addVector(cameraData);
    });
    //获得经度
    $("input[name='lon']").bind('input porpertychange',function () {
        let lon =$.trim($("input[name='lon']").val());
        let lat =$.trim($("input[name='lat']").val());
        positionMap(lon,lat);
        if(patternNumber(lon)==true && patternNumber(lon)==true)
        {
            cameraData.centerPoint = new SuperMap.Geometry.Point(lon,lat);
            _addVector(cameraData);
        }
        else
        {
            sweetAlert(
                '请输入数字',
                'error'
            )
        }

    })
    //获取纬度
    $("input[name='lat']").bind('input porpertychange',function () {
        let lon =$.trim($("input[name='lon']").val());
        let lat =$.trim($("input[name='lat']").val());
        positionMap(lon,lat);
        if(patternNumber(lon)==true && patternNumber(lon)==true)
        {
            cameraData.centerPoint = new SuperMap.Geometry.Point(lon,lat);
            _addVector(cameraData);
        }
        else
        {
            sweetAlert(
                '请输入数字',
                'error'
            )
        }
    })
    //获取方位角
    $("input[name='positionAngle']").bind('input porpertychange',function () {
        let angle =$("input[name='positionAngle']").val();
        if(patternNumber(angle)==true)
        {
            cameraData.angle = angle;
        }else
        {
            cameraData.angle = 0;
        }
        _addVector(cameraData);
    })
    //获取可视距离
    $("input[name='visualDistance']").bind('input porpertychange',function () {
        let visualDistance =$("input[name='visualDistance']").val();

        if(patternNumber(visualDistance)==true)
        {
            cameraData.radius = visualDistance;
        }
        else {
            cameraData.radius = 0;
        }

        _addVector(cameraData);

    })
    //获取可视角度
    $("input[name='visualAngle']").bind('input porpertychange',function () {
        let visualAngle =$("input[name='visualAngle']").val();
        if(patternNumber(visualAngle)==true)
        {
            cameraData.origin = visualAngle;
        }
        else{
            cameraData.origin = 0;
        }
        _addVector(cameraData);
    })
    /**
     * 点击+号画遮挡线
     */
    $("#add").on('click',function () {
        //画遮挡区域之前先移除marker
        markerlayer.removeMarker(marker);
        drawPointLayer.style = {
            strokeColor: "blue",
            pointRadius: 4,
            fillColor: "blue",
            fillOpacity: 1
        };
        drawLine.activate();
        drawLine.events.on({
            "featureadded": drawLineCompleted
        });
    })

    /**
     * 画遮挡线
     * @param event
     */
    function drawLineCompleted(event) {
        if(event.feature.geometry != null)
        {
            let geometry = event.feature.geometry.components[0].components;
            let pointLonLat = {
                lon:[],
                lat:[]
            }
            for(let i=0;i<geometry.length;i++)
            {
                pointLonLat.lon.push(geometry[i].x);
                pointLonLat.lat.push(geometry[i].y);
            }
            cameraData.sheleterPointArray.push(pointLonLat);
            drawLine.deactivate();
            //移除画线的标记
            drawPointLayer.removeAllFeatures();
            //加载画扫描区域的数据
            _addVector(cameraData);
        }
        event.feature.geometry = null;
    }
    /**
     * 点击减号删除遮挡点
     */
    $("#cut").on('click',function () {
        drawLine.deactivate();
        cameraData.sheleterPointArray.pop();
        _addVector(cameraData);
    })

    //点击保存按钮 PS:页面已经取消的保存和取消按钮 暂留参考 可以删除
    $("button#save").on('click',function () {
        //保存的数据格式信息已经写好文档
        let Lon = cameraData.centerPoint.x;
        let Lat = cameraData.centerPoint.y;

        console.log(cameraData);
        swal({
            title: '保存成功！',
            timer: 1000
        })
    })
    //点击取消按钮
    $("button#cancel").on('click',function () {
        swal({
            title: '您取消了保存！',
            timer: 1000
        })
    })

    /**
     *加载cameraData到地图图层上
     * @param cameraData
     * @private
     */
    function _addVector(cameraData) {
       //vector先加载扫描区域的图层
        let vectorArray = _drawCameraScanningArea(cameraData.cameraType,cameraData.centerPoint, cameraData.radius, cameraData.origin, cameraData.angle);
        vector.addFeatures(vectorArray);
        if(cameraData.sheleterPointArray.length >0)
        {
            //vector移除可视区域的图层，后续导洞会包含扇形
            vector.removeFeatures(visualAngleVector);
            //包含导洞的vector数组
            let holeLinearRing = [];
            for(let i =0 ;i<cameraData.sheleterPointArray.length ;i++)
            {
                let sheleterPointArray = [];
                for(let j=0;j<cameraData.sheleterPointArray[i].lon.length ;j++)
                {
                    let linePoint = new SuperMap.Geometry.Point(cameraData.sheleterPointArray[i].lon[j],cameraData.sheleterPointArray[i].lat[j]);
                    sheleterPointArray.push(linePoint);
                }
                let holeVector = createHoleRegion(cameraData.centerPoint, sheleterPointArray,cameraData.radius,cameraData.origin,cameraData.angle);
                holeLinearRing.push(holeVector);
            }
            //所有导洞和扇形可视区域结合
            let holeRegionVector = combineHoleCuvre(cameraData.centerPoint,holeLinearRing,cameraData.radius, cameraData.origin, cameraData.angle);
            vector.addFeatures(holeRegionVector);

        }
        else
        {
            let vectorArray = _drawCameraScanningArea(cameraData.cameraType,cameraData.centerPoint,cameraData.radius, cameraData.origin, cameraData.angle);
            vector.addFeatures(vectorArray);
         }

    };

    /**
     * 绘制摄像头的导洞区域
     * @param  {[SuperMap.Geometry.Point]} centerPoint [摄像头位置点]
     * @param  {[Array]} sheleterPointArray   [遮挡物点数组]
     * @param  {[Number]} radius      [扫描区域半径]
     * @param  {[Number]} angle      [视角旋转角度 0-360°]
     * @return {{}}                 [包含岛洞的Vector]
     */
    function  createHoleRegion(centerPoint,sheleterPointArray,Cameraradius,origin,angle) {
        let cuvreSides = 30; //扇面
        let radius = parseFloat(Cameraradius)/111110;//半径

        let leftPoint = sheleterPointArray[0];
        let rightPoint = sheleterPointArray[sheleterPointArray.length - 1];

        //导洞内扇形旋转角度的计算rotateAngle
        //取方位角angle + 遮挡线最后一个点和视角扇形夹角
        let visualAngle = SuperMap.Geometry.Polygon.createRegularPolygonCurve(centerPoint, radius, cuvreSides, origin, angle); // 扇形视角区域
        let directionPoint = {};
        directionPoint.x = visualAngle.components[0].components[0].x;
        directionPoint.y = visualAngle.components[0].components[0].y;

        let rightPointCalculate = parseFloat(_calculaScreenteAngle(centerPoint, rightPoint, directionPoint));
        let leftPointCalculate = parseFloat(_calculaScreenteAngle(centerPoint, leftPoint, directionPoint));
        //构建导洞内部扇形的旋转角度
        let rotateAngle = 0;
        // 岛洞点数组
        let holeArray = [];
        //判断是顺时针画线还是逆时针画线
        if(leftPointCalculate > rightPointCalculate)
        {
            rotateAngle = parseFloat(angle) + rightPointCalculate; // 遮挡物扇形区域和正东方向的夹角
            //顺时针则使用 画线保存的点数组 去构建导洞
            for (let j = 0, len = sheleterPointArray.length; j < len; j++)
            {
                holeArray.push(sheleterPointArray[j]);
            }
        }
        else
        {
            //逆时针则用想反的点去存数组
            rotateAngle = parseFloat(angle) + leftPointCalculate; // 遮挡物扇形区域和正东方向的夹角
            for (let j = sheleterPointArray.length -1; j >= 0; j--)
            {
                holeArray.push(sheleterPointArray[j]);
            }
        }
        // 遮挡物和中心点的夹角
        let intersectionAngle = _calculaScreenteAngle(centerPoint, leftPoint, rightPoint);
        let screenCuvre = SuperMap.Geometry.Polygon.createRegularPolygonCurve(centerPoint, radius, cuvreSides, intersectionAngle, rotateAngle); // 遮挡扇形
        let screenCuvreList = screenCuvre.components[0].components;
        //导洞数组
        for (let i = 0, len = screenCuvreList.length -2; i < len; i++)
        {
            holeArray.push(screenCuvreList[i]);
        }
        holeArray.push(holeArray[0]);

        let holeLinearRing = new SuperMap.Geometry.LinearRing(holeArray);

        return holeLinearRing;
    }
    /**
     * 组合摄像头的导洞区域+扫描区域
     * @param  {[SuperMap.Geometry.Point]} centerPoint [摄像头位置点]
     * @param  {[Array]} holeLinearRingArray   [构成导洞的线]
     * @param  {[Number]} radius      [扫描区域半径]
     * @param  {[Number]} origin      [视角范围 0-360°]
     * @param  {[Number]} angle      [视角旋转角度 0-360°]
     * @return {{}}                 [包含岛洞的Vector]
     */
    function combineHoleCuvre(centerPoint,holeLinearRingArray,Cameraradius,origin,angle){
        //默认半径radius单位计算
        let radius = parseFloat(Cameraradius)/111110;
        let cuvreSides = 30; // 扇形边数

        //构建扫描区域的扇形
        let visualAngle = SuperMap.Geometry.Polygon.createRegularPolygonCurve(centerPoint, radius, cuvreSides, origin, angle); // 扇形视角区域
        let visualAngleList = visualAngle.components[0].components;
        let visualAngleLinearRing = new SuperMap.Geometry.LinearRing(visualAngleList);

        holeLinearRingArray.push(visualAngleLinearRing);

        holeRegion = new SuperMap.Geometry.Polygon(holeLinearRingArray);
        holeRegionVector = new SuperMap.Feature.Vector(holeRegion);
        // 枪机岛洞样式
        holeRegionVector.style = {
            strokeColor: "#2f8df0",
            fillColor: "#C6E2FF",
            strokeWidth: 1,
            fillOpacity: 0.5
        }
        //测试
        return [holeRegionVector];

    }
    /**
     * 绘制摄像头的扫描区域
     * @param  {[String]} cameraType  [摄像头类型，可选值为：枪机 || 球机： bolt || dome]
     * @param  {[SuperMap.Geometry.Point]} centerPoint [摄像头位置点]
     * @param  {[Array]} sheleterPointArray   [遮挡物点数组]
     * @param  {[Number]} Cameraradius      [扫描区域半径]
     * @param  {[Number]} origin      [视角范围 0-360°]
     * @param  {[Number]} angle      [视角旋转角度 0-360°]
     * @return {[Array]}             [包含岛洞的Vector数组]
     */
    function _drawCameraScanningArea(cameraType,centerPoint,Cameraradius, origin, angle) {
        //默认半径radius单位计算
        let radius = parseFloat(Cameraradius)/111110;

        vector.removeAllFeatures();
        //中心点
        cameraCenterVector = new SuperMap.Feature.Vector(centerPoint);
        cameraCenterVector.style = {
            fillColor: "blue",
            strokeColor: "blue",
            pointRadius: 4
        };

        let cuvreSides = 30; // 扇形边数
        let visualAngle = SuperMap.Geometry.Polygon.createRegularPolygonCurve(centerPoint, radius, cuvreSides, origin, angle); // 扇形视角区域
        visualAngleVector = new SuperMap.Feature.Vector(visualAngle); // 视角扇形Vector
        visualAngleVector.style = {
            strokeColor: "#2f8df0",
            fillColor: "#C6E2FF",
            strokeWidth: 2,
            fillOpacity: 0.5
        };

        let circleSides = 256; // 圆的边数
        let circle = _createCircle(centerPoint, radius, circleSides, 360, 0); // 初始化一个圆区域
        let circleList = circle.components[0].components;
        let circleListPoint = circle.components[0].components[0];
        let circleLinearRing = new SuperMap.Geometry.LinearRing(circleList);
        let circleVector = new SuperMap.Feature.Vector(circleLinearRing);
        // 圆样式
        circleVector.style = {
                strokeColor: "#2f8df0",
                fillColor: "#C6E2FF",
                strokeWidth: 2,
                fillOpacity: 0
            };

        if (cameraType === 'dome') { // 如果是球机，岛洞的外围是圆
                return [cameraCenterVector,circleVector,visualAngleVector];
            }
        else { // 如果是枪机，岛洞外围是视角范围
                return [cameraCenterVector,visualAngleVector];
            }
    };
    /**
     * [_createCircle description]
     * @param  {[SuperMap.Geometry.Point]} origin [圆心]
     * @param  {[Number]} radius [半径]
     * @param  {[Number]} sides  [组成圆的边数，大于256近似圆]
     * @param  {[Number]} r      [圆的显示范围，0-360°，比如半圆：180]
     * @param  {[Number]} angel  [圆的旋转角度，0-360°]
     * @return {[SuperMap.Geometry.Collection]}        [包含圆的一个几何对象集合]
     */
    function _createCircle(origin, radius, sides, r, angel) {

        let rR = r * Math.PI / (180 * sides);
        let rotatedAngle, x, y;
        let points = [];

        for (let i = 0; i < sides; ++i) {
            rotatedAngle = rR * i;
            x = origin.x + (radius * Math.cos(rotatedAngle));
            y = origin.y + (radius * Math.sin(rotatedAngle));
            points.push(new SuperMap.Geometry.Point(x, y));
        }

        rotatedAngle = r * Math.PI / 180;
        x = origin.x + (radius * Math.cos(rotatedAngle));
        y = origin.y + (radius * Math.sin(rotatedAngle));
        points.push(new SuperMap.Geometry.Point(x, y));

        let ring = new SuperMap.Geometry.LinearRing(points);
        ring.rotate(parseFloat(angel), origin);
        let geo = new SuperMap.Geometry.Collection([ring]);

        geo.origin = origin;
        geo.radius = radius;
        geo.r = r;
        geo.angel = angel;
        geo.sides = sides;
        geo.polygonType = "Curve";

        return geo;
    }
    /**
     * 计算两个遮挡物点与中心点的夹角
     * @param  {[SuperMap.Geomertry.Point]} centerPoint [中心点]
     * @param  {[SuperMap.Geomertry.Point]} leftPoint   [左遮挡物点]
     * @param  {[SuperMap.Geomertry.Point]} rightPoint  [右遮挡物点]
     * @return {[Number]}             [角度]
     */
    function _calculaScreenteAngle(centerPoint, leftPoint, rightPoint) {
        if (leftPoint != null && rightPoint != null) {
            let dx1 = leftPoint.x - centerPoint.x;
            let dy1 = leftPoint.y - centerPoint.y;

            let dx2 = rightPoint.x - centerPoint.x;
            let dy2 = rightPoint.y - centerPoint.y;

            let c = Math.sqrt(dx1 * dx1 + dy1 * dy1) * Math.sqrt(dx2 * dx2 + dy2 * dy2);

            if (c == 0) return -1;

            let angle = Math.acos((dx1 * dx2 + dy1 * dy2) / c);

            return 180 * angle / Math.PI;
        }
    }

    /**
     * 正则表达式匹配数字
     * @param num
     * @returns {*}
     */
    function patternNumber(num) {
        let reg = /^\d+(\.\d+)?$/;
        if(reg.test(num)==true)
        {
            return true;
        }else
        {
            return false;
        }
    }
})