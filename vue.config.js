const url = 'http://pigx.pigx.top'
module.exports = {
    lintOnSave: true,
    productionSourceMap: false,
    chainWebpack: (config) => {
        config.externals({
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios',
            'element-ui': 'ELEMENT',
        })
    },
    transpileDependencies: ['avue-plugin-transfer', 'avue-plugin-ueditor'],
    //配置转发代理
    devServer: {
        proxy: {
            '/auth': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/auth': '/auth'
                }
            },
            '/admin': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/admin': '/admin'
                }
            },
            '/code': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/code': '/code'
                }
            },
            '/gen': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/gen': '/gen'
                }
            },
            '/daemon': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/daemon': '/daemon'
                }
            },
            '/tx': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/tx': '/tx'
                }
            },
        }
    }
}