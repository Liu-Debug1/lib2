- 视频连接【STM32入门教程-2023版 细致讲解 中文字幕】[https://www.bilibili.com/video/BV1th411z7sn?p=4&vd_source=f4ecd7e50821fdecda2ed9065f0bb39c](https://www.bilibili.com/video/BV1th411z7sn?p=4&vd_source=f4ecd7e50821fdecda2ed9065f0bb39c)
- 支持包安装
    
    - ![](https://api2.mubu.com/v3/document_image/28368310_577149bf-7c00-415c-8768-286569cf8555.png?)

    - 选择对应型号芯片 --> 安装Install![](https://api2.mubu.com/v3/document_image/28368310_158661e5-2496-4206-b3f1-673bbc3c9060.png?)
- 软件注册
    
    - 管理员身份运行
    
    - File ---> License Manegement --> 复制Computer ID
    
    - 打开Keil5 MDK 的Keygenerat 生成 注册码
- 工程模板
    
    - 新建模板 New project
    
    - Start文件
        
        - 建Start文件夹
            - ![](https://api2.mubu.com/v3/document_image/28368310_dcd6ef6c-4b89-42e4-dbe6-b914d4ec68e2.png?)
        
        - Keil5中
            
            - 建立一个同名文件夹Start
            
            - 选择对应位置下Start文件夹，选择合适的启动文件以及所有 .c 与 .h 文件![](https://api2.mubu.com/v3/document_image/324828c0-dca5-4557-a8f5-740465bbe9ba-28368310.jpg?)
            
            - ![](https://api2.mubu.com/v3/document_image/28368310_9b87469c-678a-428c-a525-1672373e7763.png?)
        
        - 添加头文件路径
            
            - ![](https://api2.mubu.com/v3/document_image/28368310_f44354b3-0227-4530-c8c6-4c0c3f1047dd.png?)
            
            - 添加Start文件夹路径![](https://api2.mubu.com/v3/document_image/28368310_513b0855-5849-44b6-a22c-1162638a8349.png?)
    
    - User文件
        
        - main函数 放在该目录下
        
        - 右键 Target，点击 Add group，改名（重命名F2）为User![](https://api2.mubu.com/v3/document_image/4a25b67c-035c-454f-beaa-708c69c237b8-28368310.jpg?)
        
        - 右键User 创 .c 文件，命名为 main。 注意： 文件路径要在User下，否则会默认放在文件夹外![](https://api2.mubu.com/v3/document_image/28368310_fdf80a75-a4e6-4310-b6d5-4b4a45fbaa23.png?)
        
        - main函数基本框架（最后一行必须是空行）![](https://api2.mubu.com/v3/document_image/28368310_74997ba7-6bd8-4a50-a767-b586e1e12579.png?)
        
        - 与Start文件相同，添加头文件路径
    
    - Library库函数文件
        
        - 建Library文件夹，复制标准库函数驱动文件、头文件包含文件等，粘贴至Library文件下
        
        - 在Keil5中，新建Library文件夹，添加对应文件内容
        
        - 打开conf文件，找到定义头文件的字符串，复制并粘贴至该处![](https://api2.mubu.com/v3/document_image/28368310_a998906d-17e9-441d-b4ec-f5eb2f6c0554.png?)
        
        - 添加头文件路径
- ![](https://api2.mubu.com/v3/document_image/28368310_422d3642-f941-4395-b920-6592f77ae384.png?)