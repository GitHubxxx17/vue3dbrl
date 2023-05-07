<template>
  <div class="Tutorial">
        <div class="bgc"></div>
        <header>
            <div class="iconfont icon-xiangzuojiantou" @click="userstore.TutorialIsShow = false;"></div>
        </header>
        <main>
            <div class="novice_title">—&nbsp;&nbsp;新手教程&nbsp;&nbsp;—</div>
            <div class="common no_bgc">
                <div class="function_title">上传</div>
                <div class="com_step">step.1</div>
                <div class="com_context">在本页面点击导入键，选择想要上传的文档（请注意是pdf或docx或doc格式）。</div>
                <div class="com_image">
                    <img src="@/assets/images/新手教程/新手教程1.jpg" alt="">
                </div>
                <div class="com_step">step.2</div>
                <div class="com_context">识别文档完成后，根据自己的需要进行挖空，编辑该模板名字及标题。</div>
                <div class="com_image">
                    <img src="@/assets/images/新手教程/新手教程2.jpg" alt="">
                    <img src="@/assets/images/新手教程/新手教程3.jpg" alt="">
                </div>
                <div class="com_step">step.3</div>
                <div class="com_context">保存文档完成后，在“学习—个人库”页面即可找到刚上传的文档进行学习。</div>
                <div class="com_image">
                    <img src="@/assets/images/新手教程/新手教程4.jpg" alt="">
                </div>
            </div>
            <!-- <div class="bcg"></div> -->
            <div class="common">
                <div class="function_title">PK</div>
                <div class="com_step">step.1</div>
                <div class="com_context">点击pk页面后选择“开始匹配”键</div>
                <div class="com_image">
                    <img src="@/assets/images/新手教程/新手教程5.jpg" alt="">
                </div>
                <div class="com_step">step.2</div>
                <div class="com_context">在弹窗选择难度和pk的模板后，即可进入pk。</div>
                <div class="com_image">
                    <img src="@/assets/images/新手教程/新手教程16.jpg" alt="">
                </div>
                <div class="com_step">step.3</div>
                <div class="com_context">若匹配不成功，可在左上角选择退出。</div>
                <div class="com_image">
                    <img src="@/assets/images/新手教程/新手教程9.jpg" alt="">
                </div>
            </div>
            <!-- <div class="bcg"></div> -->
            <div class="common">
                <div class="function_title">社区</div>
                <div class="com_step">step.1</div>
                <div class="com_context">选择社区页面，选择自己需要的模板，顶栏的搜索栏也可以搜索需要的模板。</div>
                <div class="com_image">
                    <img src="@/assets/images/新手教程/新手教程10.jpg" alt="">
                </div>
                <div class="com_step">step.2</div>
                <div class="com_context">点击收藏，即可在“学习—记忆库—收藏库”找到模板。</div>
                <div class="com_image">
                    <img src="@/assets/images/新手教程/新手教程11.jpg" alt="">
                </div>
                <div class="com_step">step.3</div>
                <div class="com_context">选择模板，进行学习或再编辑。</div>
                <div class="com_image">
                    <img src="@/assets/images/新手教程/新手教程12.jpg" alt="">
                </div>
            </div>
            <!-- <div class="bcg"></div> -->
            <div class="common">
                <div class="function_title">社区上传</div>
                <div class="com_step">step.1</div>
                <div class="com_context">选择社区页面，点击左上角的“上传”键。</div>
                <div class="com_image">
                    <img src="@/assets/images/新手教程/新手教程13.jpg" alt="">
                </div>
                <div class="com_step">step.2</div>
                <div class="com_context">选择个人记忆库的模板以及标题。</div>
                <div class="com_image">
                    <img src="@/assets/images/新手教程/新手教程14.jpg" alt="">
                </div>
                <div class="com_step">step.3</div>
                <div class="com_context">上传完成后，即可在社区页共享自己的模板。</div>
                <div class="com_image">
                    <img src="@/assets/images/新手教程/新手教程15.jpg" alt="">
                </div>
            </div>
        </main>
        <footer class="foot"></footer>
    </div>
</template>

<script setup>
import {userStore} from "@/stores";
let userstore = userStore();
</script>

<style scoped lang="less">
@vw: 3.95vw;
.Tutorial{
    width: 100vw;
    height: 100vh;

    .bgc{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: url(@/assets/images/新手教程/上栏.png) no-repeat;
        // background-size: cover;
        background-size: 100% (50vh);
        z-index: -1;
    }

    header{
        margin-top: (30/@vw);
        padding: 0 (20/@vw);

        div{
            width: (40/@vw);
            height: (40/@vw);
            text-align: center;
            line-height: (40/@vw);
            color: aliceblue;
            border-radius: 100%;
            background-color: rgba(0, 0, 0, 0.31);
        }
    }
    main{
        position: relative;
        .novice_title{
            margin: (20/@vw) auto;
            margin-bottom: (50/@vw);
            // width: (100/@vw);
            height: (30/@vw);
            line-height: (30/@vw);
            font-size: (30/@vw);
            text-align: center;
        }

        .common.no_bgc{
            margin-top: (10/@vw);
        }

        // .bcg{
        //     position: absolute;
        //     width: 100%;
        //     height: (200/@vw);
        //     background: url(@/assets/images/新手教程/新手教程中间.jpg) no-repeat;
        //     // background-size: cover;
        //     background-size: 100% 100%;
        //     z-index: -1;
        // }

        .common{
            z-index: 100;
            // margin-top: (-210/@vw);
            padding: 0 (30/@vw);

            .function_title{
                margin: 0 auto;
                // margin-top: (20/@vw);
                margin-bottom: (30/@vw);
                width: (100/@vw);
                height: (40/@vw);
                z-index: 100;
                line-height: (40/@vw);
                border-radius: (10/@vw);
                color: #ffffff;
                background-color:#51399f;
                font-size: (20/@vw);
                text-align: center;
            }

            .com_step{
                // margin-top: (20/@vw);
                font-size: (26/@vw);
                color: #00000091;
            }

            .com_context{
                margin-top: (20/@vw);
                line-height: (26/@vw);
               
            }

            .com_image{
                margin-top: (20/@vw);
                padding: 0 (12/@vw);

                img{
                    margin-bottom: (50/@vw);
                    box-shadow: (1/@vw) (1/@vw) (6/@vw) (1/@vw)rgba(121, 121, 121, 0.38);
                }
            }
        } 
    }

    footer{
        z-index: -1;
        margin-top: (-300/@vw);
        width: 100%;
        height: (50vh);
        background: url(@/assets/images/新手教程/下栏.png) no-repeat;
        // background-size: cover;
        background-size: 100% (50vh);
    }
}
</style>