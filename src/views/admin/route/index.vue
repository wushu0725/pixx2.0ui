<!--
  -    Copyright (c) 2018-2025, lengleng All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lengleng (wangiegie@gmail.com)
  -->

<template>
    <div class="app-container pull-auto">
        <basic-container>
            <vue-json-editor v-model="json" :show-btns="false"></vue-json-editor>
            <div align="center">
                <el-button @click="edit()">更新</el-button>
                <el-button type="warning" @click="fallback()">回滚</el-button>
            </div>
        </basic-container>
    </div>
</template>
<script>
import vueJsonEditor from 'vue-json-editor'
import  {fetchList, putObj,fallback} from '@/api/route'
export default {
    data () {
        return {
            json: null
        }
    },

    // 注入vueJsonEditor组件
    components: {
        vueJsonEditor
    },

    created () {
        this.getList()
    },

    methods: {
        getList () {
            fetchList().then(response => {
                this.json = response.data
                console.log(this.json)
            })
        },

        fallback (){
            fallback(this.json).then(response => {
                this.$notify({
                    title: '成功',
                    message: '回滚成功',
                    type: 'success',
                    duration: 2000
                })
            })
        },

        edit (){
            putObj(this.json).then(response => {
                this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 2000
                })
            })
        },

    }
}
</script>
