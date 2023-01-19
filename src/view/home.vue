
<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <h1 class="tit">
          WHY iOS creator
          <div class="border"></div>
        </h1>
      </el-header>
      <el-container>
        <el-aside class="left-aside" width="20%">
          <template v-for="(item, index) in state.leftBtns" :key="index">
            <el-button type="primary" class="left-btn" @click="leftBtnClick(item)">{{ item.name }}</el-button>
          </template>
        </el-aside>
        <el-main class="main-view">
          <div class="main-phone">
            <template v-for="(item, index) in state.currentShowViews" :key="index">
              <div :class="{
                'content-view': true,
                'selected': index == state.currentSelectIndex
              }" @click="contentViewClick(item, index)"
                :style="item.style">{{
                  item.setting.name
                }}</div>
            </template>
          </div>
          <div>
            <el-button type="primary" size="large" @click="onMergeCreate()">合并生成</el-button>
            <el-button size="large" @click="onDeleteAll()">删除所有</el-button>
          </div>


        </el-main>
        <el-aside class="left-aside" width="35%">
          <div v-if="state.currentSelectIndex > -1">
            <UIbutton v-if="state.currentShowViews[state.currentSelectIndex].type == 'UIButton'"
              :form="state.currentShowViews[state.currentSelectIndex].setting" @update="settingUpdate"
              @delete="settingDelete" @create="settingCreate" />
            <UIView v-if="state.currentShowViews[state.currentSelectIndex].type == 'UIView'"
              :form="state.currentShowViews[state.currentSelectIndex].setting" @update="settingUpdate"
              @delete="settingDelete" @create="settingCreate" />
            <UILabel v-if="state.currentShowViews[state.currentSelectIndex].type == 'UILabel'"
              :form="state.currentShowViews[state.currentSelectIndex].setting" @update="settingUpdate"
              @delete="settingDelete" @create="settingCreate" />
            <UIImageView v-if="state.currentShowViews[state.currentSelectIndex].type == 'UIImageView'"
              :form="state.currentShowViews[state.currentSelectIndex].setting" @update="settingUpdate"
              @delete="settingDelete" @create="settingCreate" />
            <UIScrollView v-if="state.currentShowViews[state.currentSelectIndex].type == 'UIScrollView'"
              :form="state.currentShowViews[state.currentSelectIndex].setting" @update="settingUpdate"
              @delete="settingDelete" @create="settingCreate" />
            <UITableView v-if="state.currentShowViews[state.currentSelectIndex].type == 'UITableView'"
              :form="state.currentShowViews[state.currentSelectIndex].setting" @update="settingUpdate"
              @delete="settingDelete" @create="settingCreate" />
            <UITableViewCell v-if="state.currentShowViews[state.currentSelectIndex].type == 'UITableViewCell'"
              :form="state.currentShowViews[state.currentSelectIndex].setting" @update="settingUpdate"
              @delete="settingDelete" @create="settingCreate" />
          </div>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>



<script setup>
import UIbutton from '../components/UIButtonSetting.vue';
import UIView from '../components/UIView.vue';
import UILabel from '../components/UILabel.vue';
import UIImageView from '../components/UIImageView.vue';
import UIScrollView from '../components/UIScrollView.vue';
import UITableView from '../components/UITableView.vue';
import UITableViewCell from '../components/UITableViewCell.vue';
import * as $utils from '../components/Utils';
import { reactive, ref } from 'vue'

// do not use same name with ref
const state = reactive({
  currentShowViews: [],
  leftBtns: [{
    name: "UIButton",
    type: 'UIButton'
  }, {
    name: "UILabel",
    type: 'UILabel'
  }, {
    name: "UIImageView",
    type: 'UIImageView'
  }, {
    name: "UIView",
    type: 'UIView'
  }, {
    name: "UIScrollView",
    type: 'UIScrollView'
  }, {
    name: "UITableView",
    type: 'UITableView'
  }, {
    name: "UITableViewCell",
    type: 'UITableViewCell'
  }],
  currentSelectIndex: -1
})

const leftBtnClick = (item) => {
  if (state.currentShowViews.length > 0) {
    let end = state.currentShowViews[state.currentShowViews.length - 1];
    let position = calcPosition(end)
    state.currentShowViews.push({
      type: item.type,
      setting: {},
      style: '',
      createResult: '',
      postion: {
        top: 0,
        left: 0,
        width: 100,
        height: 100
      }
    })
  } else {
    state.currentShowViews.push({
      type: item.type,
      setting: {},
      style: '',
      createResult: '',
      postion: {
        top: 0,
        left: 0,
        width: 100,
        height: 100
      }
    })
  }
  console.log(state.currentShowViews);
  contentViewClick(state.currentShowViews[state.currentShowViews.length - 1], state.currentShowViews.length - 1)
}

const calcPosition = (past) => {
  return {
    top: 0,
    left: 0,
    width: 100,
    height: 100
  }
}

const contentViewClick = (item, index) => {
  state.currentSelectIndex = index;

}

const settingUpdate = (setting) => {
  if (state.currentSelectIndex > -1) {
    state.currentShowViews[state.currentSelectIndex].setting = setting;
    state.currentShowViews[state.currentSelectIndex].style = `background-color:${setting.backgroundColor};border-radius:${setting.conrnerRadius}px ;`;
  }
}

const settingDelete = (setting) => {
  state.currentShowViews.splice(state.currentSelectIndex, 1);
  if (state.currentShowViews.length > 0) {
    state.currentSelectIndex = 0;
  } else {
    state.currentSelectIndex = -1;
  }
}

const settingCreate = (createResult) => {
  if (state.currentSelectIndex > -1) {
    state.currentShowViews[state.currentSelectIndex].createResult = createResult;
  }
}

const onMergeCreate = () => {
  var result = ''
  for (let view of state.currentShowViews) {
    result = result + view.createResult + '\n';
  }
  if (result.length != 0) {
    $utils.copy(result);
  }
}

const onDeleteAll = () => {
  state.currentShowViews = [];
  state.currentSelectIndex = -1;
}

</script>

<style scoped lang="less">
body {
  width: 100%;
}

.left-btn {

  width: 43%;
  margin-bottom: 5px;
  margin-right: 5px;
  height: 60px;
  margin-left: 0px !important;
}

.main-view {
  height: 100%;
  background: #3c5774;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

}

.main-phone {
  min-height: calc(100vh - 160px);
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
</style>
