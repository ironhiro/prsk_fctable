import './Section.css';
import {firestore} from '../../firebase';
import {useAsync} from "react-async";
import React, {forwardRef, useRef, useEffect, useState} from 'react';
import {getCurrentDate, sortByDifficulties} from './Utils';
import ReactDOM from 'react-dom';
import ReactTooltip from 'react-tooltip';
import './Section.css';
import html2canvas from 'html2canvas';

const category = ['vocaloid', 'light_music_club', 'idol', 'street', 'theme_park', 'school_refusal','sekai','other'];
const lineColor_1 = ["#ffd642", "#f755e7", "#76d6ff","transparent"];

let clickCount = {};
let chartStatus = {
    'fc': 0,
    'clear': 0,
    'blank': 0,
    'ap' : 0,
};

let selectedDiff = '';
let isChecked = false;

const headerComponent = () =>{
    return(
        <div className="container text-center mt-5 mb-5">
            <div className="h1 mb-5">
                프로세카 기록체크표
            </div>
            <div className="h5 mb-5">
                
                이 체크표는 서열표가 아닙니다.
                <br></br>
                <br></br>
                 각 그룹곡들은 난이도순으로 정렬되어있습니다.<br></br>
                  같은 난이도면 곡이 나온 순으로 정렬되어있습니다.
                  <br></br>
                  <br></br>
                 현재 시점에서는 전체 그룹 범위에서 체크만 가능합니다.<br></br>
                  추후 그룹 필터 기능을 추가할 예정입니다.
                  <br></br>
                  <br></br>
                  이 체크표는 pc환경에서의 사용을 권장합니다. <br></br>
                  크롬 브라우저 이외의 브라우저 사용 시 원활한 사용이 보장되지 않습니다.
                  <br></br>
                  <br></br>
                 이미지와 닉네임을 등록하고 맨 아래쪽에 있는 버튼을 누르면<br></br>
                  풀콤체크표.png라는 이름으로 브라우저에 지정된 다운로드 위치에 저장됩니다.
                  <br></br>
                  <br></br>
                 기타 피드백 및 버그사항은 <a href="mailto:ironhiro@kakao.com?subject=[버그/피드백]">ironhiro@kakao.com</a>으로 보내주시길 바랍니다.
                
            </div>

        </div>
    );
}



const drawLine = (ctx_info, id) =>{
    ctx_info.lineWidth = 20;
    ctx_info.beginPath();
    
    if(clickCount[id.toString()] === undefined)
    {
        ctx_info.strokeStyle = lineColor_1[0];
        ctx_info.moveTo(0,0);
        ctx_info.lineTo(300,150);
        ctx_info.stroke();
        clickCount[id.toString()] = 1;
    }
    else
    {
        if(clickCount[id.toString()]%4===2)
        {
            let gradient = ctx_info.createLinearGradient(0,0,300,150);
            gradient.addColorStop("0", "#faaff9");
            gradient.addColorStop("0.5", "#8ad1fe");
            gradient.addColorStop("1", "#03d7b4");
            ctx_info.strokeStyle = gradient;
        }
        else
        {
            ctx_info.strokeStyle = lineColor_1[clickCount[id.toString()]%4];
        }
        
        ctx_info.clearRect(0,0,300,150);
        ctx_info.moveTo(0,0);
        ctx_info.lineTo(300,150);
        ctx_info.stroke();
        clickCount[id.toString()]++;
    }
   
    checkStatus(id);
}



const borderColor = {
    'vocaloid': "#00FFDD",
    'light_music_club': "#4455dd",
    'idol': '#88DD44',
    'street': "#EE1166",
    'theme_park': "#FF9900",
    'school_refusal': "#884499",
    'sekai': "#2ED7E1",
    'other': "#FFD800",
};

const origComponent = ()=>{
    return(
        <div className="h5 input-group">
            <input type="text" id="input-username" className="form-control" placeholder="닉네임을 등록해주세요" aria-label="username"></input>
            <button className="btn btn-primary" onClick={submitNickname}>등록하기</button>    
        </div>
    );
};
const nickNameComponent = (data) =>{
    return(
        <div className="h1 text-center">
            {data}
            <br></br>
            <button className="btn btn-primary" id="button_undo" onClick={undo}>다시 작성하기</button>
        </div>
    );
};

function undo(e)
{
    let parentDiv = document.getElementById('custom-profile');
    ReactDOM.render(origComponent(), parentDiv);
    isChecked=false;
}



const Sections = forwardRef((props, ref) =>{
    const imageStyle = {
        border: '5px solid #F1F1F1',
    }
   
    return(
        <div className="App-section container" ref={ref}>
                {headerComponent()}
                <div className="container"> 
                    <div className="d-flex flex-wrap justify-content-around mt-5">
                        <div className="d-flex flex-column" id="custom-profile-root">
                            <div className="p-2 mb-3 text-center">
                                <img style={imageStyle} id="profile_img"  src={process.env.PUBLIC_URL +  "/assets/default.png"}></img>
                                <br></br>
                                <label id="input-file" className="input-file-button" for="upload_file">
                                    이미지 업로드
                                </label>
                                
                                <input type="file" accept="image/*" className="btn btn-primary" id="upload_file" onChange={uploadProfileImage} style={{display:"none"}}></input>
                            </div>
                            <div className="p-2 mb-3" id="custom-profile">
                                <div className="h5 input-group">
                                    <input type="text" id="input-username" className="form-control" placeholder="닉네임을 등록해주세요" aria-label="username"></input>
                                    <button className="btn btn-primary" id="register_nickname" onClick={submitNickname}>등록하기</button>    
                                </div>
                            </div>
                            
                        </div>
                        <div className="d-flex flex-column h4 my-auto">
                        <div className="d-flex flex-row flex-wrap h4 my-auto justify-content-center" style={{fontSize: "15pt"}}>
                        <div className="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="easy" onClick={getRadioValue}></input>
                            <label style={{color: '#64DE0D'}}class="form-check-label" for="inlineRadio1">easy</label>
                            </div>
                            <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="normal" onClick={getRadioValue}></input>
                            <label style={{color: '#36BAEB'}} class="form-check-label" for="inlineRadio2">normal</label>
                            </div>
                            <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="hard" onClick={getRadioValue}></input>
                            <label style={{color: '#FDAB00'}} class="form-check-label" for="inlineRadio3">hard</label>
                            </div>
                            <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="expert" onClick={getRadioValue}></input>
                            <label style={{color: '#EC4563'}} class="form-check-label" for="inlineRadio4">expert</label>
                            </div>
                            <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio5" value="master" onClick={getRadioValue}></input>
                            <label style={{color: '#C231F2'}} class="form-check-label" for="inlineRadio5">master</label>
                            </div>
                        </div>
                        <div className="d-flex flex-wrap flex-row h4 my-auto justify-content-center">
                            <div id="current_date" className="p-2">{getCurrentDate()}</div>
                            <div id = "blank_status" className="p-2">
                                <img src={process.env.PUBLIC_URL +  "/assets/status/blank.png"} width="25px" height="25px"></img>
                                {chartStatus['blank']}
                            </div>
                            <div id = "clear_status" className="p-2">
                                <img src={process.env.PUBLIC_URL +  "/assets/status/clear.png"} width="25px" height="25px"></img>
                                {chartStatus['clear']}
                            </div>
                            <div id = "fc_status" className="p-2">
                                <img src={process.env.PUBLIC_URL +  "/assets/status/fc.png"} width="25px" height="25px"></img>
                                {chartStatus['fc']}
                            </div>
                            <div id = "ap_status" className="p-2">
                                <img src={process.env.PUBLIC_URL +  "/assets/status/ap.png"} width="25px" height="25px"></img>
                                {chartStatus['ap']}
                            </div>
                       </div>
                       </div>
                       
                    </div>
                </div>
                <div id="chartsList"> 
                    {props.props}
                </div>
                <div className="container mt-5">
                    <p className="text-end">
                    Powered by <a href="https://twitter.com/ironhiro1">@ironhiro1</a>, <a href="https://twitter.com/Biiiiiiiiii_0w0">@Biiiiiiiiii_0w0</a>
                    </p>
                </div>
        </div>
    );
  });

function uploadProfileImage(e)
{
    document.getElementById('profile_img').src = window.URL.createObjectURL(document.getElementById('upload_file').files[0]);    
}

function submitNickname()
{
    let parentDiv = document.getElementById('custom-profile');
    ReactDOM.render(nickNameComponent(document.getElementById('input-username').value), parentDiv);
    isChecked=true;
}

async function getGroupValue()
{
    
}

async function getRadioValue()
{
    let counts = 0;
    selectedDiff = document.querySelector('input[name="inlineRadioOptions"]:checked').value;
    const tested = await Promise.all(category.map(function(element,idx){
        return getValues(element).then(function(data){
            counts += Object.keys(data).length;
            const res = Object.keys(data).map((res)=>{
                return data[res]['id'];
            });
            const res2 = Object.keys(data).map((res)=>{
                return data[res];
            });
            const b = res2.map(function(data,index){
                data.key=res[index];
                return data;
            });
            
            const c = b.slice(0).sort(function(a,b){
                return sortByDifficulties(a,b,selectedDiff);
            });
            
            const d = c.map((data)=>components(data));
        
            return d;
        }).then(function(data){
            const b = `${process.env.PUBLIC_URL}/assets/groupunits/${categoryBg(element)}`;
            const groups_styles={
                borderBottom: '10px solid ' + borderColor[element],
                backgroundImage: `linear-gradient(rgba(255,255,255,0.3), rgba(255,255,255,0.3)), url(${process.env.PUBLIC_URL}/assets/backgrounds/${categoryBg(element)})`,
                
                backgroundSize: 'cover',
                backgroundPosition: '20% 20%',
            }
            const charts_styles={
                backgroundColor: 'rgba(211,211,211,0.3)',
                backgroundSize: 'cover',
            }
            const div_col1 = (
                <div  style={groups_styles}  className="col music-category mx-auto my-auto text-center">
                        <img className="groups" src={b}></img>
                </div>
            );
            const div_col2 =  (
                <div style={charts_styles} className="col-9 mx-auto my-auto w-100">
                        <ul className="groups_border text-center">
                            {data}
                        </ul>
                </div>
            );
            const row_styles = {
                border: '10px solid ' + borderColor[element],
                
            }
         
            return (
                    <div style={row_styles}  className="row chart-list h-100 mt-5">
                        {div_col1}
                        {div_col2} 
                    </div>
            )
        })}));
        chartStatus['blank'] = counts;
        chartStatus['clear'] = 0;
        chartStatus['fc'] = 0;
        chartStatus['ap'] = 0;
        clickCount = {};
        reload();

        let parentDiv = document.getElementById('chartsList');
        ReactDOM.render(tested, parentDiv);
    
}

function reload()
{
    document.getElementById("blank_status").childNodes[1].nodeValue = chartStatus['blank'];
    document.getElementById("ap_status").childNodes[1].nodeValue = chartStatus['ap'];
    document.getElementById("clear_status").childNodes[1].nodeValue = chartStatus['clear'];
    document.getElementById("fc_status").childNodes[1].nodeValue = chartStatus['fc'];
}

function saveImage(sectionRef)
{
    if(isChecked)
    {
        document.getElementById('btn-download').style.display = "none";
        document.getElementById('input-file').style.display = "none";
        document.getElementById('button_undo').style.display = "none";
        console.log(sectionRef);
        //exportComponentAsPNG(sectionRef,{fileName:"풀콤체크표.png", html2CanvasOptions:{}});
        

        const fType = 'image/png';
        const fileName='풀콤체크표.PNG';
        html2canvas(sectionRef.current,{
            windowWidth: 1440,
            scrollY: -window.scrollY,
            useCORS: true,
        }).then(canvas => {
            var resizedCanvas = document.createElement("canvas");
            var resizedContext = resizedCanvas.getContext("2d");
            resizedCanvas.width = 1320;
            resizedCanvas.height = 5000;
            resizedContext.drawImage(canvas, 0,0,1320, 5000);
            
            let link = document.createElement("a");
            link.download = fileName;
            resizedCanvas.toBlob(function(blob){
                link.href = window.URL.createObjectURL(blob);
                link.click();
                document.getElementById('btn-download').style.display = "inline";
            }, fType);
            
            
        });
        
        document.getElementById('input-file').style.display = "inline";
        document.getElementById('button_undo').style.display = "inline";
    }
    else
    {
        alert("닉네임을 입력해주세요..!");
    }
    
}


function categoryBg(category)
{
    var a = '';
    switch(category)
    {
        case 'light_music_club':
            a='leoneed.png';
            break;
        case 'vocaloid':
            a='vs.png';
            break;
        case 'idol':
            a='mmj.png';
            break;
        case 'street':
            a='vbs.png';
            break;
        case 'school_refusal':
            a='25ji.png';
            break;
        case 'theme_park':
            a='wxs.png';
            break;
        case 'sekai':
            a=`${category}.png`;
            break;
        case 'other':
            a='other.png';
            break;

    }
    return a;
}

function checkStatus(data)
{
    
    switch(clickCount[data] % 4)
    {
        case 1:
            document.getElementById("clear_status").childNodes[1].nodeValue = ++chartStatus['clear'];
            document.getElementById("blank_status").childNodes[1].nodeValue = --chartStatus['blank'];
            break;
        case 2:
            document.getElementById("fc_status").childNodes[1].nodeValue = ++chartStatus['fc'];
            break;
        case 3:
            document.getElementById("ap_status").childNodes[1].nodeValue = ++chartStatus['ap'];
            break;
        case 0:
            document.getElementById("blank_status").childNodes[1].nodeValue = ++chartStatus['blank'];
            document.getElementById("ap_status").childNodes[1].nodeValue = --chartStatus['ap'];
            document.getElementById("clear_status").childNodes[1].nodeValue = --chartStatus['clear'];
            document.getElementById("fc_status").childNodes[1].nodeValue = --chartStatus['fc'];
            break;
    }
    
}


function getValues(element)
{
    // 맞는 데이터 찾는 과정
    const chartref = firestore.ref('charts');

    const result = new Promise(function(resolve,reject){
        setTimeout(function(){
            chartref.orderByChild('category').equalTo(element).once('value').then((data)=>{
            
            resolve(data.val());
        },2000)})});
    
    
    return result;
}
function components(data)
{
    const res = `${process.env.PUBLIC_URL}/assets/jackets/${data.key}.png`;
    const imageStyle ={
        backgroundImage: `url(${res})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    }
    const listStyle = {
        border: `5px solid ${borderColor[data.category]}`,
    }
    const canvasName = `${data.key}`;
    const tooltipMessage=
        `Title: ${data.title}
        Lv
        Easy - ${data.difficulties.easy}
        Normal - ${data.difficulties.normal}
        Hard - ${data.difficulties.hard}
        Expert - ${data.difficulties.expert}
        Master - ${data.difficulties.master}`;
    
    return <li className="jacketInfo" style={listStyle}>
        <canvas id={canvasName} onClick={drawDash} data-for={'chart' + data.id.toString()} data-tip className="jackets" style={imageStyle}></canvas>
        <ReactTooltip
            className="chartToolTip"
            id={'chart' + data.id.toString()}
            place="bottom"
            data-html={true}
            >
            {tooltipMessage}
        </ReactTooltip>
        </li>
}

function drawDash(component)
{
    const canvas = document.getElementById(component.target.id);
    const ctx = canvas.getContext("2d");
    drawLine(ctx, component.target.id);
}



async function getComponent()
{
    const tested = await Promise.all(category.map(function(element,idx){
    return getValues(element).then(function(data){
        chartStatus['blank'] += Object.keys(data).length;
        const res = Object.keys(data).map((res)=>{
            return data[res]['id'];
        });
        const res2 = Object.keys(data).map((res)=>{
            return data[res];
        });
        const b = res2.map(function(data,index){
            data.key=res[index];
            return data;
        });
        
        const c = b.slice(0).sort(function(a,b){
            return sortByDifficulties(a,b, 'master');
        });
        
        const d = c.map((data)=>components(data));
    
        return d;
    }).then(function(data){
        const b = `${process.env.PUBLIC_URL}/assets/groupunits/${categoryBg(element)}`;
        const group_name = categoryBg(element).replace('.png', '')=='other'? categoryBg(element).replace('.png', ''):'groups';
        
        const groups_styles={
            borderBottom: '10px solid ' + borderColor[element],
            backgroundImage: `linear-gradient(rgba(255,255,255,0.3), rgba(255,255,255,0.3)), url(${process.env.PUBLIC_URL}/assets/backgrounds/${categoryBg(element)})`,
            
            backgroundSize: 'cover',
            backgroundPosition: '20% 20%',
        }
        const charts_styles={
            backgroundColor: 'rgba(211,211,211,0.3)',
            backgroundSize: 'cover',
        }
        
        const div_col1 = (
            <div  style={groups_styles}  className="col music-category mx-auto my-auto text-center">
                    <img className={group_name} src={b}></img>
            </div>
        );
        const div_col2 =  (
            <div style={charts_styles} className="col-9 mx-auto my-auto w-100">
                    <ul className="groups_border text-center">
                        {data}
                    </ul>
            </div>
        );
        const row_styles = {
            border: '10px solid ' + borderColor[element],
            
        }
     
        return (
                <div style={row_styles}  className="row chart-list h-100 mt-5">
                    {div_col1}
                    {div_col2} 
                </div>
        )
    })}));    
    return tested
}


function Section()
{
    const {data: components, error, isLoading} = useAsync({
        promiseFn: getComponent
    });
    const sectionRef = useRef();
    
    
    if(isLoading) return <div className="container">로딩중...</div>
    if(error) return <div className="container">Error</div>
    if(components){ 
        //Section 위쪽에 인장 
        
        return (
            <React.Fragment>
                <Sections  ref={sectionRef} props={components}/>
                <div className="py-4 my-4 container text-center border-top">
                    <button id="btn-download" onClick={() => {
                        saveImage(sectionRef);
                    }} className="btn btn-primary btn-lg ">이미지 생성하기</button>
                </div>
            </React.Fragment>
            
        );
    } 
}

export default Section;