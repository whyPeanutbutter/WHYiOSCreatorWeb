<template>
    <el-form :model="form" label-width="120px">
        <div style="margin-bottom: 10px">
            设置
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
                <el-checkbox label="editable" name="editable" />
                <el-checkbox label="scrollEnabled" name="scrollEnabled" />
                <el-tooltip class="box-item" effect="dark" content="需手动引入UItextView+placeholder" placement="right">
                    <el-checkbox label="placeholder" name="placeholder" />
                </el-tooltip>

                <div class="flex-row">
                    <el-checkbox label="backgroundColor" name="backgroundColor"></el-checkbox>
                    <el-input class='select-input' placeholder="#fff" v-model="form.data.backgroundColor" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="border" name="border"></el-checkbox>
                    <el-input class='select-input' placeholder="borderColor" v-model="form.data.borderColor" />
                </div>
                <el-checkbox label="click" name="click" />
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
                    <el-checkbox label="textViewDidChange" />
                    <el-checkbox label="textViewShouldBeginEditing" />
                    <el-tooltip class="box-item" effect="dark" content="点击完成/回车，收起操作" placement="right">
                        <el-checkbox label="shouldChangeTextInRange" />
                    </el-tooltip>
                    <el-checkbox label="textViewDidEndEditing" />
                    <el-checkbox label="超链接" />
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
        name: 'TextView',
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
        numberOfLine: '0',
         masonrys: [],
        quickMasonrys: '',
frame:[0,0,0,0],
type: 'UITextView',
    },
    helpMe: '',
    result: '点击create生成代码',
    firstLoad:true,
});

const resetForm = () => {
    console.log('reset');
    form.data = {
        name: 'TextView',
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
        numberOfLine: '0',
         masonrys: [],
        quickMasonrys: '',
frame:[0,0,0,0],
type: 'UITextView',
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

const onCreate = (formData, needCopy = false) => {
    if(!formData.commonSettings){
        return
    }

    if(!$utils.getStorage('isOCTag')){
        onCreateSwift(formData,needCopy)
        return
    }
    let commonSettings = formData.commonSettings;
    let init = commonSettings.indexOf('init') > -1 ? `UITextView *${formData.name} = [[UITextView alloc]init];\n  ${formData.name}.textContainerInset = UIEdgeInsetsMake(0, 0, 0, 0);\n` : '';
    let addSubView = commonSettings.indexOf('addSubView') > -1 ? `[<#self#> addSubview:${formData.name}];\n` : '';
   if(formData.frame.length < 4){
        formData.frame = [0,0,0,0]
    }
    let frame = commonSettings.indexOf('frame') > -1 ? `${formData.name}.frame = CGRectMake(<#${formData.frame[0]}#>, <#${formData.frame[1]}#>, <#${formData.frame[2]}#>, <#${formData.frame[3]}#>);\n` : '';
    let click = commonSettings.indexOf('click') > -1 ? `[${formData.name} addTarget:self action:@selector(<#${formData.name}Clicked:#>) forControlEvents:UIControlEventTouchUpInside];\n\n- (void)${formData.name}Clicked:(UIButton *)button{\n\n}\n` : '';
    let cornerRadius = commonSettings.indexOf('cornerRadius') > -1 ? `${formData.name}.layer.cornerRadius = ${formData.cornerRadius};\n${formData.name}.layer.masksToBounds = YES;\n` : '';
    let backgroundColor = commonSettings.indexOf('backgroundColor') > -1 ? `${formData.name}.backgroundColor = ${$utils.getColor(formData.backgroundColor)};\n` : '';
    let border = commonSettings.indexOf('border') > -1 ? `[${formData.name}.layer setBorderColor:${$utils.getColor(formData.borderColor)}.CGColor];\n[${formData.name}.layer setBorderWidth:<#1.0#>];\n` : '';

    let editable = commonSettings.indexOf('editable') > -1 ? `${formData.name}.editable = NO;\n` : '';
    let scrollEnabled = commonSettings.indexOf('scrollEnabled') > -1 ? `${formData.name}.editable = YES;\n` : '';
    let placeholder = commonSettings.indexOf('placeholder') > -1 ? `${formData.name}.placeholder = @"";\n` : '';
    let haveDelgete = formData.haveDelgete ? getDelgeteText(formData.name, formData.delgeteSettings) : '';

    let title = formData.haveTitle ? `${formData.name}.text = @"${formData.titleName}";\n${formData.name}.textAlignment = NSTextAlignment${formData.textAlign};\n${formData.name}.textColor=${$utils.getColor(formData.titleColor)};\n${formData.name}.font = ${$utils.getFont(formData.titleSize)};\n` : ''
    let haveAttributedText = formData.haveAttributedText ? $utils.getAttributedText(formData.name + 'AttributedString', formData.attributedTextSettings) + `${formData.name}.attributedText = ${formData.name}AttributedString;\n` : '';
    let mansoryStr = $utils.getMansorys(formData.masonrys,formData.frame);
    let masonry = formData.masonrys?.length > 0 ? `[${formData.name} mas_makeConstraints:^(MASConstraintMaker *make) {
        ${mansoryStr}
    }];\n`: ''
    var result =
        `${init}${frame}${addSubView}${editable}${scrollEnabled}${placeholder}${title}${haveAttributedText}${cornerRadius}${backgroundColor}${border}${masonry}${click}${haveDelgete}\n`
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
    let init = commonSettings.indexOf('init') > -1 ? `let ${formData.name} = UITextView()\n${formData.name}.textContainerInset = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)\n` : '';
    let addSubView = commonSettings.indexOf('addSubView') > -1 ? `self.addSubview(${formData.name})\n` : '';
   if(formData.frame.length < 4){
        formData.frame = [0,0,0,0]
    }
    let frame = commonSettings.indexOf('frame') > -1 ? `${formData.name}.frame = CGRect(x: <#x#>, y: <#y#>, width: <#width#>, height: <#height#>)\n` : '';
    let click = commonSettings.indexOf('click') > -1 ? `let tapGesture = UITapGestureRecognizer(target: self, action: #selector(${formData.name}Tapped(_:)))\n${formData.name}.addGestureRecognizer(tapGesture)\n\n@objc func ${formData.name}Tapped(_ sender: UITapGestureRecognizer) {\n// Handle tap\n}\n` : '';
    let cornerRadius = commonSettings.indexOf('cornerRadius') > -1 ? `${formData.name}.layer.cornerRadius = ${formData.cornerRadius}\n${formData.name}.clipsToBounds = true\n` : '';
    let backgroundColor = commonSettings.indexOf('backgroundColor') > -1 ? `${formData.name}.backgroundColor = ${$utils.getColor(formData.backgroundColor)}\n` : '';
    let border = commonSettings.indexOf('border') > -1 ? `${formData.name}.layer.borderColor = ${$utils.getColor(formData.borderColor)}.cgColor\n${formData.name}.layer.borderWidth = <#1.0#>\n` : '';
    let editable = commonSettings.indexOf('editable') > -1 ? `${formData.name}.isEditable = false\n` : '';
    let scrollEnabled = commonSettings.indexOf('scrollEnabled') > -1 ? `${formData.name}.isScrollEnabled = true\n` : '';
    let placeholder = commonSettings.indexOf('placeholder') > -1 ? `${formData.name}.text = "<#placeholder#>"\n` : '';
    let haveDelgete = formData.haveDelgete ? getDelgeteText(formData.name, formData.delgeteSettings) : '';
    let title = formData.haveTitle ? `${formData.name}.text = "${formData.titleName}"\n${formData.name}.textAlignment = .${formData.textAlign}\n${formData.name}.textColor=${$utils.getColor(formData.titleColor)}\n${formData.name}.font = ${$utils.getFont(formData.titleSize)}\n` : ''
    let haveAttributedText = formData.haveAttributedText ? $utils.getAttributedText(formData.name + 'AttributedString', formData.attributedTextSettings) + `${formData.name}.attributedText = ${formData.name}AttributedString;\n` : '';
    let mansoryStr = $utils.getMansorys(formData.masonrys,formData.frame);
    let masonry = formData.masonrys?.length > 0 ? `${formData.name}.snp.makeConstraints { (make) in\n${mansoryStr}\n}\n` : '';
    var result = `${init}${frame}${addSubView}${editable}${scrollEnabled}${placeholder}${title}${haveAttributedText}${cornerRadius}${backgroundColor}${border}${masonry}${click}${haveDelgete}\n`;
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
        return `UITextViewDelegate\n${name}.delegate = self;\n`
    }

    let dict = {
        "init": `UITextViewDelegate\n${name}.delegate = self;\n`,
        "textViewDidChange": "- (void)textViewDidChange:(UITextView *)textView {\n     textView.text.length//修改后的所有text\n}\n",
        "超链接": ` ${name}.editable = NO;\n\n       NSString *summary = @“bbbbbb联系客服bbbbb”;\n        NSMutableAttributedString * attributeString = [[NSMutableAttributedString alloc] initWithString:summary];\n        [attributeString addAttribute: NSLinkAttributeName value: @"http://www.jianshu.com" range: [summary rangeOfString:@"联系客服"]];\n        ${name}.linkTextAttributes = @{ NSForegroundColorAttributeName: RGBA(79, 224, 161, 1)};\n        ${name}.attributedText = attributeString;\n\n- (BOOL)textView:(UITextView *)textView shouldInteractWithURL:(NSURL *)URL inRange:(NSRange)characterRange interaction:(UITextItemInteraction)interaction {\n    NSString *url = URL.absoluteString;\n    if ([url isEqualToString:@"http://www.jianshu.com"]) {\n//在这里是可以做一些判定什么的，用来确定对应的操作。\n}\n\n    return YES;//返回 YES，则会打开URL地址，返回 NO则不会。\n}\n`,
        "textViewDidEndEditing": `- (void)textViewDidEndEditing:(UITextView *)textView\n{\n}\n`,
        "shouldChangeTextInRange": `-(BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text\n{//点击完成操作\n    if ([text isEqualToString:@"\n"]) {\n        [textView resignFirstResponder];\n        return NO;\n    }\n    return YES;\n}`,
        "textViewShouldBeginEditing": "- (BOOL)textViewShouldBeginEditing:(UITextView *)textView\n{\n    return YES;\n}\n\n"
    };

    if(!$utils.getStorage('isOCTag')){
        dict = {
        "init": `UITextViewDelegate\n${name}.delegate = self\n`,
        "textViewDidChange": "func textViewDidChange(_ textView: UITextView) {\n     let textLength = textView.text.length\n}\n",
        "超链接": `${name}.isEditable = false\n\nlet summary = "bbbbbb联系客服bbbbb"\nlet attributedString = NSMutableAttributedString(string: summary)\nattributedString.addAttribute(.link, value: "http://www.jianshu.com", range: (summary as NSString).range(of: "联系客服"))\n${name}.linkTextAttributes = [NSAttributedString.Key.foregroundColor: UIColor(red: 79/255, green: 224/255, blue: 161/255, alpha: 1)]\n${name}.attributedText = attributedString\n\nfunc textView(_ textView: UITextView, shouldInteractWith URL: URL, in characterRange: NSRange, interaction: UITextItemInteraction) -> Bool {\n    if URL.absoluteString == "http://www.jianshu.com" {\n        // Handle URL interaction\n    }\n    return true\n}\n`,
        "textViewDidEndEditing": `func textViewDidEndEditing(_ textView: UITextView) {\n\n}\n`,
        "shouldChangeTextInRange": `func textView(_ textView: UITextView, shouldChangeTextIn range: NSRange, replacementText text: String) -> Bool {\n    if text == "\\n" {\n        textView.resignFirstResponder()\n        return false\n    }\n    return true\n}`,
        "textViewShouldBeginEditing": "func textViewShouldBeginEditing(_ textView: UITextView) -> Bool {\n    return true\n}\n\n"
    };
    }
   
    var re = dict['init'];
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
    if(!form.firstLoad){
            if(!form.firstLoad){
        emits('update', newValue)
    } 
    form.firstLoad = false
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
