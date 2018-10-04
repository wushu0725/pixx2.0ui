/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */

export const tableOption = {
  'border': true,
  'index': true,
  'stripe': true,
  'menuAlign': "center",
  'align': "center",
  menuBtn: true,
  'editBtn': false,
  'delBtn': false,
  'addBtn': false,
  'dicUrl': '/admin/dict/type/leave_status',
  'column': [
	  {
      label: 'ID',
      prop: 'leaveId',
      editDisabled: true,
      addVisdiplay: false
    },
	  {
      label: '申请人',
      prop: 'username',
      editDisabled: true,
      addVisdiplay: false
    },
	  {
      label: '天数',
      prop: 'days'
    },
	  {
      label: '请假时间',
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm'
    },
    {
        label: '备注',
        prop: 'content',
        type:'textarea',
        minRows:2,
        row:true,
        span:24
    },
    {
        label: '状态',
        prop: 'state',
        type: 'select',
        dicData: 'leave_status',
        search: true,
        addVisdiplay: false
    }
  ]
}
