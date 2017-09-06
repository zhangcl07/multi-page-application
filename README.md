# 基于VUE的多页面打包方案
偶尔在开发后台页面时，打开每个页面会有权限验证的步骤，这层关系前端判断的话，需要做单页路由跳转，涉及几种不同的权限时，会比较复杂，如果前端不想做这层关系的话，可以采用此项目的方案。

此方案借鉴了```vue-cli```的代码，因为涉及到多页面访问，用了```webpack-dev-server```作为server工具，主要是因为没找到express如何访问路径的写法[笨]

项目分主模版和页面模版，如果当前页面比较特殊，可在```src/pages/页面目录```/下，添加自己特殊的模版，打包时会先查找页面目录下有无模版，没有时，才会采用项目根目录下的主模版。

## 目录结构

```javascript
src/
  |- basic/       放所有依赖的库
  |- common/      项目中自己写或依赖的各种公共方法、配置、样式
  |- commponents/ 组件
  |- pages/       多页面逻辑代码
      |- page
          |- index.html 独立模版，相当于一个frame框架
          |- main.js    页面逻辑代码，import依赖组件，页面模版、Vue实例，类似 `*.vue` 文件构造
          |- main.scss  页面单独的css，可@import公共的common.scss
```
## 命令
- ```npm start``` // 开发模式
- ```npm run build``` // 打包
- ```npm run watch``` // watch 需要自己手动刷新页面
