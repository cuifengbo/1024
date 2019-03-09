import React from 'react';
import ReactDOM from 'react-dom';
import Tween from 'rc-tween-one';
import './index.css';


var row = 4;//最大行数
var column = 4;//最大列数
var baseArr = [];//数据基础矩阵
var timeArr = [['','','',''],['','','',''],['','','',''],['','','','']];//时间倒退数组；
var powerAttack = false;
var timeKey = false;
var startX ;
var startY ;
function Square(props){
    return(
     <div className="square" onClick={() => props.onClick(props.value.x,props.value.y)}>
     {props.value.value}
     </div>
    );
}
class Board extends React.Component {
    constructor(props){
     super(props);
     for (let i=0; i<row;i++){//构建格子数组
        var brr = [];
         for (let j=0; j<column;j++){
          var obj = {
           x:i,
           y:j,
           st:{"background":"#FFEECB"},
           value:"",
           status:0,
          }
          brr.push(obj);
         }
         baseArr.push(brr);
        }//构建格子完毕
        baseArr[0][0].value = 2;
        this.newNumber();
        this.newNumber();
        this.state = {
            squares:baseArr,
           }
    }
    newNumber(){
        var full = true;
        for (var i=0;i<baseArr.length;i++){
            for(var j=0;j<baseArr[i].length;j++){
                if(baseArr[i][j].value===""){
                    full=false;
                    break;
                }
            }
        }
        if(full){//数据充满时检测是否有可合并的方格
            var sames = false;
            console.log("runing full check");
            for (var m=0;m<baseArr.length;m++){
                for(var n=0;n<baseArr[m].length;n++){
                    console.log("m="+m,"n="+n);
                    if(m==baseArr.length-1&&n==baseArr[m].length-1){//最后一个元素不查直接跳出循环
                        break;
                    }
                    if(m==baseArr.length-1){//边界元素只查一个相邻方向
                        if(baseArr[m][n].value==baseArr[m][n+1].value){
                            sames = true;
                            break;
                        }
                    }
                    if(n==baseArr[m].length-1){//边界元素
                        if(baseArr[m][n].value==baseArr[m+1][n].value){
                            sames = true;
                            break;
                        }
                    }
                    if(m<baseArr.length-1&&n<baseArr[m].length-1){//中央元素两边都查
                        if(baseArr[m][n].value==baseArr[m][n+1].value){
                            sames = true;
                            break;
                        }
                        if(baseArr[m][n].value==baseArr[m+1][n].value){
                            sames = true;
                            break;
                        }
                    }
                    
                }
            }
            if(sames){
                console.log(sames);
            }else{
                alert("GameOver!");    
            }
           
        }else{
            var tempX = Math.floor(Math.random()*row);
            var tempY = Math.floor(Math.random()*column);
            if(baseArr[tempX][tempY].value==""){
                if(Math.random()>0.15){
                    baseArr[tempX][tempY].value = 2;  
                }else{
                    baseArr[tempX][tempY].value = 4;  
                }
                      
            }else{
                this.newNumber();
            }
        }
        
    }
    handleClick(x,y){
       if(powerAttack){
            baseArr[x][y].value = "";
            this.setState({
                squares:baseArr
            });
            powerAttack = false;
       }
    }
    renderSquare(i,j) {
        var _color = '#fff'
        switch (baseArr[i][j].value){
            case "":
            _color = '#eee'
            break;
            case 2:
            _color = "#ff9"
            break;
            case 4:
            _color = "#A6FF4D"
            break;
            case 8:
            _color = '#4DFFA6'
            break;
            case 16:
            _color = '#00D9A3'
            break;
            case 32:
            _color = '#00FFFF'
            break;
            case 64:
            _color = '#0040FF'
            break;
            case 128:
            _color = '#7373FF'
            break;
            case 256:
            _color = '#9326FF'
            break;
            case 512:
            _color = '#8C008C'
            break;
            case 1024:
            _color = '#FF0000'
            break;
            case 2048:
            _color = '#D93600'
            break;
            case 4096:
            _color = '#B28500'
            break;
            case 8192:
            _color = '#0036D9'
            break;
            case 16384:
            _color = '#000'
            break;

            default:
            _color = "#fff"
            break;

        }
        return <Tween
        animation={[
          { backgroundColor: _color },
          {float: 'left'}
        ]}
        style = {{backgroundColor: '#000',width: "23%", margin: "1%", float: 'left', border_radius: "5px"}}
      > <Square key={i+j} value={baseArr[i][j]} onClick={(i,j) => this.handleClick(i,j)} />
      </Tween>;
       }
    handleTs(e){//滑动开始检测
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }
    handleTe(e){//滑动结束判断方向
        if(Math.abs(e.changedTouches[0].clientX-startX)>5||Math.abs(e.changedTouches[0].clientY-startY)>5){//偏移量大于5时生效
            if(Math.abs(e.changedTouches[0].clientX-startX)>Math.abs(e.changedTouches[0].clientY-startY)){//根据横纵偏移量判断是滑动方向
                if(e.changedTouches[0].clientX-startX>0){
                    console.log("右");
                    this.handleMove("y+");
                }else{
                    console.log("左");
                    this.handleMove("y-");
                }
            }else{
                if(e.changedTouches[0].clientY-startY>0){
                    console.log("下");
                    this.handleMove("x+");
                }else{
                    console.log("上");
                    this.handleMove("x-");
                }
            }
        }
        
    }
    goback(e){
        if(timeKey){
            for(var ii = 0 ;ii<timeArr.length;ii++){
                for(var jj = 0 ;jj<timeArr[ii].length;jj++){
                    baseArr[ii][jj].value=timeArr[ii][jj];
                } 
           }
            
            
            console.log("back in time");
            timeKey=false;
            this.setState({
                squares:baseArr
            });
        }
        
        
        
    }
    smash(e){
        powerAttack =true;
    }
    handleMove(direction){
       for(var ii = 0 ;ii<timeArr.length;ii++){
            for(var jj = 0 ;jj<timeArr[ii].length;jj++){
                timeArr[ii][jj]=baseArr[ii][jj].value;
            } 
       }
       
        
        timeKey=true;
      
       
       

        var somethingMoved = false;
        switch(direction){
            case "y+":
            for (var z = 0; z<baseArr.length;z++){
                var valueLength = 0;
                for(var m=1;m<=baseArr[z].length;m++){//计算有值的长度
                    if(baseArr[z][baseArr[z].length-m].value!=""){
                       valueLength++
                    }else{
                       if((m<baseArr[z].length)&&(baseArr[z][baseArr[z].length-m].value=="")&&(baseArr[z][baseArr[z].length-m-1].value!="")){
                            somethingMoved = true;
                       }
                    }
                }
                for(var i=baseArr[z].length-1;i>=0;i--){//去除空格
                    var k = 0;
                     while((baseArr[z][i].value=="")&&(k<=i)){
                        for(var j=i;j>=0;j--){
                            if(j==0){
                                baseArr[z][j].value = "";
                            }else{
                                baseArr[z][j].value = baseArr[z][j-1].value;
                            }
                        }
                        k++;
                    }
                }
                for(var n=valueLength,r=baseArr[z].length-1;n>0;n--,r--){//合并相同数
                    if ((valueLength == 4)&&(r==1)){
                        if(baseArr[z][r].value==baseArr[z][r-1].value){
                            baseArr[z][r].value = baseArr[z][r-1].value+baseArr[z][r].value;
                            baseArr[z][r-1].value = "";
                            somethingMoved = true;
                        } 
                        break;
                    }
                    if(baseArr[z][r].value==baseArr[z][r-1].value){
                        baseArr[z][r].value = baseArr[z][r-1].value+baseArr[z][r].value;
                        somethingMoved = true;
                        for(var x= r-1;x>0;x--){
                            baseArr[z][x].value = baseArr[z][x-1].value;
                            if(x==1){
                                baseArr[z][x-1].value="";
                            }
                        }
                        break;
                    }
                }
            }
            break;
            case "y-":
            for (var z = 0; z<baseArr.length;z++){
                var valueLength = 0;
                for(var m=1;m<=baseArr[z].length;m++){//计算有值的长度
                    if(baseArr[z][m-1].value!=""){
                       valueLength++
                    }else{
                        if((m<baseArr[z].length)&&(baseArr[z][m-1].value=="")&&(baseArr[z][m].value!="")){
                             somethingMoved = true;
                        }
                    }
                }
                for(var i=0 ;i<=baseArr[z].length-1;i++){//去除空格
                    var k = 0;
                     while((baseArr[z][i].value=="")&&(k<=baseArr[z].length-1-i)){
                        for(var j=i;j<=baseArr[z].length-1;j++){
                            if(j==baseArr[z].length-1){
                                baseArr[z][j].value = "";
                            }else{
                                baseArr[z][j].value = baseArr[z][j+1].value ;
                            }
                        }
                        k++;
                    }
                } 
                for(var n=valueLength,r=0;n>0;n--,r++){//合并相同数
                    if ((valueLength == 4)&&(r==baseArr[z].length-2)){
                        if(baseArr[z][r].value==baseArr[z][r+1].value){
                            baseArr[z][r].value = baseArr[z][r+1].value+baseArr[z][r].value;
                            baseArr[z][r+1].value = "";
                            somethingMoved = true;
                        } 
                        break;
                    }
                    if(baseArr[z][r].value==baseArr[z][r+1].value){
                        baseArr[z][r].value = baseArr[z][r+1].value+baseArr[z][r].value;
                        somethingMoved = true;
                        for(var x= r+1;x<baseArr[z].length-1;x++){
                            baseArr[z][x].value = baseArr[z][x+1].value;
                            if(x==baseArr[z].length-2){
                                baseArr[z][x+1].value="";
                            }
                        }
                        break;
                    }
                }
            }
            break;
            case "x+":
            for (var z = 0; z<baseArr[0].length;z++){
                var valueLength = 0;
                for(var m=1;m<=baseArr.length;m++){//计算有值的长度
                    if(baseArr[baseArr[z].length-m][z].value!=""){
                        valueLength++
                    }else{
                        if((m<baseArr.length)&&(baseArr[baseArr[z].length-m][z].value=="")&&(baseArr[baseArr[z].length-m-1][z].value!="")){
                             somethingMoved = true;
                        }
                    }
                }
                for(var i=baseArr.length-1;i>=0;i--){//去除空格
                    var k = 0;
                     while((baseArr[i][z].value=="")&&(k<=i)){
                        for(var j=i;j>=0;j--){
                            if(j==0){
                                baseArr[j][z].value = "";
                            }else{
                                baseArr[j][z].value = baseArr[j-1][z].value;
                            }
                        }
                        k++;
                    }
                }
                
                for(var n=valueLength,r=baseArr.length-1;n>0;n--,r--){//合并相同数
                    if ((valueLength == 4)&&(r==1)){
                        if(baseArr[r][z].value==baseArr[r-1][z].value){
                            baseArr[r][z].value = baseArr[r-1][z].value+baseArr[r][z].value;
                            baseArr[r-1][z].value = "";
                            somethingMoved = true;
                        } 
                        break;
                    }
                    if(baseArr[r][z].value==baseArr[r-1][z].value){
                        somethingMoved = true;
                        baseArr[r][z].value = baseArr[r-1][z].value+baseArr[r][z].value;
                        for(var x= r-1;x>0;x--){
                            baseArr[x][z].value = baseArr[x-1][z].value;
                            if(x==1){
                                baseArr[x-1][z].value="";
                            }
                        }
                        break;
                    }
                }
            }
            break;
            case "x-":
            for (var z = 0; z<baseArr[0].length;z++){
                var valueLength = 0;
                for(var m=1;m<=baseArr.length;m++){//计算有值的长度
                    if(baseArr[m-1][z].value!=""){
                        valueLength++
                    }else{
                        if((m<baseArr.length)&&(baseArr[m-1][z].value=="")&&(baseArr[m][z].value!="")){
                             somethingMoved = true;
                        }
                    }
                }
                for(var i=0 ;i<=baseArr.length-1;i++){//去除空格
                    var k = 0;
                     while((baseArr[i][z].value=="")&&(k<=baseArr[z].length-1-i)){
                        for(var j=i;j<=baseArr.length-1;j++){
                            if(j==baseArr.length-1){
                                baseArr[j][z].value = "";
                            }else{
                                baseArr[j][z].value = baseArr[j+1][z].value ;
                            }
                        }
                        k++;
                    }
                }
                
                for(var n=valueLength,r=0;n>0;n--,r++){//合并相同数
                    if ((valueLength == 4)&&(r==baseArr.length-2)){
                        if(baseArr[r][z].value==baseArr[r+1][z].value){
                            baseArr[r][z].value = baseArr[r+1][z].value+baseArr[r][z].value;
                            baseArr[r+1][z].value = "";
                            somethingMoved = true;
                        } 
                        break;
                    }
                    if(baseArr[r][z].value==baseArr[r+1][z].value){
                        baseArr[r][z].value = baseArr[r+1][z].value+baseArr[r][z].value;
                        somethingMoved = true;
                        for(var x= r+1;x<baseArr.length-1;x++){
                            baseArr[x][z].value = baseArr[x+1][z].value;
                            if(x==baseArr.length-2){
                                baseArr[x+1][z].value="";
                            }
                        }
                        break;
                    }
                }
            }
            break;
            default:
            break;

        }        
        
        if(somethingMoved==true){
            this.setState({
                squares:baseArr
            });
            this.newNumber();
        }
        

    }
    render(){    
        var _boards = [];
         for (var _i=0 ; _i<row ;_i++){
         var _board = [];
         for (var _j=0; _j<column ;_j++){
          _board.push(this.renderSquare(_i,_j));
         }
         _boards.push(<div className = "board-row" >{_board}</div>)
        }
       return(
            <div className = "board" onTouchStart = {(e)=>this.handleTs(e)} onTouchEnd = {(e)=>this.handleTe(e)}>
             {_boards}
             <button onClick =  {(e)=>this.goback(e)}>反悔</button><button onClick={(e)=>this.smash(e)} >砸</button>
            </div>
            
       )
    }
   
}






// ========================================

ReactDOM.render(
  <Board />,
  document.getElementById('root')
);


