<template>
    <el-form :model="form" label-width="120px">
        <div style="margin-bottom: 10px">
            ChatGPT
        </div>
        <el-form-item label="问题描述">
            <el-input v-model="form.question" type="textarea" :rows="5" style=" width: 500px;" />
        </el-form-item>
        <el-form-item label="密钥">
            <div class="flex-row">
                <el-input v-model="form.password" style=" width: 500px;"
                    placeholder="联系管理员索要密码 wuhyAppleDeveloper@163.com" />
            </div>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onCreate" :loading="form.wait">解答</el-button>
            <el-button type="primary" @click="onDeleteResult">清空回答</el-button>
        </el-form-item>
        <el-form-item label="回答">
            <el-input v-model="form.result" type="textarea" :rows="30" style=" width: 500px;" />
        </el-form-item>

    </el-form>
</template>

<script setup>
import { reactive, watch, defineEmits, defineProps, toRef } from 'vue';
import * as $utils from './Utils';
// import md5 from 'js-md5';

// do not use same name with ref
var form = reactive({
    question: '',
    result: '',
    wait:false
});

const resetForm = () => {
    console.log('reset');

};

const onCreate = async () => {
    getResponse()
};

const getPassword = () => {
    // var result = form.password;
    // if (parseInt(form.password).toString() == form.password && form.password.length > 3 && form.password[2] == '9') {
    //     let arr = result.split('')//.reverse()
    //     let keyArr = 'sk-'.split('')
    //     console.log('sk-');
    //     let arrLength =  arr.length;
    //     for (var i = 0; i < arrLength*17; i+=2) {
    //         let index1 = parseInt(arr[i%arrLength])*(i+ 1)%40;
    //         let index2 = parseInt(arr[(i+ 1)%arrLength])*(i + 1)%40;
    //         let temp = keyArr[index1];
    //         keyArr[index1] = keyArr[index2];
    //         keyArr[index2] = temp;
    //     }
    //     result = keyArr.join('')
    //     console.log(result);
    //     getkeyPassword(result)
    // }
    // return result;
    var result = form.password;
    if (parseInt(form.password).toString() == form.password && form.password.length > 3 && form.password[2] == '9') {
        let arr = result.split('').reverse()
        let keyArr = 'dkbC5PMaWcqXI2B7GAlYDFNX3sAskhZ-nIP8dcJTyPMGU3oGmji'.split('')
                   
        let arrLength =  arr.length;
        for (var i = 0; i < arrLength*17; i+=2) {
            let index1 = parseInt(arr[i%arrLength])*(arrLength*17 - i - 1)%40;
            let index2 = parseInt(arr[(i+ 1)%arrLength])*( arrLength*17 - i - 1)%40;
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
    // const prompt = 'Hello, ChatGPT!';
    // const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': ''
    //     },
    //     body: JSON.stringify({
    //         prompt: prompt,
    //         max_tokens: 50,
    //         n: 1,
    //         stop: '\n'
    //     })
    // })
    //     .then(res => res.json())
    //     .then(data => data.choices[0].text);
    var OPENAI_API_KEY = getPassword()
    form.wait = true
    var oHttp = new XMLHttpRequest();
    oHttp.open("POST", "https://api.openai.com/v1/chat/completions");
    oHttp.setRequestHeader("Accept", "application/json");
    oHttp.setRequestHeader("Content-Type", "application/json");
    oHttp.setRequestHeader("Authorization", "Bearer " + OPENAI_API_KEY)
    console.log(11111111111);
    oHttp.onreadystatechange = function () {
        console.log(2222222222222);
        form.wait = false
        if (oHttp.readyState === 4) {
            var oJson = {}
            if (form.result != "") form.result += "\n";
            console.log(333333333333);

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
                form.result += "ChatGPT: " + s;
            }
        }
    };
    var sModel = 'gpt-3.5-turbo'//'text-davinci-003';//
    var iMaxTokens = 1000;
    var sUserId = "1";
    var dTemperature = 0.5;
    var sQuestion = form.question
    var data = {
        model: sModel,
        messages: [{"role": "user", "content": form.question}],
        max_tokens: iMaxTokens,
        user: sUserId,
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

const onReset = () => {
    resetForm()
};

const onDeleteResult = () => {
    form.result = "";
    emits('delete')
};

const onAddClip = async () => {

};

const onHelpMe = async () => {

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