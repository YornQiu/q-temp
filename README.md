#### Introduction 介绍
+ 一个自定义项目脚手架
+ 作用为通过 qt 命令新建项目后从指定源拉取模板
+ 仅拉取已创建好的模板，与cli的作用不同

#### Requirements 要求
Git
node >= 8.9

#### Instructuins 使用说明
全局安装
npm i q-temp -g

创建项目
qt create <preject-name>

指定git库地址
qt create <peoject-name> -u <url> 

安装依赖
cd <project-name>
npm install

#### [Github地址](https://github.com/yogurtq/q-temp)

