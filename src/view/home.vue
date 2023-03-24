
<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <h1 class="tit">
          WHY iOS creator
          <el-switch v-model="state.isOCTag" class="switch-border" active-text="OC" inactive-text="Swift"
            style="--el-switch-off-color:#ff4949;" />
          <div class="border"></div>
        </h1>

      </el-header>
      <el-container>
        <el-aside class="left-aside" width="150px">
          <template v-for="(item, index) in state.leftBtns" :key="index">
            <el-button type="primary" class="left-btn" @click="leftBtnClick(item)">{{ item.name }}</el-button>
          </template>
        </el-aside>
        <el-main class="main-view">
          <div v-if="state.currentSelectIndex > -1" class="right-view"
            :style="(state.currentShowViews[state.currentSelectIndex].type == 'HelpMe' || state.currentShowViews[state.currentSelectIndex].type == 'AnalyCodeView') ? 'width: 1300px;' : 'width: 400px;'">
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
              <UITableView v-if="state.currentShowViews[state.currentSelectIndex].type == 'UITableView'"
              :form="state.currentShowViews[state.currentSelectIndex].setting" @update="settingUpdate"
              @delete="settingDelete" @create="settingCreate" />
            <UICollectionView v-if="state.currentShowViews[state.currentSelectIndex].type == 'UICollectionView'"
              :form="state.currentShowViews[state.currentSelectIndex].setting" @update="settingUpdate"
              @delete="settingDelete" @create="settingCreate" />
            <HelpMeView v-if="state.currentShowViews[state.currentSelectIndex].type == 'HelpMe'" />
            <AnalyCodeView v-if="state.currentShowViews[state.currentSelectIndex].type == 'AnalyCodeView'" />

          </div>
          <div class="flex-col">
            <div class="main-phone">
              <template v-for="(item, index) in state.currentShowViews" :key="index">
                <div :class="{
                  'content-view': true,
                  'selected': index == state.currentSelectIndex,
                  'displayNone': item.type == 'AnalyCodeView'
                }" @click="contentViewClick(item, index)" :style="item.style">{{ item.setting.name }}</div>
              </template>
            </div>
            <div>
              <el-button type="primary" size="large" @click="onMergeCreate()">合并生成</el-button>
              <el-button size="large" @click="onDeleteAll()">删除所有</el-button>
            </div>
          </div>

        </el-main>
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
import UICollectionView from '../components/UICollectionView.vue';
import HelpMeView from '../components/HelpMeView.vue';
import * as $utils from '../components/Utils';
import { reactive, ref, getCurrentInstance, watch, onMounted } from 'vue'
import AnalyCodeView from '../components/AnalyCodeView.vue';
import router from '../router/index.js'
const { proxy } = getCurrentInstance();

// do not use same name with ref
const state = reactive({
  isOCTag: proxy.isOCTag,
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
  },{
    name: "UICollectionView",
    type: 'UICollectionView'
  },
  {
    name: "代码解析",
    type: 'AnalyCodeView'
  },
  {
    name: "帮帮我",
    type: 'HelpMe'
  }
  ],
  currentSelectIndex: -1,
})

onMounted(() => {
  // const that = this
  // alert(that.$route.query)
  // var canRedirect = router.query && router.query.canRedirect ? router.query.canRedirect : true;
  let isMobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  if (isMobile) {
    router.push({
      name: 'phoneHome'
    })
  }
})

watch(() => state.isOCTag, (newValue, oldValue) => {
  proxy.isOCTag = newValue;
  console.log(proxy.isOCTag);

}, {
  deep: true,
  immediate: true
});

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
    state.currentShowViews[state.currentSelectIndex].style = `background-color:${setting.backgroundColor};border-radius:${setting.conrnerRadius}px ;color:${setting.titleColor};`;
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
