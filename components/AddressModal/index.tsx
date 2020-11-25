import React, { useEffect } from "react"
import {Button, Cascader, Checkbox, Col, Form, Input, Modal, Row} from "antd"
import styles from './index.module.scss'


const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 4},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};


const residences = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'West Lake',
                    },
                ],
            },
        ],
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men',
                    },
                ],
            },
        ],
    },
];


/**
 * 地址添加和修该弹窗
 * 2020/5/31 10:52 下午 BY TF
 */
const AddressModal = ({
                          visible,
                          onOk,
                          onCancel,
                          initialValues
                      }) => {

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [form, initialValues])

    return (
        <Modal
            title="添加/编辑地址"
            visible={visible}
            footer={null}
            // onOk={() => onOk && onOk()}
            onCancel={() => onCancel && onCancel()}
            width={746}
            destroyOnClose={true}
        >
            <Form {...formItemLayout}
                  form={form}
                  initialValues={initialValues}
                  onFinish={(values) => {
                      onOk && onOk(values);
                  }}
            >
                {/* <Form.Item
                    name="area"
                    label="所在地区"
                    rules={[
                        {type: 'array', required: true, message: '必填'},
                    ]}
                >
                    <Cascader options={residences}/>
                </Form.Item> */}
                <Form.Item
                    name="prov"
                    label="省"
                    rules={[{required: true, message: '必填'}]}
                >
                    <Input placeholder={'请填写省'}/>
                </Form.Item>
                <Form.Item
                    name="city"
                    label="市"
                    rules={[{required: true, message: '必填'}]}
                >
                    <Input placeholder={'请填写市'}/>
                </Form.Item>
                <Form.Item
                    name="district"
                    label="区"
                    rules={[{required: true, message: '必填'}]}
                >
                    <Input placeholder={'请填写区'}/>
                </Form.Item>
                <Form.Item
                    name="detail"
                    label="详细地址"
                    rules={[{required: true, message: '必填'}]}
                >
                    <Input.TextArea rows={2} placeholder={'请填写详细地址，小于75字'}/>
                </Form.Item>
                <Form.Item
                    name="receiver"
                    label="收货人姓名"
                    rules={[{required: true, message: '必填'}]}
                >
                    <Input placeholder={'请填写真实姓名'}/>
                </Form.Item>
                <Form.Item
                    name="mobile"
                    label="手机号码"
                    rules={[{required: true, message: '必填'}]}
                >
                    <Input placeholder={'请填写手机号码'}/>
                </Form.Item>
                {/* <Form.Item label=" " name="remember" valuePropName="checked" colon={false}>
                    <Checkbox>设为默认地址</Checkbox>
                </Form.Item> */}
                <Row justify={'center'}>
                    <Col span={3}>
                        <Button type="primary" htmlType="submit">确定</Button>
                    </Col>
                    <Col span={3}>
                        <Button onClick={() => onCancel && onCancel()}>取消</Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}


export default AddressModal