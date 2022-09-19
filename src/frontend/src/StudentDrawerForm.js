import {Drawer, Input, Col, Select, Form, Row, Button} from 'antd';
import {addNewStudent} from "./client";
import {Spin} from 'antd';
import {useState} from "react";
import {successNotification,errorNotification} from "./Notification";

const {Option} = Select;

function StudentDrawerForm({showDrawer, setShowDrawer, fetchedStudents}) {

    const [submitting, setSubmitting] = useState(false)
    const onCLose = () => setShowDrawer(false);

    const onFinish = student => {
        setSubmitting(true)
        console.log(JSON.stringify(student, null, 2));
        addNewStudent(student)
            .then(() => {console.log("Student added")
            onCLose()
                successNotification(
                    "Student was successfully added",
                    `${student.name} was added to the system`
                )
            fetchedStudents()})
            .catch((err) => {console.log(err)
                errorNotification("There was an issue", `${err.response.data.message} [${err.response.data.error}] [Status:${err.response.data.status}]`,"bottomLeft")
            })
            .finally(() => setSubmitting(false))

    };


    const onFinishFailed = errorInfo => {
        alert(JSON.stringify(errorInfo, null, 2));
    };

    return <Drawer
        title="Create new student"
        width={720}
        onClose={onCLose}
        visible={showDrawer}
        bodyStyle={{paddingBottom: 80}}
        footer={
            <div
                style={{
                    textAlign: 'right',
                }}
            >
                <Button onClick={onCLose} style={{marginRight: 8}}>
                    Cancel
                </Button>
            </div>
        }
    >
        <Form layout="vertical"
              onFinishFailed={onFinishFailed}
              onFinish={onFinish}
              hideRequiredMark>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{required: true, message: 'Please enter student name'}]}
                    >
                        <Input placeholder="Please enter student name"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{required: true, message: 'Please enter student email'}]}
                    >
                        <Input placeholder="Please enter student email"/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="gender"
                        label="gender"
                        rules={[{required: true, message: 'Please select a gender'}]}
                    >
                        <Select placeholder="Please select a gender">
                            <Option value="MALE">MALE</Option>
                            <Option value="FEMALE">FEMALE</Option>
                            <Option value="OTHER">OTHER</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                {submitting && <Spin/>}
            </Row>
        </Form>
    </Drawer>
}

export default StudentDrawerForm;