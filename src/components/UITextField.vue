
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
                <el-checkbox label="enabled" name="editable" />
                <el-checkbox label="attributedPlaceholder" name="attributedPlaceholder" />
                <el-checkbox label="placeholder" name="placeholder" />
                <!-- <el-tooltip class="box-item" effect="dark" content="需手动引入UItextView+placeholder" placement="right">
                    
                </el-tooltip> -->
                <el-checkbox label="clearButtonMode" name="clearButtonMode" />
                <el-checkbox label="returnKeyType" name="returnKeyType" />
                <el-checkbox label="keyboardType" name="keyboardType" />
                
                <div class="flex-row">
                    <el-checkbox label="backgroundColor" name="backgroundColor"></el-checkbox>
                    <el-input class='select-input' placeholder="#fff" v-model="form.data.backgroundColor" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="border" name="border"></el-checkbox>
                    <el-input class='select-input' placeholder="borderColor" v-model="form.data.borderColor" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="cornerRadius" name="cornerRadius"></el-checkbox>
                    <el-input class='select-input' placeholder="6" v-model="form.data.cornerRadius" />
                </div>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="delgete">
            <el-switch v-model="form.data.haveDelgete" />
            <div v-if="form.data.haveDelgete" style="width:100%">
                <el-checkbox-group class="flex-col-start" v-model="form.data.delgeteSettings">
                    <el-checkbox label="textFieldDidChange" />
                    <el-checkbox label="textFieldDidBeginEditing" />
                    <el-checkbox label="textFieldShouldBeginEditing" />
                    <el-tooltip class="box-item" effect="dark" content="限制输入字数" placement="right">
                        <el-checkbox label="shouldChangeCharactersInRange" />
                    </el-tooltip>
                    <el-checkbox label="textFieldShouldReturn" />
                </el-checkbox-group> 
            </div>
        </el-form-item>
        <el-form-item label="title">
            <el-switch v-model="form.data.haveTitle" />
            <div v-if="form.data.haveTitle" style="padding: 10px;">
                <el-input placeholder="文字" v-model="form.data.titleName" />
                <el-input placeholder="颜色" v-model="form.data.titleColor" />
                <el-input placeholder="大小" v-model="form.data.titleSize" />
                <el-radio-group v-model="form.data.textAlign" style="width:100%">
                    <el-radio-button label="Left" />
                    <el-radio-button label="Center" />
                    <el-radio-button label="Right" />
                </el-radio-group>
            </div>
        </el-form-item>
        <el-form-item label="attributedText">
            <el-switch v-model="form.data.haveAttributedText" />
            <div v-if="form.data.haveAttributedText" style="width:100%">
                <el-checkbox-group class="flex-col-start" v-model="form.data.attributedTextSettings">
                    <el-checkbox label="局部变色" />
                    <el-checkbox label="局部font" />
                    <el-tooltip class="box-item" effect="dark" content="首行/行缩进，行/段落间距" placement="right">
                        <el-checkbox label="paragraphStyle" />
                    </el-tooltip>
                    <el-checkbox label="中划线" />
                    <el-checkbox label="下划线" />
                    <el-checkbox label="插入图片" />
                    <el-tooltip class="box-item" effect="dark"
                        content="字体背景颜色<br>文字排版、书写方向<br>字体横向拉伸、倾斜度<br>基线上下偏移值<br>阴影属性<br>笔画宽度和填充颜色<br>字符间的间距<br>"
                        placement="right" :raw-content="true">
                        <el-checkbox label="其他" />
                    </el-tooltip>
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
        name: 'TextField',
        commonSettings: ["addSubView", "init"],
        cornerRadius: '4',
        backgroundColor: '#fff',
        borderColor: 'borderColor',
        haveTitle: false,
        haveAttributedText: false,
        attributedTextSettings: [],
        delgeteSettings: [],
        haveDelgete: false,
        titleSize: '',
        titleColor: '',
        titleName: '',
        textAlign: 'Center',
        masonrys: []
    },
    helpMe: '',
    result: '点击create生成代码'
});

const resetForm = () => {
    console.log('reset');
    form.data = {
        name: 'TextField',
        commonSettings: ["addSubView", "init"],
        cornerRadius: '4',
        backgroundColor: '#fff',
        borderColor: 'borderColor',
        delgeteSettings: [],
        haveDelgete: false,
        haveTitle: false,
        haveAttributedText: false,
        attributedTextSettings: [],
        titleSize: '',
        titleColor: '',
        titleName: '',
        textAlign: 'Center',
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
    let init = commonSettings.indexOf('init') > -1 ? ` UITextField *${formData.name} = [[UITextField alloc] init)];\n ${formData.name}.contentVerticalAlignment = UIControlContentVerticalAlignmentCenter;\n ${formData.name}.inputAssistantItem.leadingBarButtonGroups = @[];\n ${formData.name}.inputAssistantItem.trailingBarButtonGroups = @[];\n${formData.name}.autocapitalizationType = UITextAutocapitalizationTypeNone;\n` : '';
    let addSubView = commonSettings.indexOf('addSubView') > -1 ? `[<#self#> addSubview:${formData.name}];\n` : '';
    let frame = commonSettings.indexOf('frame') > -1 ? `${formData.name}.frame = CGRectMake(<#CGFloat x#>, <#CGFloat y#>, <#CGFloat width#>, <#CGFloat height#>);\n` : '';
    let enabled = commonSettings.indexOf('enabled') > -1 ? `${formData.name}.enabled = NO;\n` : '';
    let cornerRadius = commonSettings.indexOf('cornerRadius') > -1 ? `${formData.name}.layer.cornerRadius = ${formData.cornerRadius};\n${formData.name}.layer.masksToBounds = YES;\n` : '';
    let backgroundColor = commonSettings.indexOf('backgroundColor') > -1 ? `${formData.name}.backgroundColor = ${$utils.getColor(formData.backgroundColor)};\n` : '';
    let border = commonSettings.indexOf('border') > -1 ? `[${formData.name}.layer setBorderColor:${$utils.getColor(formData.borderColor)}.CGColor];\n[${formData.name}.layer setBorderWidth:<#1.0#>];\n` : '';

    let returnKeyType = commonSettings.indexOf('returnKeyType') > -1 ? `${formData.name}.clearButtonMode = UITextFieldViewModeWhileEditing;\n` : '';
    let clearButtonMode = commonSettings.indexOf('clearButtonMode') > -1 ? `${formData.name}.returnKeyType = UIReturnKeyDone;\n` : '';
    let keyboardType = commonSettings.indexOf('keyboardType') > -1 ? `${formData.name}.keyboardType = UIKeyboardTypeNumberPad;\n` : '';

    let attributedPlaceholder = commonSettings.indexOf('attributedPlaceholder') > -1 ? `${formData.name}.attributedPlaceholder = [[NSMutableAttributedString alloc] initWithString:DefaultInputHint attributes:@{NSFontAttributeName:GetRegularFont(15),NSForegroundColorAttributeName:Color_Black_Light}];\n` : '';
    let placeholder = commonSettings.indexOf('placeholder') > -1 ? `${formData.name}.placeholder = @"";\n` : '';
    let haveDelgete = formData.haveDelgete ? getDelgeteText(formData.name, formData.delgeteSettings) : '';

    let title = formData.haveTitle ? `${formData.name}.text = @"${formData.titleName}";\n${formData.name}.textAlignment = NSTextAlignment${formData.textAlign};\n${formData.name}.textColor=${$utils.getColor(formData.titleColor)};\n${formData.name}.font = ${$utils.getFont(formData.titleSize)};\n` : ''
    let haveAttributedText = formData.haveAttributedText ? $utils.getAttributedText(formData.name + 'AttributedString', formData.attributedTextSettings) + `${formData.name}.attributedText = ${formData.name}AttributedString;\n` : '';
    let mansoryStr = $utils.getMansorys(formData.masonrys);
    let masonry = formData.masonrys?.length > 0 ? `[${formData.name} mas_makeConstraints:^(MASConstraintMaker *make) {
        ${mansoryStr}
    }];\n`: ''
    var result =
        `${init}${frame}${addSubView}${enabled}${returnKeyType}${clearButtonMode}${keyboardType}${placeholder}${attributedPlaceholder}${title}${haveAttributedText}${cornerRadius}${backgroundColor}${border}${masonry}${haveDelgete}\n`
    console.log(result);
    form.result = result;
    emits('create', result)
    if (needCopy) {
        $utils.copy(result)
        form.result = '已复制到剪切板\n' + result;
    }
};

const getDelgeteText = (name, settings) => {
    if (settings.length == 0) {
        return `UITextFieldDelegate\n${name}.delegate = self;\n`
    }
    let dict = {
        "init": `UITextFieldDelegate\n${name}.delegate = self;\n#pragma mark - UITextFieldDelegate\n`,
        "textFieldDidChange": `  [${name} addTarget:self action:@selector(textFieldDidChange:) forControlEvents:UIControlEventEditingChanged];\n\n- (void)textFieldDidChange:(UITextField *)textField\n{\n UITextRange *range = textField.markedTextRange; \n}\n`,
        "textFieldDidBeginEditing": "- (void)textFieldDidBeginEditing:(UITextField *)textField {\n}\n",
        "textFieldShouldBeginEditing": `- (BOOL)textFieldShouldBeginEditing:(UITextField *)textField\n{\n if (textField == categoryField) {\n   return NO;\n }\n return YES;\n}\n`,
        "shouldChangeCharactersInRange": `\n-(BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string\n{\n NSMutableString *inputText = textField.text.mutableCopy;\n [inputText replaceCharactersInRange:range withString:string];\n if (inputText.length > 50)\n {\n  return NO;\n }\n return YES;\n}\n`,
        "textFieldShouldReturn": "`- (BOOL)textFieldShouldReturn:(UITextField *)textField {\n [textField resignFirstResponder];\n [self endEditing:YES];\n return YES;\n}\n`"
    };
    var re = dict['init'];
    if(settings.length == 1 && settings[0] == "textFieldDidChange"){
        re = ""
    }
    var i = 0
    for (let str of settings) {
        re = re + (settings.indexOf(str) > -1 ? dict[str] : '')
        if (i != settings.length - 1) {
            re = re + '\n'
        }
        i++;
    }
    return re
}

const onReset = () => {
    resetForm()
};

const onDelete = () => {
    emits('delete')
};


watch(() => form.data, (newValue, oldValue) => {
    emits('update', newValue)
    onCreate(newValue, false)
}, {
    deep: true,
    immediate: true
});

const onAddClip = async () => {
    form.helpMe = await navigator.clipboard.readText()
    onHelpMe()
};

const onHelpMe = async () => {
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

.select-input {
    width: 150px !important;
    margin-right: 10px;
    margin-left: 5px;
}
</style>