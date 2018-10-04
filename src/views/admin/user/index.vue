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
      <avue-crud :option="option"
                 ref="crud"
                 v-model="form"
                 :page="page"
                 :table-loading="listLoading"
                 @current-change="handleCurrentChange"
                 @size-change="handleSizeChange"
                 @search-change="handleFilter"
                 @refresh-change="handleRefreshChange"
                 @row-update="update"
                 @row-save="create"
                 :before-open="handleOpenBefore"
                 :data="list">
        <template slot="menuLeft">
          <el-button v-if="sys_user_add"
                     class="filter-item"
                     @click="handleCreate"
                     size="small"
                     type="primary"
                     icon="el-icon-edit">添加</el-button>
        </template>
        <template slot="username"
                  slot-scope="scope">
          <img v-if="scope.row.avatar"
                   class="user-avatar"
                   style="width: 20px; height: 20px; border-radius: 50%;"
                   :src="scope.row.avatar+'?imageView2/1/w/20/h/20'" />
          <span>{{scope.row.username}}</span>
        </template>
        <template slot="role"
                  slot-scope="scope">
          <span v-for="(role,index) in scope.row.roleList"
                :key="index">
            <el-tag>{{role.roleDesc}} </el-tag>&nbsp;&nbsp;
          </span>
        </template>
        <template slot="deptId"
                  slot-scope="scope">
          {{scope.row.deptName}}
        </template>
        <template slot="delFlag"
                  slot-scope="scope">
          <el-tag>{{scope.label}}</el-tag>
        </template>
        <template slot="menu"
                  slot-scope="scope">
          <el-button v-if="sys_user_edit"
                     size="small"
                     type="success"
                     @click="handleUpdate(scope.row,scope.index)">编辑
          </el-button>
          <el-button v-if="sys_user_del"
                     size="small"
                     type="danger"
                     @click="deletes(scope.row,scope.index)">删除
          </el-button>
        </template>
        <template slot="deptIdForm"
                  slot-scope="scope">
          <avue-crud-input v-model="form.deptId"
                           type="tree"
                           placeholder="请选择所属部门"
                           :node-click="getNodeData"
                           :dic="treeDeptData"
                           :props="defaultProps"></avue-crud-input>
        </template>
        <template slot="roleForm"
                  slot-scope="scope">
          <avue-crud-select v-model="role"
                            multiple
                            placeholder="请选择角色，要先选择部门"
                            :dic="rolesOptions"
                            :props="roleProps"></avue-crud-select>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj } from "@/api/user";
import { deptRoleList, fetchDeptTree } from "@/api/role";
import { tableOption } from '@/const/crud/user';
import { mapGetters } from "vuex";
import { constants } from 'fs';
import { connect } from 'tls';

export default {
  name: "table_user",
  data () {
    return {
      option: tableOption,
      treeDeptData: [],
      checkedKeys: [],
      roleProps: {
        label: "roleDesc",
        value: 'roleId'
      },
      defaultProps: {
        label: "name",
        value: 'id',
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      role: [],
      form: {},
      rolesOptions: [],
    };
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  watch: {
    role () {
      this.form.role = this.role
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: "有效",
        1: "无效",
        9: "锁定"
      };
      return statusMap[status];
    }
  },
  created () {
    this.getList();
    this.sys_user_add = this.permissions["sys_user_add"];
    this.sys_user_edit = this.permissions["sys_user_edit"];
    this.sys_user_del = this.permissions["sys_user_del"];
  },
  methods: {
    getList () {
      this.listLoading = true;
      this.listQuery.isAsc = false;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records;
        this.page.total = response.data.total
        this.listLoading = false;
      });
    },
    getNodeData (data, done) {
      done();
      deptRoleList(this.form.deptId).then(response => {
        this.rolesOptions = response.data;
      });
    },
    handleDept () {
      fetchDeptTree().then(response => {
        this.treeDeptData = response.data;
      });
    },
    handleFilter (param) {
      this.listQuery = Object.assign(this.listQuery, param)
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange (val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleRefreshChange () {
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleCreate () {
      this.$refs.crud.rowAdd();
    },
    handleOpenBefore (show, type) {
      this.handleDept();
      if (['edit', 'views'].includes(type)) {
        this.role = [];
        for (var i = 0; i < this.form.roleList.length; i++) {
          this.role[i] = this.form.roleList[i].roleId;
        }
        deptRoleList(this.form.deptId).then(response => {
          this.rolesOptions = response.data;
        });
      } else if (type === 'add') {
        this.role = [];
      }
      show();
    },
    handleUpdate (row, index) {
      this.$refs.crud.rowEdit(row, index);
      this.form.password = undefined
    },
    create (row, done, loading) {
      addObj(this.form).then(() => {
        this.getList();
        done();
        this.$notify({
          title: "成功",
          message: "创建成功",
          type: "success",
          duration: 2000
        });
      }).catch(() => {
        loading();
      });
    },
    update (row, index, done, loading) {
      putObj(this.form).then(() => {
        this.getList();
        done();
        this.$notify({
          title: "成功",
          message: "修改成功",
          type: "success",
          duration: 2000
        });
      }).catch(() => {
        loading();
      });
    },
    deletes (row, index) {
      this.$confirm(
        "此操作将永久删除该用户(用户名:" + row.username + "), 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        delObj(row.userId)
          .then(() => {
            this.list.splice(index, 1);
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
          })
          .cache(() => {
            this.$notify({
              title: "失败",
              message: "删除失败",
              type: "error",
              duration: 2000
            });
          });
      });
    }
  }
};
</script>
