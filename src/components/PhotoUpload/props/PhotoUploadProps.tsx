import { UploadProps } from 'antd/lib/upload/interface'
export interface PhotoUploadProps extends UploadProps {
  previewVisible?:boolean,
  previewTitle?:"",
  previewImage?:"",
  handleCancel?: () => void;
  getImageList?: () => void;
  }
  
  