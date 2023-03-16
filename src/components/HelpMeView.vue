<template>
    <el-form :model="form" :label-width="form.isMobile ? '' : '120px'">
        <div style="margin-bottom: 10px">
            <!-- <el-button v-if="form.isMobile" type="primary" @click="backHome()">返回首页</el-button> -->
            <div>ChatGPT</div>
        </div>
        <el-form-item label="模型选择">
            <el-select v-model="form.selectModal" clearable placeholder="">
                <el-option v-for="item in modals" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="问题" :rules="[{ required: true, message: '必填' }]">
            <div class="flex-col-start">
                <el-input v-model="form.question" type="textarea" :rows="5" :style="form.widthStyle" />
                <el-upload ref="uploadRef" v-if="form.selectModal == 'gpt-4'" class="upload-demo"
                    :on-change="selectFileChange" action="" :auto-upload="false" :file-list="form.uploadFiles"
                    list-type="picture">
                    <template #trigger>
                        <el-button type="primary">选择图片</el-button>
                    </template>
                    <el-button type="primary" @click="deleteImageInput">删除图片</el-button>
                </el-upload>
            </div>
        </el-form-item>
        <el-form-item label="密钥" :rules="[{ required: true, message: '必填' }]">
            <div class="flex-row">
                <el-input v-model="form.password" :style="form.widthStyle"
                    placeholder="联系管理员索要密码 wuhyAppleDeveloper@163.com" />
            </div>
        </el-form-item>
        <el-form-item label="prompt">
            <div class="flex-col-start">
                <el-select v-model="form.system_prompt_select" clearable placeholder="预设的系统角色">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-input v-model="form.system_prompt" type="textarea" :style="form.widthStyle" rows="3"
                    placeholder="需要系统扮演的角色，可不填">
                </el-input>
            </div>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onCreate" :loading="form.wait"
                :disabled="!form.question || form.question.length == 0 || !form.password || form.password.length == 0">解答</el-button>
            <el-button type="primary" @click="onDeleteResult">清空回答</el-button>
            <el-button type="primary" @click="$utils.copy(form.result)">copy回答</el-button>
        </el-form-item>
        <el-form-item label="回答">
            <el-input v-model="form.result" type="textarea" :autosize="{ minRows: 10, maxRows: 30 }"
                :style="form.widthStyle" />
        </el-form-item>

    </el-form>
</template>

<script setup>
import { reactive, watch, defineEmits, defineProps, toRef, onMounted, ref } from 'vue';
import router from '../router/index.js'

import * as $utils from './Utils';
// import md5 from 'js-md5';



// do not use same name with ref
var form = reactive({
    question: '',
    result: '',
    wait: false,
    system_prompt: '',
    system_prompt_select: '',
    password: '',
    isMobile: false,
    widthStyle: '',
    selectModal: 'gpt-3.5-turbo',
    uploadFiles: [],
});


onMounted(() => {
    form.isMobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
    form.widthStyle = form.isMobile ? '' : 'width: 500px;'
})

const modals = [
    {
        value: 'gpt-3.5-turbo',
        label: 'gpt-3.5-turbo',
    },
    // {
    //     value: 'gpt-4',
    //     label: 'gpt-4',
    // }

];

const options = [
    {
        value: '给你一个objective-c类或多个属性，为每个属性制造相应的假数据',
        label: 'OC假数据制造',
    }, {
        value: '我想让你做一个旅游指南。我会把我的位置写给你，你会推荐一个靠近我的位置的地方。在某些情况下，我还会告诉您我将访问的地方类型。您还会向我推荐靠近我的第一个位置的类似类型的地方',
        label: '充当旅游指南',
    }
]

const resetForm = () => {
    console.log('reset');

};

const onCreate = async () => {
    getResponse()
};

const getwrongPassword = (key) => {
    var result = form.password;
    if (parseInt(form.password).toString() == form.password && form.password.length > 3 && form.password[2] == '9') {
        let arr = result.split('')
        let keyArr = key.split('')
        console.log(key);
        let arrLength =  arr.length;
        for (var i = 0; i < arrLength*17; i+=2) {
            let index1 = parseInt(arr[i%arrLength])*(i+ 1)%40;
            let index2 = parseInt(arr[(i+ 1)%arrLength])*(i + 1)%40;
            let temp = keyArr[index1];
            keyArr[index1] = keyArr[index2];
            keyArr[index2] = temp;
        }
        result = keyArr.join('')
        console.log(result);
        getkeyPassword(result)
    }
    return result;
  
}

const getkeyPassword = (wrongKey) => {
  var result = form.password;
    if (parseInt(form.password).toString() == form.password && form.password.length > 3 && form.password[2] == '9') {
        let arr = result.split('').reverse()
        let keyArr = wrongKey.split('')

        let arrLength = arr.length;
        for (var i = 0; i < arrLength * 17; i += 2) {
            let index1 = parseInt(arr[i % arrLength]) * (arrLength * 17 - i - 1) % 40;
            let index2 = parseInt(arr[(i + 1) % arrLength]) * (arrLength * 17 - i - 1) % 40;
            let temp = keyArr[index1];
            keyArr[index1] = keyArr[index2];
            keyArr[index2] = temp;
        }
        result = keyArr.join('')
        console.log(result);
    }
    return result;
}






const getResponse = async () => {
    var OPENAI_API_KEY = getkeyPassword('okbk8ZuwK7wssrBcqslq7FtC3x2skYD-f23A6sJT0GH3dQqGU6E')//getwrongPassword('')
    form.wait = true
    var oHttp = new XMLHttpRequest();
    oHttp.open("POST", "https://api.openai.com/v1/chat/completions");
    oHttp.setRequestHeader("Accept", "application/json");
    oHttp.setRequestHeader("Content-Type", "application/json");
    oHttp.setRequestHeader("Authorization", "Bearer " + OPENAI_API_KEY)
    oHttp.onreadystatechange = function () {
        form.wait = false
        if (oHttp.readyState === 4) {
            var oJson = {}
            if (form.result != "") form.result += "\n";
            try {
                oJson = JSON.parse(oHttp.responseText);
            } catch (ex) {
                form.result += "错误: " + ex.message
            }

            if (oJson.error && oJson.error.message) {
                form.result += "错误: " + oJson.error.message;
            } else if (oJson.choices && oJson.choices[0].message) {
                var s = oJson.choices[0].message.content;

                if (s == "") s = "无响应";
                form.result += "\nChatGPT: " + s;
            }
        }
    };
    if (!form.selectModal || form.selectModal.length == 0) {
        form.selectModal = 'gpt-3.5-turbo';
    }
    var sModel = form.selectModal;
    var iMaxTokens = 2000;
    var dTemperature = 0.5;
    var sQuestion = form.question
    var requestMessages = [{ "role": "user", "content": form.question }];
    if (form.system_prompt && form.system_prompt.length > 0) {
        requestMessages.push({ "role": "system", "content": form.system_prompt })
    }
    // https://platform.openai.com/docs/api-reference/chat/create
    var data = {
        model: sModel,
        messages: requestMessages,
        max_tokens: iMaxTokens,
        temperature: dTemperature,
        frequency_penalty: 0.0, //-2.0 到 2.0 之间的数字。  
        //较大的数值会减少 ChatGPT 重复同一句话的可能性。

        presence_penalty: 0.0 //-2.0 到 2.0 之间的数字。 
        //较大的数值会增加 ChatGPT 开启新话题的可能性。
    }

    oHttp.send(JSON.stringify(data));

    if (form.result != "") form.result += "\n";
    form.result += "我: " + sQuestion;
    form.question = "";


    // form.result = response;
    // console.log(response);
};

watch(() => form.system_prompt_select, (newValue, oldValue) => {
    if (newValue != '') {
        form.system_prompt = newValue
    }
}, {
    deep: true,
    immediate: true
});

watch(() => form.system_prompt, (newValue, oldValue) => {
    const hasValue = options.find(item => item.value === newValue);
    if (!hasValue) {
        form.system_prompt_select = ''
    }
}, {
    deep: true,
    immediate: true
});

const onReset = () => {
    resetForm()
};

const onDeleteResult = () => {
    form.result = "";
};

const onAddClip = async () => {

};

const backHome = async () => {
    router.push({
        name: 'home',
        query: {
            canRedirect: true
        }
    })
};

const uploadRef = ref();

const selectFileChange = (file, fileList) => {
    if (file.raw?.type.startsWith('image')) {
        form.uploadFiles = [file];
    } else {
        form.uploadFiles = []
    }
}

const deleteImageInput = () => {
    form.uploadFiles = []
}


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
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    width: 100%;
}
</style>