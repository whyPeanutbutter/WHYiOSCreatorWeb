<template>
    <el-form :model="form" :label-width="form.isMobile ? '' : '120px'" class="form-class">
        <div class="flex-row-center" style="margin-bottom: 10px">
            <!-- <el-button v-if="form.isMobile" type="primary" @click="backHome()">返回首页</el-button> -->
            <div>ChatGPT </div>
            <div class="geo-class" :style="form.isRightIpGeo ? '' : 'color:red;'">{{ form.ipGeoText }}</div>
            <el-button v-if="!form.isRightIpGeo" type="primary" @click="get_geoip()">检测Ip</el-button>
        </div>
        <el-form-item label="模型选择">
            <el-select v-model="form.selectModal" clearable placeholder="">
                <el-option v-for="item in modals" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-switch v-model="form.showParam" class="switch-border" active-text="查看参数" />
            <el-switch v-model="form.isStream" class="switch-border" active-text="stream" :disabled='form.wait' />
            <el-switch v-model="form.isContinueStyle" class="switch-border" active-text="对话模式" />
        </el-form-item>
        <el-form-item v-if="form.showParam" label="参数选择">
            <el-scrollbar style="width:100%;" height="100px">
                <div class="slider-demo-block">
                    <el-tooltip class="box-item" effect="dark" content="数值大时，每次回答都会不同，更具创造性" placement="top">
                        <span class="demonstration">温度</span>
                    </el-tooltip>
                    <div class="slider-container">
                        <el-slider v-model="form.temperature" :max="2" :step="0.1" />
                    </div>
                </div>
                <div class="slider-demo-block">
                    <el-tooltip class="box-item" effect="dark" content="最大数会依据问题改变" placement="top">
                        <span class="demonstration">最大回答字数</span>
                    </el-tooltip>
                    <div class="slider-container">
                        <el-slider v-model="form.maxTokenNum" :max="form.allowMaxTokenNum" :min="200" :step="1" />
                    </div>
                </div>
                <!-- <div class="slider-demo-block">
                <span class="demonstration">Customized initial value</span>
                <el-slider v-model="value2" />
            </div>
            <div class="slider-demo-block">
                <span class="demonstration">Hide Tooltip</span>
                <el-slider v-model="value3" :show-tooltip="false" />
            </div> -->
            </el-scrollbar>
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
                <el-input v-model="form.system_prompt" type="textarea" :style="form.widthStyle" rows="1"
                    placeholder="需要系统扮演的角色，可不填">
                </el-input>
            </div>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onCreate" :loading="form.wait"
                :disabled="!form.question || form.question.length == 0 || !form.password || form.password.length == 0 || !form.isRightIpGeo">{{
                    form.isContinueStyle ? '接着答' : '解答' }}</el-button>
            <el-button type="primary" @click="onDeleteResult">清空回答</el-button>
            <el-button type="primary" @click="$utils.copy(form.orginResult)">copy回答</el-button>
            <el-button v-if="form.orginResult && form.orginResult.length > 0 && !form.isMobile" type="primary"
                @click="saveFile()">保存为文件</el-button>
            <el-button v-if="form.wait" type="primary" @click="donotWait()">不等了</el-button>

        </el-form-item>
        <el-form-item label="回答">
            <div :style="form.widthStyle" class="result-container" v-html="parse_text(form.result)"></div>
            <el-input v-model="form.orginResult" type="textarea" :autosize="{ maxRows: 2 }" :style="form.widthStyle" />
        </el-form-item>

    </el-form>
</template>

<script setup>
import { reactive, watch, defineEmits, defineProps, toRef, onMounted, ref, getCurrentInstance } from 'vue';
import router from '../router/index.js'
import { marked } from 'marked'
import * as $utils from './Utils';
import { saveAs } from 'file-saver'


const { proxy } = getCurrentInstance();

// import md5 from 'js-md5';


// do not use same name with ref
var form = reactive({
    question: '',
    result: '',
    orginResult: '',
    wait: false,
    system_prompt: '给出简短的回答，不要做出解释',
    system_prompt_select: '',
    password: proxy.gptkey,
    isMobile: false,
    widthStyle: '',
    selectModal: 'gpt-3.5-turbo',
    uploadFiles: [],
    ipGeoText: '',
    isRightIpGeo: false,
    abortController: null,
    //stream回答模式
    isStream: true,
    //连续问答模式
    isContinueStyle: false,
    //连续问答的信息
    allMessages: [],
    //查看请求参数
    showParam: false,

    temperature: 0.8,
    allowMaxTokenNum: 4000,
    maxTokenNum: 3000
});

//js计算字符串长度，其中中文长度为2英文为1
const getLength = (str) => {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) { //如果是中文字符
            len += 2;
        } else {
            len++;
        }
    }
    return len;
}

watch(() => form.question, (newValue, oldValue) => {
    var allowMaxTokenNum = 4000 - getLength(form.question) - getLength(form.system_prompt)
    if (form.isContinueStyle) {
        var data = [...form.allMessages];
        var totalLength = 0;
        for (var i = 0; i < data.length; i++) {
            var content = data[i].content;
            var length = content.replace(/[^\u0000-\u00ff]/g, 'xx').length; // 将中文替换成两个字符
            totalLength += length;
        }
        allowMaxTokenNum = 4000 - totalLength - getLength(form.system_prompt)
    }
    form.allowMaxTokenNum = allowMaxTokenNum < 100 ? 100 : allowMaxTokenNum
}, {
    deep: true,
    immediate: true
});

watch(() => form.password, (newValue, oldValue) => {
    proxy.gptkey = newValue;
    console.log(proxy.gptkey);

}, {
    deep: true,
    immediate: true
});

watch(() => form.allowMaxTokenNum, (newValue, oldValue) => {
    if (form.maxTokenNum == oldValue || form.maxTokenNum > newValue) {
        form.maxTokenNum = newValue;
    }
}, {
    deep: true,
    immediate: true
});

onMounted(() => {

    get_geoip();
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
        value: '用Objective-c编写，给出简短的回答，不要做出解释',
        label: 'OC回答'
    }, {
        label: "分步指导，逻辑增强",
        value: "Let's think step by step"

    },
    {
        value: '给你一个objective-c类或多个属性，为每个属性制造相应的假数据',
        label: 'OC假数据制造',
    }, {
        value: '我将给出两个json数据，请找出他们的key或者key对应的vlaue不同的部分并输出，也就是给出他们包含数据的并集。不要做出解释，简短的回答',
        label: 'json数据对比',
    },
    {
        label: "发送图片",
        value: "从现在起, 当你想发送一张照片时，请使用 Markdown ,并且 不要有反斜线, 不要用代码块。使用 Unsplash API (https://source.unsplash.com/1280x720/? < PUT YOUR QUERY HERE >)"
    }, {
        label: 'debug code',
        value: "I want you to debug this code. The code is supposed to do [provide purpose] [Insert code here]"
    },
    {
        label: '给代码添加注释',
        value: "给代码添加注释"

    },
    {
        label: '帮我总结内容',
        value: '请帮我总结内容，实现减少字数的同时，保证对话的质量。在总结中不要加入这一句话。'
    },
    {
        label: "充当提示生成器",
        value: "我希望你充当提示生成器。首先，我会给你一个这样的标题：《做个英语发音帮手》。然后你给我一个这样的提示：“我想让你做土耳其语人的英语发音助手，我写你的句子，你只回答他们的发音，其他什么都不做。回复不能是翻译我的句子，但只有发音。发音应使用土耳其语拉丁字母作为语音。不要在回复中写解释。我的第一句话是“伊斯坦布尔的天气怎么样？”。（你应该根据我给的标题改编示例提示。提示应该是不言自明的并且适合标题，不要参考我给你的例子。）我的第一个标题是“充当代码审查助手”\n"
    }, {
        label: "充当正则表达式生成器",
        value: "我希望你充当正则表达式生成器。您的角色是生成匹配文本中特定模式的正则表达式。您应该以一种可以轻松复制并粘贴到支持正则表达式的文本编辑器或编程语言中的格式提供正则表达式。不要写正则表达式如何工作的解释或例子；只需提供正则表达式本身。我的第一个提示是生成一个匹配电子邮件地址的正则表达式。\n"
    },
    {
        label: '自定义promt模版',
        value: "角色-目标-提需求-补充；\n 我的情况是-我想-你是谁-我要你"

    }, {
        value: '我想让你做一个旅游指南。我会把我的位置写给你，你会推荐一个靠近我的位置的地方。在某些情况下，我还会告诉您我将访问的地方类型。您还会向我推荐靠近我的第一个位置的类似类型的地方',
        label: '充当旅游指南',
    },
    {
        label: "充当小说家",
        value: "我想让你扮演一个小说家。您将想出富有创意且引人入胜的故事，可以长期吸引读者。你可以选择任何类型，如奇幻、浪漫、历史小说等——但你的目标是写出具有出色情节、引人入胜的人物和意想不到的高潮的作品。我的第一个要求是“我要写一部以未来为背景的科幻小说”。\n"
    }, {
        label: '抖音标题制作',
        value: `下面是一些抖音标题
        <
了了睛山见，纷纷宿雾空。＃爱情＃大概这就是爱情最美的样子 ＃甜甜的恋爱

你我共存，枯木逢春。#爱情

遇一树花开，染一身花香，从此心里每个角落都开满花。#花#春

若无闲事挂心头 便是人间好时节 #海棠花＃看看你相册里的花花
>
请模仿上面抖音标题的风格，以用户输入的话为主题，写一个标题。标题中可以引用相关古诗词,要吸引眼球，标题最后需要用Hashtag给出话题。`
    }
]

const resetForm = () => {
    console.log('reset');

};

const onCreate = async () => {

    getResponse().catch(error => {
        form.result += "<div class='error-red'> 错误: " + "Error fetching data:" + error + "</div>";
        form.orginResult += "错误: " + "Error fetching data:" + "Error fetching data:" + error;
        console.error("Error fetching data:", error);
    });
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
    if (abortController) {
        form.abortController.abort();
    }
}

const oldGetResponse = () => {
    // var OPENAI_API_KEY = getkeyPassword('okbk8ZuwK7wssrBcqslq7FtC3x2skYD-f23A6sJT0GH3dQqGU6E')//getwrongPassword('')
    // form.wait = true
    // var oHttp = new XMLHttpRequest();
    // oHttp.open("POST", "https://api.openai.com/v1/chat/completions");
    // oHttp.setRequestHeader("Accept", "application/json");
    // oHttp.setRequestHeader("Content-Type", "application/json");
    // oHttp.setRequestHeader("Authorization", "Bearer " + OPENAI_API_KEY)
    // oHttp.onreadystatechange = function () {
    //     form.wait = false
    //     if (oHttp.readyState === 4) {
    //         var oJson = {}
    //         if (form.result != "") {
    //             form.result += "\n";
    //             form.orginResult += "\n";
    //         }
    //         try {
    //             oJson = JSON.parse(oHttp.responseText);
    //         } catch (ex) {
    //             form.result += "<div class='error-red'> 错误: " + ex.message + "</div>";
    //             form.orginResult += "错误: " + ex.message;
    //         }

    //         if (oJson.error && oJson.error.message) {
    //             form.result += "<div class='error-red'> 错误: " + oJson.error.message + "</div>";
    //             form.orginResult += "错误: " + ex.message;
    //         } else if (oJson.choices && oJson.choices[0].message) {
    //             var s = oJson.choices[0].message.content;

    //             if (s == "") s = "无响应";
    //             form.result += "<div class='gpt-result'> \n************************************************************************\nChatGPT: \n" + s + "</div>";
    //             form.orginResult += "\n************************************************************************\nChatGPT: \n" + s;
    //             form.question = "";
    //         }
    //     }
    // };

    // oHttp.send(JSON.stringify(postData()));
}



const getResponse = async () => {
    // getwrongPassword('sk-')
    // return
    var OPENAI_API_KEY = getkeyPassword('bkmsjLitngigdBnbZsIl29S-3BT3kFJ62umMYVA6zyDMTU5crA7')
    form.wait = true
    form.abortController = new AbortController();
    const signal = form.abortController.signal;
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + OPENAI_API_KEY
            },
            body: JSON.stringify(postData()),
            signal // 添加中止信号
        });
        var sQuestion = form.question
        if (!response.ok) {
            form.result += "<div class='error-red'> 错误: " + `HTTP error! Status: ${response.status}` + "</div>";
            form.orginResult += "错误: " + `HTTP error! Status: ${response.status}`;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();


        let result = "";
        var isfirst = true
        if (form.isStream) {
            if (form.result != "") {
                form.result += "\n";
                form.orginResult += "\n";
            }
        }

        var allResultContent = ''
        while (true) {
            const { value, done } = await reader.read();
            if (done || !form.wait) break;
            result += decoder.decode(value, { stream: true });
            // 处理数据流的每个片段
            if (form.isStream) {
                processStreamChunk(decoder.decode(value, { stream: true }), isfirst, (content) => {
                    allResultContent += content
                });
                isfirst = false
            }
        }
        console.log(result)
        form.wait = false
        if (!form.isStream) {
            // 处理完整的数据流
            processStreamComplete(result, (content) => {
                allResultContent += content
            });
        }
        console.log('allResultContent' + allResultContent);

        if (form.isContinueStyle && allResultContent && allResultContent.length > 0) {
            var requestMessages = [{ "role": "user", "content": sQuestion }, { "role": "assistant", "content": allResultContent }];
            form.allMessages = form.allMessages.concat(requestMessages)
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Request aborted');
            form.result += "<div class='error-red'> 错误: " + `Request aborted 用户终止请求` + "</div>";
            form.orginResult += "错误: " + `Request aborted 用户终止请求`;
        } else {
            console.error("Error fetching data:", error);
            form.result += "<div class='error-red'> 错误: " + "Error fetching data:" + error + "</div>";
            form.orginResult += "错误: " + "Error fetching data:" + error;
        }
    }

};

const processStreamChunk = (chunks, isfirst, callBack) => {
    // 在这里处理每个数据流片段
    console.log('processStreamChunk' + chunks, isfirst);
    var chunkArr = chunks.trim().split('\n')
    for (let i = 0; i < chunkArr.length; i++) {
        var chunk = chunkArr[i]
        if (!chunk || chunk.length < 7 || chunk == 'data: [DONE]') {
            continue
        }
        chunk = chunk.slice(6)
        // 在这里处理完整的数据流
        let oJson = {};
        try {
            oJson = JSON.parse(chunk);
        } catch (ex) {
            form.result += "<div class='error-red'> 错误1: " + ex.message + "</div>";
            form.orginResult += "错误: " + ex.message;
            break
        }

        if (oJson.error && oJson.error.message) {
            form.result += "<div class='error-red'> 错误2: " + oJson.error.message + "</div>";
            form.orginResult += "错误: " + oJson.error.message;
        } else {
            if (oJson.choices && oJson.choices[0].delta) {
                var s = oJson.choices[0].delta.content;

                if (s) {
                    if (isfirst) {
                        form.result += "<div class='gpt-result'> ************************************************************************\nChatGPT: \n</div>"
                        form.orginResult += "\n************************************************************************\nChatGPT: \n"
                    }
                    isfirst = false
                } else {
                    s = ""
                }
                callBack(s)

                var finishReason = oJson.choices[0].delta.finish_reason
                if (finishReason && finishReason.length > 0) {
                    if (finishReason != 'stop') {
                        s += '\n结束原因：' + finishReason
                    }
                }

                // console.log(s);

                var end = ''
                if (form.result.endsWith("</div>")) {
                    var insertIndex = form.result.length - 6;
                    var insertString = form.result.slice(0, insertIndex) + s + '</div>'
                    form.result = insertString;
                } else {
                    form.result += s
                }



                form.orginResult += s;
                form.question = "";
                if (finishReason && finishReason.length > 0) {
                    break
                }
            }
        }

    }


}

const processStreamComplete = (result, callBack) => {
    console.log("processStreamComplete" + result);
    form.wait = false
    // 在这里处理完整的数据流
    let oJson = {};
    if (form.result != "") {
        form.result += "\n";
        form.orginResult += "\n";
    }
    try {
        oJson = JSON.parse(result);
    } catch (ex) {
        form.result += "<div class='error-red'> 错误3: " + ex.message + "</div>";
        form.orginResult += "错误: " + ex.message;
    }

    if (oJson.error && oJson.error.message) {
        form.result += "<div class='error-red'> 错误4: " + oJson.error.message + "</div>";
        form.orginResult += "错误: " + oJson.error.message;
    } else if (oJson.choices && oJson.choices[0].message) {
        var s = oJson.choices[0].message.content;
        callBack(s)
        if (s == "") s = "无响应";
        form.result += "<div class='gpt-result'> \n************************************************************************\nChatGPT: \n" + s + "</div>";
        form.orginResult += "\n************************************************************************\nChatGPT: \n" + s;
        form.question = "";
    }
}



const postData = () => {
    if (!form.selectModal || form.selectModal.length == 0) {
        form.selectModal = 'gpt-3.5-turbo';
    }
    var sModel = form.selectModal;
    var iMaxTokens = form.maxTokenNum;
    var dTemperature = form.temperature;//一般来说，在构建需要可预测响应的应用程序时，我建议使用温度为零。在所有课程中，我们一直设置温度为零，如果您正在尝试构建一个可靠和可预测的系统，我认为您应该选择这个温度。如果您尝试以更具创意的方式使用模型，可能需要更广泛地输出不同的结果，那么您可能需要使用更高的温度。
    var sQuestion = form.question
    var requestMessages = [{ "role": "user", "content": sQuestion }];
    if (form.isContinueStyle) {
        var tmpAllMessages = form.allMessages.concat(requestMessages)
        requestMessages = [...tmpAllMessages];
    }
    if (form.system_prompt && form.system_prompt.length > 0) {
        requestMessages.push({ "role": "system", "content": form.system_prompt })
    }
    console.log('requestMessages', requestMessages);
    // https://platform.openai.com/docs/api-reference/chat/create
    var data = {
        model: sModel,
        messages: requestMessages,
        max_tokens: iMaxTokens,
        temperature: dTemperature,//0-2 控制模型生成的多样性和创造力，较高的温度会产生更多的随机性和变化性。希望结果更有创意可以尝试 0.9，或者希望有固定结果可以尝试 0.0 .
        frequency_penalty: 0.5, //-2.0 到 2.0 之间的数字。  
        //较大的数值会减少 ChatGPT 重复同一句话的可能性。
        stream: form.isStream,
        presence_penalty: 0.0 //-2.0 到 2.0 之间的数字。 
        //较大的数值会增加 ChatGPT 开启新话题的可能性。
    }


    if (form.result != "") {
        form.result += "\n";
        form.orginResult += "\n";
    }
    form.result += "<div class='question'>我: " + sQuestion + '</div>';
    form.orginResult += "我: " + sQuestion;
    return data
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

const saveFile = () => {
    const data = form.orginResult; // 文件内容
    console.log(data);
    var title = '';
    if (data.length > 11) {
        title = data.slice(3, 10) + '.txt';
    } else {
        title = 'myfile.txt'
    }

    const blob = new Blob([data]) // 将数据封装在 Blob 对象中
    saveAs(blob, title) // 保存文件
}


const onDeleteResult = async () => {

    form.result = "";
    form.orginResult = ''
    form.allMessages = []

    //     var test = `data: {"id":"chatcmpl-76uk0YLzZlAohYR234UKd5I7Gb0tw","object":"chat.completion.chunk","created":1681882436,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"role":"assistant"},"index":0,"finish_reason":null}]}

    // data: {"id":"chatcmpl-76uk0YLzZlAohYR234UKd5I7Gb0tw","object":"chat.completion.chunk","created":1681882436,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":"Hello"},"index":0,"finish_reason":null}]}

    // `
    //     processStreamChunk(test, true)
    //     test = `data: {"id":"chatcmpl-76uk0YLzZlAohYR234UKd5I7Gb0tw","object":"chat.completion.chunk","created":1681882436,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":"!"},"index":0,"finish_reason":null}]}

    // data: {"id":"chatcmpl-76uk0YLzZlAohYR234UKd5I7Gb0tw","object":"chat.completion.chunk","created":1681882436,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":" How"},"index":0,"finish_reason":null}]}

    // data: {"id":"chatcmpl-76uk0YLzZlAohYR234UKd5I7Gb0tw","object":"chat.completion.chunk","created":1681882436,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":" may"},"index":0,"finish_reason":null}]}

    // data: {"id":"chatcmpl-76uk0YLzZlAohYR234UKd5I7Gb0tw","object":"chat.completion.chunk","created":1681882436,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":" I"},"index":0,"finish_reason":null}]}

    // data: {"id":"chatcmpl-76uk0YLzZlAohYR234UKd5I7Gb0tw","object":"chat.completion.chunk","created":1681882436,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":" assist"},"index":0,"finish_reason":null}]}

    // data: {"id":"chatcmpl-76uk0YLzZlAohYR234UKd5I7Gb0tw","object":"chat.completion.chunk","created":1681882436,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":" you"},"index":0,"finish_reason":null}]}

    // data: {"id":"chatcmpl-76uk0YLzZlAohYR234UKd5I7Gb0tw","object":"chat.completion.chunk","created":1681882436,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":" today"},"index":0,"finish_reason":null}]}

    // data: {"id":"chatcmpl-76uk0YLzZlAohYR234UKd5I7Gb0tw","object":"chat.completion.chunk","created":1681882436,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":"?"},"index":0,"finish_reason":null}]}

    // data: {"id":"chatcmpl-76uk0YLzZlAohYR234UKd5I7Gb0tw","object":"chat.completion.chunk","created":1681882436,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{},"index":0,"finish_reason":"stop"}]}

    // data: [DONE]`
    //     processStreamChunk(test, false)
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
    if (!text) {
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
            text = text.replace(matcher[0], `<img class='image-result' src="${matcher[2]}" >`)
        }
    }
    text = marked(text)
    return text
}

const get_geoip = async () => {
    // console.log(form.temperature);
    // return
    try {
        var result = ''
        const response = await fetch('https://ipapi.co/json/', { timeout: 5000 });
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
    } catch (error) {
        var result = `获取IP地理位置失败。原因：${error}`;
        form.isRightIpGeo = true
        form.ipGeoText = '获取ip失败'
        form.result = form.result + `**${error}**`;
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

.geo-class {
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

.question {
    width: 100%;
    background-color: #bedaf7;
}

.error-red {
    width: 100%;
    background-color: #f7becb;
}

.gpt-result {
    width: 100%;
    background-color: #d3e3ff57;
}

.image-result {
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

.form-class {
    width: 100%;
    box-sizing: border-box;
    padding: 5px;
}

.switch-border {
    border: 1px solid #409eff;
    border-radius: 4px;
    padding: 0 6px;
    margin-left: 4px;
}


.slider-demo-block {
    display: flex;
    align-items: center;
}

.slider-demo-block .demonstration {
    font-size: 14px;
    color: var(--el-text-color-secondary);
}

.slider-container {
    padding: 2px 19px;
    flex: 1;
}

.button-style {
    background: #4f91ec;
}
</style>