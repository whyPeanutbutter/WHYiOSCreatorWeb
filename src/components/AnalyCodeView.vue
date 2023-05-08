<template>
    <el-form :model="form" label-width="90px">
        <div style="margin-bottom: 10px">
            代码解析
        </div>
        <el-form-item label="代码">
            <div class="flex-col-start">
                <el-input v-model="form.codeText" placeholder="粘贴代码" type="textarea" :rows="10" style="width: 500px;" />
                <el-button type="primary" @click="onAddClip" style="width:500px;">粘贴</el-button>
            </div>
        </el-form-item>
        <el-form-item label="处理方式">
            <el-radio-group class="flex-col-start" v-model="form.data.analycodeRadioSelect">
                <el-tooltip class="box-item" effect="dark" content="将接口文档转换为属性" placement="right">
                    <el-radio class="radio-item" label="api转属性" name="api转属性" border
                        :disabled="form.codeText?.length == 0" />
                </el-tooltip>
                <el-tooltip class="box-item" effect="dark" content="如：UIView *name;" placement="right">
                    <el-radio class="radio-item" label="提取类及名" name="提取类及名" border :disabled="form.codeText?.length == 0" />
                </el-tooltip>
                <el-tooltip class="box-item" effect="dark" content="将代码转换为代码库格式" placement="right">
                    <el-radio class="radio-item" label="转换代码库" name="转换代码库" border
                        :disabled="form.codeText?.length == 0" />
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
                result = nameStr + result;
                break;
            case "api转属性":
                result = convertApi(form.codeText)
                break;
            case "转换代码库":
                result = convertCodeKu(form.codeText)
            default:
                break;
        }
        if (needCopy) {
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

const convertApi = (apiText) => {
    var result = ''
    apiText = apiText.replaceAll('\t\n', '\n');
    apiText = apiText.replaceAll('\t', '##')
    var lineArr = apiText.split("\n");
    lineArr.filter(word => word.length > 6);
    var noInferString = "以下是程序无法推断的属性或是不需要的注释:"
    for (let index = 0; index < lineArr.length; index++) {
        const lineElement = lineArr[index];
        var lineEleArr = lineElement.split('##')
        //预处理
        lineEleArr = lineEleArr.filter(word => word.length > 0 || word != '可选' || word != '必选' || word != 'true' || word != 'false');
        if (lineEleArr?.length == 0 || lineArr[0] == '参数') {
            continue
        }

        var lineEleArrLower = [...lineEleArr]
        for (let i = 0; i < lineEleArrLower.length; i++) {
            lineEleArrLower[i] = lineEleArrLower[i].toLowerCase()
        }

        var propertyName = lineEleArr[0].charAt(0).toLowerCase() + lineEleArr[0].slice(1);
        var propertyDes = ''
        if (lineEleArr.length > 1) {
            propertyDes = '//' + lineEleArr[1];
        }

        console.log('lineEleArrLower ' + lineEleArrLower);
        console.log('propertyName ' + propertyName);
        if (lineEleArrLower.length > 1) {
            if (['string'].filter(v => lineEleArrLower.includes(v)).length > 0) {
                result = `${result}\n@property (nonatomic, copy) NSString *${propertyName};${propertyDes}`
            } else if (['int', 'long', 'datetime', 'number', 'integer', 'date','integer(int32)', 'integer(int64)'].filter(v => lineEleArrLower.includes(v)).length > 0) {
                result = `${result}\n@property (nonatomic, assign) NSInteger ${propertyName};${propertyDes}`
            } else if (['bool', 'boolean'].filter(v => lineEleArrLower.includes(v)).length > 0) {
                result = `${result}\n@property (nonatomic, assign) BOOL ${propertyName};${propertyDes}`
            } else if (['double', 'float',].filter(v => lineEleArrLower.includes(v)).length > 0) {
                result = `${result}\n@property (nonatomic, assign) CGFloat ${propertyName};${propertyDes}`
            } else if (lineEleArrLower[1].indexOf('list<') > -1) {
                result = `${result}\n@property (nonatomic, strong) NSArray<${lineEleArr[1].slice(5, -1)}*> *${propertyName};(这是推测类型)${propertyDes}`
            } else {
                result = `${result}\n@property (nonatomic, strong) ${lineEleArr[1]} *${propertyName};(这是推测类型)${propertyDes}`
            }
        } else {
            result = `${result}\n${lineEleArr[1]}//未知，请改进`
        }
    }
    return result

};

const convertCodeKu = (apiText) => {
    return '`'+ apiText.replaceAll('\n','\\n').replaceAll('   ','')+'\\n`'
}


watch(() => form.data, (newValue, oldValue) => {
    onCreate(newValue, true)
}, {
    deep: true,
    immediate: true
});

watch(() => form.codeText, (newValue, oldValue) => {
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