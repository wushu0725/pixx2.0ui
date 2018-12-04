// 配置编译环境和线上环境之间的切换

const env = process.env
let baseUrl = ''
// 图表库为avue和pig2套地址
let iconfontVersion = ['667895_4y8d30c1og', '567566_qo5lxgtishg']
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`
let codeUrl = `/code`
let actUrl = `${window.origin}/act/modeler.html?modelId=`
if (env.NODE_ENV == 'development') {

} else if (env.NODE_ENV == 'production') {

} else if (env.NODE_ENV == 'test') {

}
export {
  baseUrl,
  actUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl,
  env
}
