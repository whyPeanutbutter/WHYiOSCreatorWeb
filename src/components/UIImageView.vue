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
                <el-button @click="onHelpMe">解析</el-button>
            </div>
        </el-form-item>
        <el-form-item label="常用简单属性">
            <el-checkbox-group class="flex-col-start" v-model="form.data.commonSettings">
                <el-checkbox label="addSubView" name="addSubView" />
                <el-checkbox label="frame" name="frame" />
                <div class="flex-row">
                    <el-checkbox label="image" name="image"></el-checkbox>
                    <el-input style="margin-left: 5px;" placeholder="imageName" v-model="form.data.imageName" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="imageUrl" name="imageUrl"></el-checkbox>
                    <el-input style="margin-left: 5px;" placeholder="imageUrl" v-model="form.data.imageName" />
                </div>
                <el-checkbox label="click" name="click" />
                <div class="flex-row">
                    <el-checkbox label="conrnerRadius" name="conrnerRadius"></el-checkbox>
                    <el-input style="margin-left: 5px;" placeholder="6" v-model="form.data.conrnerRadius" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="contentMode" name="contentMode"></el-checkbox>
                    <el-select style="margin-left: 5px;" v-model="form.data.contentMode" size="small">
                        <el-option  label="拉伸图片，填满" value="UIViewContentModeScaleToFill" />
                        <el-option  label="保持比例，多余留空" value="UIViewContentModeScaleAspectFit" />
                        <el-option  label="保持比例，剪裁填满" value="UIViewContentModeScaleAspectFill" />
                    </el-select>
                    
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
        name: 'ImgView',
        commonSettings: ["addSubView"],
        conrnerRadius: '4',
        imageName: 'imageName',
        contentMode: 'UIViewContentModeScaleAspectFit',
        masonrys: []
    },
    helpMe:'',
    result: '点击create生成代码'
});

const resetForm = () => {
    console.log('reset');
    form.data = {
        name: 'ImgView',
        commonSettings: ["addSubView"],
        conrnerRadius: '4',
        imageName: 'imageName',
        contentMode: 'UIViewContentModeScaleAspectFit',
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
    let addSubView = commonSettings.indexOf('addSubView') > -1 ? `[<#self#> addSubview:${formData.name}];\n` : '';
    let frame = commonSettings.indexOf('frame') > -1 ? `${formData.name}.frame = CGRectMake(<#CGFloat x#>, <#CGFloat y#>, <#CGFloat width#>, <#CGFloat height#>);\n` : '';
    let image = commonSettings.indexOf('image') > -1 ? `${formData.name}.image = [UIImage imageNamed:@"${formData.imageName}"];\n` : '';
    let click = commonSettings.indexOf('click') > -1 ? `${formData.name}.userInteractionEnabled = YES;\nUITapGestureRecognizer *${formData.name}TapGestureRecognizer = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(${formData.name}Tap:)];\n[${formData.name} addGestureRecognizer:${formData.name}TapGestureRecognizer];\n\n-(void)${formData.name}Tap:(UITapGestureRecognizer *)tap{\ntap.view\n}` : '';
    let conrnerRadius = commonSettings.indexOf('conrnerRadius') > -1 ? `${formData.name}.layer.cornerRadius = ${formData.conrnerRadius};\n${formData.name}.layer.masksToBounds = YES;\n` : '';
    let imageUrl = commonSettings.indexOf('imageUrl') > -1 ? `#import "UIImageView+WebCache.h"\n [${formData.name} sd_setImageWithURL:[NSURL URLWithString:${formData.imageName}] placeholderImage:[UIImage imageNamed: @"jsbcDefault"]];\n` : '';
    let contentMode = commonSettings.indexOf('contentMode') > -1 ? ` ${formData.name}.contentMode = ${formData.contentMode};\n` : '';
    let mansoryStr = $utils.getMansorys(formData.masonrys);
    let masonry = formData.masonrys?.length > 0 ? `[${formData.name} mas_makeConstraints:^(MASConstraintMaker *make) {
        ${mansoryStr}
    }];\n`: ''
    var result = `UIImageView *${formData.name} = [[UIImageView alloc] init];\n` +
        `${frame}${image}${imageUrl}${conrnerRadius}${contentMode}${addSubView}${masonry}${click}\n`
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
</style>