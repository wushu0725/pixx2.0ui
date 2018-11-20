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
  <div class="dept">
    <basic-container>
      <el-row>
        <el-col :span="8"
                style='padding-right:20px;'>
          <avue-tree :data="treeData"
                     :option="treeOption"
                     @node-click="getNodeData">
            <template slot="addBtn">
              <el-button size="small"
                         @click="handlerParentAdd()"
                         icon="el-icon-plus"
                         v-if="deptManager_btn_add"></el-button>
            </template>
            <template slot-scope="scope"
                      slot="menuBtn">
              <el-dropdown-item v-if="deptManager_btn_add"
                                @click.native="handlerAdd(scope.data)">新增</el-dropdown-item>
              <el-dropdown-item v-if="deptManager_btn_edit"
                                @click.native="handlerEdit(scope.data)">修改</el-dropdown-item>
              <el-dropdown-item v-if="deptManager_btn_del"
                                @click.native="handleDelete(scope.data)">删除</el-dropdown-item>
            </template>
          </avue-tree>
        </el-col>
        <el-col :span="16">
          <avue-form :option="formOption"
                     v-model="form"
                     ref="form"
                     @submit="isAdd?create():update()">
            <template slot="menuForm">
              <el-button @click="onCancel()"
                         v-if="editFlag">取消</el-button>
            </template>
          </avue-form>
          <!-- <avue-crud :option="tableOption"
                     class="dept__table"
                     @refresh-change="getList()"
                     @row-del="handleDelete"
                     :data="tableData">
            <template slot-scope="scope"
                      slot="menuLeft">
              <el-button type="primary"
                         size="small"
                         v-if="deptManager_btn_add"
                         @click="handlerParentAdd()">新增</el-button>
            </template>
            <template slot-scope="scope"
                      slot="menu">
              <el-button type="primary"
                         size="small"
                         @click="handlerEdit(scope.row)">编辑</el-button>
              <el-button type="danger"
                         size="small"
                         @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </avue-crud> -->
        </el-col>
      </el-row>
      <!-- <el-dialog @close="onCancel"
                 :visible.sync="box">
        <avue-form :option="formOption"
                   v-model="form"
                   ref="form"
                   @submit="isAdd?create():update()">
        </avue-form>
      </el-dialog> -->
    </basic-container>
  </div>
</template>

<script>
import { fetchTree, getObj, addObj, delObj, putObj } from '@/api/dept'
import { mapGetters } from 'vuex'
import { validatenull } from '@/util/validate'
import { setTimeout } from 'timers';
export default {
  name: 'dept',
  data () {
    return {
      treeOption: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        nodeKey: "id",
        props: {
          label: 'name'
        }
      },
      tableOption: {
        index: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        page: false,
        column: [{
          label: 'id',
          prop: 'id'
        }, {
          label: '名称',
          prop: 'name'
        }],
      },
      editFlag: false,
      tableData: [],
      box: false,
      obj: {},
      formStatus: '',
      treeData: [],
      form: {

      },
      deptManager_btn_add: false,
      deptManager_btn_edit: false,
      deptManager_btn_del: false
    }
  },
  created () {
    this.getList()
    this.deptManager_btn_add = this.permissions['sys_dept_add']
    this.deptManager_btn_edit = this.permissions['sys_dept_edit']
    this.deptManager_btn_del = this.permissions['sys_dept_del']
  },
  computed: {

    ...mapGetters([
      'elements',
      'permissions'
    ]),
    isAdd () {
      return this.formStatus === 'create';
    },
    formOption () {
      return {
        submitText: this.isAdd ? '新增' : '修改',
        submitBtn: this.editFlag,
        emptyBtn: this.editFlag,
        column: [
          {
            label: '父类序号',
            prop: 'parentId',
            disabled: true,
            span: 24,
          },
          {
            label: '部门名称',
            prop: 'name',
            disabled: !this.editFlag,
            span: 24,
            rules: [{ required: true, message: '请输入部门名称', trigger: 'change' }]
          }, {
            label: '排序',
            prop: 'orderNum',
            disabled: !this.editFlag,
            span: 24,
          }
        ]
      }
    },
  },
  methods: {
    getList () {
      fetchTree(this.listQuery).then(response => {
        this.treeData = response.data.data
        if (validatenull(this.obj)) this.tableData = this.treeData;
        else this.tableData = this.obj.children;
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getNodeData (data) {
      this.obj = data;
      this.tableData = data.children;
    },
    show (data = {}) {
      getObj(data.id).then(res => {
        const data = res.data.data;
        if (this.formStatus === 'update') {
          this.form = data;
          this.form.parentName = this.obj.name;
        } else if (this.formStatus === 'create') {
          this.form.parentId = data.deptId;
          this.form.parentName = this.obj.name;
        } else {
          this.form = data;
        }
        this.$refs.form.clearValidate();
      })
    },
    handlerEdit (data) {
      this.formStatus = 'update'
      this.editFlag = true;
      this.show(data);
    },
    handlerParentAdd () {
      this.formStatus = 'create'
      this.editFlag = true;
      if (validatenull(this.obj)) {
        this.form.parentId = 0;
        this.form.parentName = '';
      } else {
        this.show(this.obj);
      }
    },
    handlerAdd (data) {
      this.formStatus = 'create'
      this.editFlag = true;
      this.show(data);
    },
    handleDelete (data) {
      this.show(data);
      this.$confirm(`此操作将永久删除${data.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(this.form.deptId).then(() => {
          this.getList()
          this.onCancel()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    update () {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        putObj(this.form).then(() => {
          this.onCancel();
          this.getList()
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
      })

    },
    create () {
      addObj(this.form).then(() => {
        this.onCancel();
        this.getList()
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    onCancel () {
      this.formStatus = ''
      this.editFlag = false;
      setTimeout(() => {
        this.$refs.form.resetForm();
        this.$refs.form.clearValidate();
      }, 0)
    }
  }
}
</script>

<style lang="scss">
.dept {
  &__tree {
    margin-bottom: 13px;
  }
  &__table {
    margin-top: -32px;
  }
}
</style>


