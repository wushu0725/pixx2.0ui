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
                 @row-save="handleSave"
                 @row-del="rowDel">
        <template slot-scope="scope"
                  slot="dropMenu">
          <el-dropdown-item divided
                            v-if="permissions.sys_log_del"
                            @click.native="handleView(scope.row,scope.index)">模型图</el-dropdown-item>
          <el-dropdown-item divided
                            v-if="permissions.sys_log_del"
                            @click.native="handleDeploy(scope.row,scope.index)">部署</el-dropdown-item>
          <el-dropdown-item divided
                            v-if="permissions.sys_log_del"
                            @click.native="handleDel(scope.row,scope.index)">删除</el-dropdown-item>

        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, delObj, addObj, deploy } from '@/api/activiti'
import { tableOption } from '@/const/crud/activiti'
import { mapGetters } from 'vuex'
export default {
  name: 'activiti',
  data () {
    return {
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
  created () {
    this.getList()
  },
  mounted: function () { },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.listQuery.orderByField = 'create_time'
      this.listQuery.isAsc = false
      fetchList(this.listQuery).then(response => {
        this.tableData = response.data.records
        this.page.total = response.data.total
        this.tableLoading = false
      })
    },
    currentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    sizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleView (row, index) {
      const name = `模型id为${row.id}的${row.name}流程图`,
        src = `/activti/detail/${row.id}`;
      this.$router.push({
        path: src,
        query: {
          name: name
        }
      })
    },
    handleDel (row, index) {
      this.$refs.crud.rowDel(row, index)
    },
    handleDeploy: function (row, index) {
      var _this = this
      this.$confirm('是否确认部署ID为"' + row.id + '"的模型?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return deploy(row.id)
      })
        .then(data => {
          this.getList()
          _this.$message({
            showClose: true,
            message: '部署成功',
            type: 'success'
          })
        })
        .catch(function (err) { })
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm('是否确认删除ID为"' + row.id + '"的模型?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return delObj(row.id)
        })
        .then(data => {
          this.getList()
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        })
        .catch(function (err) { })
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function (row, done) {
      addObj(row).then(data => {
        this.tableData.push(Object.assign({}, row))
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        done()
        this.getList()
      })
    },
    /**
     * 搜索回调
     */
    searchChange (form) {
      this.listQuery.category = form.category
      this.getList()
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

