// 配置编译环境和线上环境之间的切换

const env = process.env
let baseUrl = '';
let iconfontVersion = ['567566_r22zi6t8noas8aor', '567566_qo5lxgtishg', '599693_dfa50fge714', '667895_2ek3wqcg8w1', '667895_bywepfixwj8']
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
let codeUrl = `/code`
let actUrl = `${window.origin}/act/modeler.html?modelId=`;
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