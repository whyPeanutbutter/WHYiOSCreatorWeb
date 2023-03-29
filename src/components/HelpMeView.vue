<template>
    <el-form :model="form" :label-width="form.isMobile ? '' : '120px'" class="form-class">
        <div class="flex-row-center" style="margin-bottom: 10px">
            <!-- <el-button v-if="form.isMobile" type="primary" @click="backHome()">返回首页</el-button> -->
            <div>ChatGPT </div>
            <div class="geo-class" :style="form.isRightIpGeo ?'':'color:red;'">{{form.ipGeoText}}</div>
            <el-button v-if="!form.isRightIpGeo" type="primary" @click="get_geoip()">检测Ip</el-button>
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
                <el-input v-model="form.password" :style="form.widthStyle" show-password
                    placeholder="联系管理员 wuhyAppleDeveloper@163.com" />
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
                :disabled="!form.question || form.question.length == 0 || !form.password || form.password.length == 0 || !form.isRightIpGeo">解答</el-button>
            <el-button type="primary" @click="onDeleteResult">清空回答</el-button>
            <el-button type="primary" @click="$utils.copy(form.result)">copy回答</el-button>
            <el-button v-if="form.wait" type="primary" @click="donotWait()">不等了</el-button>

        </el-form-item>
        <el-form-item label="回答">
            <div :style="form.widthStyle" class="result-container" v-html="parse_text(form.result)"></div>
            <el-input v-model="form.result" type="textarea" :autosize="{ maxRows: 2 }" :style="form.widthStyle" />
        </el-form-item>
        
    </el-form>
</template>

<script setup>
import { reactive, watch, defineEmits, defineProps, toRef, onMounted, ref,getCurrentInstance } from 'vue';
import router from '../router/index.js'
import {marked} from 'marked'
import * as $utils from './Utils';
const { proxy } = getCurrentInstance();
// import md5 from 'js-md5';


// do not use same name with ref
var form = reactive({
    question: '',
    result: '',
    wait: false,
    system_prompt: '用Objective-c编写，给出简短的回答，不要做出解释',
    system_prompt_select: '',
    password: proxy.gptkey,
    isMobile: false,
    widthStyle: '',
    selectModal: 'gpt-3.5-turbo',
    uploadFiles: [],
    ipGeoText:'',
    isRightIpGeo:false
});


watch(() => form.password, (newValue, oldValue) => {
  proxy.gptkey = newValue;
  console.log(proxy.gptkey);

}, {
  deep: true,
  immediate: true
});

onMounted(() => {
    get_geoip()
    form.isMobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
    // form.widthStyle = form.isMobile ? '' : 'width: 500px;'
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
    },{
        value: '我将给出两个json数据，请找出他们的key或者key对应的vlaue不同的部分并输出，也就是给出他们包含数据的并集。不要做出解释，简短的回答',
        label: 'json数据对比',
    },
     {
        value: '我想让你做一个旅游指南。我会把我的位置写给你，你会推荐一个靠近我的位置的地方。在某些情况下，我还会告诉您我将访问的地方类型。您还会向我推荐靠近我的第一个位置的类似类型的地方',
        label: '充当旅游指南',
    }, {
        label: "发送图片",
        value: "从现在起, 当你想发送一张照片时，请使用 Markdown ,并且 不要有反斜线, 不要用代码块。使用 Unsplash API (https://source.unsplash.com/1280x720/? < PUT YOUR QUERY HERE >)"
    },{
        label:'debug code',
        value:"I want you to debug this code. The code is supposed to do [provide purpose] [Insert code here]"
    },
    {
        label:'给代码添加注释',
        value:"给代码添加注释"
        
    },
    {
        label:'自定义promt模版',
        value:"角色-目标-提需求-补充；\n 我的情况是-我想-你是谁-我要你"
        
    },{
        label:'抖音标题制作',
        value:`下面是一些抖音标题
了了睛山见，纷纷宿雾空。＃爱情＃大概这就是爱情最美的样子 ＃甜甜的恋爱

你我共存，枯木逢春。#爱情

遇一树花开，染一身花香，从此心里每个角落都开满花。#花#春

若无闲事挂心头 便是人间好时节 #海棠花＃看看你相册里的花花

请模仿上面抖音标题的风格，以用户输入的话为主题，写一个标题。标题中可以引用相关古诗词，标题最后需要用Hashtag给出话题。`
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
        let arrLength = arr.length;
        for (var i = 0; i < arrLength * 17; i += 2) {
            let index1 = parseInt(arr[i % arrLength]) * (i + 1) % 40;
            let index2 = parseInt(arr[(i + 1) % arrLength]) * (i + 1) % 40;
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


const donotWait = () => {
    form.wait = false
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
                form.result += "<div class='error-red'> 错误: " + ex.message + "</div>";
            }

            if (oJson.error && oJson.error.message) {
                form.result += "<div class='error-red'> 错误: " + oJson.error.message + "</div>";
            } else if (oJson.choices && oJson.choices[0].message) {
                var s = oJson.choices[0].message.content;

                if (s == "") s = "无响应";
                form.result += "<div class='gpt-result'> \n************************************************************************\nChatGPT: \n" + s+ "</div>";
                form.question = "";
            }
        }
    };
    if (!form.selectModal || form.selectModal.length == 0) {
        form.selectModal = 'gpt-3.5-turbo';
    }
    var sModel = form.selectModal;
    var iMaxTokens = 3500;
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
    form.result += "<div class='question'>我: " + sQuestion + '</div>';
   


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

const onDeleteResult = async() => {
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

const parse_text = (text) => {
    if(!text){
        return ''
    }
    let lines = text.split("\n");
    lines = lines.filter(line => line !== "");
    let count = 0;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.includes("```")) {
            count += 1;
            let items = line.split('`');
            if (count % 2 === 1) {
                lines[i] = `<pre><code class="language">`
            } else {
                lines[i] = `<br></code></pre>`
            }
        } else {
            if (i > 0) {
                if (count % 2 === 1) {
                    line = line.replace("`", "\\`");
                    line = line.replace("<", "&lt;");
                    line = line.replace(">", "&gt;");
                    line = line.replace(" ", "&nbsp;");
                    line = line.replace("*", "&ast;");
                    line = line.replace("_", "&lowbar;");
                    line = line.replace("-", "&#45;");
                    line = line.replace(".", "&#46;");
                    line = line.replace("!", "&#33;");
                    line = line.replace("(", "&#40;");
                    line = line.replace(")", "&#41;");
                    line = line.replace("$", "&#36;");
                }
                lines[i] = "<br>" + line;
            }
        }
    }
    text = lines.join("");
    text = imageTextTohtml(text)
    text = `<div class='result-bg'>` + text + '</div>'
    return text;
}

const imageTextTohtml = (text) => {
    const pattern = /!\[(.*?)\]\((.*?)\)/mg;
    let matcher;
    while ((matcher = pattern.exec(text)) !== null) {
        console.log(matcher);
        if (matcher) {
            text = text.replace(matcher[0],`<img class='image-result' src="${matcher[2]}" >`)
        }
    }
    console.log(text);
    text = marked(text)
    console.log(text);
    return text
}

const get_geoip = async() => {
  const response = await fetch('https://ipapi.co/json/', {timeout: 5000});
  const data = await response.json();
  if ("error" in data) {
    console.warning(`无法获取IP地址信息。\n${data}`);
    if (data['reason'] === "RateLimited") {
        result = "获取IP地理位置失败，因为达到了检测IP的速率限制。聊天功能可能仍然可用，但请注意，如果您的IP地址在不受支持的地区，您可能会遇到问题。";
        form.isRightIpGeo = true
        form.ipGeoText = '获取ip失败'
        form.result = form.result + `**${result}**`;
    } else {
        result = `获取IP地理位置失败。原因：${data['reason']}`;
        form.isRightIpGeo = true
        form.ipGeoText = '获取ip失败'
        form.result = form.result + `**${result}**`;
    }
  } else {
    const country = data['country_name'];
    if (country === "China") {
      const text = "**您的IP区域：中国。请立即检查代理设置，在不受支持的地区使用API可能导致账号被封禁。**";
      console.info(text);
      form.isRightIpGeo = false
      form.ipGeoText = `您的IP区域：${country}。`;
      form.result = form.result + `**${text}**`;
    } else {
      const text = `您的IP区域：${country}。`;
      console.info(text);
      form.isRightIpGeo = true
        form.ipGeoText = text
    }
  }

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

.flex-row-center {
    display: flex;
    align-items: center;
    justify-content: center;
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

.geo-class{
    font-size: 9px;
font-family: PingFangSC, PingFangSC-Regular;
font-weight: 400;
color: #999999;
margin-left: 5px;
}

.result-bg {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    width: 100%;
    border: 1px solid #409eff;
    height: 100%;
    padding: 15px 10px 0;
    flex: 1;
    box-sizing: border-box;
}

.result-container {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    max-height: 600px;
    min-height: 300px;
    text-align: left;
    overflow-x: hidden;
    overflow-y: scroll;
    box-sizing: border-box;
    width: 100%;
}

.question{
    width: 100%;
    background-color: #bedaf7;
}

.error-red{
    width: 100%;
    background-color: #f7becb;
}

.gpt-result{
    width: 100%;
    background-color: #d3e3ff57;
}

.image-result{
    width: 100%;
}

code {
    display: inline;
    white-space: break-spaces;
    border-radius: 6px;
    margin: 0 2px 0 2px;
    padding: .2em .4em .1em .4em;
    background-color: rgba(175, 184, 193, 0.2);
    width: 100%;
    word-break: break-all;
    box-sizing: border-box;
}

pre code {
    width: 100%;
    display: block;
    white-space: pre;
    background-color: hsla(0, 0%, 0%, 72%);
    border: solid 5px var(--color-border-primary) !important;
    border-radius: 10px;
    padding: 0 1.2rem 1.2rem;
    margin-top: 1em !important;
    color: #FFF;
    box-shadow: inset 0px 8px 16px hsla(0, 0%, 0%, .2);
    box-sizing: border-box;

}

.form-class{
    width: 100%;
    box-sizing: border-box;
    padding: 5px;
}
</style>