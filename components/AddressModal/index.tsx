import React, { useEffect } from 'react'
import { Button, Col, Form, Input, Modal, Row } from 'antd'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

/**
 * Add/Edit address modal
 * @param param0
 */
const AddressModal = ({ visible, onOk, onCancel, initialValues }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(initialValues)
  }, [form, initialValues])

  return (
    <Modal
      title="Add/Edit address"
      visible={visible}
      footer={null}
      // onOk={() => onOk && onOk()}
      onCancel={() => onCancel && onCancel()}
      width={746}
      destroyOnClose={true}
    >
      <Form
        {...formItemLayout}
        form={form}
        initialValues={initialValues}
        onFinish={(values) => {
          onOk && onOk(values)
        }}
      >
        {/* <Form.Item
                    name="area"
                    label="Area"
                    rules={[
                        {type: 'array', required: true, message: 'Mandatory'},
                    ]}
                >
                    <Cascader options={residences}/>
                </Form.Item> */}
        <Form.Item
          name="prov"
          label="Province"
          rules={[{ required: true, message: 'Mandatory' }]}
        >
          <Input placeholder={'Fill in province please'} />
        </Form.Item>
        <Form.Item
          name="city"
          label="City"
          rules={[{ required: true, message: 'Mandatory' }]}
        >
          <Input placeholder={'Fill in city please'} />
        </Form.Item>
        <Form.Item
          name="district"
          label="District"
          rules={[{ required: true, message: 'Mandatory' }]}
        >
          <Input placeholder={'Fill in district please'} />
        </Form.Item>
        <Form.Item
          name="detail"
          label="Detail"
          rules={[{ required: true, message: 'Mandatory' }]}
        >
          <Input.TextArea
            rows={2}
            placeholder={'Fill in detail address, less than 75'}
          />
        </Form.Item>
        <Form.Item
          name="receiver"
          label="Receiver"
          rules={[{ required: true, message: 'Mandatory' }]}
        >
          <Input placeholder={'Fill in realname please'} />
        </Form.Item>
        <Form.Item
          name="mobile"
          label="Mobile"
          rules={[{ required: true, message: 'Mandatory' }]}
        >
          <Input placeholder={'Fill in mobile please'} />
        </Form.Item>
        {/* <Form.Item label=" " name="remember" valuePropName="checked" colon={false}>
                    <Checkbox>Set as default</Checkbox>
                </Form.Item> */}
        <Row justify={'center'}>
          <Col span={3}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Col>
          <Col span={3}>
            <Button onClick={() => onCancel && onCancel()}>Cancel</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AddressModal
