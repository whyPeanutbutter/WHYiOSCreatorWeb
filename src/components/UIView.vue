<template>
    <el-form :model="form" label-width="120px">
        <div style="margin-bottom: 10px">
            UIView设置
        </div>
        <el-form-item label="名称">
            <div class="flex-row">
               <el-input v-model="form.data.name" />
               <el-select v-model="form.data.type">
                    <el-option
                    v-for="item in $utils.typeOptions()"
                    :key="item"
                    :label="item"
                    :value="item"
                    :disabled="form.data.type == item"
                    />
                </el-select>
            </div>
        </el-form-item>
        <el-form-item label="帮我解析">
            <div class="flex-row">
                <el-input v-model="form.helpMe" placeholder="粘贴数据" />
                <el-button @click="onAddClip">粘贴</el-button>
                <el-button @click="onHelpMe">解析</el-button>
            </div>
        </el-form-item>
        <el-form-item label="常用简单属性">
            <el-checkbox-group class="flex-col-start" v-model="form.data.commonSettings">
                <el-checkbox label="init" name="init" />
                <el-checkbox label="addSubView" name="addSubView" />
                <el-checkbox label="frame" name="frame" />
                <el-checkbox label="click" name="click" />
                <el-checkbox label="下侧圆角" name="下侧圆角" />
                <el-checkbox label="阴影" name="阴影" />
                <div class="flex-row">
                    <el-checkbox label="cornerRadius" name="cornerRadius"></el-checkbox>
                    <el-input class='select-input' placeholder="6" v-model="form.data.cornerRadius" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="backgroundColor" name="backgroundColor"></el-checkbox>
                    <el-input class='select-input' placeholder="#fff" v-model="form.data.backgroundColor" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="border" name="border"></el-checkbox>
                    <el-input class='select-input' placeholder="borderColor" v-model="form.data.borderColor" />
                </div>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="masonrys">
            <el-input placeholder="快捷输入简称：lrtbwhsecxcyclvtvrvbv" v-model="form.data.quickMasonrys" />
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
                <el-checkbox label="bottom-View" />
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
import { reactive, watch, defineEmits, defineProps, toRef,getCurrentInstance } from 'vue';
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
        name: 'view',
        commonSettings: ["addSubView", "init"],
        cornerRadius: '4',
        backgroundColor: '#fff',
        borderColor: 'borderColor',
         masonrys: [],
        quickMasonrys: '',
        frame:[0,0,0,0],
        type: 'UIView',
    },
    helpMe: '',
    result: '点击create生成代码',
    firstLoad:true,
});

const resetForm = () => {
    console.log('reset');
    form.data = {
        name: 'View',
        commonSettings: ["addSubView", "init"],
        cornerRadius: '4',
        backgroundColor: '#fff',
        borderColor: 'borderColor',
         masonrys: [],
        quickMasonrys: '',
        frame:[0,0,0,0],
        type: 'UIView',
    }
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

watch(() => form.data.quickMasonrys, (newValue, oldValue) => {
     if(!newValue ||  newValue == '' ){
        return
    }
    newValue = newValue.toLocaleLowerCase()
    form.data.quickMasonrys = newValue
    let copy = newValue;
    copy = copy.replace('cx', 'x').replace('cy', 'y').replace('lv', 'a').replace('rv', 'm').replace('tv', 'o').replace('bv', 'j')
    var newMasonrys = []
    var map = {
        'l': 'left',
        'r': 'right',
        't': 'top',
        'b': 'bottom',
        'w': 'width',
        'h': 'height',
        's': 'size',
        'x': 'centerX',
        'e': 'edges',
        'y': 'centerY',
        'c': 'center',
        'a': 'left-View',
        'm': 'right-View',
        'o': 'top-View',
        'j': 'bottom-View',
    }
    copy.split("").forEach(element => {
        if (map[element]) {
            newMasonrys.push(map[element])
        }
    });
    console.log('已选择 ', newMasonrys)
    form.data.masonrys = newMasonrys;
}, {
    deep: true,
    immediate: true
});

watch(() => props.form, (newValue, oldValue) => {
    resetForm()
    if(newValue.clipText && newValue.clipText.length > 0){
        form.helpMe = newValue.clipText
        onHelpMe()
    } else if (newValue.name) {
        for (let key in newValue) {
            form.data[key] = newValue[key];
        }
    } 
    form.firstLoad = true
}, {
    deep: true,
    immediate: true
});


const { proxy } = getCurrentInstance();
const onCreate = (formData, needCopy = false) => {
    if(!formData.commonSettings){
        return
    }
    if(!formData.commonSettings){
        return
    }
    if(!$utils.getStorage('isOCTag')){
        onCreateSwift(formData,needCopy)
        return
    }
    let commonSettings = formData.commonSettings;
    let init = commonSettings.indexOf('init') > -1 ? `UIView *${formData.name} = [[UIView alloc] init];\n` : '';
    let addSubView = commonSettings.indexOf('addSubView') > -1 ? `[<#self#> addSubview:${formData.name}];\n` : '';
    if(formData.frame.length < 4){
        formData.frame = [0,0,0,0]
    }
    let frame = commonSettings.indexOf('frame') > -1 ? `${formData.name}.frame = CGRectMake(<#${formData.frame[0]}#>, <#${formData.frame[1]}#>, <#${formData.frame[2]}#>, <#${formData.frame[3]}#>);\n` : '';
    let click = commonSettings.indexOf('click') > -1 ? `${formData.name}.userInteractionEnabled = YES;\nUITapGestureRecognizer *${formData.name}TapGestureRecognizer = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(${formData.name}Tap:)];\n[${formData.name} addGestureRecognizer:${formData.name}TapGestureRecognizer];\n\n-(void)${formData.name}Tap:(UITapGestureRecognizer *)tap{\ntap.view\n}` : '';
    let cornerRadius = commonSettings.indexOf('cornerRadius') > -1 ? `${formData.name}.layer.cornerRadius = ${formData.cornerRadius};\n${formData.name}.layer.masksToBounds = YES;\n` : '';
    let backgroundColor = commonSettings.indexOf('backgroundColor') > -1 ? `${formData.name}.backgroundColor = ${$utils.getColor(formData.backgroundColor)};\n` : '';
    let border = commonSettings.indexOf('border') > -1 ? `[${formData.name}.layer setBorderColor:${$utils.getColor(formData.borderColor)}.CGColor];\n[${formData.name}.layer setBorderWidth:<#1.0#>];\n` : '';
    let bottomCor = commonSettings.indexOf('下侧圆角') > -1 ? `  UIBezierPath *maskPath = [UIBezierPath bezierPathWithRoundedRect:${formData.name}.bounds<#CGRectMake(0, 0, 100, 100)#> byRoundingCorners:UIRectCornerBottomLeft | UIRectCornerBottomRight cornerRadii:CGSizeMake(10, 10)];
    CAShapeLayer *maskLayer = [[CAShapeLayer alloc] init];
    maskLayer.frame = ${formData.name}.bounds;
    maskLayer.path = maskPath.CGPath;
    ${formData.name}.layer.mask = maskLayer;` : '';
    let shadow = commonSettings.indexOf('阴影') > -1 ? ` ${formData.name}.layer.shadowColor = [[UIColor blackColor] CGColor];\n ${formData.name}.layer.shadowOffset = CGSizeMake(0,0);\n ${formData.name}.layer.shadowOpacity = 0.2;\n ${formData.name}.layer.shadowRadius = 6;\n` : '';
    let mansoryStr = $utils.getMansorys(formData.masonrys,formData.frame);
    let masonry = formData.masonrys?.length > 0 ? `[${formData.name} mas_makeConstraints:^(MASConstraintMaker *make) {
        ${mansoryStr}
    }];\n`: ''
    var result =
        `${init}${frame}${addSubView}${cornerRadius}${shadow}${bottomCor}${backgroundColor}${border}${masonry}${click}\n`
    console.log(result);
    form.result = result;
    emits('create', result)
    if (needCopy) {
        $utils.copy(result)
        form.result = '已复制到剪切板\n' + result;
    }
};

const onCreateSwift = (formData, needCopy = false) => {
    let commonSettings = formData.commonSettings;
    let init = commonSettings.indexOf('init') > -1 ? `let ${formData.name} = UIView()\n` : '';
    let addSubView = commonSettings.indexOf('addSubView') > -1 ? `<#self#>.addSubview(${formData.name})\n` : '';
   if(formData.frame.length < 4){
        formData.frame = [0,0,0,0]
    }
    let frame = commonSettings.indexOf('frame') > -1 ? `${formData.name}.frame = CGRect(x: <#x#>, y: <#y#>, width: <#width#>, height: <#height#>)\n` : '';
    let click = commonSettings.indexOf('click') > -1 ? `let tapGesture = UITapGestureRecognizer(target: self, action: #selector(${formData.name}Tapped(_:)))\n${formData.name}.addGestureRecognizer(tapGesture)\n\n@objc func ${formData.name}Tapped(_ sender: UITapGestureRecognizer) {\n// Handle tap\n}\n` : '';
    let cornerRadius = commonSettings.indexOf('cornerRadius') > -1 ? `${formData.name}.layer.cornerRadius = ${formData.cornerRadius}\n${formData.name}.clipsToBounds = true\n` : '';
    let backgroundColor = commonSettings.indexOf('backgroundColor') > -1 ? `${formData.name}.backgroundColor = ${$utils.getColor(formData.backgroundColor)}\n` : '';
    let border = commonSettings.indexOf('border') > -1 ? `${formData.name}.layer.borderColor = ${$utils.getColor(formData.borderColor)}.cgColor\n${formData.name}.layer.borderWidth = <#1.0#>\n` : '';
    let bottomCor = commonSettings.indexOf('下侧圆角') > -1 ? `let maskPath = UIBezierPath(roundedRect: ${formData.name}.bounds, byRoundingCorners: [.bottomLeft, .bottomRight], cornerRadii: CGSize(width: 10, height: 10))\nlet maskLayer = CAShapeLayer()\nmaskLayer.frame = ${formData.name}.bounds\nmaskLayer.path = maskPath.cgPath\n${formData.name}.layer.mask = maskLayer\n` : '';
    let shadow = commonSettings.indexOf('阴影') > -1 ? `${formData.name}.layer.shadowColor = UIColor.black.cgColor\n${formData.name}.layer.shadowOffset = CGSize.zero\n${formData.name}.layer.shadowOpacity = 0.2\n${formData.name}.layer.shadowRadius = 6\n` : '';
    let mansoryStr = $utils.getMansorys(formData.masonrys,formData.frame);
    let masonry = formData.masonrys?.length > 0 ? `${formData.name}.snp.makeConstraints { (make) in\n${mansoryStr}\n}\n` : '';
    var result = `${init}${frame}${addSubView}${cornerRadius}${shadow}${bottomCor}${backgroundColor}${border}${masonry}${click}\n`;
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
        if(!form.firstLoad){
        emits('update', newValue)
    } 
    form.firstLoad = false
    onCreate(newValue, false)
}, {
    deep: true,
    immediate: true
});


const onAddClip = async () => {
    form.helpMe = await navigator.clipboard.readText()
    onHelpMe()
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

.select-input {
    width: 150px !important;
    margin-right: 10px;
    margin-left: 5px;
}
</style>