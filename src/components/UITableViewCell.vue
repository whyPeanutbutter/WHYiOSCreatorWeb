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
                
                <div class="flex-row">
                    <el-checkbox label=".h文件"></el-checkbox>
                    <el-switch style="margin-left: 5px;" active-text="包含delegate" v-model="form.data.haveDelegate" />
                </div>
                <el-checkbox label=".m文件" />
                <el-checkbox label="纯delegate代码" />
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
        name: 'tableViewCell',
        commonSettings: ["addSubView","init"],
        haveDelegate: false
    },
    helpMe:'',
    result: '点击create生成代码'
});

const resetForm = () => {
    console.log('reset');
    form.data = {
        name: 'TableViewCell',
        commonSettings: ["addSubView","init"],
        haveDelegate: false
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
    let upperFirst = formData.name.charAt(0).toUpperCase()+ formData.name.slice(1);
    let lowerFirst = formData.name.charAt(0).toLowerCase()+ formData.name.slice(1);
    let hCode = commonSettings.indexOf('.h文件') > -1 ? `@interface ${upperFirst} : UITableViewCell\n` : '';
    
    if(formData.haveDelegate && hCode.length > 0){
        hCode = `@protocol ${upperFirst}Delegate<NSObject>\n@optional\n- (void)${lowerFirst}Clicked;\n@end\n\n`+ hCode + `@property (weak, nonatomic) id<${upperFirst}Delegate> delegate;\n`
    }
    var useDelegateCode = `- (void)${lowerFirst}Clicked {
        if (self.delegate && [self.delegate respondsToSelector:@selector(${lowerFirst}Clicked)]) {
        [self.delegate ${lowerFirst}Clicked];}
        }\n`
    var  mDelegateCode = ''
    if(formData.haveDelegate){
        mDelegateCode = useDelegateCode
    }
    hCode = hCode +(hCode.length > 0 ?  '@end\n': '')
    let mCode = commonSettings.indexOf('.m文件') > -1 ? `@interface ${upperFirst}(){\n\n}@end\n@implementation ${upperFirst}\n - (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier{\nif (self = [super initWithStyle:style reuseIdentifier:reuseIdentifier]) {\nself.selectionStyle = UITableViewCellSelectionStyleNone;\n[self setupUI];\n}\nreturn self;\n}\n\n- (void)setupUI {\n<#content#>\n}\n${mDelegateCode}@end` : '';
    let pureDelegateCode = commonSettings.indexOf('纯delegate代码') > -1 ? `@protocol ${upperFirst}Delegate<NSObject>\n@optional\n- (void)${lowerFirst}Clicked;\n@end\n\n@property (weak, nonatomic) id<${upperFirst}Delegate> delegate;\n\n${useDelegateCode}` : '';
    var result =  `${hCode}${mCode}${pureDelegateCode}\n`
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