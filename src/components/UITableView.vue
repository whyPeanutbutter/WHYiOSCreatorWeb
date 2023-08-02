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
                <el-checkbox label="registerClass" />
                <div class="flex-row">
                    <el-checkbox label="backgroundColor" name="backgroundColor"></el-checkbox>
                    <el-input class='select-input' placeholder="#fff" v-model="form.data.backgroundColor" />
                </div>
                <div class="flex-row">
                    <el-checkbox label="estimatedRowHeight" name="estimatedRowHeight"></el-checkbox>
                    <el-input class='select-input' placeholder="65" v-model="form.data.estimatedRowHeight" />
                </div>
                <el-checkbox label="sectionNum" />
                <el-checkbox label="rownNum" />
                <el-checkbox label="rowHeight" />
                <el-checkbox label="cellView" />
                <el-checkbox label="headerView" />
                <el-checkbox label="footerView" />
                <el-checkbox label="selectCell" />
                <el-checkbox label="cellAction" />
                
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
        commonSettings: ["addSubView","init"],
        backgroundColor: '#fff',
        estimatedRowHeight:'',
         masonrys: [],
        quickMasonrys: ''
    },
    helpMe:'',
    result: '点击create生成代码'
});

const resetForm = () => {
    console.log('reset');
    form.data = {
        name: 'TableView',
        commonSettings: ["addSubView","init"],
        backgroundColor: '#fff',
        estimatedRowHeight:'',
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
    let frame = commonSettings.indexOf('frame') > -1 ? `${formData.name}.frame = CGRectMake(<#CGFloat x#>, <#CGFloat y#>, <#CGFloat width#>, <#CGFloat height#>);\n` : '';

    let init = commonSettings.indexOf('init') > -1 ? `UITableViewDataSource,UITableViewDelegate\nUITableView *${formData.name} = [[UITableView alloc]initWithFrame:CGRectZero style:UITableViewStyleGrouped];\n${frame}${formData.name}.dataSource = self;\${formData.name}.delegate = self;\n${formData.name}.separatorStyle = UITableViewCellSeparatorStyleNone;\n${formData.name}.showsVerticalScrollIndicator = NO;\nif (@available(iOS 15.0, *)) {\n${formData.name}.sectionHeaderTopPadding = 0;\n}\n` : '';
    let addSubView = commonSettings.indexOf('addSubView') > -1 ? `[<#self#> addSubview:${formData.name}];\n` : '';
    let backgroundColor = commonSettings.indexOf('backgroundColor') > -1 ? `${formData.name}.backgroundColor = ${$utils.getColor(formData.backgroundColor)};\n` : '';
    let upperFirst = formData.name.charAt(0).toUpperCase()+ formData.name.slice(1);
    let estimatedRowHeight = commonSettings.indexOf('estimatedRowHeight') > -1 ? `${formData.name}.estimatedRowHeight = ${formData.estimatedRowHeight};\n${formData.name}.rowHeight = UITableViewAutomaticDimension;\n` : '';
    let registerClass = commonSettings.indexOf('registerClass') > -1 ? `static NSString* const ${upperFirst}CellIdentifier = @"${upperFirst}CellIdentifier";\n[${formData.name} registerClass:[<#${upperFirst}Cell#> class] forCellReuseIdentifier:${upperFirst}CellIdentifier];\n` : '';
    let sectionNum = commonSettings.indexOf('sectionNum') > -1 ? `- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{\nreturn 1;\n}\n` : '';
    let rowNum = commonSettings.indexOf('rownNum') > -1 ? `- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{\nreturn .count;\n}\n` : '';
    let rowHeight = commonSettings.indexOf('rowHeight') > -1 ? `- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{\nreturn 103;\n}\n` : '';
    let cellView = commonSettings.indexOf('cellView') > -1 ? `- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{\n${upperFirst}Cell *cell = [tableView dequeueReusableCellWithIdentifier:${upperFirst}CellIdentifier];\nreturn cell;\n}\n` : '';
    let headerView = commonSettings.indexOf('headerView') > -1 ? `- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section{\nUIView *view = [[UIView alloc]init];\nreturn view;}\n\n- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section\n{\nreturn 0.0001f;\n}\n` : '';
    let footerView = commonSettings.indexOf('footerView') > -1 ? `- (UIView *)tableView:(UITableView *)tableView viewForFooterInSection:(NSInteger)section{\nUIView *view = [[UIView alloc] init];\nreturn view;\n}\n\n- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section{\nreturn 0.0001f;\n}\n` : '';
    let selectCell = commonSettings.indexOf('selectCell') > -1 ? `- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {\n[tableView deselectRowAtIndexPath:indexPath animated:NO];\n}\n` : '';
    let cellAction = commonSettings.indexOf('cellAction') > -1 ? `"- (NSArray<UITableViewRowAction *> *)tableView:(UITableView *)tableView editActionsForRowAtIndexPath:(NSIndexPath *)indexPath\n{\n    \n    UITableViewRowAction *action = [UITableViewRowAction rowActionWithStyle:UITableViewRowActionStyleNormal title:@"删除" handler:^(UITableViewRowAction * _Nonnull action, NSIndexPath * _Nonnull indexPath) {\n        [self cellDeleteAction:indexPath];\n    }];\n    action.backgroundColor= Color_Red;\n    return @[action];\n}\n\n\n-(void)cellDeleteAction:(NSIndexPath *)indexPath{\n}\n";` : '';

    let mansoryStr = $utils.getMansorys(formData.masonrys);
    let masonry = formData.masonrys?.length > 0 ? `[${formData.name} mas_makeConstraints:^(MASConstraintMaker *make) {
        ${mansoryStr}
    }];\n`: ''
    var result = `${init}${addSubView}${estimatedRowHeight}${backgroundColor}${registerClass}${masonry}
        /*${sectionNum}${rowNum}${rowHeight}${cellView}${headerView}${footerView}${selectCell}${cellAction}*/\n`
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
    let frame = commonSettings.indexOf('frame') > -1 ? `${formData.name}.frame = CGRect(x: <#CGFloat x#>, y: <#CGFloat y#>, width: <#CGFloat width#>, height: <#CGFloat height#>)\n` : '';

    let init = commonSettings.indexOf('init') > -1 ? `var ${formData.name}: UITableView = {\nlet ${formData.name} = UITableView(frame: .zero, style: .grouped)\n${formData.name}.dataSource = self;\n${formData.name}.delegate = self;\n${formData.name}.separatorStyle = .none\n${formData.name}.showsVerticalScrollIndicator = false\nif #available(iOS 15.0, *) {\n${formData.name}.sectionHeaderTopPadding = 0\n}\nreturn ${formData.name}\n}()\n` : '';
    let addSubView = commonSettings.indexOf('addSubView') > -1 ? `self.addSubview(${formData.name})\n` : '';
    let backgroundColor = commonSettings.indexOf('backgroundColor') > -1 ? `${formData.name}.backgroundColor = \(formData.backgroundColor)\n` : '';
    let upperFirst = formData.name.charAt(0).toUpperCase() + formData.name.slice(1);
    let estimatedRowHeight = commonSettings.indexOf('estimatedRowHeight') > -1 ? `${formData.name}.estimatedRowHeight = ${formData.estimatedRowHeight};\n${formData.name}.rowHeight = UITableView.automaticDimension\n` : '';
    let registerClass = commonSettings.indexOf('registerClass') > -1 ? `let ${upperFirst}CellIdentifier = "${upperFirst}CellIdentifier"\n${formData.name}.register(<#${upperFirst}Cell#>.self, forCellReuseIdentifier: ${upperFirst}CellIdentifier)\n` : '';
    let sectionNum = commonSettings.indexOf('sectionNum') > -1 ? `func numberOfSections(in tableView: UITableView) -> Int {\nreturn 1\n}\n` : '';
    let rowNum = commonSettings.indexOf('rownNum') > -1 ? `func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {\nreturn .count\n}\n` : '';
    let rowHeight = commonSettings.indexOf('rowHeight') > -1 ? `func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {\nreturn 103\n}\n` : '';
    let cellView = commonSettings.indexOf('cellView') > -1 ? `func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {\nlet cell = tableView.dequeueReusableCell(withIdentifier: ${upperFirst}CellIdentifier, for: indexPath) as! <#${upperFirst}Cell#>\nreturn cell\n}\n` : '';
    let headerView = commonSettings.indexOf('headerView') > -1 ? `func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {\nlet view = UIView()\nreturn view\n}\n\nfunc tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {\nreturn CGFloat.leastNormalMagnitude\n}\n` : '';
    let footerView = commonSettings.indexOf('footerView') > -1 ? `func tableView(_ tableView: UITableView, viewForFooterInSection section: Int) -> UIView? {\nlet view = UIView()\nreturn view\n}\n\nfunc tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {\nreturn CGFloat.leastNormalMagnitude\n}\n` : '';
    let selectCell = commonSettings.indexOf('selectCell') > -1 ? `func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {\ntableView.deselectRow(at: indexPath, animated: false)\n}\n` : '';
    let cellAction = commonSettings.indexOf('cellAction') > -1 ? `func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {\nlet delete = UIContextualAction(style: .destructive, title: "删除") { (action, view, completionHandler) in\nself.cellDeleteAction(at: indexPath)\ncompletionHandler(true)\n}\nlet configuration = UISwipeActionsConfiguration(actions: [delete])\nreturn configuration\n}\n\nfunc cellDeleteAction(at indexPath: IndexPath) {\n}\n` : '';

    let masonry = formData.masonrys?.length > -1 ? `${formData.name}.snp.makeConstraints { (make) in\n/* Constraints here */\n}\n` : '';
    var result = `${init}${addSubView}${estimatedRowHeight}${backgroundColor}${registerClass}${masonry}${sectionNum}${rowNum}${rowHeight}${cellView}${headerView}${footerView}${selectCell}${cellAction}\n`
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