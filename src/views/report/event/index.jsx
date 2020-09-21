import React from 'react'
import { Card,  Col,  Divider,  Form,  Input,  InputNumber,  message,  Modal,  Row,  TreeSelect,  Select,  Upload,  Layout,  Menu,  Breadcrumb,  DatePicker, Button, Radio, Avatar } from 'antd'
import * as service from "../../../services/report"
import {treeListApi} from "../../../services/report";
import {ParamUtils, RateUtils,axios} from '@utils'
import { AddButton,  CommonTable,  ExportButton,  HrefDelButton,  HrefEditButton,  RatelPage,  SearchButton,  HrefViewButton } from "@/components";
import './index.less'
import moment from "moment";
import * as roleApi from "../../../services/system/role";
import Photo from '../../../components/Photo'
import CollectionCreateFormqs from '../sign/CollectionCreateFormqs'
import { signpersion } from "../../../services/system/dept"

import * as Storage from "../../../utils/Storage";
import {createHashHistory} from 'history';
const { Header, Content, Footer } = Layout;
const {RangePicker} = DatePicker;
const { Option } = Select;
const TextArea = Input.TextArea;
const {SHOW_PARENT,SHOW_ALL} = TreeSelect;


class Eventlist extends React.Component {
  searchForm = React.createRef();

  constructor(props) {
    super(props);
    
    this.state = {
      statusList:[{id:"0",name:"全部"},{id:"1",name:"待分派"},{id:"2",name:"待签收"},{id:"3",name:"整改中"},{id:"4",name:"已反馈"}],
      statusSelect:[{id:"0",name:"全部"},{id:"1",name:"待分派"},{id:"2",name:"待签收"},{id:"3",name:"整改中"},{id:"4",name:"已整改"},{id:"5",name:"已反馈"},{id:"6",name:"后督察"},{id:"7",name:"无需整改"}],
      userInfo: Storage.getUserInfo(),
      ext3:'0',
      ext5:'zzbfzr',
      currentRow: {},
      allDeptList:'',
      eventTypeList:[],
      rowName: null,
      dataSource: [],
      modalVisible: false,
      columns: this.columns,

      modalFeedbackVisible: false,
      fileList: [],
      feedBackId: "",
      operateType:"",

      treeDataSource: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      recordList: [],
      InputValue: '' ,
      modalVisible1:false,

      modalVisible2:false,
       //无需整改
      modalVisible3:false,
      //提醒
      modalVisible4:false,
      pointList:[],
      recordId:''


    }
  }

  componentDidMount() {
    this.getData()
    //eventTypeList  事件类型
    this.eventTypeList()
    
    this.allDeptList()
    
    
  }

  setModalVisible(modalVisible) {
    if (modalVisible) {
      treeListApi({}, (res) => {
        this.setState({
          treeDataSource: res,
        })
      })
    }
    this.setState({modalVisible})
  }

  getCurrentDate(separator=''){

    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();

    return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
  }
  onAddBtn() {
    this.setState({currentRow: {}})
    this.setModalVisible(true)
    this.setState({modalEditable: true})
  }


  onEditBtn(record) {
    //console.log(record);
    
    record.eventTypes=record.eventType.id

    let re = []
    let x = JSON.parse(record.ext4)
    x.forEach(function (data, index) {
      re.push(data.id)
    })
    record.recommendDepts = re;
    
    
    this.setState({currentRow: record, modalEditable: true})
    this.setModalVisible(true)
  }
  
  onViewClick(record) {
    
    record.eventTypes=record.eventType.id

    let re = []
    let x = JSON.parse(record.ext4)
    x.forEach(function (data, index) {
      re.push(data.id)
    })
    record.recommendDepts = re;
    
    this.setState({currentRow: record, modalEditable: false})
    this.setModalVisible(true)
  }
  
  onViewClick1(record) {
    const history = createHashHistory();
    history.push('/detail?'+record.id);
  }
 

  onSaveItem = (values) => {
    //console.log(values);
    this.setState({currentRow: Object.assign(this.state.currentRow, values)})
    
    let param = values
    const de =[];
 
    const  eventType = {id: param.eventTypes};
   
    const deptMap = {}
    if (param.recommendDepts !== null && param.recommendDepts !== undefined && param.recommendDepts.length>0){
      for (let j=0;j<param.recommendDepts.length;j++) {
        deptMap[param.recommendDepts[j]]=true
      }
      this.state.allDeptList.map(item => {
        if (deptMap[item.id]){
          de.push({id:item.id,name:item.name})
        }
      })
    }
  

    
    if (this.state.currentRow.id) {
      service.updateEvent(Object.assign(this.state.currentRow, {eventType: eventType, recommendDept: de}), () => {
        this.setModalVisible(false)
        this.getData()
      })
    } else {
      values.findTime = this.getCurrentDate('-');
      values.status = 1
      values.voices = []
      service.addEvent(Object.assign(values, {eventType: eventType, recommendDept: de}), () => {
        this.setModalVisible(false)
        this.getData()
      })
    }
}

//查询
onHandleSearch = () => {
    this.setState({
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10
    }
  },
      () => {
        this.getData()
      }
      )
  
 
}
//重置
onResetSearch= () => {
  this.searchForm.current.resetFields();
  this.setState({ 
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10
    }
  },
    () => {
      this.getData()
    })  
  
}

getSearchParams() {
let values = this.searchForm.current.getFieldsValue();
let params = ParamUtils.getPageParam(this.state.pagination, this.state.sorter)
  params.eventName=values.name;
  params.createUserName=values.createUserName;
  params.eventType=values.eventType;
  
  if (values.findTime) {
    params.findTime = [];
    params.findTimeStart = moment(values.findTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
    params.findTimeEnd = moment(values.findTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
  }
  params.ext3 = this.state.ext3
  params.ext5 = this.state.ext5
  params.status=values.eventStatus;
 
return params
}

eventTypeList = () => {
service.eventTypeList({}, (res) => {
  //console.log(res)
  let etlist = res
  etlist.unshift({id:"",name:"请选择"})
  this.setState({
    eventTypeList: etlist
  })
})
}
allDeptList = () => {
  service.listApi({}, (res) => {
    //console.log(res)
    this.setState({
      allDeptList: res
    })
  })
}

getData = () => {
    console.log(this.state.userInfo);
  let _this = this;
  service.eventList(this.getSearchParams(), (res) => {
    let newlist = res.content
    if (newlist!==null&&newlist!==undefined) {
      for (let i=0;i<newlist.length;i++){
        if (newlist[i].ynWcInfoList !==null && newlist[i].ynWcInfoList.length>0 && newlist[i].ynWcInfoList !==undefined){
          let operate = '1';
          for (let a=0;a<newlist[i].ynWcInfoList.length;a++) {
            
            if (newlist[i].ynWcInfoList[a].operateType === '2') {
              
              operate= '2'
              let changeTimeLimit = newlist[i].changeTimeLimit+" 23:59:59"
              if (newlist[i].ynWcInfoList[a].createTime > changeTimeLimit) {
                newlist[i].yq = 1;
                break;
              }
            } 
              if (operate !== '2') {
                if (this.getNowFormatDate()>newlist[i].changeTimeLimit +" 23:59:59"){
                  newlist[i].yq = 1;
                }
              } else {
                newlist[i].yq = 2;
              }
            
          }
        } else {
              if (this.getNowFormatDate()>newlist[i].changeTimeLimit +" 23:59:59"){
                newlist[i].yq = 1;
              }
            }
        
      }
    }
    
    
    
    newlist.map(newListItem => {
      //debugger;
      let ynWcInfoList = newListItem.ynWcInfoList;
      let flag = "false";
      let qsflag = "false";
      let zgflag = "false";
      if (ynWcInfoList !== undefined && ynWcInfoList.length>0){
      
           for (let j=0;j<ynWcInfoList.length;j++) {
             let itemx = ynWcInfoList[j];
           
             if (itemx.operateType === "0" || itemx.operateType === "1") {
               if (_this.state.userInfo.deptId === itemx.departmentId) {
                 if (itemx.deptType === "1") {
                   flag="true";
                   break;
                 } 
                 //debugger;
               } 
             } 
             
           }
           
           for (let j=0;j<ynWcInfoList.length;j++) {
             let itemx = ynWcInfoList[j];
           
             if (itemx.operateType === "0" || itemx.operateType === "1") {
               if (_this.state.userInfo.deptId === itemx.departmentId && itemx.leaderId === null) {
                 
                 //debugger;
                   qsflag="true"
                   break;
                
               } 
             }
             
           }
           
           for (let j=0;j<ynWcInfoList.length;j++) {
             let itemx = ynWcInfoList[j];
           
             if (itemx.operateType === "0" || itemx.operateType === "1") {
               if (_this.state.userInfo.deptId === itemx.departmentId && itemx.leaderId !== null && _this.state.userInfo.id === itemx.leaderId) {
                 
                 //debugger;
                 if (itemx.deptType === "1") {
                   zgflag="true"
                   break;
                }
               } 
             }
             
           }
      
        
      } 
      newListItem.deptTypeStatus = flag
      newListItem.qsflag = qsflag
      newListItem.zgflag = zgflag
    });
    
    console.log(newlist);
    this.setState({
      dataSource: newlist,
      pagination: Object.assign(this.state.pagination, {
        total: res.totalElements
      })
    })
  })
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

onExportBtn() {
  /*service.downloadEvent(this.getSearchParams(), (data) => {
    RateUtils.downloadFile(data, '事件数据', 'xlsx')
  })*/
  let values = this.searchForm.current.getFieldsValue();
  let params = ParamUtils.getPageParam(this.state.pagination, this.state.sorter)
  params.eventName=values.name;
  params.createUserName=values.createUserName;
  params.eventType=values.eventType;
  params.status=values.eventStatus;
  

 if (values.findTime) {
    params.findTime = [];
    params.findTimeStart = moment(values.findTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
    params.findTimeEnd = moment(values.findTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
  }
  params.ext3 = this.state.ext3
  params.ext5 = this.state.ext5
  
  service.downloadEvent(params).then(result => {
    RateUtils.downloadFile(result.data, '事件数据', 'xlsx')
  }).catch(() => {
    message.error("数据下载错误")
  }) 
}

handleClick = ({key}) => {
   this.setState(
  { ext3: key },
  () => {
    this.searchForm.current.resetFields();
    this.getData();
  }
)
  
 
}

setModalFeedBackVisible(modalFeedbackVisible) {
  this.setState({ modalFeedbackVisible })
}

rctification  = (record) => {
  this.setState({
    modalFeedbackVisible: true,
    feedBackId: record.id,
    operateType:'2'
  })
}

feedback = (record) => {
  this.setState({
    modalFeedbackVisible: true,
    feedBackId: record.id,
    operateType:'3'
  })
}
houducha = (record) => {
  this.setState({
    modalFeedbackVisible: true,
    feedBackId: record.id,
    operateType:'4'
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
  service.feedback(values,(res) => {
    this.setModalFeedBackVisible(false);
    this.getData();
 });
}

/* 无需整改 */
wuxuzhenggai(record) {
  console.log(record.id)
  this.setState({recordId:record.id})
  this.setState({ modalEditable: true })
  this.setModalVisible3(true)
}
/* 无需整改 */
setModalVisible3(modalVisible3) {
  this.setState({modalVisible3})
}
/* 无需整改 */
noChangeSubmit = (values) => {
  let id = this.state.recordId;
  let status = '7';
   service.updateEvent({id: id,status:status},() => {
        this.setModalVisible3(false)
        this.getData()
    })
}

/* 提醒 */
reminds = (record) => {
  console.log(record.id)
  this.setState({recordId:record.id})
  this.setState({ modalEditable: true })
  this.setModalVisible4(true)
}
/* 提醒  */
setModalVisible4(modalVisible4) {
  this.setState({modalVisible4})
}
/* 提醒 */
remindSubmit = (values) => {
  let id = this.state.recordId;
   service.remind({eventId: id},() => {
        this.setModalVisible4(false)
        this.getData()
    })
}
//刁

//签收
onqsBtn(record) {
  console.log(record.id)
  this.setState({recordId:record.id})
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
    if (this.state.currentRow.id) {
      signpersion(param,(res) => {
        this.setModalVisible1(false)
        this.getData();    
      })
    } else {
      signpersion(param,(res) => {
        this.setModalVisible1(false)
        this.getData();    
      })
    }
  
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
  


  if (this.state.currentRow.id) {
    service.assignment(Object.assign(this.state.currentRow, {id:id,dept1: de,dept2:de1,dept3:de2}), () => {
      this.setModalVisible2(false)
      this.getData();   
    })
  } else {
    service.assignment(Object.assign(values, {id:id,dept1: de,dept2:de1,dept3:de2}), () => {
      this.setModalVisible2(false)
    this.getData();   
    })
  }

}

onAddBtnassign(record) {
  console.log(record.id)
  this.setState({recordId:record.id})
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
    axios.get('/api/point/list', { params: { pointType: pointType } }).then((res) => {
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
const {dataSource, currentRow, pagination,treeDataSource,ext3,userInfo} = this.state
const columns = [
  {
    title: '序号',
    key: 'index',
    render: (text, record, index) => (
      <span>{index + 1}</span>
    )
  },
  {
    title: '事件编号',
    dataIndex: 'code',
    key: 'code',
    render: (text, record, index) => {
      return (
        <a href='javascript:void(0);' onClick={() => this.onViewClick1(record)} >{text}</a>
      )
    }
  },
  {
    title: '事件标题',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '事件类型',
    dataIndex: 'eventType',
    key: 'eventType',
    render: (text, record, index) => {
      return (
        record.eventType !== null ? record.eventType.name :null
      )
    }
  },
  {
    title: '事件地点',
    dataIndex: 'eventAddress',
    key: 'eventAddress',
  },
  {
    title: '上报时间',
    dataIndex: 'findTime',
    key: 'findTime',
    render: (text, record, index) => {
      return (
        record.findTime  ? moment(record.findTime).format('YYYY-MM-DD') : ''
       /* record.qsflag === "true"?"111":"22"*/
     
      )
    }
  },
  {
    title: '上报人',
    dataIndex: 'createUserName',
    key: 'createUserName',
  },
  {
    title: '事件状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record, index) => {
       if (record.status === '1') {
        //1待分派，2待签收，3待整改，4已整改，5已反馈 ，6后督察7无需整改
          return "待分派"
       } else if (record.status === '2'){
         if (record.yq ===1){
           return (<span>待签收<span className='span-red'>(逾期)</span></span>)
         } else {
           return "待签收"
         }
        
       } else if (record.status ===  '3'){
         if (record.yq ===1){
           return (<span>整改中<span className='span-red'>(逾期)</span></span>)
         } else {
           return "整改中"
         }
       } else if (record.status ===  '4'){
         if (record.yq ===1){
           return (<span>已整改<span className='span-red'>(逾期)</span></span>)
         } else {
           return "已整改"
         }
       } else if (record.status === '5'){
         if (record.yq ===1){
           return (<span>已反馈<span className='span-red'>(逾期)</span></span>)
         } else {
           return "已反馈"
         }
       } else if (record.status === '6'){
         if (record.yq ===1){
           return (<span>后督察<span className='span-red'>(逾期)</span></span>)
         } else {
           return "后督察"
         }
       } else if (record.status === '7'){
         if (record.yq ===1){
           return (<span>无需整改<span className='span-red'>(逾期)</span></span>)
         } else {
           return "无需整改"
         }
       } else {
         return ""
       }
    }
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => {
      if (userInfo.roles.findIndex((element) => (element === 'system')) === -1){
        return (
          <span>
            {
              record.status === '1' && userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1  ? (<HrefViewButton onClick={() => this.wuxuzhenggai(record)} label={'无需整改'}/>):null
            }
            {
              record.status === '1'  && userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1 ? (<Divider type='vertical'/>):null
            }
            {
              record.status === '1'  && userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1  ? (<HrefViewButton onClick={() => this.onAddBtnassign(record)} label={'分派'}/>):null
            }
            {
              record.status === '1'  && userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1  ? (<Divider type='vertical'/>):null
            }
            {
              record.status === '2'  && record.qsflag === "true"  ? (<HrefViewButton onClick={() => this.onqsBtn(record)} label={'签收'}/>):null
            }
            {
              record.status === '2' && record.qsflag === "true"  ? (<Divider type='vertical'/>):null
            }
            {
              record.status === '2'  && record.qsflag === "true"  && record.deptTypeStatus === "true"  ? (<HrefViewButton onClick={() => this.feedback(record)} label={'反馈'}/>):null
            }
            {
              record.status === '2'  && record.qsflag === "true"  && record.deptTypeStatus === "true"  ? (<Divider type='vertical'/>):null
            }
            {
              record.status === '3'  && record.zgflag === "true"    ? (<HrefViewButton onClick={() => this.rctification(record)} label={'整改'}/>):null
            }
            {
              record.status === '3'  && record.zgflag === "true"    ? (<Divider type='vertical'/>):null
            }
            {
              record.status === '5'   && userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1  ? (<HrefViewButton onClick={() => this.onAddBtnassign(record)} label={'再分派'}/>):null
            }
            {
              record.status === '5'   && userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1  ? (<Divider type='vertical'/>):null
            }
            

            {
              ((record.status === '2' || record.status === '3' ||record.status === '6')  && record.yq === 1) && userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1   ? (<HrefViewButton onClick={() => this.reminds(record)} label={'提醒'}/>):null
            }
            {
              ((record.status === '2' || record.status === '3' ||record.status === '6')  && record.yq === 1)  && userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1  ? (<Divider type='vertical'/>):null
            }
            {
              (record.status === '4')   && userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1 ? (<HrefViewButton onClick={() => this.houducha(record)} label={'后督察'}/>):null
            }
            {
              (record.status === '4')   && userInfo.roles.findIndex((element) => (element === 'zzbfzr')) !== -1 ? (<Divider type='vertical'/>):null
            }

            {/*<HrefViewButton onClick={() => this.onViewClick(record)} label={'查看'}/>
            <Divider type='vertical'/>
        
            <HrefEditButton onClick={() => this.onEditBtn(record)} label={'编辑'}/>*/}
            <HrefViewButton onClick={() => this.onViewClick1(record)} label={'查看'}/>
       
      </span>)
      } else {
        return (
          <span>

            {/*<HrefViewButton onClick={() => this.onViewClick(record)} label={'查看'}/>
            <Divider type='vertical'/>
        
            <HrefEditButton onClick={() => this.onEditBtn(record)} label={'编辑'}/>
            <Divider type='vertical'/>*/}
            <HrefViewButton onClick={() => this.onViewClick1(record)} label={'查看'}/>
       
      </span>)
      }
     
    }
  }]
const rowSelection = {
  onChange: this.onSelectChange
};
const formItemLayout = {
  labelCol: {
    xs: {span: 0},
    sm: {span: 0},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 24},
  },
};
return (
  <Layout className="event-layout">
    <Header className="ant-layout-header-menu" style={{ zIndex: 1, width: '100%' }}>
      <div className="logo" />
      <Menu theme="light" mode="horizontal" defaultSelectedKeys={['0']} onClick={this.handleClick}>
        {this.state.statusList.map(item => {
          return (
            <Menu.Item key={item.id}>{item.name}</Menu.Item>
          )
        })}
      </Menu>
    </Header>
    <Content className="site-layout" style={{ marginTop: 24 }}>
      <div className="site-layout-background" style={{ minHeight: 380 }}>
        <RatelPage className='page' inner>
          <div className='bonc-mung-role-list'>

          <Form ref={this.searchForm} name="searchForm"  className="ant-advanced-search-form" style={{paddingBottom: 15}} {...formItemLayout}>
            <Row gutter={24}>
              <Col span={5} offset={0} >
                <Form.Item name="name" label="事件标题">
                  <Input placeholder="输入名称搜索"/>
                </Form.Item>
              </Col>
              <Col span={5} offset={3} >
                <Form.Item name="createUserName"  label="上报人">
                  <Input placeholder="输入名称搜索"/>
                </Form.Item>
              </Col>
              {
                (ext3==='0')  ?   <Col span={5} offset={3} ><Form.Item  name="eventStatus" label="事件状态">
                  <Select allowClear placeholder="请选择"  >
                    {this.state.statusSelect.map(item => {
                      return (
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      )
                    })}
                  </Select>
                </Form.Item> </Col>: null
              }
              {
                (ext3==='0')  ?    <Col span={5} offset={0} >
                  <Form.Item  name="eventType" label="事件类型">
                    <Select allowClear placeholder="请选择"  >
                      {this.state.eventTypeList.map(item => {
                        return (
                          <Option key={item.key} value={item.id}>{item.name}</Option>
                        )
                      })}
                    </Select>
                  </Form.Item>
                </Col>: <Col span={5} offset={3} >
                  <Form.Item  name="eventType" label="事件类型">
                    <Select allowClear placeholder="请选择"  >
                      {this.state.eventTypeList.map(item => {
                        return (
                          <Option key={item.key} value={item.id}>{item.name}</Option>
                        )
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              }
             {
                (ext3==='0')  ?   <Col span={5} offset={3} ><Form.Item name="findTime"  label="上报时间">
                  <RangePicker format={'YYYY-MM-DD'}/>
                  </Form.Item></Col>:(ext3 === '2' || ext3 === '3')? <Col span={5} offset={0} ><Form.Item name="findTime"  label="整改时间">
                  <RangePicker format={'YYYY-MM-DD'}/>
                </Form.Item> </Col>:<Col span={5} offset={0} ><Form.Item name="findTime"  label="上报时间">
                  <RangePicker format={'YYYY-MM-DD'}/>
                </Form.Item>
                  
                </Col>
              } 
             {/* <Col span={5} offset={3} >
                { 
                  (ext3 === '2' || ext3 === '3')? <Form.Item name="findTime"  label="整改时间">
                    <RangePicker format={'YYYY-MM-DD'}/>
                  </Form.Item>:<Form.Item name="findTime"  label="上报时间">
                    <RangePicker format={'YYYY-MM-DD'}/>
                  </Form.Item>
                }
              </Col>*/}
              <Col span={5} offset={3} >

                <Form.Item wrapperCol={{
                  xs: {span: 24, offset: 0},
                  sm: {span: 24, offset: 0},
                }}>
                  <Button type="primary" icon={<i className="fa" style={{marginRight: 8}}/>}
                          className={'margin-right-10'} onClick={this.onHandleSearch}
                  >{ '查询'} </Button>
                  <Button type="primary" icon={<i className="fa" style={{marginRight: 8}}/>}
                          className={'margin-right-10'} onClick={this.onResetSearch}
                  >{ '重置'} </Button>
                </Form.Item>
              </Col>
            </Row>
            </Form>
         
         
            <Row style={{paddingBottom: 15}}>
              {
                (ext3==='0' ||   ext3==='1')  ?<Button type="primary" icon={<i className="fa fa-plus" style={{marginRight: 8}}/>}
                className={'button-color-sunset margin-right-10'}
                onClick={() => this.onAddBtn()} >{ '新增'} </Button>:null
              }
              {
                (ext3==='0')  ?<Button type="primary" icon={<i className="fa fa-download" style={{marginRight: 8}}/>}
                                       className={'button-color-cyan margin-right-10'}
                                       onClick={() => this.onExportBtn()} >{ '导出'} </Button> :null
              }
             {/* {
                (ext3==='0' ||   ext3==='1') ?<Button type="primary" icon={<i className="fa" style={{marginRight: 8}}/>}
                                                      className={'button-color-green margin-right-10'}
                                                      >{ '无需整改'} </Button>:null                
              } */}
              
              
            </Row>
{/* rowSelection={rowSelection}*/}
            <Row>
              <Col span={24}>
                <Card title="事件列表">
                  <CommonTable
                    rowKey={(r, i) => r.id}
                   
                    columns={columns}
                    dataSource={dataSource}
                    noSorterAll={true}
                    onChange={(pagination, filters, sorter, extra) => {
                      this.setState({pagination: pagination, sorter: sorter}, () => {
                        this.getData()
                      })
                    }}

                    rowClassName={(record) => {
                      return record.id === this.state.rowId ? 'clickRowStyl' : '';
                    }}
                    pagination={{
                      total: pagination.total,
                      current: pagination.current,
                      pageSize: pagination.pageSize
                    }}
                  />
                </Card>
              </Col>

            </Row>
          </div>
          <CollectionCreateForm
            visible={this.state.modalVisible}
            editable={this.state.modalEditable}
            submitMap={this.onSaveItem}
            onCancel={() => {
              this.setModalVisible(false)
            }}
            eventTypeList={this.state.eventTypeList}
            treeDataSource={treeDataSource}
            currentRow={currentRow}
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
  disabledDate = {this.disabledDate}          />
          
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

        </RatelPage>
      </div>
    </Content>
     
  </Layout>
 
)
}
}

export default Eventlist


const CollectionCreateForm = ({visible, editable, submitMap, onCancel, currentRow,eventTypeList,treeDataSource}) => {
const [form] = Form.useForm();
const layout = {
labelCol: {span: 5},
wrapperCol: {span: 18},
};

form.resetFields();
form.setFieldsValue(currentRow)

return (
<Modal
  maskClosable={false}
  visible={visible}
  title="事件管理"
  onCancel={onCancel}
  width={800}
  destroyOnClose={true}
  onOk={() => {
    form
      .validateFields()
      .then(values => {
        console.log(values.storageList);
        if (values.storageList !== undefined) {
          let list = [];
          values.storageList.map((item, index) => {
            if (item.status === 'done') {
              list.push({ "id": item.response.content.id });
            }
          });
          if (list !== undefined && list.length > 0) {
            values.storageList = list;
            
          } else {
            message.error("至少正确上传一张图片");
          }
        }
        console.log(values.storageList);
       
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
    initialValues={currentRow}
  >
    <Form.Item label="地点" name="eventAddress" rules={[{required: true}]}>
      <Input placeholder="请输入地点,至多30个字符"  maxLength="100" disabled={!editable}/>
    </Form.Item>

    <Form.Item label="事件标题" name="name" rules={[{required: true}]}>
      <Input placeholder="请输入事件标题,至多30个字符" maxLength="30"  disabled={!editable}/>
    </Form.Item>

    <Form.Item label="事件类型" name="eventTypes" rules={[{required: true}]}>
      <Select allowClear placeholder="请选择事件类型"    disabled={!editable} >
        {eventTypeList.map(item => {
          return (
            <Option key={item.key} value={item.id}>{item.name}</Option>
          )
        })}
      </Select>
      
    </Form.Item>
    
    <Form.Item label="事件描述" name="eventDesc" rules={[{required: true}]}>
       <TextArea placeholder="请输入事件描述,至多100个字符"  maxLength="100"   rows={4}   disabled={!editable}/>
    </Form.Item>

    <Form.Item
      name="storageList"
      label="事件图片"
      rules={[
        { required: true, message: '请上传相关图片' }]}
    >
      <Photo/>
    </Form.Item>
    
      <Form.Item label="建议参与部门" name="recommendDepts" rules={[{required: false}]}>
        <TreeSelect
        
          showSearch={false}
          multiple
          placeholder="请选择建议参与部门"
          treeData={treeDataSource}
          disabled={!editable}/>
        
      </Form.Item>

        <Form.Item label="处理意见" name="advise" rules={[{required: false}]}>
          <TextArea placeholder="请输入处理意见 ,至多100个字符"  maxLength="100"     rows={4}   disabled={!editable}/>
        </Form.Item>
         
      </Form>
    </Modal>
  );
}

const FeedbackModal = ({ visible, editable, submitMap, onFeedBacCancel, currentDictRow, feedBackId,operateType }) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  };

  form.resetFields();
  form.setFieldsValue(currentDictRow);
 let title = '';
 console.log(operateType);
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
