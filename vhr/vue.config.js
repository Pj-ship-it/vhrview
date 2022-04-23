const path = require("path")

function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    chainWebpack: config => {
        config.resolve.alias
            .set("@",resolve("src"));
    }
}

module.exports={
    devServer:{
        host:'localhost',
        port:'8080',
        proxy: {
            '/': {
                target: 'http://localhost:8999',
                secure: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/': ''
                }
            }
        }
    }
}
