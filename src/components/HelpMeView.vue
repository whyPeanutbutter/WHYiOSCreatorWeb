<template>
    <el-form :model="form" label-width="120px">
        <div style="margin-bottom: 10px">
            帮帮我
        </div>
        <el-form-item label="问题描述">
            <el-input v-model="form.question" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item label="帮我解析">
            <div class="flex-row">
                <el-input v-model="form.password" placeholder="联系管理员索要密码 wuhyAppleDeveloper@163.com" />
            </div>
        </el-form-item>
        <el-form-item label="回答">
            <el-input v-model="form.result" type="textarea" :rows="25" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onCreate">解答</el-button>
        </el-form-item>
    </el-form>
    <!-- <el-input v-model="form.result" type="textarea" :rows="10"/> -->

</template>

<script setup>
import { reactive, watch, defineEmits, defineProps, toRef } from 'vue';
import * as $utils from './Utils';

// do not use same name with ref
var form = reactive({
    question: '',
    result: '点击create生成代码'
});

const resetForm = () => {
    console.log('reset');

};

const onCreate = async () => {
    getResponse()
};

const getResponse = async () => {
    const prompt = 'Hello, ChatGPT!';
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ''
        },
        body: JSON.stringify({
            prompt: prompt,
            max_tokens: 50,
            n: 1,
            stop: '\n'
        })
    })
        .then(res => res.json())
        .then(data => data.choices[0].text);
    form.result = response;
    console.log(response);
};

const onReset = () => {
    resetForm()
};

const onDelete = () => {
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