
<template>
    <div class="common-layout">
        <HelpMeView />
    </div>
</template>
  
  
  
<script setup>
import HelpMeView from '../components/HelpMeView.vue';
import { reactive, ref, getCurrentInstance, watch } from 'vue'
import router from '../router/index.js'

// do not use same name with ref
const state = reactive({
})

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

.flex-col {
    display: flex;
    align-items: center;
    justify-content: flex-start;
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
</style>
  