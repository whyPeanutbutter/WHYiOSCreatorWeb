<template>
    <el-form :model="form" label-width="120px">
        <div style="margin-bottom: 10px">
            按钮设置
        </div>
        <el-form-item label="按钮名称">
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
                <el-checkbox label="btnClick" name="btnClick" />
                <div class="flex-row">
                    <el-checkbox label="image" name="image"></el-checkbox>
                    <el-input style="margin-left: 5px;" placeholder="imageName" v-model="form.data.imageName" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="conrnerRadius" name="conrnerRadius"></el-checkbox>
                    <el-input style="margin-left: 5px;" placeholder="6" v-model="form.data.conrnerRadius" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="backgroundColor" name="backgroundColor"></el-checkbox>
                    <el-input style="margin-left: 5px;" placeholder="#fff" v-model="form.data.backgroundColor" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="border" name="border"></el-checkbox>
                    <el-input style="margin-left: 5px;" placeholder="borderColor" v-model="form.data.borderColor" />
                </div>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="title">
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
            <!-- <el-radio-group v-model="form.data.resource">
                <el-radio label="Sponsor" />
                <el-radio label="Venue" />
            </el-radio-group> -->
        </el-form-item>
        <!-- <el-form-item label="Activity form"> -->

        <!-- </el-form-item> -->
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
        name: 'Btn',
        commonSettings: ["addSubView","init"],
        imageName: 'imageName',
        conrnerRadius: '4',
        backgroundColor: '#fff',
        borderColor: 'borderColor',
        haveTitle: false,
        titleSize: '',
        titleColor: '',
        titleName: '',
        textAlign:'Center',
        masonrys: []
    },
    helpMe:'',
    result: '点击create生成代码'
});

const resetForm = () => {
    console.log('reset');
    form.data = {
        name: 'Btn',
        commonSettings: ["addSubView","init"],
        imageName: 'imageName',
        conrnerRadius: '4',
        backgroundColor: '#fff',
        borderColor: 'borderColor',
        haveTitle: false,
        titleSize: '',
        titleColor: '',
        titleName: '',
        textAlign:'Center',
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
    let init = commonSettings.indexOf('init') > -1 ?  `UIButton *${formData.name} = [UIButton buttonWithType:UIButtonTypeCustom];\n` : '';
    let addSubView = commonSettings.indexOf('addSubView') > -1 ? `[<#self#> addSubview:${formData.name}];\n` : '';
    let frame = commonSettings.indexOf('frame') > -1 ? `${formData.name}.frame = CGRectMake(<#CGFloat x#>, <#CGFloat y#>, <#CGFloat width#>, <#CGFloat height#>);\n` : '';
    let btnClick = commonSettings.indexOf('btnClick') > -1 ? `[${formData.name} addTarget:self action:@selector(<#${formData.name}Clicked:#>) forControlEvents:UIControlEventTouchUpInside];\n\n- (void)${formData.name}Clicked:(UIButton *)button{\n\n}\n` : '';
    let image = commonSettings.indexOf('image') > -1 ? `[${formData.name} setImage:[UIImage imageNamed:@"${formData.imageName}"] forState:UIControlStateNormal];\n` : '';
    let conrnerRadius = commonSettings.indexOf('conrnerRadius') > -1 ? `${formData.name}.layer.cornerRadius = ${formData.conrnerRadius};\n${formData.name}.layer.masksToBounds = YES;\n` : '';
    let backgroundColor = commonSettings.indexOf('backgroundColor') > -1 ? `${formData.name}.backgroundColor = ${$utils.getColor(formData.backgroundColor)};\n` : '';
    let border = commonSettings.indexOf('border') > -1 ? `[${formData.name}.layer setBorderColor:${$utils.getColor(formData.borderColor)}.CGColor];\n[${formData.name}.layer setBorderWidth:<#1.0#>];\n` : '';
    let title = formData.haveTitle ? `[${formData.name} setTitle:@"${formData.titleName}" forState:UIControlStateNormal];\n${formData.name}.titleLabel.textAlignment = NSTextAlignment${formData.textAlign};\n[${formData.name} setTitleColor:${$utils.getColor(formData.titleColor)} forState:UIControlStateNormal];\n${formData.name}.titleLabel.font = ${$utils.getFont(formData.titleSize)};\n` : ''
    let mansoryStr = $utils.getMansorys(formData.masonrys);
    let masonry = formData.masonrys?.length > 0 ? `[${formData.name} mas_makeConstraints:^(MASConstraintMaker *make) {
        ${mansoryStr}
    }];\n`: ''
    var result = 
        `${init}${frame}${addSubView}${image}${title}${conrnerRadius}${backgroundColor}${border}${masonry}${btnClick}\n`
    console.log(result);
    form.result = result;
    emits('create', result)
    if (needCopy) {
        $utils.copy(result)
        form.result = '已复制到剪切板\n' + result;
    }
};
// let nameBtn = UIButton(type: .custom)
// self.addSubview(nameBtn)
// nameBtn.setImage(UIImage(named: "imageName"), for: .normal)
// nameBtn.setTitle("文字", for: .normal)
// nameBtn.titleLabel?.textAlignment = .center
// nameBtn.setTitleColor(ColorUtility.colorWithString("ffffff"), for: .normal)
// nameBtn.titleLabel?.font = UIFont.systemFont(ofSize: 14)
// nameBtn.layer.cornerRadius = 4
// nameBtn.layer.masksToBounds = true
// nameBtn.backgroundColor = ColorUtility.colorWithString("#fff")
// nameBtn.layer.borderColor = ColorUtility.colorWithString("borderColor").cgColor
// nameBtn.layer.borderWidth = 1.0
// nameBtn.addTarget(self, action: #selector(nameBtnClicked(_:)), for: .touchUpInside)

// @objc func nameBtnClicked(_ button: UIButton) {
//     // 按钮点击事件处理
// }

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

defineExpose({
    onCreate
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
</style>