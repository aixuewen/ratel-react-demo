import React from 'react';
import { Upload, Modal,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { eq, result } from 'lodash';
import config from '../../config'
import * as Storage from "../../utils/Storage";
import { info } from 'autoprefixer';
const {
  API_BASE_URL,
  IMAGE_SIZE
} = config

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class Photo extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
    accept:".jpg, .jpeg, .png",
  };
    constructor(props){
      super(props);
      // this.props.getChildrenMsg('123','456');
    }

  handleCancel = () => this.setState({ previewVisible: false });
  

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = ({file,fileList,event}) =>  {

    if (file && file.status === 'done') {
      console.log("图片上传完成");

    } else if (file && file.status === 'removed') {
      console.log("点击了图片移除");
    } else if (file && file.status === 'uploading'){
      console.log("图片上传中");
    } else {
      console.log("图片上传失败");
      file.status="error"
      // var a = fileList.find(item => item.uid === file.uid);
      // fileList.splice(a,1);
      // message.error("图片上传失败");
    }
    this.setState({ 
      fileList:fileList
     }); 
     //this.props.getImageList(this,this.state.fileList);
    this.props.onChange(this.state.fileList)
   
  } 

  beforeUpload = (file, name) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    let flag = true;
    if (!isJpgOrPng) {
      file.status="error";
      message.error('只能上传JPG/PNG/jpg文件!');
      flag = false;
    }
    const isLt2M = file.size / 1024 / 1024 < IMAGE_SIZE;
    if (!isLt2M) {
      file.status="error";
      var info = '图片大小不能超过'+IMAGE_SIZE+'MB!';
      message.error(info);
      flag = false;
    }
    return flag;
}

  remove =  ({image}) => {
    console.log(image);
  }
  
  render() {
    const {previewVisible, previewImage, fileList, previewTitle,accept} = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    // var url = "https://www.mocky.io/v2/5cc8019d300000980a055e76";
    var url = API_BASE_URL+"/api/sys/storage/image?name=photo";
    return (
      <div className="clearfix">
        <Upload
          action={url}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          accept={accept}
          headers={{
            'Duliday-Agent': '4',
            'Duliday-Agent-Version': (0x020000).toString(),
            'X-Requested-With': 'null',
            'Authorization': Storage.getAuthorizationToken()
          }}
          beforeUpload={this.beforeUpload}
          // onRemove={this.remove}
        //   name="photo"
          // success={this.getImageList}
          // data={this.handleUploadData}
        >
          {fileList.length >= 5 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default Photo

