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
  <div class="app-container calendar-list-container">
    <basic-container>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form :model="ruleForm2"
                     :rules="rules2"
                     ref="ruleForm2"
                     label-width="100px"
                     class="demo-ruleForm">
              <el-form-item label="用户名"
                            prop="username">
                <el-input type="text"
                          v-model="ruleForm2.username"
                          disabled></el-input>
              </el-form-item>
              <el-form-item label="原密码"
                            prop="password">
                <el-input type="password"
                          v-model="ruleForm2.password"
                          auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码"
                            prop="newpassword1">
                <el-input type="password"
                          v-model="ruleForm2.newpassword1"
                          auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码"
                            prop="newpassword2">
                <el-input type="password"
                          v-model="ruleForm2.newpassword2"
                          auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="社交登录"
                            prop="social">
                <a href="#"
                   style="color: blue"
                   @click="handleClick('wechat')">绑定微信</a>
              </el-form-item>
              <el-form-item>
                <el-button type="primary"
                           @click="submitForm('ruleForm2')">提交
                </el-button>
                <el-button @click="resetForm('ruleForm2')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>


<script>
  import {openWindow} from '@/util/util'
  import {mapState} from 'vuex'
  import {getToken} from '@/util/auth'
  import request from '@/router/axios'

  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (this.ruleForm2.password !== '') {
          if (value === '') {
            callback(new Error('请再次输入密码'))
          } else if (value !== this.ruleForm2.newpassword1) {
            callback(new Error('两次输入密码不一致!'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        fileList: [],
        show: false,
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        ruleForm2: {
          username: '',
          password: '',
          newpassword1: '',
          newpassword2: ''
        },
        rules2: {
          password: [{required: true, min: 6, message: '原密码不能为空且不少于6位', trigger: 'change'}],
          newpassword1: [{required: true, min: 6, message: '新密码不能为空且不少于6位', trigger: 'change'}],
          newpassword2: [{required: true, validator: validatePass, trigger: 'blur'}]
        }
      }
    },
    created() {
      this.ruleForm2.username = this.userInfo.username
    },
    computed: {
      ...mapState({
        userInfo: state => state.user.userInfo
      }),
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            request({
              url: '/admin/user/edit',
              method: 'put',
              data: this.ruleForm2
            }).then(response => {
              if (response.data.data) {
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
                // 修改密码之后强制重新登录
                if (this.ruleForm2.newpassword1 !== '') {
                  this.$store.dispatch('LogOut').then(() => {
                    location.reload() // 为了重新实例化vue-router对象 避免bug
                  })
                } else {
                  this.$router.push({path: '/'})
                }
              } else {
                this.$notify({
                  title: '失败',
                  message: response.data.msg,
                  type: 'error',
                  duration: 2000
                })
              }
            }).catch(() => {
              this.$notify({
                title: '失败',
                message: '修改失败',
                type: 'error',
                duration: 2000
              })
            })
          } else {
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      handleClick(thirdpart) {
        let appid, client_id, redirect_uri, url
        redirect_uri = encodeURIComponent(window.location.origin + '/#/authredirect?type=BIND')
        if (thirdpart === 'wechat') {
          appid = 'wxd1678d3f83b1d83a'
          url = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + appid + '&redirect_uri=' + redirect_uri + '&state=' + appid + '&response_type=code&scope=snsapi_login#wechat_redirect'
        } else if (thirdpart === 'tencent') {
          client_id = '101322838'
          url = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&state=' + appid + '&client_id=' + client_id + '&redirect_uri=' + redirect_uri
        }
        openWindow(url, thirdpart, 540, 540)
      }
    }
  }
</script>
