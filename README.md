<p align="center">
  <h1 align="center">🎨 Image Editor</h1>
</p>

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/hbseo/image_editor/blob/master/LICENSE) 
[![version](https://img.shields.io/badge/react-16.13.1-blue)](https://reactjs.org/)
![node](https://img.shields.io/node/v/fabric)

## Introduction  
Our project is an image editor that runs on a web browser written by Javascript.  
We used some references  
* An image editor based on [Fabric.js](https://github.com/fabricjs/fabric.js).  
* Some parts of code are from [ToastUI Image Editor](https://github.com/nhn/tui.image-editor) and [glfx.js](https://github.com/evanw/glfx.js)
* Origin Repository [image_editor](https://github.com/hbseo/image_editor)


## Overview  
* __Save and Load__ - Save current project as JPG or PNG. Also, Load from image.  
* __User ID__ - Manage projects using individual ID. Use mysql as Database. There are two tables USERS table and PROJECTS table.  
* __Main page__ - You can create or load a project of any size.  
<img src = "https://raw.githubusercontent.com/hbseo/image_editor/master/doc/pictures/main.png" width="50%">  

* __Editor page__ - Edit your project using tools.  
<img src = "https://raw.githubusercontent.com/hbseo/image_editor/master/doc/pictures/editor.png" width="50%">  

* __Get image__ - You can search under any title to use the image.  
<img src = "https://raw.githubusercontent.com/hbseo/image_editor/master/doc/pictures/get.png" width="50%">  

* __Load project__ - View projects when login.  
<img src = "https://raw.githubusercontent.com/hbseo/image_editor/master/doc/pictures/projects.png" width="50%">  

## How to start  
Before launching the below code open mysql and set [config](https://github.com/hbseo/image_editor/tree/master/server/config).   
You can start editor by executing following command.  
* client  
```
npm install
npm run start
```
* server  
```
npm run serve
```  
And then access it by using a browser. [http://localhost:8080](http://localhost:8080)  
Server is running on 8000 port.  
Dependency conflicts may happen.  

## Structure  
<details><summary>Details</summary>

```
image_editor
│───README.md   
│
└───public
│   │───index.html
│   │
│   └───image
│       └───.svg
│
└───src
│   │───index.js
│   │───Route.js
│   │
│   └───css
│   │   │───Error.scss
│   │   │───ImageEditor.scss
│   │   │───ImageList.scss
│   │   │───Loading.scss
│   │   │───Main.scss
│   │   │───New_project.scss
│   │   │───Save.scss
│   │   │───UploadFIle.scss
│   │   │
│   │   └───Login
│   │   │   │───font-awesome.min.scss
│   │   │   │───main.scss
│   │   │   │───util.scss
│   │   │   └───fonts
│   │   │   
│   │   └───ui
│   │       │───Draw.scss
│   │       │───Filter.scss
│   │       │───History.scss
│   │       │───Icon.scss
│   │       │───Image.scss
│   │       │───Rotation.scss
│   │       │───Shape.scss
│   │       └───Text.scss
│   │
│   └───locale
│   │   │───i18n.js
│   │   │
│   │   │───ko
│   │   │   └───korean.json
│   │   │
│   │   └───en
│   │       └───english.json
│   │
│   └───components
│       │───Change_password.js
│       │───Error.js
|       |───Find_password.js
│       │───ImageEditor.js
│       │───ImageList.js
│       │───LoadImage.js
│       │───Login.js
│       │───Main.js
│       │───New_project.js
│       │───Project.js
│       │───Save.js
│       │───SignIn.js
│       │───SignUp.js
│       │───Upload_file.js
│       │    
│       └─── action
│       │     │───Action.js
│       │     │───Clip.js
│       │     │───Crop.js
│       │     │───Delete.js
│       │     │───Draw.js
│       │     │───Fill.js
│       │     │───Filter.js
│       │     │───Flip.js
│       │     │───Icon.js
│       │     │───Image.js
│       │     │───Line.js
│       │     │───ObjectAction.js
│       │     │───Rotation.js
│       │     │───Shape.js
│       │     └───Text.js
│       │
│       └─── const
│       │     └───consts.js
│       │
│       └─── extension
│       │     │───Extension.js
│       │     │───Grid.js
│       │     │───Layers.js
│       │     │───Pipette.js
│       │     │───Snap.js
│       │     └───Util.js
│       │   
│       └─── filters
|       │    └─── glfx
│       │          │───denoise.js
│       │          │───hexagonalPixelate.js
│       │          │───ink.js
│       │          │───vibrance.js
│       │          │───vignette.js
│       │          └───zoomblur.js
│       │
│       └─── helper
│       │     │───Brush.js
│       │     │───ConverRGB.js
│       │     │───originImage.js
│       │     │───Resize.js
│       │     └───SwithTools.js
│       │
│       └─── ui
│             │───Canvas.js
│             │───Draw.js
│             │───Effect.js
│             │───Filter.js
│             │───History.js
│             │───Icon.js
│             │───Image.js
│             │───Loading.js
│             │───Object.js
│             │───Rotation.js
│             │───Shape.js
│             │───SideNav.js
│             │───Text.js
│             └───Tools.js
│                                               
└───server
    │─── app.js
    │
    │─── config
    │     │───db-config.json
    │     │───jwt.js
    │     └───user.sql
    │
    │─── database
    │     └───index.js
    │
    │─── middlewares
    │     └───auth.js
    │
    └─── routes
          └───api
              │───auth
              │   │───controller.js 
              │   └───index.js
              │
              └───content
                  │───controller.js 
                  └───index.js
```

</details>

## Tech Stack
**Frontend**

![react](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black)
![nodejs](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white) 
![javascript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![npm](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white) 
![webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=flat-square&logo=webpack&logoColor=black)
![lodash](https://img.shields.io/badge/Lodash-3492FF?style=flat-square&logo=Lodash&logoColor=white)
![i18next](https://img.shields.io/badge/i18next-26A69A?style=flat-square&logo=i18next&logoColor=white)
![bootstrap](https://img.shields.io/badge/bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white)
![sass](https://img.shields.io/badge/Sass-CC6699?style=flat-square&logo=Sass&logoColor=white) 
![fabricjs](https://img.shields.io/badge/FabricJS-FFC0CB?style=flat-square&logo=javascripst&logoColor=black)
![jquery](https://img.shields.io/badge/jquery-0769AD?style=flat-square&logo=jquery&logoColor=white)

**Backend**

![nodejs](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)
![javascript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=Express&logoColor=white)
![JSON Web Tokens](https://img.shields.io/badge/JSONWebTokens-000000?style=flat-square&logo=JSONWebTokens&logoColor=white)
![mysql](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white)


**Other**

![Unsplash](https://img.shields.io/badge/Unsplash-000000?style=flat-square&logo=Unsplash&logoColor=white)
![nodemon](https://img.shields.io/badge/nodemon-76D04B?style=flat-square&logo=nodemon&logoColor=white)

## Contributor  
[Hyeon Beom Seo](https://github.com/hbseo)  
[Ju Kyung Yoon](https://github.com/JuKyYoon)
[Se Myeong Lee](https://github.com/3people)  

## Bug Report  
If you find a bug. please report to us posting [issues](https://github.com/hbseo/image_editor/issues) on GitHub.
