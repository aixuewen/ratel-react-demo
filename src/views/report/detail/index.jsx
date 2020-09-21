import React from 'react';
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Switch,
  TreeSelect,
  Tabs,
  Col,
  Steps,
  Timeline,
  Icon,
  Select
} from 'antd'
import './index.less';
import { AddButton,  CommonTable,  ExportButton,  HrefDelButton,  HrefEditButton,  RatelPage,  SearchButton,  HrefViewButton } from "@/components";
import RatelItem from "../../../components/RatelItem";
import * as reportApi from '../../../services/report'
import {Storage} from '../../../utils'
import {createHashHistory} from 'history';
import Photo from '../../../components/Photo'	
import moment from "moment";
import {ParamUtils, RateUtils,axios} from '@utils'
import { signpersion } from "../../../services/system/dept"
import {treeListApi} from "../../../services/report";
import CollectionCreateFormqs from '../sign/CollectionCreateFormqs'


const TextArea = Input.TextArea;

const {confirm} = Modal;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const { Option } = Select;


class Detail extends React.Component {
  searchForm = React.createRef();
  
  
  
  constructor(props) {
    super(props)
    console.log(props.location.search.substr(1,props.location.search.length))
    this.state = {
      modalVisible: false,
      modalEditable: true,
      menuType: 0,
      dataSource: [],
      currentRow: {},
      treeDataSource: [],
      eventId:props.location.search.substr(1,props.location.search.length),
      isShow:false,
      imgSrc:"",
      //zyx
      modalFeedbackVisible: false,
      fileList: [],
      feedBackId: "",
      operateType:"",
      //dyp
      recordList: [],
      InputValue: '' ,
      modalVisible1:false,
      pointList:[],
      modalVisible2:false,
      modalVisible3:false,
      modalVisible4:false,
      allDeptList:'',
      userInfo: Storage.getUserInfo(),
      record:'',
      display:true
    }
  }
  
 componentDidMount() {
  this.handleGetDetail();
  this.handleGetOperate()
  this.allDeptList()
  
 }
 
 
 getButtonList = (record,yq,zzb,fzr) => {
   if (this.state.userInfo.roles.findIndex((element) => (element === 'system')) === -1){
      
     return (
       <span>
         {
           record === '1' && this.state.userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1  ? (<span className="theTypeButton"><Button className="theButtonType1"  type="ghost" onClick={() => this.wuxuzhenggai(this.state.eventId)}>无需整改</Button></span>):null
         }
         {
           record === '1' && this.state.userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1  ? (<Divider type='vertical'/>):null
         }
         {
           record === '1' && this.state.userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1  ? (<span className=""><Button className="theButtonType2" type="ghost" onClick={() => this.onAddBtnassign(this.state.eventId)}>分派</Button></span>):null
         }
         {
           record === '1' && this.state.userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1  ? (<Divider type='vertical'/>):null
         }
         {
           record === '2' && fzr === 'true' ? (<span className="theTypeButton"><Button className="theButtonType1" type="ghost" onClick={() => this.onqsBtn(this.state.eventId)}>签收</Button></span>):null
         }
         {
           record === '2' && fzr === 'true' ? (<Divider type='vertical'/>):null
         }
         {
           (record === '2' && zzb  === 'true' && fzr === 'true') ? (<span className=""><Button className="theButtonType2" type="ghost" onClick={() => this.feedback(this.state.eventId)}>反馈</Button></span>):null
         }
         {
           record === '2' && zzb === 'true' && fzr === 'true' ? (<Divider type='vertical'/>):null
         }
         {
           (record === '3' && zzb  === 'true' && fzr === 'true')? (<span className="theTypeButton"><Button className="theButtonType1" type="ghost" onClick={() => this.rctificationrctification(this.state.eventId)}>整改</Button></span>):null
         }
         {
           (record === '3' && zzb  === 'true' && fzr === 'true')? (<Divider type='vertical'/>):null
         }
         {
           record === '5' && this.state.userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1 ? (<span className="theTypeButton"><Button className="theButtonType1" type="ghost" onClick={() => this.onAddBtnassign(this.state.eventId)}>再分派</Button></span>):null
         }
         {
           record === '5' && this.state.userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1 ? (<Divider type='vertical'/>):null
         }
         {
           (record === '4')   && this.state.userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1 ? (<span className="theTypeButton"><Button className="theButtonType1" type="ghost" onClick={() => this.houducha(this.state.eventId)}>后督察</Button></span>):null
         }
         {
           (record === '4')   && this.state.userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1 ? (<Divider type='vertical'/>):null
         }
   
         {
           ((record === '2' || record === '3' ||record === '6')  && yq === 1) && this.state.userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1   ? (<span className={record === '2' && fzr === 'true'?"":'theTypeButton'}><Button className="theButtonType2" type="ghost" onClick={() => this.reminds(this.state.eventId)}>提醒</Button></span>):null
         }
         {
           ((record === '2' || record === '3' ||record === '6')  && yq === 1)  && this.state.userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1  ? (<Divider type='vertical'/>):null
         }
         
   
         
    
   </span>)
   } else {
    
     
   }
 }
 
 getNowFormatDate() {
   var date = new Date();
   var seperator1 = "-";
   var year = date.getFullYear();
   var month = date.getMonth() + 1;
   var strDate = date.getDate();
   if (month >= 1 && month <= 9) {
     month = "0" + month;
   }
   if (strDate >= 0 && strDate <= 9) {
     strDate = "0" + strDate;
   }
   var currentdate = year + seperator1 + month + seperator1 + strDate;
   return currentdate;
 }
  
 callback = (key) => {
   
    console.log(key);
  }
  
  getEventType = (type) => {
    switch (type) {
      case '1':
      return '待分派'
      
      case '2':
      return '待签收'
      
      case '3':
      return '待整改'
      
      case '4':
      return '已整改'
       
      case '5':
      return '已反馈'
       
      case '6':
      return '后督察'
       
      case '7':
      return '无需整改'
        
    }
  }
  
  getDeptType = (type) => {
    switch (type) {
      case '1':
      return '牵头部门'
      
      case '2':
      return '责任部门'
      
      case '3':
      return '配合部门'
    }
  }
  
  getOperateType = (type) => {
    switch (type) {
      case '2':
      return '整改'
      
      case '3':
      return '反馈'
      
      case '4':
      return '后督察'
      
      case '5':
      return '后督察'
    }
  }
  
   Date2Week = (value) => {
    const day = new Date(Date.parse(value.replace(/-/g, '/'))); //将日期值格式化
    const today = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return today[day.getDay()];//day.getDay();根据Date返一个星期中的某一天，其中0为星期日
  };
  
  changeTime = (value) => {
    let first = value.substr(0,10)
    let second = "/" + this.Date2Week(value);
    let third = value.substr(10,value.length)
    return first + second + third;
  }
  
  goBack = () => { 
    const history = createHashHistory();
    history.push('/');
  }
  
  onClose =() => {
      this.setState({
       imgShow: false
      });
    }
   imgShow = (e) => {
   
    if (e.target.nodeName==="IMG") { //判断img 节点
      this.setState({
        imgShow:true,
        imgSrc:e.target.src
      })
    }
   }
  
  handleGetOperate = () => {
    reportApi.getOperate({
      eventId:this.state.eventId
    }).then((res) => {
      console.log(res)
      
      var content = res.data.content
      
      let operateList = []
      
       this.state.record = content.status;
      
      content.map((value,key) => {
        
        let description = []
        let title = []
        let time = false;
        
          //判断为分派
          if (value.type === '0') {
            title.push(value.deptName)
             description.push(value.deptName)
             description.push(<span style={{color:'#4378BD'}}>{value.createUserName}</span>)
             description.push("对事件进行了分派")
             for (let a in value.ext1) {
               //判断为牵头部门
               if (a === 'dept1') {
                 
                   description.push(",牵头部门：")
                    description.push(<span style={{color:'#4378BD'}}>{value.ext1[a][0].name}</span>)
               }
               //判断责任部门
               if (a === 'dept2') {
                 let dept = value.ext1[a]
                 if (value.ext1[a] !== undefined){
                   for (let b in dept) {
                     
                     if (b === '0'){
                       description.push(",责任部门：")
                       description.push(<span style={{color:'#4378BD'}}>{dept[b].name}</span>)
                     } else if (b !== dept.length) {
                       description.push("、")
                       description.push(<span style={{color:'#4378BD'}}>{dept[b].name}</span>)
                       description.push("、")
                     } else {
                       description.push(<span style={{color:'#4378BD'}}>{dept[b].name}</span>)
                      description.push("，")
                     }
                     
                   }
                 }
                 
               }
               //判断配合部门
               if (a === 'dept3') {
                 let dept = value.ext1[a]
                 if (value.ext1[a] !== undefined){
                   for (let b in dept) {
                     
                     if (b === '0'){
                       description.push(",配合部门：")
                       description.push(<span style={{color:'#4378BD'}}>{dept[b].name}</span>)
                     } else if (b !== dept.length) {
                       description.push("、")
                       description.push(<span style={{color:'#4378BD'}}>{dept[b].name}</span>)
                       description.push("、")
                     } else {
                       description.push(<span style={{color:'#4378BD'}}>{dept[b].name}</span>)
                     }
                     
                   }
                 }
               }
             }
          }
          
          if (value.type === '1') {
            if (value.deptType === '1') {
              title.push("牵头部门")
              description.push(value.deptName + "已签收，并指派")
            }
            if (value.deptType === '2') {
              title.push("责任部门")
              description.push(value.deptName + "已签收，并指派")
            }
            if (value.deptType === '3') {
              title.push("配合部门")
              description.push(value.deptName + "已签收，并指派")
            }
            description.push(<span style={{color:'#4378BD'}}>{value.leaderName}</span>)
            description.push("整改，电话：")
            description.push(<span style={{color:'#4378BD'}}>{value.leaderPhone}</span>)
          }
          
          if (value.type === '2'){
            title.push(value.deptName)
            description.push(value.deptName)
            description.push(<span style={{color:'#4378BD'}}>{value.leaderName}</span>)
            description.push("已整改，整改内容查看详情")
          }
          if (value.type === '3'){
            title.push(value.deptName)
            description.push(value.deptName)
            description.push(<span style={{color:'#4378BD'}}>{value.leaderName}</span>)
            description.push("已反馈，反馈内容查看详情")
          }
          if (value.type === '4'){
            title.push(value.deptName)
            description.push(value.deptName)
            description.push(<span style={{color:'#4378BD'}}>{value.leaderName}</span>)
            description.push("提交了后督察，督察内容查看详情")
          }
          
          
          //判断时间
          
         
          if (key !== 0) {
            content.map((v,k) => {
              if (k < key) {
                if (v.createTime.substr(0,v.createTime.length-9) === value.createTime.substr(0,value.createTime.length-9)) {
                  time = true;
                }
              }
            })
          } 
          
          let createTime = ''
         
          if (time) {
            createTime = value.createTime.substr(value.createTime.length-9,value.createTime.length)
          } else {
            createTime = value.createTime
          }
          
          operateList.push({'description':description,'title':title,'createTime':createTime})
          
      })
      //console.log(description)
      
      //console.log(operateList)
      
      
      this.setState({operateList:operateList})
    }).catch((error) => {
      
      console.log(error)
    })
    
  }
  
  playVideo =  (id) => {
    
    let tId = "#myVideo"+id.target.id.substr(4,id.target.id.length)
    
    var myVideo = document.querySelector(tId);
    
    var allVideo = document.getElementsByClassName("allVideo")
    
    let pId = "#play"+id.target.id.substr(4,id.target.id.length)
    
    var thePlay = document.querySelector(pId);
    
    var allPlay = document.getElementsByClassName("pointer")
    
    
    
    if (myVideo !== null) {
      if (myVideo.paused) {
        for (let a=0;a<allVideo.length;a++) {
          if (allVideo[a] !== null) {
            allVideo[a].pause()
            allPlay[a].style.setProperty('background',"url('/static/img/u1709.png') no-repeat")
            allPlay[a].style.setProperty('background-size',"100%")
          }
        } 
      myVideo.play();//播放
      thePlay.style.setProperty('background',"url('/static/img/00.png') no-repeat")
      thePlay.style.setProperty('background-size',"100%")
      } else {
      myVideo.pause();//暂停
      thePlay.style.setProperty('background',"url('/static/img/u1709.png') no-repeat")
      thePlay.style.setProperty('background-size',"100%")
      }
    }
    
  }
  
  handleGetDetail = () => {
    console.log(this.state.eventId)
    reportApi.getDetail({
      id:this.state.eventId
    }).then((res) => {
       /* this.state.currentRow = res.data.content
        console.log(this.state.currentRow)
        var obj = Object.entries(this.state.currentRow)
        console.log(obj) */
        /* this.state.dataSource = res.data.content
        console.log(this.state.dataSource) */
        /* for (let key in Object.keys(this.state.currentRow)){
         
          
        } */
        
        const first = new Array(10);
        let yq = 0
        let zzb = 'false'
        let fzr = 'false'
        
        for (let a in res.data.content) {
          
          
          
          if (a === 'code') {
            
            first[0] = <Col key={a} span={12}><RatelItem label="事件编号：" content={<div><p>{res.data.content[a]}</p></div>}/></Col> 
          }
          if (a === 'status') {
            let type = this.getEventType(res.data.content[a])
            first[1]=(<Col key={a} span={12}><RatelItem label="事件状态：" content={<div><p>{this.getEventType(res.data.content[a])}</p></div>}/></Col>) 
          }
          if (a === 'name') {
           
            first[2]=(<Col key={a} span={12}><RatelItem label="事件标题：" content={<div><p>{res.data.content[a]}</p></div>}/></Col>) 
          }
          if (a === 'eventType') {
            
            first[3]=(<Col key={a} span={12}><RatelItem label="事件类型：" content={<div><p>{res.data.content[a].name}</p></div>}/></Col>) 
          }
          if (a === 'eventDesc') {
            
            let voice = []
            for (let d in res.data.content['voices']){
                /* voice.push(<audio key={d} src={"/report/"+res.data.content['voices'][d]} id={d}/>) */
                
                
                voice.push(<div className="video-warp" id="video-warp">
                <video className="allVideo" id={'myVideo'+d} key={d} controls="controls" style={{display:'none'}} name="media"><source src={"/report/"+res.data.content['voices'][d]} type="audio/mpeg"/></video><div className="controls" id="controls"><i className="pointer" id={"play"+d} onClick={this.playVideo}/><span id={"play"+d} style={{color:'#4378BD'}} onClick={this.playVideo}>播放</span></div></div>)
            }
            //<video controls="controls"   poster={require('assets/images/成功.png')} name="media"><source src="http://localhost:8001/static/img/ADAMAS.mp3" type="audio/mpeg"/></video>
            
            
            
            
            first[4]=(<Col key={a} span={12}><RatelItem label="事件描述：" content={<div><span>{res.data.content[a]}{(voice !== null &&voice.length>0 && res.data.content[a]!==null && res.data.content[a]!=='')? "|":''} </span>{voice}</div>}/></Col>) 
          }
          if (a === 'findTime'){
            first[5]=<Col key={a} span={12}><RatelItem label="上报时间：" content={<div className="dTxt01"><p>{res.data.content[a]}</p></div>}/></Col>
          }
          if (a === 'advise') {
           
            first[6]=(<Col key={a} span={12}><RatelItem label="处理建议：" content={<div><p>{res.data.content[a]}</p></div>}/></Col>) 
          }
          if (a === 'eventAddress') {
           
            first[7]=(<Col key={a} span={12}><RatelItem label="事件地点：" content={<div><p>{res.data.content[a]}</p></div>}/></Col>) 
          }
         if (a === 'recommendDept') {
            let dept = ""
            if (res.data.content[a].length>2 && res.data.content[a] !== null) {
              for (let d in res.data.content[a]){
                  dept += res.data.content[a][d].name + "、"
              }
              dept = dept.substr(0,dept.length-1)
            }
            
          
           first[8]=(<Col key={a} span={12}><RatelItem label="建议参与部门：" content={<div><p>{dept}</p></div>}/></Col>) 
         }
            if (a === 'createUserName') {
              
              first.push(<Col key={a} span={12}><RatelItem label="上报人：" content={<div><p>{res.data.content[a]}</p></div>}/></Col>) 
            }
            
            //图片
            if (a === 'storageList'){
                this.setState({second:res.data.content[a]})
            }
            
            
            //签收情况
            if (a === 'ynWcInfoList'){
              for (let b in res.data.content[a]) {
                if (this.state.userInfo.deptId === res.data.content[a][b].departmentId) {
                  if (res.data.content[a][b].deptType === '1') {
                    
                    zzb = 'true'
                  }
                  if (res.data.content[a][b].leaderId === null) {
                    fzr = 'true'
                  }
                }
                
              }
              this.setState({third:res.data.content[a]})
              
            }
            
            if (this.getNowFormatDate()>res.data.content['changeTimeLimit']) {
              yq = 1;
            }
           
            
          
        }
       if (res.data.content['ynWcInfoList'] !==null && res.data.content['ynWcInfoList'].length>0){
         this.setState({infoCreatTime:res.data.content['ynWcInfoList'][0].createTime})
       }
        this.setState({buttonList:this.getButtonList(res.data.content['status'],yq,zzb,fzr)})
        this.setState({timeLimit:res.data.content['changeTimeLimit']})
        
        //console.log(this.state.second)
        this.setState({first:first})
        //this.state.dataSource = first
    }).catch((error) => {
      
      console.log(error)
    })
  }
  
//zyx 2020.06.23
setModalFeedBackVisible(modalFeedbackVisible) {
  this.setState({ modalFeedbackVisible })
}

rctification  = (id) => {
  this.setState({
    modalFeedbackVisible: true,
    feedBackId: id,
    operateType:'2'
  })
}

feedback = (id) => {
  this.setState({
    modalFeedbackVisible: true,
    feedBackId: id,
    operateType:'3'
  })
}
houducha = (id) => {
  this.setState({
    modalFeedbackVisible: true,
    feedBackId: id,
    operateType:'4'
  })
}

/* 无需整改 */
wuxuzhenggai(id) {
  console.log(id)
  this.setState({ modalEditable: true })
  this.setModalVisible3(true)
}
/* 无需整改 */
setModalVisible3(modalVisible3) {
  this.setState({modalVisible3})
}
/* 无需整改 */
noChangeSubmit = (values) => {
  let id = this.state.eventId;
  let status = '7';
   reportApi.updateEvent({id: id,status:status},() => {
        this.setModalVisible3(false)
        this.goBack();
    })
}

/* 提醒 */
reminds = (id) => {
  console.log(id)
  this.setState({ modalEditable: true })
  this.setModalVisible4(true)
}
/* 提醒  */
setModalVisible4(modalVisible4) {
  this.setState({modalVisible4})
}
/* 提醒 */
remindSubmit = (values) => {
  let id = this.state.eventId;
   reportApi.remind({eventId: id},() => {
        this.setModalVisible4(false)
        this.goBack();
    })
}

getImageList = (result, msg) => {

  this.setState({
    fileList: msg
  })
  msg.forEach(image => {
    console.log(image.response);
  });
}

onFeedSaveItem = (values) => {
  reportApi.feedback(values,(res) => {
    this.setModalFeedBackVisible(false);
   // this.getData();
   this.goBack();
 });
}
//dyp
//签收
onqsBtn(record) {
  console.log(record)
  this.setState({recordId:record})
  this.setModalVisible1(true)
  this.setState({ modalEditable: true })
  axios.get('/api/buser/find').then((res) => {
    if (res) {
      this.setState({
        recordList: res.data.content
      });
    }
  })

}
setModalVisible1(modalVisible1) {
  this.setState({modalVisible1})
}
onSaveMenuqs = (values) => {
  let id = this.state.recordId;
  let param = {id:id,user:values};
  // signpersion(param).then((res) => {
  //   if (res) {
  //     this.setModalVisible1(false)
  //     this.getData();
  //     this.goBack();
  //   } else {
  //     this.setModalVisible1(false)
  //   }
  // })
  signpersion(param, (res) => {
    if (res) {
      this.setModalVisible1(false)
      this.goBack();
    } else {
      this.setModalVisible1(false)
    } 
  })
 

}
changeRecordList = (value) => {
  axios.get('/api/buser/find', { params: {name: value} }).then((res) => {
    if (res) {
      console.log(res)
      this.setState({
        recordList : res.data.content
      })
    }
  })
}

allDeptList = () => {
  reportApi.listApi({}, (res) => {
    //console.log(res)
    this.setState({
      allDeptList: res
    })
  })
}

//分派
onSaveMenu = (values) => {
  let id = this.state.recordId;
  //this.setState({currentRow: Object.assign(this.state.currentRow, values)})
  let statusPassTime = moment(values.changeTimeLimit).format('YYYY-MM-DD');
  values.changeTimeLimit=statusPassTime
  let param = values
  const de ={id:'',name:''};
  const deptMap = {}
  for (let j=0;j<param.dept1.length;j++) {
    deptMap[param.dept1[j]]=true
  }
  this.state.allDeptList.map(item => {
    /* if (deptMap[item.id]){
      de.id=item.id
      de.name=item.name
    } */
    if (item.id === param.dept1) {
      de.id=item.id
      de.name=item.name
    }
  })
  const de1 =[];

  const deptMap1 = {}
  if (param.dept2) {
    for (let j=0;j<param.dept2.length;j++) {
      deptMap1[param.dept2[j]]=true
    }
    this.state.allDeptList.map(item => {
      if (deptMap1[item.id]){
        de1.push({id:item.id,name:item.name})
      }
    })
  }
  
  const de2 =[];

  const deptMap2 = {}
  if (param.dept3) {
    for (let j=0;j<param.dept3.length;j++) {
      deptMap2[param.dept3[j]]=true
    }
    this.state.allDeptList.map(item => {
      if (deptMap2[item.id]){
        de2.push({id:item.id,name:item.name})
      }
    })
  }
  reportApi.assignment(Object.assign(values, {id:id,dept1: de,dept2:de1,dept3:de2}), (res) => {
      if (res) {
        this.setModalVisible2(false)
        this.goBack();
      } else {
        this.setModalVisible2(false)
      }   
    })

}

onAddBtnassign(record) {
  console.log(record)
  this.setState({recordId:record})
  this.setState({ modalEditable: true })
  this.setModalVisible2(true)

}

setModalVisible2(modalVisible2) {
  const { currentRow } = this.state
  currentRow.pointType = ''
  if (modalVisible2) {
    treeListApi({}, (res) => {
      this.setState({
        treeDataSource: res,
      })
    })
  }
  this.setState({ modalVisible2, currentRow, pointList: [] })
}

onChangepoint = e => {
  console.log('radio checked', e.target.value);
  const { currentRow } = this.state
  const pointType = e.target.value
  currentRow.pointType = pointType
  currentRow.pointDetail=''
  this.setState({ currentRow }, () => {
    axios.get('/api/point/list', { params:{ pointType: pointType } }).then((res) => {
      if (res) {
        this.setState({
          pointList: res.data.content
        });
      }
    })
  })
};
disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().startOf("day");
}


  render() {
    
    const {dataSource,second,third,operateList,currentRow,treeDataSource,timeLimit,infoCreatTime} = this.state
    const Step = Steps.Step;
    
    
   return (
   <div><div className="theTitle"><Button className="theButton" type="ghost" onClick={this.goBack}>返回</Button></div>
   <div className="card-container">
      <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="详细信息" key="1">
            <div className="card-content tbLast tbTopimg">
              <Row>
                {
                  this.state.first
                  }
                
              </Row>
            </div>
                  <Modal
                    className="imgCon"
                      visible={this.state.imgShow}
                      transparent
                      maskClosable={true}
                      onClose={this.onClose}
                      title="查看图片"
                      onCancel={() => {
                        this.onClose()
                      }}
                      footer={[]}
                      >
                     <img style={{width:'100%'}} src={this.state.imgSrc} alt="" />
                    </Modal>
            <div className="card-content1 tbLast">
              <Row>
                <Col span={24}>
                <RatelItem labelWith={12.5} label="图片：" content=
                {
                  second && second.map((v,i) => {
                    return  <span key={i} className="theImage"><img style={{width: 150}} src={"/report/"+v.attrPath} onClick={this.imgShow}   alt={v.name}/></span>
                  })
                }
                />
                </Col>
              </Row>
            </div>
            <div className="card-content1 tbLast">
              <Row>
                <Col span={24}>
               {
                 infoCreatTime !== null  && infoCreatTime !== undefined
                   ?<RatelItem  labelWith={12.5} label={'分派时间：'} content={<div><span className="card-content2">{infoCreatTime}</span></div>}/>:''
               }
                
                {
                  third && third.map((v,i) => {
                    
                    if (v.operateType === '1' || v.operateType === '0'){
                      if (v.enable === '1') {
                        return  <RatelItem key={i} labelWith={12.5} label={this.getDeptType(v.deptType)+'：'} content={<div><span className="card-content2">{v.deptName}</span><span className="card-content2" style={{paddingLeft:'10%'}}>{v.leaderName}</span><span className="card-content2" style={{paddingLeft:'20%'}} >{v.leaderPhone !==''?v.leaderPhone:'无'}</span></div>}/>
                      }
                      
                    }
                    
                  })
                }
                {
                  timeLimit !== null 
                   ?<RatelItem  labelWith={12.5} label={'整改时效：'} content={<div><span className="card-content2">{timeLimit}</span></div>}/>:''
                }
                
                </Col>
              </Row>
            </div>
            
            {
              third && third.map((v,i) => {
                if (v.operateType !== '1' && v.operateType !== '0'){
                  return (
                    <div key={i} className="card-content1 tbLast">
                      <span className="diamond">&nbsp;</span><span style={{paddingLeft:'1%'}}>{this.getOperateType(v.operateType)}情况</span>
                      <Row style={{paddingTop:'1%'}}>
                        <Col span={24}>
                          <RatelItem labelWith={12.5} label={this.getOperateType(v.operateType)+"时间："} content={<div><p>{v.updateTime}</p></div>}/>
                          <RatelItem labelWith={12.5} label={this.getOperateType(v.operateType)+"图片："} 
                          content={<div>{(v.storageList && v.storageList.length>0) ?<span>{v.storageList.map((value,key) => { return <span key={key} className="theImage"><img style={{width: 150}} src={"/report/"+value.attrPath} onClick={this.imgShow}  alt={value.name}/></span> }) }</span>:'无'}
                            </div>
                           }
                            />
                          <RatelItem labelWith={12.5} label={this.getOperateType(v.operateType)+"内容："} content={<div><p>{v.description}</p></div>}/>
                        </Col>
                      </Row>
                    </div>
                  )
                }
                
              })
            }
            <div style={{paddingBottom:'3%'}}>{this.state.buttonList}</div>
              
          </TabPane>
          <TabPane tab="处理进度" key="2">
            <div className="card-content">
            <Timeline>
            { 
              operateList && operateList.map((v,i) => {
                 return <div key={i} className="card-content1 timeSty01">
                   <span className="dateLeft">{v.createTime.length>10 ?this.changeTime(v.createTime):v.createTime}</span><span style={{paddingLeft:'1%'}}><Timeline.Item className="creat_time" dot={<img src={require('assets/images/success.png')} style={{width: 25,height:25}} />}><strong>{v.title} </strong> {v.description} </Timeline.Item></span>
                 </div>
               
              })
              }
              </Timeline>
             
             </div>
          </TabPane>
        </Tabs>
    </div>

    <FeedbackModal
          visible={this.state.modalFeedbackVisible}
          submitMap={this.onFeedSaveItem}
          onCancel={() => {
            this.setModalFeedBackVisible(false)
          }}
          onFeedBacCancel={() => {
            this.setModalFeedBackVisible(false)
          }}
          feedBackId={this.state.feedBackId}
          operateType={this.state.operateType}
          // submitFeedBack={() => this.submitFeedBack}
        />
        <CollectionCreateFormqs
            visible={this.state.modalVisible1}
            editable={this.state.modalEditable}
            onCancel={() => {
              this.setModalVisible1(false)
            }}
            submitMap={this.onSaveMenuqs}
            currentDetailData={currentRow}
            recordList={this.state.recordList}
            searchpersion={this.searchpersion}
            changeRecordList={this.changeRecordList}
          />
          
          <CollectionCreateFormassign
            visible={this.state.modalVisible2}
            editable={this.state.modalEditable}
            submitMap={this.onSaveMenu}
            treeDataSource={treeDataSource}
            onCancel={() => {
              this.setModalVisible2(false)
            }}
            //roleListData={roleListData}
            currentDetailData={currentRow}
            onChangepoint={this.onChangepoint}
            pointList={this.state.pointList}
            disabledDate = {this.disabledDate}
          />
          
          <CollectionCreateForNoChangemassign
             visible={this.state.modalVisible3}
             editable={this.state.modalEditable}
             submitMap={this.noChangeSubmit}
             onCancel={() => {
               this.setModalVisible3(false)
             }}
          />
          
          <CollectionCreateForRemindmassign
             visible={this.state.modalVisible4}
             editable={this.state.modalEditable}
             submitMap={this.remindSubmit}
             onCancel={() => {
               this.setModalVisible4(false)
             }}
          />
    </div>
    )
  }
}

export default Detail;


 

/* const colums =({title,title1,content,content1}) => {
    return (
    <Row className="row-content">
      <Col span={4} className="col-content-litile">{title}</Col>
      <Col span={8} className="col-content-many">{content}</Col>
      <Col span={4} className="col-content-litile">{title1}</Col>
      <Col span={8} className="col-content-many">{content1}</Col>
    </Row>
    )
}; */

const FeedbackModal = ({ visible, editable, submitMap, onFeedBacCancel, currentDictRow, feedBackId,operateType }) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  };

  form.resetFields();
  form.setFieldsValue(currentDictRow);
 let title = '';
 
 if (operateType === '3') {
  title="事件反馈"
} else if (operateType === '4') {
  title="后督察"
} else if (operateType === '2'){
  title="整改"
}
  return (

    <Modal
    maskClosable={false}
      visible={visible}
      title={title}
      onCancel={onFeedBacCancel}
      width={800}
      destroyOnClose={true}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            values.operateType = operateType;
            values.eventId = feedBackId;
            if (values.storageList !== undefined) {
              let list = [];
              values.storageList.map((item, index) => {
                if (item.status === 'done') {
                  list.push({ "id": item.response.content.id });
                }
              });
              if (list !== undefined && list.length > 0) {
                values.storageList = list;
                submitMap(values);
                
              } else {
                message.error("至少正确上传一张图片");
              }
    
            }
            // submitMap(values);
          })
          .catch(info => {
            console.log('校验失败:', info);
          });
      }}
    >
      {
        operateType === '4' ? <div className="infoDiv"><img className="infoImg" src={require('assets/images/u1687.png')} /><span>确定改事件需要重新整改？操作后该事件将直接分派到原部门。</span></div> :  null
      }
      <Form
        form={form}
        {...layout}
        // name="serverDetail"
        initialValues={currentDictRow}
      >
        <Form.Item
          name="storageList"
          label="图片"
          rules={[
            { required: true, message: '请上传相关图片' }]}
        >
        <Photo />
        </Form.Item>
        <Form.Item label="处理意见" name="description" rules={[{ required: true }]}>
          <TextArea rows={4} placeholder="请输入事件描述,至多100个字符" maxLength="100"/>
        </Form.Item>

      </Form>
    </Modal>
  );
}

const CollectionCreateFormassign = ({disabledDate,visible, editable, roleListData, detpTreeData, submitMap, onCancel, currentDetailData,onChangepoint,pointList,treeDataSource}) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: {span: 5},
    wrapperCol: {span: 18},
  };
  //form.resetFields()
  form.setFieldsValue(currentDetailData)
  const aaa = () => {
    form.resetFields()
    onCancel()
  }
  return (
    <Modal
    maskClosable={false}
      visible={visible}
      title="事件分派"
      onCancel={aaa}
      width={800}
      destroyOnClose={true}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            submitMap(values);
          })
          .catch(info => {
            console.log('校验失败:', info);
          });
      }}
    >
      <Form
        form={form}
        {...layout}
        name="serverDetail"
        initialValues={currentDetailData}
      >
        <Form.Item label="点位类型：" name="pointType" rules={[{required: true}]} onChange={onChangepoint}>
          <Radio.Group >
            <Radio value='1'>示范点</Radio>
            <Radio value='2'>随机点</Radio>
            <Radio value='3'>其它社区</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="选择点位:" name="pointDetail" rules={[{required: true}]}>
          <Select defaultValue="" >
            {(pointList || []).map((item, index) => {

              return (

                <Option value={item.pointId}>{item.point}</Option>
              )
            })}
          </Select>
        </Form.Item>

        <Form.Item label="牵头部门:" name="dept1" rules={[{required: true}]}>
          <TreeSelect
            showSearch={false}
            placeholder="请选择建议牵头部门"
            treeData={treeDataSource}
            disabled={!editable}/>
        </Form.Item>

        <Form.Item label="责任部门:" name="dept2">

          <TreeSelect
            
            showSearch={true}
            multiple
            placeholder="请选择建议责任部门"
            treeData={treeDataSource}
            disabled={!editable}/>

        </Form.Item>

        <Form.Item label="配合部门" name="dept3" >
          <TreeSelect
           
            showSearch={false}
            multiple
            placeholder="请选择建议配合部门"
            treeData={treeDataSource}
            disabled={!editable}/>
        </Form.Item>
        <Form.Item label="整改时限" name="changeTimeLimit" rules={[{required: true}]}>
          <DatePicker format='YYYY-MM-DD' disabledDate={disabledDate}/>
        </Form.Item>
      </Form>
    </Modal>
  );
          }
          
/* 无需整改 */
const CollectionCreateForNoChangemassign = ({visible, editable, roleListData, detpTreeData, submitMap, onCancel, currentDetailData,onChangepoint,pointList,treeDataSource,feedBackId}) => {
   const [form] = Form.useForm();
   const layout = {
     labelCol: {span: 5},
     wrapperCol: {span: 18},
   };
   form.setFieldsValue(currentDetailData)
   return (
     <Modal
     maskClosable={false}
       visible={visible}
       title=""
       onCancel={onCancel}
       width={400}
       destroyOnClose={true}
       onOk={() => {
             submitMap();
       }}
     >
     <div>确定后此事件无需进行整改</div>
     </Modal>
   );
  }
 /* 提醒 */
  const CollectionCreateForRemindmassign = ({visible, editable, roleListData, detpTreeData, submitMap, onCancel, currentDetailData,onChangepoint,pointList,treeDataSource,feedBackId}) => {
     const [form] = Form.useForm();
     const layout = {
       labelCol: {span: 5},
       wrapperCol: {span: 18},
     };
     form.setFieldsValue(currentDetailData)
     return (
       <Modal
       maskClosable={false}
         visible={visible}
         title=""
         onCancel={onCancel}
         width={400}
         destroyOnClose={true}
         onOk={() => {
               submitMap();
         }}
       >
       <div>确定提醒</div>
       </Modal>
     );
}
