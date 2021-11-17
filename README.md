### Introduction 介绍
+ 一个自定义项目脚手架
+ 作用为通过 qt 命令新建项目后从指定源拉取模板
+ 仅拉取已创建好的模板，与vue-cli等脚手架的作用不同

### Requirements 环境要求
Git  
node >= 8.9

### Usage 使用说明  
#### 1. 全局安装  
`npm i q-temp -g`

#### 2. 命令：qt create 
+ 创建项目  
根据输入的项目名称创建一个新项目  
```
qt create <preject-name>
```  

+ 指定Git库地址  
根据输入的项目名称创建一个新项目并从指定Git库拉取模板  
```
qt create <peoject-name> -u <url>
```  

+ 指定仓库(需先在配置文件中添加该仓库，见下文)  
根据输入的项目名称创建一个新项目并从指定仓库拉取模板  
```
qt create <project-name> -r <repository-name>
```

#### 3. 命令：qt repo
+ 添加仓库  
将该地址保存到配置文件中并命名，后续即可通过 `qt create <project-name> -r <repository-name>` 命令使用该地址快速创建项目  
```
qt repo -a <name> <address>
```  
eg: `qt repo -a vue-template https://github.com/YornQiu/vue-template.git`  


+ 删除仓库  
删除指定名称的仓库  
```
qt repo -d <name>
```

+ 更改仓库  
更改指定名称的仓库的地址
```
qt repo -u <name> <address>
```


### [Github地址](https://github.com/YornQiu/q-temp)

