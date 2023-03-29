<template>
    <el-form :model="form" label-width="120px">
        <div style="margin-bottom: 10px">
            设置
        </div>
        <el-form-item label="名称">
            <el-input v-model="form.data.name" />
        </el-form-item>
          <el-form-item label="帮我解析">
            <div class="flex-row">
                <el-input v-model="form.helpMe" placeholder="粘贴数据"/>
                <el-button @click="onAddClip">粘贴</el-button>
                <el-button @click="onHelpMe">解析</el-button>
            </div>
        </el-form-item>
        <el-form-item label="常用简单属性">
            <el-checkbox-group class="flex-col-start" v-model="form.data.commonSettings">
                <el-checkbox label="init" name="init" />
                <el-checkbox label="addSubView" name="addSubView" />
                <el-checkbox label="frame" name="frame" />
                <el-checkbox label="delegate" name="delegate"></el-checkbox>
                <el-checkbox label="@available(iOS 11.0, *)" name="@available(iOS 11.0, *)"></el-checkbox>
                <div class="flex-row">
                    <el-checkbox label="conrnerRadius" name="conrnerRadius"></el-checkbox>
                    <el-input class='select-input' placeholder="6" v-model="form.data.conrnerRadius" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="backgroundColor" name="backgroundColor"></el-checkbox>
                    <el-input class='select-input' placeholder="#fff" v-model="form.data.backgroundColor" />
                </div>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="masonrys">
            <el-checkbox-group class="flex-row flex-wrap" v-model="form.data.masonrys">
                <el-checkbox label="top" />
                <el-checkbox label="left" />
                <el-checkbox label="right" />
                <el-checkbox label="bottom" />
                <el-checkbox label="width" />
                <el-checkbox label="height" />
                <el-checkbox label="size" />
                <el-checkbox label="edges" />
                <el-checkbox label="centerX" />
                <el-checkbox label="centerY" />
                <el-checkbox label="center" />
                <el-checkbox label="left-View" />
                <el-checkbox label="top-View" />
                <el-checkbox label="right-View" />
            </el-checkbox-group>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onCreate(form.data, true)">Create</el-button>
            <el-button @click="onReset">Reset</el-button>
            <el-button @click="onDelete">删除视图</el-button>
        </el-form-item>
    </el-form>
    <el-input v-model="form.result" type="textarea" :rows="10"/>
</template>

<script setup>
import { reactive, watch, defineEmits, defineProps, toRef } from 'vue';
import * as $utils from './Utils';


const emits = defineEmits(['create', 'delete', 'update']);

const props = defineProps({
    form: {
        type: Object,
        default: () => ({}),
    }
});

// do not use same name with ref
var form = reactive({
    data: {
        name: 'scrollView',
        commonSettings: ["addSubView","init"],
        conrnerRadius: '4',
        backgroundColor: '#fff',
        masonrys: []
    },
    helpMe:'',
    result: '点击create生成代码'
});

const resetForm = () => {
    console.log('reset');
    form.data = {
        name: 'scrollView',
        commonSettings: ["addSubView","init"],
        conrnerRadius: '4',
        backgroundColor: '#fff',
        masonrys: []
    }
};

watch(() => props.form, (newValue, oldValue) => {
    if (newValue.name) {
        form.data = newValue
    } else {
        resetForm()
        }
}, {
    deep: true,
    immediate: true
});

const onCreate = (formData, needCopy = false) => {
    let commonSettings = formData.commonSettings;
    let init = commonSettings.indexOf('init') > -1 ? `UIScrollView *${formData.name} = [[UIScrollView alloc]init];\n${formData.name}.showsVerticalScrollIndicator = NO;\n${formData.name}.showsHorizontalScrollIndicator = NO;\n${formData.name}.bounces = YES;//添加后不支持下拉刷新\n` : '';
    let addSubView = commonSettings.indexOf('addSubView') > -1 ? `[<#self#> addSubview:${formData.name}];\n` : '';
    let aviIOS11 = commonSettings.indexOf('@available(iOS 11.0, *)') > -1 ? `if (@available(iOS 11.0, *)) {\n${formData.name}.insetsLayoutMarginsFromSafeArea = NO;\n${formData.name}.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;\n} <#else {\n self.automaticallyAdjustsScrollViewInsets = NO;\n}#>\n` : '';
    let frame = commonSettings.indexOf('frame') > -1 ? `${formData.name}.frame = CGRectMake(<#CGFloat x#>, <#CGFloat y#>, <#CGFloat width#>, <#CGFloat height#>);\n` : '';
    let delegate = commonSettings.indexOf('delegate') > -1 ? `UIScrollViewDelegate \n${formData.name}.delegate = self;\n` : '';
    let conrnerRadius = commonSettings.indexOf('conrnerRadius') > -1 ? `${formData.name}.layer.cornerRadius = ${formData.conrnerRadius};\n${formData.name}.layer.masksToBounds = YES;\n` : '';
    let backgroundColor = commonSettings.indexOf('backgroundColor') > -1 ? `${formData.name}.backgroundColor = ${$utils.getColor(formData.backgroundColor)};\n` : '';
    let mansoryStr = $utils.getMansorys(formData.masonrys);
    let masonry = formData.masonrys?.length > 0 ? `[${formData.name} mas_makeConstraints:^(MASConstraintMaker *make) {
        ${mansoryStr}
    }];\n`: ''
    var result =  `${init}${frame}${addSubView}${conrnerRadius}${aviIOS11}${backgroundColor}${delegate}${masonry}\n`
    console.log(result);
    form.result = result;
    emits('create', result)
    if (needCopy) {
        $utils.copy(result)
        form.result = '已复制到剪切板\n' + result;
    }
};

const onReset = () => {
    resetForm()
};

const onDelete = () => {
    emits('delete')
};

watch(() => form.data, (newValue, oldValue) => {
    emits('update', newValue)
    onCreate(newValue,false)
}, {
    deep: true,
    immediate: true
});


const onAddClip = async() => {
    form.helpMe = await navigator.clipboard.readText()
    onHelpMe()
};

const onHelpMe = async() => {
    let re = $utils.analyViewData(form.helpMe)
    console.log(re);
    for (let key in form.data) {
  if (re.hasOwnProperty(key)) {
    form.data[key] = re[key];
    console.log(key);
  }
}
};
</script>

<style>
.flex-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;

}

.flex-wrap {
    flex-wrap: wrap;
}

.flex-col-start {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
}

.select-input{
    width: 150px !important;
    margin-right: 10px;
    margin-left: 5px;
}
</style>