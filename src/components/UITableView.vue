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
                <el-checkbox label="registerClass" />
                <div class="flex-row">
                    <el-checkbox label="backgroundColor" name="backgroundColor"></el-checkbox>
                    <el-input style="margin-left: 5px;" placeholder="#fff" v-model="form.data.backgroundColor" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="estimatedRowHeight" name="estimatedRowHeight"></el-checkbox>
                    <el-input style="margin-left: 5px;" placeholder="65" v-model="form.data.estimatedRowHeight" />
                </div>
                <el-checkbox label="sectionNum" />
                <el-checkbox label="rowHeight" />
                <el-checkbox label="cellView" />
                <el-checkbox label="headerView" />
                <el-checkbox label="footerView" />
                <el-checkbox label="selectCell" />
                
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
        name: 'tableView',
        commonSettings: ["addSubView"],
        backgroundColor: '#fff',
        estimatedRowHeight:'',
        masonrys: []
    },
    result: '点击create生成代码'
});

const resetForm = () => {
    console.log('reset');
    form.data = {
        name: 'tableView',
        commonSettings: ["addSubView"],
        backgroundColor: '#fff',
        estimatedRowHeight:'',
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
    let addSubView = commonSettings.indexOf('addSubView') > -1 ? `[<#self#> addSubview:${formData.name}]\n` : '';
    let frame = commonSettings.indexOf('frame') > -1 ? `${formData.name}.frame = CGRectMake(<#CGFloat x#>, <#CGFloat y#>, <#CGFloat width#>, <#CGFloat height#>);\n` : '';
    let backgroundColor = commonSettings.indexOf('backgroundColor') > -1 ? `${formData.name}.backgroundColor = ${$utils.getColor(formData.backgroundColor)};\n` : '';
    let upperFirst = formData.name.charAt(0).toUpperCase()+ formData.name.slice(1);
    let estimatedRowHeight = commonSettings.indexOf('estimatedRowHeight') > -1 ? `${formData.name}.estimatedRowHeight = ${formData.estimatedRowHeight};\n${formData.name}.rowHeight = UITableViewAutomaticDimension;\n` : '';
    let registerClass = commonSettings.indexOf('registerClass') > -1 ? `static NSString* const ${upperFirst}CellIdentifier = @"${upperFirst}CellIdentifier";\n[${formData.name} registerClass:[<#${upperFirst}Cell#> class] forCellReuseIdentifier:${upperFirst}CellIdentifier];\n` : '';
    let sectionNum = commonSettings.indexOf('sectionNum') > -1 ? `- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{\nreturn 1;\n}\n` : '';
    let rowNum = commonSettings.indexOf('rowHeight') > -1 ? `- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{\nreturn .count;\n}\n` : '';
    let rowHeight = commonSettings.indexOf('rowHeight') > -1 ? `- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{\nreturn 103;\n}\n` : '';
    let cellView = commonSettings.indexOf('cellView') > -1 ? `- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{\n${upperFirst}Cell *cell = [tableView dequeueReusableCellWithIdentifier:${upperFirst}CellIdentifier];\nreturn cell;\n}\n` : '';
    let headerView = commonSettings.indexOf('headerView') > -1 ? `- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section{\nUIView *view = [[UIView alloc]init];\nreturn view;}\n\n- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section\n{\nreturn 0.0001f;\n}\n` : '';
    let footerView = commonSettings.indexOf('footerView') > -1 ? `- (UIView *)tableView:(UITableView *)tableView viewForFooterInSection:(NSInteger)section{\nUIView *view = [[UIView alloc] init];\nreturn view;\n}\n\n- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section{\nreturn 0.0001f;\n}\n` : '';
    let selectCell = commonSettings.indexOf('selectCell') > -1 ? `- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {\n[tableView deselectRowAtIndexPath:indexPath animated:NO];\n}\n` : '';
    let mansoryStr = $utils.getMansorys(formData.masonrys);
    let masonry = formData.masonrys?.length > 0 ? `[${formData.name} mas_makeConstraints:^(MASConstraintMaker *make) {
        ${mansoryStr}
    }];\n`: ''
    var result = `UITableViewDataSource,UITableViewDelegate\nUITableView *${formData.name} = [[UITableView alloc]initWithFrame:CGRectZero style:UITableViewStyleGrouped];\n${frame} \ntableView.dataSource = self;\ntableView.delegate = self;\n${formData.name}.separatorStyle = UITableViewCellSeparatorStyleNone;\n${formData.name}.showsVerticalScrollIndicator = NO;\nif (@available(iOS 15.0, *)) {\n${formData.name}.sectionHeaderTopPadding = 0;\n}\n` +
        `${addSubView}${estimatedRowHeight}${backgroundColor}${registerClass}${masonry}
        /*${sectionNum}${rowNum}${rowHeight}${cellView}${headerView}${footerView}${selectCell}*/\n`
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