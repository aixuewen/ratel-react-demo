import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import * as React from 'react';

// import { UploadProps } from 'antd/lib/upload/interface'
import {PhotoUploadProps} from './props/PhotoUploadProps'

const PhotoUpload: React.FC<PhotoUploadProps> = props => 
  (
    <div className="clearfix">
      <Upload
        action={props.action}
        listType={props.listType}
        fileList={props.fileList}
        onPreview={props.onPreview}
        onChange={props.onChange}
      >
        { props.fileList && props.fileList.length >= 5 ? null :
          <div>
            <PlusOutlined />
            <div className="ant-upload-text">上传</div>
          </div>}
      </Upload>
      <Modal
        visible={props.previewVisible}
        title={props.previewTitle}
        footer={null}
        onCancel={props.handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={props.previewImage} />
      </Modal>
    </div>
  );

  export default PhotoUpload;




