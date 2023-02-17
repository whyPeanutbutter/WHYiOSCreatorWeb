<template>
    <el-form :model="form" label-width="120px">
        <div style="margin-bottom: 10px">
            代码解析
        </div>
        <el-form-item label="代码">
            <el-input v-model="form.codeText" placeholder="粘贴代码" type="textarea" :rows="10" />
            <el-button type="primary" @click="onAddClip" style="width: 100%;">粘贴</el-button>
        </el-form-item>
        <el-form-item label="处理方式">
            <el-radio-group class="flex-col-start" v-model="form.data.analycodeRadioSelect">
                <el-tooltip class="box-item" effect="dark" content="如：UIView *name;" placement="right">
                    <el-radio label="提取类及名" name="提取类及名" border :disabled="form.codeText?.length == 0" />
                </el-tooltip>
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
    data: {
        analycodeRadioSelect: "",
    },
    codeText: '',
    result: ''
});



const onCreate = (formData, needCopy = false) => {

    if (form.codeText?.length > 0 && formData.analycodeRadioSelect?.length > 0) {
        var result = ''
        let selectRadio = formData.analycodeRadioSelect;
        switch (selectRadio) {
            case '提取类及名':
                var nameResults = form.codeText.match(/(UIView|UIButton|UILabel|UIScrollView|UIImageView|UITableView|UICollectionView) \*[^ =]+/g);//[^=]代表在等号前截止匹配
                result = form.codeText.replace(/(UIView|UIButton|UILabel|UIScrollView|UIImageView|UITableView|UICollectionView) \*/g, '');

                let nameStr = '';
                for (var name of nameResults) {
                    nameStr = nameStr + name + ';\n';
                    console.log(name);
                }
                result  = nameStr + result;
                break;
            default:
                break;
        }
        if (needCopy) {
            console.log(2222);
            $utils.copy(result)
            form.result = '已复制到剪切板\n' + result;
        }

    }
    // console.log(analycodeRadioSelect,111111111);
    // switch()
    // let init = analycodeRadioSelect.indexOf('init') > -1 ? `UIView *${formData.name} = [[UIView alloc] init];\n` : '';
    // let addSubView = analycodeRadioSelect.indexOf('addSubView') > -1 ? `[<#self#> addSubview:${formData.name}];\n` : '';
    // let frame = analycodeRadioSelect.indexOf('frame') > -1 ? `${formData.name}.frame = CGRectMake(<#CGFloat x#>, <#CGFloat y#>, <#CGFloat width#>, <#CGFloat height#>);\n` : '';
    // let click = analycodeRadioSelect.indexOf('click') > -1 ? `${formData.name}.userInteractionEnabled = YES;\nUITapGestureRecognizer *${formData.name}TapGestureRecognizer = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(${formData.name}Tap:)];\n[${formData.name} addGestureRecognizer:${formData.name}TapGestureRecognizer];\n\n-(void)${formData.name}Tap:(UITapGestureRecognizer *)tap{\ntap.view\n}` : '';
    // let conrnerRadius = analycodeRadioSelect.indexOf('conrnerRadius') > -1 ? `${formData.name}.layer.cornerRadius = ${formData.conrnerRadius};\n${formData.name}.layer.masksToBounds = YES;\n` : '';
    // let backgroundColor = analycodeRadioSelect.indexOf('backgroundColor') > -1 ? `${formData.name}.backgroundColor = ${$utils.getColor(formData.backgroundColor)};\n` : '';
    // let border = analycodeRadioSelect.indexOf('border') > -1 ? `[${formData.name}.layer setBorderColor:${$utils.getColor(formData.borderColor)}.CGColor];\n[${formData.name}.layer setBorderWidth:<#1.0#>];\n` : '';
    // let bottomCor = analycodeRadioSelect.indexOf('下侧圆角') > -1 ? `  UIBezierPath *maskPath = [UIBezierPath bezierPathWithRoundedRect:${formData.name}.bounds<#CGRectMake(0, 0, 100, 100)#> byRoundingCorners:UIRectCornerBottomLeft | UIRectCornerBottomRight cornerRadii:CGSizeMake(10, 10)];
    // CAShapeLayer *maskLayer = [[CAShapeLayer alloc] init];
    // maskLayer.frame = ${formData.name}.bounds;
    // maskLayer.path = maskPath.CGPath;
    // ${formData.name}.layer.mask = maskLayer;` : '';
    // let mansoryStr = $utils.getMansorys(formData.masonrys);
    // let masonry = formData.masonrys?.length > 0 ? `[${formData.name} mas_makeConstraints:^(MASConstraintMaker *make) {
    //     ${mansoryStr}
    // }];\n`: ''
    // var result =
    //     `${init}${frame}${addSubView}${conrnerRadius}${bottomCor}${backgroundColor}${border}${masonry}${click}\n`
    // console.log(result);
    // form.result = result;
    // emits('create', result)
    // if (needCopy) {
    //     $utils.copy(result)
    //     form.result = '已复制到剪切板\n' + result;
    // }
};

watch(() => form.data, (newValue, oldValue) => {
    onCreate(newValue, true)
}, {
    deep: true,
    immediate: true
});

watch(() => form.codeText, (newValue, oldValue) => {
    console.log(111111);
    form.data.analycodeRadioSelect = ''
}, {
    deep: true,
    immediate: true
});


const onAddClip = async () => {
    form.codeText = await navigator.clipboard.readText()
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