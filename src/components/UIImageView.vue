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
                <div class="flex-row">
                    <el-checkbox label="image" name="image"></el-checkbox>
                    <el-input class='select-input' placeholder="imageName" v-model="form.data.imageName" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="imageUrl" name="imageUrl"></el-checkbox>
                    <el-input class='select-input' placeholder="imageUrl" v-model="form.data.imageName" />
                </div>
                <el-checkbox label="click" name="click" />
                <div class="flex-row">
                    <el-checkbox label="cornerRadius" name="cornerRadius"></el-checkbox>
                    <el-input class='select-input' placeholder="6" v-model="form.data.cornerRadius" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="contentMode" name="contentMode"></el-checkbox>
                    <el-select class='select-input' v-model="form.data.contentMode" size="small">
                        <el-option  label="拉伸图片，填满" value="UIViewContentModeScaleToFill" />
                        <el-option  label="保持比例，多余留空" value="UIViewContentModeScaleAspectFit" />
                        <el-option  label="保持比例，剪裁填满" value="UIViewContentModeScaleAspectFill" />
                    </el-select>
                    
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
        commonSettings: ["addSubView","init"],
        cornerRadius: '4',
        imageName: 'imageName',
        contentMode: 'UIViewContentModeScaleAspectFit',
         masonrys: [],
        quickMasonrys: ''
    },
    helpMe:'',
    result: '点击create生成代码'
});

const resetForm = () => {
    console.log('reset');
    form.data = {
        name: 'ImgView',
        commonSettings: ["addSubView","init"],
        cornerRadius: '4',
        imageName: 'imageName',
        contentMode: 'UIViewContentModeScaleAspectFit',
         masonrys: [],
        quickMasonrys: ''
    }
};

watch(() => form.data.quickMasonrys, (newValue, oldValue) => {
   if(newValue == ''){
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

    if(!$utils.getStorage('isOCTag')){
        onCreateSwift(formData,needCopy)
        return
    }
    let commonSettings = formData.commonSettings;
    let init = commonSettings.indexOf('init') > -1 ?  `UIImageView *${formData.name} = [[UIImageView alloc] init];\n` : '';
    let addSubView = commonSettings.indexOf('addSubView') > -1 ? `[<#self#> addSubview:${formData.name}];\n` : '';
    let frame = commonSettings.indexOf('frame') > -1 ? `${formData.name}.frame = CGRectMake(<#CGFloat x#>, <#CGFloat y#>, <#CGFloat width#>, <#CGFloat height#>);\n` : '';
    let image = commonSettings.indexOf('image') > -1 ? `${formData.name}.image = ${$utils.getImage(formData.imageName)};\n` : '';
    let click = commonSettings.indexOf('click') > -1 ? `${formData.name}.userInteractionEnabled = YES;\nUITapGestureRecognizer *${formData.name}TapGestureRecognizer = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(${formData.name}Tap:)];\n[${formData.name} addGestureRecognizer:${formData.name}TapGestureRecognizer];\n\n-(void)${formData.name}Tap:(UITapGestureRecognizer *)tap{\ntap.view\n}` : '';
    let cornerRadius = commonSettings.indexOf('cornerRadius') > -1 ? `${formData.name}.layer.cornerRadius = ${formData.cornerRadius};\n${formData.name}.layer.masksToBounds = YES;\n` : '';
    let imageUrl = commonSettings.indexOf('imageUrl') > -1 ? `#import "UIImageView+WebCache.h"\n [${formData.name} sd_setImageWithURL:[NSURL URLWithString:${formData.imageName}] placeholderImage:TTIMAGE_PLACE_HOLDER];\n` : '';
    let contentMode = commonSettings.indexOf('contentMode') > -1 ? ` ${formData.name}.contentMode = ${formData.contentMode};\n` : '';
    let mansoryStr = $utils.getMansorys(formData.masonrys);
    let masonry = formData.masonrys?.length > 0 ? `[${formData.name} mas_makeConstraints:^(MASConstraintMaker *make) {
        ${mansoryStr}
    }];\n`: ''
    var result = 
        `${init}${frame}${image}${imageUrl}${cornerRadius}${contentMode}${addSubView}${masonry}${click}\n`
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
    let init = commonSettings.indexOf('init') > -1 ?  `let ${formData.name} = UIImageView()\n` : '';
    let addSubView = commonSettings.indexOf('addSubView') > -1 ? `self.addSubview(${formData.name})\n` : '';
    let frame = commonSettings.indexOf('frame') > -1 ? `${formData.name}.frame = CGRect(x: <#x#>, y: <#y#>, width: <#width#>, height: <#height#>)\n` : '';
    let image = commonSettings.indexOf('image') > -1 ? `${formData.name}.image = UIImage(named: "${formData.imageName}")\n` : '';
    let click = commonSettings.indexOf('click') > -1 ? `let ${formData.name}Tap = UITapGestureRecognizer(target: self, action: #selector(${formData.name}Tapped))\n${formData.name}.addGestureRecognizer(${formData.name}Tap)\n${formData.name}.isUserInteractionEnabled = true\n\n@objc func ${formData.name}Tapped(_ sender: UITapGestureRecognizer) {\n   <#code#>\n}\n` : '';
    let cornerRadius = commonSettings.indexOf('cornerRadius') > -1 ? `${formData.name}.layer.cornerRadius = ${formData.cornerRadius}\n${formData.name}.clipsToBounds = true\n` : '';
    let imageUrl = commonSettings.indexOf('imageUrl') > -1 ? `${formData.name}.sd_setImage(with: URL(string: "${formData.imageName}"), placeholderImage: UIImage(named: "<#placeholder#>"))\n` : '';
    let contentMode = commonSettings.indexOf('contentMode') > -1 ? `${formData.name}.contentMode = .${formData.contentMode}\n` : '';
    let mansoryStr = $utils.getMansorys(formData.masonrys);
    let masonry = formData.masonrys?.length > 0 ? `${formData.name}.snp.makeConstraints { make in\n    ${mansoryStr}\n}\n`: ''
    var result = 
        `${init}${frame}${image}${imageUrl}${cornerRadius}${contentMode}${addSubView}${masonry}${click}\n`
    console.log(result);
    form.result = result;
    emits('create', result)
    if (needCopy) {
        $utils.copy(result)
        form.result = '已复制到剪切板\n' + result;
    }
}

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