
<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <button class="feedback" @click="goToLink">反馈</button>
        <button class="setting" @click="goToSetting">个性化设置</button>
        <h1 class="tit">
          WHY iOS creator
          <el-tooltip class="box-item" effect="dark"
                        content="生成swift是测试功能，并未进行过完整的测试"
                        placement="right" :raw-content="true">
          <el-switch v-model="state.isOCTag" class="switch-border" active-text="OC" inactive-text="Swift"
            style="--el-switch-off-color:#ff4949;" />
          <div class="border"></div>
        </el-tooltip>
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
            :style="isCurrentSpecialType(state.currentShowViews[state.currentSelectIndex].type) ? 'width: 1300px;' : 'width: 600px;'">
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
            <UICollectionView v-if="state.currentShowViews[state.currentSelectIndex].type == 'UICollectionView'"
              :form="state.currentShowViews[state.currentSelectIndex].setting" @update="settingUpdate"
              @delete="settingDelete" @create="settingCreate" />
            <UITextView v-if="state.currentShowViews[state.currentSelectIndex].type == 'UITextView'"
              :form="state.currentShowViews[state.currentSelectIndex].setting" @update="settingUpdate"
              @delete="settingDelete" @create="settingCreate" />
            <UITextField v-if="state.currentShowViews[state.currentSelectIndex].type == 'UITextField'"
              :form="state.currentShowViews[state.currentSelectIndex].setting" @update="settingUpdate"
              @delete="settingDelete" @create="settingCreate" />
            <CodeStoreView v-if="state.currentShowViews[state.currentSelectIndex].type == 'CodeStoreView'" />
            <HelpMeView v-if="state.currentShowViews[state.currentSelectIndex].type == 'HelpMe'" />
            <AnalyCodeView v-if="state.currentShowViews[state.currentSelectIndex].type == 'AnalyCodeView'" />
          </div>
          <div class="flex-col"
            v-if="(state.currentShowViews && state.currentShowViews.length > 0 && state.currentShowViews[state.currentSelectIndex].type != 'CodeStoreView' && state.currentShowViews[state.currentSelectIndex].type != 'HelpMe' && state.currentShowViews[state.currentSelectIndex].type != 'AnalyCodeView')">
            <div class="main-phone">
              <template v-for="(item, index) in state.currentShowViews" :key="index">
                <div :class="{
                    'content-view': true,
                    'selected': index == state.currentSelectIndex,
                    'displayNone': isCurrentSpecialType(item.type)
                  }" @click="contentViewClick(item, index)" :style="item.style">{{ item.setting.name }}</div>
              </template>
            </div>
            <div>
              <el-button type="primary" size="large" @click="onMergeCreate()">合并生成</el-button>
              <el-button size="large" @click="onDeleteAll()">删除所有</el-button>
            </div>
          </div>
          <div class="flex-col"
            v-if=" (!state.currentShowViews || state.currentShowViews.length == 0)||(state.currentShowViews && state.currentShowViews.length > 0 && state.currentShowViews[state.currentSelectIndex].type != 'CodeStoreView' && state.currentShowViews[state.currentSelectIndex].type != 'HelpMe' && state.currentShowViews[state.currentSelectIndex].type != 'AnalyCodeView')">
            <div class="main-clip">
              <el-input v-model="state.clipText" type="textarea" :rows="40" placeholder="在此输入蓝湖或者慕客控件iOS代码数据,支持一次输入多个"/>
            </div>
            <div>
              <el-button @click="onAddClip">粘贴</el-button>
              <el-button type="primary" @click="onMergeAnalyCode()">合并解析</el-button>
              <el-button @click="state.clipText=''">清空</el-button>
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
import UITextView from '../components/UITextView.vue';
import UITextField from '../components/UITextField.vue';
import * as $utils from '../components/Utils';
import { reactive, ref, getCurrentInstance, watch, onMounted } from 'vue'
import AnalyCodeView from '../components/AnalyCodeView.vue';
import CodeStoreView from '../components/CodeStoreView.vue';
import router from '../router/index.js'
const { proxy } = getCurrentInstance();

// do not use same name with ref
const state = reactive({
  isOCTag: $utils.getStorage('isOCTag'),
  currentShowViews: [],
  leftBtns: [{
    name: "UIView",
    type: 'UIView'
  }, {
    name: "UIButton",
    type: 'UIButton'
  }, {
    name: "UILabel",
    type: 'UILabel'
  }, {
    name: "UIImageView",
    type: 'UIImageView'
  }, {
    name: "UIScrollView",
    type: 'UIScrollView'
  }, {
    name: "UITableView",
    type: 'UITableView'
  }, {
    name: "UITableViewCell",
    type: 'UITableViewCell'
  }, {
    name: "UICollectionView",
    type: 'UICollectionView'
  }, {
    name: "UITextView",
    type: 'UITextView'
  },
  {
    name: "UITextField",
    type: 'UITextField'
  },

  {
    name: "代码解析",
    type: 'AnalyCodeView'
  },
  {
    name: "代码库",
    type: 'CodeStoreView'
  },
  {
    name: "帮帮我",
    type: 'HelpMe'
  }
  ],
  currentSelectIndex: -1,
  clipText :'',
})

onMounted(() => {
  console.log(state.isOCTag,'state.isOCTag');
  if(state.isOCTag == ''){
    $utils.setStorage('isOCTag',true)
  }
  
  // state.isOCTag = $utils.getStorage('isOCTag')
  // const that = this
  // alert(that.$route.query)
  // var canRedirect = router.query && router.query.canRedirect ? router.query.canRedirect : true;
  let isMobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  // if (isMobile) {
  //   router.push({
  //     name: 'phoneHome'
  //   })
  // }
})

const isCurrentSpecialType = (type) => {
  switch (type) {
    case 'HelpMe':
    case 'CodeStoreView':
    case 'AnalyCodeView':
      return true
    default:
      break;
  }
  return false
}

watch(() => state.isOCTag, (newValue, oldValue) => {
  $utils.setStorage('isOCTag',newValue)
}, {
  deep: true,
  immediate: true
});

const leftBtnClick = (item) => {
  console.log(item);
  // if(item.type == 'AnalyCodeView' || item.type == 'HelpMe'){
  //   return
  // }
    state.currentShowViews.push({
      type: item.type,
      setting: {
        clipText: item.clipText,
        name: item.name,
      },
      style: '',
      createResult: '',
    })
  console.log(state.currentShowViews);
  contentViewClick(state.currentShowViews[state.currentShowViews.length - 1], state.currentShowViews.length - 1)
}


const contentViewClick = (item, index) => {
  state.currentSelectIndex = index;

}

const settingUpdate = (setting) => {
  if (state.currentSelectIndex > -1) {
    if(setting.type && setting.type.length > 0){
    state.currentShowViews[state.currentSelectIndex].type = setting.type;
    }
    state.currentShowViews[state.currentSelectIndex].setting = setting;
    state.currentShowViews[state.currentSelectIndex].style = `background-color:${setting.backgroundColor};border-radius:${setting.cornerRadius}px ;color:${setting.titleColor};`;
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

const onMergeAnalyCode = () =>{

  var result = state.clipText.split(/(UIView \*view =|UILabel \*label =)/); 
  let filtered = [];

for (let i = 0; i < result.length; i++) {
  if (result[i] === 'UIView *view =' || result[i] === 'UILabel *label =') {
    filtered.push(result[i]);
  } else {
    filtered[filtered.length - 1] += result[i]; 
  }
}
console.log(filtered);
for (let i = 0; i < filtered.length; i++) {
  if (filtered[i].startsWith('UIView *view =')) {
  leftBtnClick({
    type:'UIView',
    name:'view',
    clipText:filtered[i]
  })
} else if (filtered[i].startsWith('UILabel *label =')) {
  leftBtnClick({
    type:'UILabel',
    name:'label',
    clipText:filtered[i]
  })
}
}
}

const onAddClip = async () => {
  state.clipText += await navigator.clipboard.readText()
};

const goToLink = () => {
  window.open("https://github.com/whyPeanutbutter/WHYiOSCreatorWeb/issues/1", "_blank");

  // window.location.href = 'https://github.com/whyPeanutbutter/WHYiOSCreatorWeb/issues/1';
}

const goToSetting = () => {
  const route = router.resolve({
      path: '/userSetting',
      query: { foo: 'bar' }
    });
    window.open(route.href, '_blank');
  // router.push({
  //     name: 'userSetting'
  //   })

}


</script>

<style scoped lang="less">
body {
  width: 100%;
}

.left-btn {
  background: #4f91ec;
  width: 95%;
  margin-bottom: 5px;
  margin-right: 5px;
  height: 55px;
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
  margin-right: 10px;

}

.main-clip{
  min-height: calc(100vh - 200px);
  border: 2px solid #000;
  background: #e7e5e5;
  width: 400px;
  box-sizing: border-box;
  position: relative;

  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  margin-right: 10px;
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

.feedback {
  padding: 7px;
  position: absolute;
  background: #d35b64;
  font-size: 16px;
  color: white;
  border-radius: 5px;
  left: 20px;
    top: 10px;
}


.setting{
  padding: 7px;
  position: absolute;
  background: #409eff;
  font-size: 16px;
  color: white;
  border-radius: 5px;
  right: 20px;
    top: 10px;
}
</style>
