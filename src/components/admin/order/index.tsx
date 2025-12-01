import { deleteBooksAPI, getBooksAPI, getOrdersAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import OrderDetail from './order.detail';
import DetailOrder from './order.detail';

type TSearch = {
    name: string,
    createdAt: string,
    createdAtRange: string
}

const TableOrder = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null);


    const columns: ProColumns<IOrderTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '_id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a href='#'
                        onClick={() => {
                            setDataViewDetail(entity)
                            setOpenViewDetail(true)
                        }}
                    >{entity._id}</a>
                )
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'price',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.totalPrice)}
                    </>
                )
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            hideInSearch: true,
            sorter: true,

        },
    ];
    return (
        <>
            <ProTable<IOrderTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {

                    let query = ""
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.name) {
                            query += `&name=/${params.name}/i`;
                        }
                        if (params.address) {
                            query += `&address=/${params.address}/i`;
                        }


                        const createDateRange = dateRangeValidate(params.createdAtRange)
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }

                        // default
                        if (sort && sort.createdAt) {
                            query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`
                        } else {
                            query += `&sort=-createdAt`
                        }

                    }

                    const res = await getOrdersAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta)
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

                }}
                rowKey="_id"
                form={{
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
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => {
                        return (<div>{range[0]} - {range[1]} trên {total} rows</div>)
                    }
                }}
            />

            <DetailOrder
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
        </>
    );
};

export default TableOrder;