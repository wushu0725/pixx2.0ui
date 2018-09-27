// 配置编译环境和线上环境之间的切换

let baseUrl = 'http://192.168.0.20:9999';
let iconfontVersion = ['567566_r22zi6t8noas8aor', '567566_qo5lxgtishg', '599693_dfa50fge714', '667895_2ek3wqcg8w1', '667895_bywepfixwj8']
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
let codeUrl = `${baseUrl}/code`
let activitiUrl = `${baseUrl}/act`
const env = process.env
if (env.NODE_ENV == 'development') {
    baseUrl = ``; // 开发环境地址
} else if (env.NODE_ENV == 'production') {
    baseUrl = ``; //生产环境地址
} else if (env.NODE_ENV == 'test') {
    baseUrl = ``; //测试环境地址
}
export {
    baseUrl,
    iconfontUrl,
    iconfontVersion,
    codeUrl,
    env
}
