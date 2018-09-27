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
      <avue-crud ref="crud"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 @current-change="currentChange"
                 @size-change="sizeChange"
                 @search-change="searchChange"
                 @refresh-change="refreshChange"
                 @row-del="rowDel">
        <template slot-scope="scope"
                  slot="menu">
          <el-button type="success"
                     v-if="permissions.sys_log_del"
                     icon="el-icon-view"
                     size="mini"
                     plain
                     @click="handlePic(scope.row,scope.index)">流程图</el-button>
          <el-button type="warning"
                     v-if="permissions.sys_log_del && scope.row.suspend"
                     icon="el-icon-circle-check"
                     size="mini"
                     plain
                     @click="handleStatus(scope.row,'active')">激活</el-button>
          <el-button type="warning"
                     v-if="permissions.sys_log_del && !scope.row.suspend"
                     icon="el-icon-circle-close"
                     size="mini"
                     plain
                     @click="handleStatus(scope.row,'suspend')">失效</el-button>
          <el-button type="danger"
                     v-if="permissions.sys_log_del"
                     icon="el-icon-delete"
                     size="mini"
                     plain
                     @click="handleDel(scope.row,scope.index)">删除</el-button>
        </template>
      </avue-crud>
    </basic-container>
    <el-dialog
            title="流程图"
            :visible.sync="showPicDialog">
      <img :src="actPicUrl">
    </el-dialog>
  </div>
</template>

<script>
  import { fetchList, delObj, addObj, status} from '@/api/process'
  import { tableOption } from '@/const/crud/process'
  import { mapGetters } from 'vuex'
  export default {
    name: 'process',
    data() {
      return {
        showPicDialog: false,
        actPicUrl: '',
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        listQuery: {
          page: 1,
          limit: 20,
          category: undefined
        },
        tableLoading: false,
        tableOption: tableOption
      }
    },
    created() {
      this.getList()
    },
    mounted: function() { },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      getList() {
        this.tableLoading = true
        this.listQuery.orderByField = 'create_time'
        this.listQuery.isAsc = false
        fetchList(this.listQuery).then(response => {
          this.tableData = response.data.records
          this.page.total = response.data.total
          this.tableLoading = false
        })
      },
      currentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      sizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handlePic(row, index) {
          this.actPicUrl = `http://192.168.0.20:9999/act/process/resource/`+row.deploymentId + '/' + row.processonDefinitionId + "/image"
          this.showPicDialog = true
      },
      handleStatus(row, type) {
          var _this = this
          this.$confirm('是否确认操作ID为"' + row.processonDefinitionId + '"的流程?', '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(function() {
                return status(row.processonDefinitionId,type)
            }).then(data => {
                this.getList()
                _this.$message({
                    showClose: true,
                    message: '操作成功',
                    type: 'success'
                })
            }).catch(function(err) { })
      },
      handleDel(row, index) {
        this.$refs.crud.rowDel(row, index)
      },
      rowDel: function(row, index) {
        var _this = this
        this.$confirm('是否确认删除ID为"' + row.deploymentId + '"的模型?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function() {
            return delObj(row.deploymentId)
          })
          .then(data => {
            this.getList()
            _this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
          })
          .catch(function(err) { })
      },
      /**
       * 搜索回调
       */
      searchChange(form) {
        this.listQuery.category = form.category
        this.getList()
      },
      /**
       * 刷新回调
       */
      refreshChange() {
        this.getList()
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>

