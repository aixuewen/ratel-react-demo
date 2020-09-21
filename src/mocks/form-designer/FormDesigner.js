import Mock from 'mockjs'
import Config from '@/config/index'

//信息分类统计
Mock.mock(`${Config.API_BASE_URL}/api/formDesigner/query`, function () {
  var data = Mock.mock({
    "code": "200",
    "message": "测试表单",
    "data": {
      name: '测试表单',
      desc: '',
      lcbh: '',
      sqrq: '',
      key: 'form' + Math.ceil(Math.random() * 10000000),
      type: '',
      role: '',
      flow: '',
      attr: '',
      publish: false,
      content: [],
      styleAble: false,
      style: {
        fontFamily: '',//字休
        fontSize: 14,//字号
        opacity: 1,//透明度
        color: '',//字体颜色
        padding: '',//外缩近
        margin: ''//内缩进
      }
    }
  })
  return data
})


Mock.mock(`${Config.API_BASE_URL}/api/formDesigner/getDataDict`, function () {
  var data = Mock.mock({
    "code": "200",
    "message": "测试表单",
    "data": [
      {name: '选项1', value: "1"},
      {name: '选项2', value: "2"},
      {name: '选项3', value: "3"},
      {name: '选项4', value: "4"},
      {name: '选项5', value: "5"}
    ]
  })
  return data
})

Mock.mock(`${Config.API_BASE_URL}/api/formDesigner/getCheckboxListDataDict`, function () {
  var data = Mock.mock({
    "code": "200",
    "message": "测试表单",
    "data": [
      {label: '苹果', value: 'Apple'},
      {label: '梨子', value: 'Pear'},
      {label: '橙子', value: 'Orange'},
    ]
  })
  return data
})


