import React from 'react'
import BraftEditor from 'braft-editor'
import '../../../themes/braft.less'
import {Button, Form, Input, Upload} from "antd";
import {RatelPage} from "@/components";
import {ParamUtils, Storage} from '@utils'
import {UploadOutlined} from '@ant-design/icons';
import {addApi} from '../../../services/tools/editor'
import config from '@config'


class Article extends React.Component {
  searchForm = React.createRef()

  state = {
    editorState: BraftEditor.createEditorState()
  }

  handleChange = (editorState) => {
    this.setState({editorState})
  }

  submitForm(values) {
    values.content = values.content.toHTML()
    let file = values.sImg[0].response
    values.listImg = file.content.attrPath
    addApi(values, () => {
    })
  }

  render() {
    return (
      <RatelPage className='page' inner>
        <FormLayoutDemo
          submitForm={this.submitForm}
          handleChange={this.handleChange}/>
      </RatelPage>
    )
  }
}

const FormLayoutDemo = ({handleChange, submitForm}) => {
  const [form] = Form.useForm();
  const excludeControls = [
    'letter-spacing',
    'line-height',
    'clear',
    'headings',
    'list-ol',
    'list-ul',
    'remove-styles',
    'superscript',
    'subscript',
    'hr',
    'text-align'
  ]

  const onFinish = values => {
    submitForm(values)
  };

  const preview = () => {
    if (window.previewWindow) {
      window.previewWindow.close()
    }
    window.previewWindow = window.open()
    window.previewWindow.document.write(buildPreviewHtml())
    window.previewWindow.document.close()
  }

  function buildPreviewHtml() {
    let content = form.getFieldValue('content')

    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${content.toHTML()}</div>
        </body>
      </html>
    `
  }

  const extendControls = [
    {
      key: 'custom-button',
      type: 'button',
      text: '预览',
      onClick: () => {
        console.log(0)
        preview()
      }
    }
  ]

  const formItemLayout = {
    labelCol: {span: 2},
    wrapperCol: {span: 22},
  };
  const tailLayout = {
    wrapperCol: {offset: 2, span: 22},
  };

  const normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const uploadProps = {
    action: config.API_BASE_URL + '/api/sys/storage/image',
    headers: {Authorization: Storage.getAuthorizationToken()},
    method: 'POST',
    multiple: false,
  };


  return (
    <Form form={form} style={{paddingBottom: 15}} {...formItemLayout} onFinish={onFinish}>
      <Form.Item label="标题" name="title" rules={[{required: true}]}>
        <Input placeholder="请输入标题"/>
      </Form.Item>
      <Form.Item label="标签" name="tags" rules={[{required: true}]}>
        <Input placeholder="请输入标签（多个标签使用逗号分割）"/>
      </Form.Item>
      <Form.Item label="描述" name="comments" rules={[{required: true}]}>
        <Input placeholder="请输入描述"/>
      </Form.Item>

      <Form.Item
        name="sImg"
        label="封面图片"
        valuePropName="sImg"
        getValueFromEvent={normFile}
      >
        <Upload name="file" {...uploadProps} listType="picture">
          <Button>
            <UploadOutlined/> 选择图片上传
          </Button>
        </Upload>
      </Form.Item>


      <Form.Item label="文章正文" name="content" rules={[{required: true}]}>
        <BraftEditor
          className="bf-ant-input"
          onChange={handleChange}
          // excludeControls={excludeControls}
          extendControls={extendControls}
          contentStyle={{minHeight: 400}}
          placeholder="请输入正文内容"
        />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button size="large" type="primary" htmlType="submit">提交</Button>
      </Form.Item>
    </Form>
  )
}

export default Article
