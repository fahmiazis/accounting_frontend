import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert, Spinner} from 'reactstrap'
import logo from "../assets/img/logo.png"
import '../assets/css/style.css'
import {FaSearch} from 'react-icons/fa'
import {AiFillCheckCircle, AiOutlineFileExcel} from 'react-icons/ai'
import depo from '../redux/actions/depo'
import user from '../redux/actions/user'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as Yup from 'yup'

const userSchema = Yup.object().shape({
    username: Yup.string().required(),
    password: Yup.string().required(),
    depo: Yup.string(),
    user_level: Yup.string().required(),
    status: Yup.string().required()
});

const userEditSchema = Yup.object().shape({
    username: Yup.string().required(),
    password: Yup.string(),
    depo: Yup.string(),
    user_level: Yup.string().required(),
    status: Yup.string().required()
});

class MasterUser extends Component {
    state = {
        alert: false,
        confirm: "",
        isOpen: false,
        dropOpen: false,
        dropOpenNum: false,
        value: '',
        onChange: new Date(),
        sidebarOpen: false,
        modalAdd: false,
        modalEdit: false,
        modalUpload: false,
        modalDownload: false,
        modalConfirm: false,
        detail: {},
        level: "",
        upload: false,
        errMsg: '',
        fileUpload: ''
    }

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }
    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    dropDown = () => {
        this.setState({dropOpen: !this.state.dropOpen})
    }
    dropOpen = () => {
        this.setState({dropOpenNum: !this.state.dropOpenNum})
    }
    onSetSidebarOpen = () => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }
    openModalAdd = () => {
        this.setState({modalAdd: !this.state.modalAdd})
    }
    openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }
    openModalUpload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }
    openModalDownload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }

    addUser = async (values) => {
        const token = localStorage.getItem("token")
        const destruct = values.depo === "-Pilih Depo-" ? ["", ""] : values.depo.split('-') 
        const data = {
            username: values.username,
            password: values.password,
            user_level: values.user_level,
            kode_depo: destruct[0],
            nama_depo: destruct[1],
            status: values.status
        }
        await this.props.addUser(token, data)
        const {isAdd} = this.props.user
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            await this.getDataUser()
            this.openModalAdd()
        }
    }

    onChangeHandler = e => {
        const {size, type} = e.target.files[0]
        if (size >= 5120000) {
            this.setState({errMsg: "Maximum upload size 5 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' ){
            this.setState({errMsg: 'Invalid file type. Only excel files are allowed.'})
            this.uploadAlert()
        } else {
            this.setState({fileUpload: e.target.files[0]})
        }
    }

    uploadMaster = async () => {
        const token = localStorage.getItem('token')
        const data = new FormData()
        data.append('master', this.state.fileUpload)
        await this.props.uploadMaster(token, data)
    }

    editUser = async (values,id) => {
        const token = localStorage.getItem("token")
        const destruct = values.depo === "" ? ["", ""] : values.depo.split('-')
        const data = {
            username: values.username,
            password: values.password,
            user_level: values.user_level,
            kode_depo: destruct[0],
            nama_depo: destruct[1],
            status: values.status
        }
        await this.props.updateUser(token, id, data)
        const {isUpdate} = this.props.user
        if (isUpdate) {
            this.setState({confirm: 'edit'})
            this.openConfirm()
            this.getDataUser()
            this.openModalEdit()
        }
    }

    componentDidUpdate() {
        const {isError, isUpload} = this.props.user
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 2000)
             setTimeout(() => {
                this.getDataUser()
             }, 2100)
        }
    }

    componentDidMount() {
        this.getDataUser()
        this.getDataDepo()
    }

    getDataUser = async () => {
        const token = localStorage.getItem("token")
        await this.props.getUser(token)
    }

    getDataDepo = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDepo(token)
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, level, upload, errMsg} = this.state
        const {dataUser, isGet, alertM, alertMsg, alertUpload} = this.props.user
        const { dataDepo } = this.props.depo
        return (
            <>
                <Navbar color="light" light expand="md" className="navbar">
                    <NavbarBrand href="/home"><img src={logo} alt="logo" className="logo" /></NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="/" className="navHome">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/dashboard" className="navDoc">Dashboard</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/dokumen" className="navDoc">Document</NavLink>
                            </NavItem>
                            <Dropdown nav isOpen={dropOpenNum} toggle={this.dropOpen}>
                                <DropdownToggle nav caret className="navDoc">
                                    Master
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem href="/email">
                                        Master Email
                                    </DropdownItem>
                                    <DropdownItem href="/master/dokumen">
                                        Master Document
                                    </DropdownItem>
                                    <DropdownItem href="/pic">
                                        Master PIC
                                    </DropdownItem>
                                    <DropdownItem href="/alasan">
                                        Master Alasan
                                    </DropdownItem>
                                    <DropdownItem href="/depo">
                                        Master Depo
                                    </DropdownItem>
                                    <DropdownItem href="/user">
                                        Master User
                                    </DropdownItem>
                                    <DropdownItem href="/divisi">
                                        Master Divisi
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <NavItem>
                                <NavLink href="/report" className="navReport">Report</NavLink>
                            </NavItem>
                        </Nav>
                        <UncontrolledDropdown>
                            <DropdownToggle nav caret>Super Admin</DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>Log Out</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Collapse>
                </Navbar>
                <Container fluid={true} className="background-logo">
                    <Alert color="danger" className="alertWrong" isOpen={this.state.alert}>
                        <div>{alertMsg}</div>
                        <div>{alertM}</div>
                        {alertUpload !== undefined && alertUpload.map(item => {
                            return (
                                <div>{item}</div>
                            )
                        })}
                    </Alert>
                    <Alert color="danger" className="alertWrong" isOpen={upload}>
                        <div>{errMsg}</div>
                    </Alert>
                    <div className="bodyDashboard">
                        <div className="headMaster">
                            <div className="titleDashboard col-md-12">Master User</div>
                        </div>
                        <div className="secHeadDashboard">
                            <div>
                                <text>Show: </text>
                                <ButtonDropdown className="drop" isOpen={dropOpen} toggle={this.dropDown}>
                                <DropdownToggle caret color="light">
                                    10
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem>20</DropdownItem>
                                </DropdownMenu>
                                </ButtonDropdown>
                                <text className="textEntries">entries</text>
                            </div>
                        </div>
                        <div className="secEmail">
                            <div className="headEmail">
                                <Button onClick={this.openModalAdd} color="primary" size="lg">Add</Button>
                                <Button onClick={this.openModalUpload} color="warning" size="lg">Upload</Button>
                                <Button color="success" size="lg">Download</Button>
                            </div>
                            <div className="searchEmail">
                                <text>Search: </text>
                                <Input className="search"><FaSearch size={20} /></Input>
                            </div>
                        </div>
                        {isGet === false ? (
                            <div className="tableDashboard">
                            <Table bordered responsive hover className="tab">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>User Name</th>
                                        <th>Kode Depo</th>
                                        <th>Nama Depo</th>
                                        <th>User Level</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                            </Table>
                                <div className="spin">
                                    <Spinner type="grow" color="primary"/>
                                    <Spinner type="grow" className="mr-3 ml-3" color="success"/>
                                    <Spinner type="grow" color="warning"/>
                                    <Spinner type="grow" className="mr-3 ml-3" color="danger"/>
                                    <Spinner type="grow" color="info"/>
                                </div>
                            </div>
                        ) : (
                            <div className="tableDashboard">
                            <Table bordered responsive hover className="tab">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>User Name</th>
                                        <th>Kode Depo</th>
                                        <th>Nama Depo</th>
                                        <th>User Level</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {dataUser.length !== 0 && dataUser.map(item => {
                                        return (
                                        <tr onClick={()=>this.openModalEdit(this.setState({detail: item}))}>
                                            <th scope="row">{(dataUser.indexOf(item) + 1)}</th>
                                            <td>{item.username}</td>
                                            <td>{item.kode_depo === 0 ? "" : item.kode_depo}</td>
                                            <td>{item.nama_depo === "null" || item.nama_depo === null ? "" : item.nama_depo}</td>
                                            <td>{item.user_level}</td>
                                            <td>{item.status}</td>
                                        </tr>
                                        )})}
                                </tbody>
                            </Table>
                        </div>  
                        )}
                        <div>
                            <div className="infoPageEmail">
                                <text>Showing 1 to 3 of entries</text>
                                <div className="pageButton">
                                    <button className="btnPrev">Previous</button>
                                    <text>1</text>
                                    <text>....</text>
                                    <text>10</text>
                                    <button className="btnPrev">Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd}>
                    <ModalHeader toggle={this.openModalAdd}>Add Master User</ModalHeader>
                    <Formik
                    initialValues={{
                    username: "",
                    password: "",
                    depo: "",
                    user_level: "", 
                    status: ""
                    }}
                    validationSchema={userSchema}
                    onSubmit={(values) => {this.addUser(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                User Name
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="username"
                                value={values.username}
                                onBlur={handleBlur("username")}
                                onChange={handleChange("username")}
                                />
                                {errors.username ? (
                                    <text className="txtError">{errors.username}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Password
                            </text>
                            <div className="col-md-9">
                            <Input 
                            type="password" 
                            name="nama_spv" 
                            value={values.password}
                            onChange={handleChange("password")}
                            onBlur={handleBlur("password")}
                            />
                            {errors.password ? (
                                <text className="txtError">{errors.password}</text>
                            ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                User Level
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select" 
                                name="select"
                                value={values.user_level}
                                onChange={handleChange("user_level")}
                                onBlur={handleBlur("user_level")}
                                >
                                    <option value="">-Pilih Level-</option>
                                    <option value="2">User SPV</option>
                                    <option value="3">User PIC</option>
                                    <option value="4">User Area SA</option>
                                    <option value="5">User Area Kasir</option>
                                    <option value="6">User Neraca</option>
                                </Input>
                                {errors.user_level ? (
                                    <text className="txtError">{errors.user_level}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Depo
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="select"
                                disabled={values.user_level === "2" || values.user_level === "3" ? true : false}
                                value={values.depo}
                                onChange={handleChange("depo")}
                                onBlur={handleBlur("depo")}
                                >
                                    <option value="">-Pilih Depo-</option>
                                    <option value="178-KRANJI">178-KRANJI</option>
                                    <option value="50-MEDAN TIMUR">50-MEDAN TIMUR</option>
                                    <option value="53-MEDAN BARAT">53-MEDAN BARAT</option>
                                </Input>
                                {errors.depo ? (
                                    <text className="txtError">{errors.depo}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Status
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="select"
                                value={values.status}
                                onChange={handleChange("status")}
                                onBlur={handleBlur("status")}
                                >   
                                    <option value="">-Pilih Status-</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Input>
                                {errors.status ? (
                                    <text className="txtError">{errors.status}</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className="foot">
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-3" onClick={this.openModalAdd}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit}>
                    <ModalHeader toggle={this.openModalEdit}>Edit Master User</ModalHeader>
                    <Formik
                    initialValues={{
                    username: detail.username,
                    depo: detail.kode_depo + "-" + detail.nama_depo,
                    user_level: detail.user_level, 
                    status: detail.status
                    }}
                    validationSchema={userEditSchema}
                    onSubmit={(values) => {this.editUser(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                User Name
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="username"
                                value={values.username}
                                onBlur={handleBlur("username")}
                                onChange={handleChange("username")}
                                />
                                {errors.username ? (
                                    <text className="txtError">{errors.username}</text>
                                ) : null}
                            </div>
                        </div>
                        {/* <div className="addModalDepo">
                            <text className="col-md-3">
                                Password
                            </text>
                            <div className="col-md-9">
                            <Input 
                            type="password" 
                            name="nama_spv" 
                            value={values.password}
                            onChange={handleChange("password")}
                            onBlur={handleBlur("password")}
                            />
                            {errors.password ? (
                                <text className="txtError">{errors.password}</text>
                            ) : null}
                            </div>
                        </div> */}
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Depo
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select" 
                                name="select"
                                value={values.depo}
                                onChange={handleChange("depo")}
                                onBlur={handleBlur("depo")}
                                >
                                    <option>-Pilih Depo-</option>
                                    <option value="178-KRANJI">178-KRANJI</option>
                                    <option value="50-MEDAN TIMUR">50-MEDAN TIMUR</option>
                                    <option value="53-MEDAN BARAT">53-MEDAN BARAT</option>
                                </Input>
                                {errors.depo ? (
                                    <text className="txtError">{errors.depo}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                User Level
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select" 
                                name="select"
                                value={values.user_level}
                                onChange={handleChange("user_level")}
                                onBlur={handleBlur("user_level")}
                                >
                                    <option>-Pilih Level-</option>
                                    <option value="2">User SPV</option>
                                    <option value="3">User PIC</option>
                                    <option value="4">User Area SA</option>
                                    <option value="5">User Area Kasir</option>
                                    <option value="6">User Neraca</option>
                                </Input>
                                {errors.user_level ? (
                                    <text className="txtError">{errors.user_level}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Status
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="select"
                                value={values.status}
                                onChange={handleChange("status")}
                                onBlur={handleBlur("status")}
                                >   
                                    <option>-Pilih Status-</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Input>
                                {errors.status ? (
                                    <text className="txtError">{errors.status}</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className="foot">
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-3" onClick={this.openModalEdit}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                    <ModalHeader>Upload Master User</ModalHeader>
                    <ModalBody className="modalUpload">
                        <div className="titleModalUpload">
                            <text>Upload File: </text>
                            <div className="uploadFileInput ml-4">
                                <AiOutlineFileExcel size={35} />
                                <div className="ml-3">
                                    <Input
                                    type="file"
                                    name="file"
                                    accept=".xls,.xlsx"
                                    onChange={this.onChangeHandler}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="btnUpload">
                            <Button color="info">Download Template</Button>
                            <Button color="primary" disabled={this.state.fileUpload === "" ? true : false } onClick={this.uploadMaster}>Upload</Button>
                            <Button onClick={this.openModalUpload}>Cancel</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                    <ModalBody>
                        {this.state.confirm === 'edit' ? (
                        <div className="cekUpdate">
                            <AiFillCheckCircle size={80} className="green" />
                            <div className="sucUpdate green">Berhasil Memperbarui User</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Menambahkan User</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Mengupload Master User</div>
                            </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.user.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className="cekUpdate">
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.user.isUpload ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className="cekUpdate">
                                <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Mengupload Master</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    depo: state.depo
})

const mapDispatchToProps = {
    addUser: user.addUser,
    updateUser: user.updateUser,
    getUser: user.getUser,
    resetError: user.resetError,
    getDepo: depo.getDepo,
    uploadMaster: user.uploadMaster
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterUser)
	