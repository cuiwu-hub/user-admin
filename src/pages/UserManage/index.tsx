import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import {Button, Dropdown, Image} from 'antd';
import { useRef } from 'react';
import {searchUsers} from "@/services/ant-design-pro/api";

const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    tip: '标题过长会自动收缩',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
    tip: '标题过长会自动收缩',
  },
  {
    title: '头像',
    dataIndex: 'avatarUrl',
    tip: '标题过长会自动收缩',
    render: (_, records) => (
      <div>
        <Image src={records.avatarUrl} width={100}/>
      </div>
    )
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    tip: '标题过长会自动收缩',
  },
  {
    title: '性别',
    dataIndex: 'gender',
    valueType: 'select',
    valueEnum: {
      0: {text: '女'},
      1: {text: '男'}
    },
    tip: '标题过长会自动收缩',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    tip: '标题过长会自动收缩',
  },
  {
    title: '电话',
    dataIndex: 'phone',
    tip: '标题过长会自动收缩',
  },
  {
    title: '星球编号',
    dataIndex: 'planetCode',
    tip: '标题过长会自动收缩',
  },
  {
    title: '状态',
    dataIndex: 'userStatus',
    tip: '标题过长会自动收缩',
  },
  {
    title: '角色',
    dataIndex: 'userRole',
    valueType: 'select',
    valueEnum: {
      0: {text: '普通用户', status: 'Default'},
      1: {text: '管理员', status: 'Success'},
    }
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}) => {
        const result = await searchUsers(params);
        return {
          data: result.data,
        }
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      // options={{
      //   setting: {
      //     listsHeight: 400,
      //   },
      // }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"
      toolBarRender={() => [
        <Button key="button" icon={<PlusOutlined />} type="primary">
          新建
        </Button>,
        <Dropdown
          key="menu"
          menu={{
            items: [
              {
                label: '1st item',
                key: '1',
              },
              {
                label: '2nd item',
                key: '1',
              },
              {
                label: '3rd item',
                key: '1',
              },
            ],
          }}
        >
          <Button>
            <EllipsisOutlined />
          </Button>
        </Dropdown>,
      ]}
    />
  );
};
