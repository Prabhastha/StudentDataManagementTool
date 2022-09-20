import {Avatar, Badge, Button, Empty, Spin, Tag, Radio, Popconfirm} from "antd";
import './App.css';
import {getAllStudents,deleteStudent} from "./client";
import {useState, useEffect} from "react";
import {
    DesktopOutlined,
    DownloadOutlined,
    FileOutlined,
    LoadingOutlined,
    PieChartOutlined,
    PlusOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {Breadcrumb, Layout, Table, Menu} from 'antd';
import StudentDrawerForm from "./StudentDrawerForm";
import {errorNotification, successNotification} from "./Notification";

const {SubMenu} = Menu
const {Header, Content, Footer, Sider} = Layout;
const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

const TheAvatar = ({name}) => {
    let trim = name.trim();
    if (trim.length === 0) {
        return <Avatar icon={<UserOutlined/>}/>
    }
    const split = trim.split("")
    if(split.length === 1){
        return <Avatar>{name.charAt(0)}</Avatar>
    }
    return <Avatar>{`${name.charAt(0)}${name.charAt(name.length-1)}`}</Avatar>
}

const removeStudent = (studentId, callback) => {
    deleteStudent(studentId).then( () => {
        successNotification("Student deleted", `Student with student Id ${studentId} was deleted`)
        callback()
}).catch(err => {
        errorNotification("There was an issue", `${err.response.data.message} [${err.response.data.error}] [Status:${err.response.data.status}]`) })

}

const columns = fetchStudents => [
    {
        title:'',
        dataIndex: 'avatar',
        key: 'avatar',
        render:(text,student) => <TheAvatar name={student.name}/>
    },
    {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Actions',
        dataIndex: 'Actions',
        key: 'actions',
        render: (text, student) =>
            <Radio.Group>
                <Popconfirm
                    placement='topRight'
                    title={`Are you sure to delete ${student.name}`}
                    onConfirm={() => removeStudent(student.id, fetchStudents)}
                    okText='Yes'
                    cancelText='No'>
                    <Radio.Button value="small" >Delete</Radio.Button>

                </Popconfirm>
                <Radio.Button value="small">Edit</Radio.Button>
            </Radio.Group>

    }
];


function App() {

    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [showDrawer, setShowDrawer] = useState(false);


    const fetchStudents = () => {
        getAllStudents().then(data => {
                //console.log(data)
                setStudents(data)
        }).catch(err => {

            errorNotification("There was an issue", `${err.response.data.message} [${err.response.data.error}] [Status:${err.response.data.status}]`) })
        .finally(() => setFetching(false))
    }
    useEffect(() => {
        console.log("component is mounted");
        fetchStudents()
    }, [])

    const renderStudents = () => {
        if (fetching) {
            return <Spin indicator={antIcon}/>
        }
        if (students.length <= 0) {
            return <>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                    Add New Student
                </Button>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />
                <Empty/>
            </>
        }
        return <>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchedStudents ={fetchStudents}
            />

            <Table dataSource={students} columns={columns(fetchStudents)} bordered
                   title={() =>
                       <>

                           <Tag>Number of Student</Tag>
                           <Badge
                               className="site-badge-count-109"
                               count={students.length}
                               style={{ backgroundColor: '#52c41a' }}
                           />
                           <br/><br/>
                           <Button
                               onClick={() => setShowDrawer(!showDrawer)}
                               type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                               Add Student
                           </Button>
                       </>

            }

                   pagination={{pageSize: 50}} scroll={{y: 500}} rowKey={(student) => student.id}/>
        </>
    }
        return (
            <Layout
                style={{
                    minHeight: '100vh',
                }}
            >
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div className="logo"/>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">

                        <Menu.Item key="1" icon={<PieChartOutlined/>}>
                            Option 1
                        </Menu.Item>
                        <Menu.Item key="2" icon={<DesktopOutlined/>}>
                            Option 2
                        </Menu.Item>
                        <SubMenu key="sub1" icon={<UserOutlined/>} title="User">
                            <Menu.Item key="3">Tom</Menu.Item>
                            <Menu.Item key="4">Bill</Menu.Item>
                            <Menu.Item key="5">Alex</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<TeamOutlined/>} title="Team">
                            <Menu.Item key="6">Team 1</Menu.Item>
                            <Menu.Item key="8">Team 2</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="9" icon={<FileOutlined/>}>
                            Files
                        </Menu.Item>
                    </Menu>

                </Sider>
                <Layout className="site-layout">
                    <Header
                        className="site-layout-background"
                        style={{
                            padding: 0,
                        }}
                    />
                    <Content
                        style={{
                            margin: '0 16px',
                        }}
                    >
                        <Breadcrumb
                            style={{
                                margin: '16px 0',
                            }}
                        >
                            <Breadcrumb.Item>User</Breadcrumb.Item>
                            <Breadcrumb.Item>Bill</Breadcrumb.Item>
                        </Breadcrumb>
                        <div
                            className="site-layout-background"
                            style={{
                                padding: 24, minHeight: 360,
                            }}
                        >
                            {renderStudents()}
                        </div>
                    </Content>
                    <Footer
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        Created by Pathfinder
                    </Footer>
                </Layout>
            </Layout>
        )
    }


    export default App;
