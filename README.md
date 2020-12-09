### Introduction 介绍
+ 一个自定义项目脚手架
+ 作用为通过 qt 命令新建项目后从指定源拉取模板
+ 仅拉取已创建好的模板，与vue-cli等脚手架的作用不同

### Requirements 环境要求
Git  
node >= 8.9

### Usage 使用说明  
全局安装  
`npm i q-temp -g`

#### qt create 
+ 创建项目  
```
qt create <preject-name>
```  
根据输入的项目名称创建一个新项目  

+ 指定Git库地址  
```
qt create <peoject-name> -u <url>
```  
根据输入的项目名称创建一个新项目并从指定Git库拉取模板

+ 指定仓库(需先在配置文件中添加该仓库，见下文)  
```
qt create <project-name> -r <repository-name>
```
根据输入的项目名称创建一个新项目并从指定仓库拉取模板

#### qt rep
+ 添加仓库  
```
qt rep -a <name> <address>
```  
eg: `qt rep -a vue-template https://github.com/yogurtq/vue-template.git`  
作用为：将该地址保存到配置文件中并命名为vue-template，后续即可使用 `qt create` 命令快速创建项目

+ 删除仓库  
```
qt rep -d <name>
```
删除指定名称的仓库

+ 更改仓库
```
qt rep -u <name> <address>
```
更改指定名称的仓库的地址

### [Github地址](https://github.com/yogurtq/q-temp)

