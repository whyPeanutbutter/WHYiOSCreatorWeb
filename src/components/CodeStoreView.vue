<template>
    <el-form :model="form" label-width="90px">
        <div style="margin-bottom: 10px">
            
        </div>
        <!-- <el-form-item label="搜索">
            <div class="flex-col-start">
                <el-autocomplete v-model="form.analycodeRadioSelect" :fetch-suggestions="suggestions" :trigger-on-focus="false"
                    clearable class="inline-input w-50" placeholder="Please Input" @select="onCreate()" />
            </div>
        </el-form-item> -->
        <el-form-item label="">
            <el-radio-group class="flex-col-start" v-model="form.analycodeRadioSelect">
                <template v-for="(item, index) in form.codeList" :key="index">
                    <el-radio class="radio-item" :label="item" :name="item" border />
                </template>
            </el-radio-group>
        </el-form-item>
    </el-form>
    <el-input v-model="form.result" type="textarea" :rows="15" />
</template>

<script setup>
import { reactive, watch, defineEmits, defineProps, toRef } from 'vue';
import * as $utils from './Utils';

// do not use same name with ref
var form = reactive({
    codeList: [
        'scrollview子视图点击居中'],
    analycodeRadioSelect: '',
    result: ''
});


const suggestions=(cb)=>{
    cb(form.codeList) 
}

const onCreate = () => {
    var result = ''
    switch (form.analycodeRadioSelect) {
        case 'scrollview子视图点击居中':
            result = ` UIView *subview = bottomLogoViews[index];\n  UIScrollView *scrollView = (UIScrollView *)subview.superview;\n\n  CGFloat scrollViewCenterX = scrollView.frame.size.width * 0.5;\n  if (scrollViewCenterX == 0) {\nreturn;\n  }\n\n  if (scrollView.contentSize.width < scrollView.frame.size.width) {\nreturn;\n  }\n\n  CGFloat subviewCenterX = subview.center.x;\n  if (subviewCenterX < scrollViewCenterX) {\n[scrollView setContentOffset:CGPointMake(0, 0) animated:YES];\n  } else if (subviewCenterX > scrollViewCenterX) {\nCGFloat unVisiableWidth = scrollView.contentSize.width - scrollView.frame.size.width;\nCGFloat needOffset = subviewCenterX - scrollViewCenterX;\nif (unVisiableWidth > needOffset) {//剩下的可滑动的区域可以给与偏移\n [scrollView setContentOffset:CGPointMake(needOffset, 0) animated:YES];\n} else {//剩下的已经不够了, 那么就直接显示\n [scrollView setContentOffset:CGPointMake(unVisiableWidth, 0) animated:YES];\n}\n  }\n`;
            break;
        default:
            break;
    }
    if (result.length > 0) {
        $utils.copy(result)
        form.result = '已复制到剪切板\n' + result;
    }

};

watch(() => form.analycodeRadioSelect, (newValue, oldValue) => {
    onCreate()
}, {
    deep: true,
    immediate: true
});

</script>

<style>
.flex-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    width: 100%;

}

.flex-wrap {
    flex-wrap: wrap;
}

.flex-col-start {
    display: flex !important;
    align-items: flex-start !important;
    justify-content: flex-start;
    flex-direction: column;
    width: 100%;

}

.box-item {
    margin-top: 5px;

}

.radio-item {
    margin-bottom: 10px;
}
</style>