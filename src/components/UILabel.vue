<template>
    <el-form :model="form" label-width="120px">
        <div style="margin-bottom: 10px">
            设置
        </div>
        <el-form-item label="名称">
            <el-input v-model="form.data.name" />
        </el-form-item>
        <el-form-item label="常用简单属性">
            <el-checkbox-group class="flex-col-start" v-model="form.data.commonSettings">
                <el-checkbox label="addSubView" name="addSubView" />
                <el-checkbox label="frame" name="frame" />
                <el-checkbox label="click" name="click" />
                <div class="flex-row">
                    <el-checkbox label="conrnerRadius" name="conrnerRadius"></el-checkbox>
                    <el-input style="margin-left: 5px;" placeholder="6" v-model="form.data.conrnerRadius" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="backgroundColor" name="backgroundColor"></el-checkbox>
                    <el-input style="margin-left: 5px;" placeholder="#fff" v-model="form.data.backgroundColor" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="numberOfLine" name="numberOfLine"></el-checkbox>
                    <el-input style="margin-left: 5px;" placeholder="1" v-model="form.data.numberOfLine" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="border" name="border"></el-checkbox>
                    <el-input style="margin-left: 5px;" placeholder="borderColor" v-model="form.data.borderColor" />
                </div>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="title" >
            <el-switch v-model="form.data.haveTitle" />
            <div v-if="form.data.haveTitle">
                <el-input style="margin-left: 5px;" placeholder="文字" v-model="form.data.titleName" />
                <el-input style="margin-left: 5px;" placeholder="颜色" v-model="form.data.titleColor" />
                <el-input style="margin-left: 5px;" placeholder="大小" v-model="form.data.titleSize" />
                <el-radio-group v-model="form.data.textAlign" style="width:100%">
                    <el-radio-button label="Left" />
                    <el-radio-button label="Center"/>
                    <el-radio-button label="Right" />
                </el-radio-group>
            </div>
        </el-form-item>
        <el-form-item label="attributedText">
            <el-switch v-model="form.data.haveAttributedText" />
            <div v-if="form.data.haveAttributedText" style="width:100%">
                <el-checkbox-group class="flex-col-start" v-model="form.data.attributedTextSettings">
                <el-checkbox label="局部变色" />
                <el-checkbox label="局部font"/>
                <el-checkbox label="paragraphStyle"/>
            </el-checkbox-group>
            </div>
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
    <el-input v-model="form.result" type="textarea" :rows="10" />
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
        name: 'label',
        commonSettings: ["addSubView"],
        conrnerRadius: '4',
        backgroundColor: '#fff',
        borderColor: 'borderColor',
        haveTitle: false,
        haveAttributedText:false,
        attributedTextSettings:[],
        titleSize: '',
        titleColor: '',
        titleName: '',
        textAlign:'Center',
        numberOfLine:'1',
        masonrys: []
    },
    result: '点击create生成代码'
});

const resetForm = () => {
    console.log('reset');
    form.data = {
        name: 'label',
        commonSettings: ["addSubView"],
        conrnerRadius: '4',
        backgroundColor: '#fff',
        borderColor: 'borderColor',
        haveTitle: false,
        haveAttributedText:false,
        attributedTextSettings:[],
        titleSize: '',
        titleColor: '',
        titleName: '',
        textAlign:'Center',
        numberOfLine:'1',
        masonrys: []
    }
};

watch(() => props.form, (newValue, oldValue) => {
    console.log('props');
    console.log(newValue);
    if (newValue.name) {
        form.data = newValue
    } else {
        resetForm()
        console.log('reset');
    }
}, {
    deep: true,
    immediate: true
});

const onCreate = (formData, needCopy = false) => {
    let commonSettings = formData.commonSettings;
    let addSubView = commonSettings.indexOf('addSubView') > -1 ? `[<#self#> addSubview:${formData.name}];\n` : '';
    let frame = commonSettings.indexOf('frame') > -1 ? `${formData.name}.frame = CGRectMake(<#CGFloat x#>, <#CGFloat y#>, <#CGFloat width#>, <#CGFloat height#>);\n` : '';
    let click = commonSettings.indexOf('click') > -1 ? `[${formData.name} addTarget:self action:@selector(<#${formData.name}Clicked:#>) forControlEvents:UIControlEventTouchUpInside];\n\n- (void)${formData.name}Clicked:(UIButton *)button{\n\n}\n` : '';
    let image = commonSettings.indexOf('image') > -1 ? `[${formData.name} setImage:[UIImage imageNamed:@"${formData.imageName}"] forState:UIControlStateNormal];\n` : '';
    let conrnerRadius = commonSettings.indexOf('conrnerRadius') > -1 ? `${formData.name}.layer.cornerRadius = ${formData.conrnerRadius};\n${formData.name}.layer.masksToBounds = YES;\n` : '';
    let backgroundColor = commonSettings.indexOf('backgroundColor') > -1 ? `${formData.name}.backgroundColor = ${$utils.getColor(formData.backgroundColor)};\n` : '';
    let border = commonSettings.indexOf('border') > -1 ? `[${formData.name}.layer setBorderColor:${$utils.getColor(formData.borderColor)}.CGColor];\n[${formData.name}.layer setBorderWidth:<#1.0#>];\n` : '';
    let numberOfLine = commonSettings.indexOf('numberOfLine') > -1 ? `${formData.name}.numberOfLines = ${formData.numberOfLine};\n`:'';
    let title = formData.haveTitle ? `${formData.name}.text = @"${formData.titleName}";\n${formData.name}.textAlignment = NSTextAlignment${formData.textAlign};\n[${formData.name}.textColor:${$utils.getColor(formData.titleColor)};\n${formData.name}.font = ${$utils.getFont(formData.titleSize)};\n` : ''
    let haveAttributedText = formData.haveAttributedText ? $utils.getAttributedText(formData.name + 'AttributedString',formData.attributedTextSettings):'';
    let mansoryStr = $utils.getMansorys(formData.masonrys);
    let masonry = formData.masonrys?.length > 0 ? `[${formData.name} mas_makeConstraints:^(MASConstraintMaker *make) {
        ${mansoryStr}
    }];\n`: ''
    var result = `UILabel *${formData.name} = [[UILabel alloc]init];\n` +
        `${frame}${addSubView}${numberOfLine}${title}${haveAttributedText}${conrnerRadius}${backgroundColor}${border}${masonry}${click}\n`
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
</style>