
<template>
    <div class="common-layout">
        用户个性化设置
        <el-form :model="form" label-width="120px" class="flex-col-center">
            <div class="setting-bg">
                <div class="settingTitle">
                    颜色设置
                </div>
                <el-form-item label="颜色前字符:">
                    <el-input v-model="state.colorSetting.left" />
                </el-form-item>
                <el-form-item label="颜色后字符:">
                    <el-input v-model="state.colorSetting.right" />
                </el-form-item>
                <el-form-item label="生成后样式:">
                    {{ state.colorSetting.left + '#ffffff' + state.colorSetting.right }}
                </el-form-item>
                <el-button type="primary" @click="saveColorSetting()">保存</el-button>
            </div>
            <div class="setting-bg">
                <div class="settingTitle">
                    字体设置
                </div>
                <el-form-item label="字体前字符:">
                    <el-input v-model="state.fontSetting.left" />
                </el-form-item>
                <el-form-item label="字体后字符:">
                    <el-input v-model="state.fontSetting.right" />
                </el-form-item>
                <el-form-item label="生成后样式:">
                    {{ state.fontSetting.left + '18' + state.fontSetting.right }}
                </el-form-item>
                <el-button type="primary" @click="saveFontSetting()">保存</el-button>
            </div>
            <div class="setting-bg">
                <div class="settingTitle">
                    image设置
                </div>
                <el-form-item label="image前字符:">
                    <el-input v-model="state.imageSetting.left" />
                </el-form-item>
                <el-form-item label="image后字符:">
                    <el-input v-model="state.imageSetting.right" />
                </el-form-item>
                <el-form-item label="生成后样式:">
                    {{ state.imageSetting.left + 'name' + state.imageSetting.right }}
                </el-form-item>
                <el-button type="primary" @click="saveImageSetting()">保存</el-button>
            </div>
        </el-form>
    </div>
</template>
  
  
  
<script setup>
import { reactive, ref, getCurrentInstance, watch, onMounted } from 'vue'
import * as $utils from '../components/Utils';
// do not use same name with ref
const state = reactive({
    colorSetting: {
        left: '[UIColor colorWithHexString:@"',
        right: '"]'
    },
    fontSetting: {
        left: '[UIFont systemFontOfSize:',
        right: ']'
    },
    imageSetting: {
        left:'[UIImage imageNamed: @"',
        right:'"]'
    },
    imageDefault: ""
})
onMounted(() => {
    var colorSetting = $utils.getStorage('colorSetting')
    if (colorSetting && colorSetting.left) {
        state.colorSetting = colorSetting
    }
    var fontSetting = $utils.getStorage('fontSetting')
    if (fontSetting && fontSetting.left) {
        state.fontSetting = fontSetting
    }
    var imageSetting = $utils.getStorage('imageSetting')
    if (imageSetting && imageSetting.left) {
        state.imageSetting = imageSetting
    }

})

const saveColorSetting = () => {
    $utils.setStorage('colorSetting', state.colorSetting);
}


const saveFontSetting = () => {
    $utils.setStorage('fontSetting', state.fontSetting);
}

const saveImageSetting = () => {
    $utils.setStorage('imageSetting', state.imageSetting);
}

</script>
  
<style scoped lang="less">
body {
    width: 100%;
}

.left-btn {

    width: 95%;
    margin-bottom: 5px;
    margin-right: 5px;
    height: 60px;
    margin-left: 0px !important;
}

.main-view {
    height: 100%;
    background: #ffffff;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: row;

}

.main-phone {
    min-height: calc(100vh - 200px);
    border: 2px solid #000;
    background: #e7e5e5;
    width: 375px;
    box-sizing: border-box;
    position: relative;

    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;

}

.flex-col-center {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    word-break: break-all;

}

.content-view {
    // position: absolute;
    width: 105px;
    height: 100px;
    margin: 5px;
    background-color: #afb9c3;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    word-break: break-all;
}

.right-view {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    word-break: break-all;
    width: 400px;
    border: 2px solid #333;
    margin-right: 10px;
}

.selected {
    // border: 1px solid #333;
    background:
        linear-gradient(90deg, #333 50%, transparent 0) repeat-x,
        linear-gradient(90deg, #333 50%, transparent 0) repeat-x,
        linear-gradient(0deg, #333 50%, transparent 0) repeat-y,
        linear-gradient(0deg, #333 50%, transparent 0) repeat-y;
    background-size: 4px 1px, 4px 1px, 1px 4px, 1px 4px;
    background-position: 0 0, 0 100%, 0 0, 100% 0;
    animation: linearGradientMove .3s infinite linear;
}

@keyframes linearGradientMove {
    100% {
        background-position: 4px 0, -4px 100%, 0 -4px, 100% 4px;
    }
}

.displayNone {
    display: none;
}

.switch-border {
    border: 1px solid #409eff;
    border-radius: 4px;
    padding: 2px 6px;
}

.settingTitle{
margin: 10px;
}

.setting-bg{
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #409eff;
    border-radius: 8px;
    min-width: 600px;
}

</style>
  