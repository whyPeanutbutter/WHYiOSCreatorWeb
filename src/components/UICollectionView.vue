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
                <el-checkbox label="estimatedCellSize" name="estimatedCellSize"></el-checkbox>
                <el-checkbox label="addSubView" name="addSubView" />
                <el-checkbox label="frame" name="frame" />
                <el-checkbox label="registerClass" name="registerClass" />
                <div class="registerClassTypes-class" v-if="form.data.commonSettings.indexOf('registerClass') > -1">
                    <el-checkbox-group v-model="form.data.registerClassTypes">
                        <el-checkbox-button v-for="position in ['cell', 'header', 'footer']" :key="position"
                            :label="position">{{ position
                            }}</el-checkbox-button>
                    </el-checkbox-group>
                </div>
                <div class="flex-row">
                    <el-checkbox label="backgroundColor" name="backgroundColor"></el-checkbox>
                    <el-input class='select-input' placeholder="#fff" v-model="form.data.backgroundColor" />
                </div>
                <el-checkbox label="sectionNum" />
                <el-tooltip content='<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/16/16dd2b824757ea5f~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.image" style="width: 310px;height: 310px;"/>'
                 raw-content placement="right">
                    <el-checkbox label="sectionInset" />
                </el-tooltip>
                <el-checkbox label="cellNum" />
                <el-checkbox label="cellSize" />
                <el-checkbox label="cellView" />
                <el-checkbox label="headerView" />
                <el-checkbox label="footerView" />
                <el-checkbox label="selectCell" />
                <el-tooltip class="box-item" effect="dark"
                    :content="`collectionView 默认spacing不为0<br>水平滚动时:对应的是同一个Section内部间Item的左右间距;<br>垂直滚动时:对应的是同一个Section内部间Item的上下间距`"
                    :raw-content="true" placement="right">
                    <el-checkbox label="minimumLineSpacing" />
                </el-tooltip>
                <el-tooltip class="box-item" effect="dark"
                    content="水平滚动时:对应的是同一个Section内部间Item的上下间距;<br> 垂直滚动时:对应的是同一个Section内部间Item的左右间距" :raw-content="true"
                    placement="right">
                    <el-checkbox label="minimumInteritemSpacing" />
                </el-tooltip>

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
        name: 'collectView',
        commonSettings: ["addSubView", "init"],
        registerClassTypes: ['cell'],
        backgroundColor: '#fff',
         masonrys: [],
        quickMasonrys: '',
frame:[0,0,0,0]
    },
    helpMe: '',
    result: '点击create生成代码'
});

const resetForm = () => {
    console.log('reset');
    form.data = {
        name: 'CollectView',
        commonSettings: ["addSubView", "init"],
        registerClassTypes: ['cell'],
        backgroundColor: '#fff',
         masonrys: [],
        quickMasonrys: '',
frame:[0,0,0,0]
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
    let commonSettings = formData.commonSettings;
   if(formData.frame.length < 4){
        formData.frame = [0,0,0,0]
    }
    let frame = commonSettings.indexOf('frame') > -1 ? `${formData.name}.frame = CGRectMake(<#${formData.frame[0]}#>, <#${formData.frame[1]}#>, <#${formData.frame[2]}#>, <#${formData.frame[3]}#>);\n` : '';
    let estimatedCellSize = commonSettings.indexOf('estimatedCellSize') > -1 ? `//未测试 \nflowLayout.estimatedItemSize = CGSizeMake(0,0);\nflowLayout.itemSize = UICollectionViewFlowLayoutAutomaticSize;\n\n` : '';
    let init = commonSettings.indexOf('init') > -1 ? `UICollectionViewDelegate, UICollectionViewDataSource\nUICollectionViewFlowLayout *flowLayout = [[UICollectionViewFlowLayout alloc]init];\nflowLayout.minimumLineSpacing = 0;\nflowLayout.minimumInteritemSpacing = 0;\n${estimatedCellSize}flowLayout.sectionInset = UIEdgeInsetsMake(0, 0, 0, 0);\nflowLayout.scrollDirection = UICollectionViewScrollDirectionVertical;\nUICollectionView *${formData.name};\n${formData.name} = [[UICollectionView alloc]initWithFrame:CGRectZero collectionViewLayout:flowLayout];\n${formData.name}.delegate = self;\n${formData.name}.dataSource = self;\n${formData.name}.showsVerticalScrollIndicator = NO;\n${formData.name}.showsHorizontalScrollIndicator = NO;` : '';
    let addSubView = commonSettings.indexOf('addSubView') > -1 ? `[<#self#> addSubview:${formData.name}];\n` : '';
    let backgroundColor = commonSettings.indexOf('backgroundColor') > -1 ? `${formData.name}.backgroundColor = ${$utils.getColor(formData.backgroundColor)};\n` : '';
    let upperFirst = formData.name.charAt(0).toUpperCase() + formData.name.slice(1);
    let registerClass = '';
    if (commonSettings.indexOf('registerClass') > -1) {
        let staticString = ''
        let registerString = ''
        if (formData.registerClassTypes.indexOf('cell') > -1) {
            staticString += `static NSString* const ${upperFirst}CellIdentifier = @"${upperFirst}CellIdentifier";\n`
            registerString += `[${formData.name} registerClass:[${upperFirst}Cell class] forCellWithReuseIdentifier:${upperFirst}CellIdentifier];\n`
        }
        if (formData.registerClassTypes.indexOf('header') > -1) {
            staticString += `static NSString* const ${upperFirst}HeaderIdentifier = @"${upperFirst}HeaderIdentifier";\n`
            registerString += `[${formData.name} registerClass:[${upperFirst}HeaderView class] forSupplementaryViewOfKind:UICollectionElementKindSectionHeader withReuseIdentifier:${upperFirst}HeaderIdentifier];\n`
        }
        if (formData.registerClassTypes.indexOf('footer') > -1) {
            staticString += `static NSString* const ${upperFirst}FooterIdentifier = @"${upperFirst}FooterIdentifier";\n`
            registerString += `[${formData.name} registerClass:[${upperFirst}FooterView class] forSupplementaryViewOfKind:UICollectionElementKindSectionFooter withReuseIdentifier:${upperFirst}FooterIdentifier];\n`
        }
        registerClass = staticString + registerString;
    }
    let sectionNum = commonSettings.indexOf('sectionNum') > -1 ? `- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {\nreturn subListDataArr.count;\n}\n` : '';
    let sectionInset = commonSettings.indexOf('sectionInset') > -1 ? `- (UIEdgeInsets)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout insetForSectionAtIndex:(NSInteger)section {\n        return UIEdgeInsetsMake(0, 0, 0, 0);\n}\n` : '';
    let cellNum = commonSettings.indexOf('cellNum') > -1 ? `- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section{\n return .count\n}\n` : '';
    let cellSize = commonSettings.indexOf('cellSize') > -1 ? `- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath {\n return CGSizeMake(0, 0);\n}\n` : '';
    let cellView = commonSettings.indexOf('cellView') > -1 ? `- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath\n{\n${upperFirst}Cell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:${upperFirst}CellIdentifier forIndexPath:indexPath];\nreturn cell;\n}\n` : '';

    let headerFooterView = ''
    if (commonSettings.indexOf('headerView') > -1 || commonSettings.indexOf('footerView') > -1) {
        let sizeString = ''
        headerFooterView = `- (UICollectionReusableView *)collectionView:(UICollectionView *)collectionView viewForSupplementaryElementOfKind:(NSString *)kind atIndexPath:(NSIndexPath *)indexPath\n{\nUICollectionReusableView *reusableView = nil;\n`
        if (commonSettings.indexOf('headerView') > -1) {
            sizeString += `- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout referenceSizeForHeaderInSection:(NSInteger)section {\n return CGSizeMake(0, 0);\n}\n`
            headerFooterView += `if (kind == UICollectionElementKindSectionHeader) {\n${upperFirst}HeaderView *headerView = [collectionView dequeueReusableSupplementaryViewOfKind:kind withReuseIdentifier:${upperFirst}HeaderIdentifier forIndexPath:indexPath];\nreusableView = headerView;\n}\n`
        }
        if (commonSettings.indexOf('footerView') > -1) {
            sizeString += `- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout referenceSizeForFooterInSection:(NSInteger)section {\n return CGSizeMake(0, 0);\n}\n`
            headerFooterView += `if (kind == UICollectionElementKindSectionFooter)\n{\n${upperFirst}FooterView *footerview = [collectionView dequeueReusableSupplementaryViewOfKind:UICollectionElementKindSectionFooter withReuseIdentifier:${upperFirst}FooterIdentifier forIndexPath:indexPath];\nreusableView = footerview;\n}\n`
        }
        headerFooterView += 'return reusableView;\n'
        headerFooterView += sizeString
    }

    let selectCell = commonSettings.indexOf('selectCell') > -1 ? `- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {\n}\n` : '';
    let minimumInteritemSpacing = commonSettings.indexOf('minimumInteritemSpacing') > -1 ? `- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumInteritemSpacingForSectionAtIndex:(NSInteger)section{\n}\n` : '';
    let minimumLineSpacing = commonSettings.indexOf('minimumLineSpacing') > -1 ? `- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumLineSpacingForSectionAtIndex:(NSInteger)section{\n}\n` : '';

    let mansoryStr = $utils.getMansorys(formData.masonrys,formData.frame);
    let masonry = formData.masonrys?.length > 0 ? `[${formData.name} mas_makeConstraints:^(MASConstraintMaker *make) {
        ${mansoryStr}
    }];\n`: ''
    var result = `${init}${frame}${addSubView}${backgroundColor}${registerClass}${masonry}
        /*${minimumInteritemSpacing}${minimumLineSpacing}${sectionNum}${sectionInset}${cellNum}${cellSize}${cellView}${headerFooterView}${selectCell}*/\n`
    console.log(result);
    form.result = result;
    emits('create', result)
    if (needCopy) {
        $utils.copy(result)
        form.result = '已复制到剪切板\n' + result;
    }
};


const onCreateSwift = (formData, needCopy = false) => {

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

.box-item {
    margin-top: 5px;

}


.select-input{
    width: 150px !important;
    margin-right: 10px;
    margin-left: 5px;
}

/* .registerClassTypes-class {
    border: solid 1px black;
    margin-left: 10px;
} */</style>