
import React, { Component } from 'react';

export class StudentData extends Component {
    static displayName = StudentData.name;

    constructor(props) {
        super(props);
        this.state = {
            clientToken : null,
            students: [],
            loading: true,
            showAlert: false,
            message: '',
            isEdit: false,
            id: 0,
            username: '',
            firstName: '',
            lastName: '',
            age: 10,
            career: '',
            id : 0,
            onError: false            
        };
    }

    UpdateStudent = async (student) => {
        console.log(JSON.stringify(student));
        if (student) {
            this.setState({ id: student.id, username: student.username, firstName: student.firstName, lastName: student.lastName, age: student.age, career: student.career, onError: false });
            this.setState({ isEdit: true });
        }
    };

    AddStudent = async (show) => {
        this.resetAddView();
        this.setState({ isEdit: true });
    };

    CancelEdit = async (show) => {
        this.resetAddView();
        this.setState({ isEdit: false });
    };

    SubmitStudent = async () => {
        if (this.isValid()) {
            this.setState({ onError: false });
            const student = {
                username: this.state.username,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                age: Number(this.state.age),
                career: this.state.career
            };
            console.log(`SubmitStudent: ${JSON.stringify(student)}`);
            let response = null;
            if (this.state.id && this.state.id > 0) {
                response = await this.modifyStudentData(this.state.id, student);
            }
            else {
                response = await this.addStudentsData(student);
            }      
            let alertmsg = '';
            if (response) {
                const { data = null, message = '', statusCode = null } = response;
                const result = (data && statusCode === 'OK');
                if (result) { this.resetAddView(); this.setState({ isEdit: false }); }
                this.loadStudentsData();
                alertmsg = message;   
            }
            else {
                alertmsg = 'Service unavailable';               
            }
            this.showAlert(alertmsg);
            setTimeout(() => { this.hideAlert(); }, 5000);
        }
        else {
            this.setState({ onError: true });
        }
    };

    resetAddView() {
        this.setState({id: 0, username: '', firstName: '', lastName: '', age: 10, career: '', onError: false});
    }

    RemoveStudent = async (student) => {
        if (student) {        
            const { id = 0 } = student;
            if (isNaN(id) || Number(id) <= 0) {
                return false;
            }
            const response = await this.removeStudentsData(id);
            let alertmsg = '';
            if (response) {
                const { data = null, message = '', statusCode = null } = response;
                const result = (statusCode === 'OK');
                alertmsg = message;
                this.loadStudentsData();
            }
            else {
                alertmsg = 'Service unavailable';               
            }
            this.showAlert(alertmsg);
            setTimeout(() => { this.hideAlert(); }, 5000);
        }
    };

    showAlert(message) {
        if (message) {
            this.setState({ showAlert: true, message: message });
        }
    }

    hideAlert() {
        this.setState({ showAlert: false, message: '' });
    }

    componentDidMount() {
        this.Init();
    }

    isValid() {
        if (!this.state.username || this.state.username.length == 0) return false;
        if (!this.state.firstName || this.state.firstName.length == 0) return false;
        if (!this.state.lastName || this.state.lastName.length == 0) return false;
        if (!this.state.age || isNaN(this.state.age) || Number(this.state.age) <= 0 ) return false;
        if (!this.state.career || this.state.career.length == 0) return false;
        return true;
    }

    async Init() {
        const token = await this.loadToken();
        if (token) {
            this.setState({ clientToken: token });
            this.loadStudentsData();
        }
        setTimeout(() => { this.RefreshToken(); }, 4000);
    }

    async RefreshToken() {
        const token = await this.loadToken();
        if (token) {
            this.setState({ clientToken: token });      
        }
        setTimeout(() => { this.RefreshToken(); }, 4000);
    }

    async loadToken() {
        const AuthController = 'api/v1/HealthCheck';
        const credentials = {
            UserName: 'WebApp',
            Password: 'L!#CsVT3Bc$=dtxh'
        };   
        const settings = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        };
       return await fetch(AuthController, settings)
           .then(async data => {
                const token = await data.json();
                return token || null;
        }).catch(ex => {
            console.log(ex);
            return null;
        });
    };

    async loadStudentsData() {
        if (this.state.clientToken) {
            const StudentController = 'api/v1/Student';
            const settings = {
                method: 'GET',
                headers: {                    
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.clientToken,
                }
            };
            const { data = [], message = '', statusCode = null } = await fetch(StudentController, settings)
                .then(async data => {
                    setTimeout(() => {
                        this.loadStudentsData();
                    }, 5000);
                    return await data.json();
                }).catch(ex => {
                    console.log(ex);
                    return null;
                });
            if (data.length > 1) data.sort((a, b) => a.username > b.username ? 1 : -1);
            this.setState({ students: data, loading: false });
        }
    }

    async addStudentsData(student) {
        if (student) {
            const StudentController = `api/v1/Student`;
            const settings = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.clientToken,
                },
                body: JSON.stringify(student)
            };
            return await fetch(StudentController, settings)
                .then(async data => {
                    return await data.json();
                }).catch(ex => {
                    console.log(ex);
                    return null;
                });   
        }
    }

    async modifyStudentData(Id, student) {
        console.log('Call modifyStudentData');
        if (Id && student && Id > 0) {
            const StudentController = `api/v1/Student/${Id}`;
            const settings = {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.clientToken,
                },
                body: JSON.stringify(student)
            };
            return await fetch(StudentController, settings)
                .then(async data => {
                    return await data.json();
                }).catch(ex => {
                    console.log(ex);
                    return null;
                });
        }
    }

    async removeStudentsData(Id) {
        if (this.state.clientToken && Id && Id > 0) {
            const StudentController = `api/v1/Student/${Id}`;
            const settings = {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.clientToken,
                }
            };
            return await fetch(StudentController, settings)
                .then(async data => {
                    return await data.json();
                }).catch(ex => {
                    console.log(ex);
                    return null;
                });
   
        }
    }

    render() {
        return (
            <>
                <div className="students-component">
                    <h1 id="tableLabel" >Student List</h1>
                    <p>This component allows you to view, create, update and delete students in a SQLite database using an API in NET Core 3.1</p>
                    {this.state.loading ?
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        :
                        <table className='table table-striped' aria-labelledby="tabelLabel">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Age</th>
                                    <th>Career</th>
                                    <th>
                                        <i className="bi bi-person-plus btn-icon" title="Add" onClick={(event) => { this.AddStudent(); }}></i>
                                        <i className="bi bi-arrow-repeat btn-icon" title="Refresh" onClick={(event) => { this.loadStudentsData(); }}></i>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.isEdit) ?
                                    <tr className="add">
                                        <td>
                                            {(this.state.id && this.state.id > 0) ?
                                                this.state.username
                                                :
                                                <div className="input-group has-validation">
                                                    <input className="form-control form-control-sm" value={this.state.username}
                                                        onChange={(event) => { this.setState({ firstName: event.target.value }); }}
                                                        onChange={(event) => { this.setState({ username: event.target.value }); }}
                                                        type="text" placeholder="Username" maxLength="20" />
                                                    {(this.state.onError && (this.state.username.length == 0)) ? <div className="invalid-tooltip" >Please provide a Username.</div> : null}
                                                </div>
                                            }
                                        </td>
                                        <td>
                                            <div className="input-group has-validation">
                                                <input className="form-control form-control-sm" value={this.state.firstName}
                                                    onFocus={(event) => { this.setState({ onError: false }); }}
                                                    onChange={(event) => { this.setState({ firstName: event.target.value }); }}
                                                    type="text" placeholder="Firstname" maxLength="20" />
                                                {(this.state.onError && (this.state.firstName.length == 0)) ? <div className="invalid-tooltip" >Please provide a Firstname.</div> : null}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="input-group has-validation">
                                                <input className="form-control form-control-sm" value={this.state.lastName}
                                                    onFocus={(event) => { this.setState({ onError: false }); }}
                                                    onChange={(event) => { this.setState({ lastName: event.target.value }); }}
                                                    type="text" placeholder="LastName" maxLength="20" />
                                                {(this.state.onError && (this.state.lastName.length == 0)) ? <div className="invalid-tooltip" >Please provide a LastName.</div> : null}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="input-group has-validation">
                                                <input className="form-control form-control-sm" value={this.state.age}
                                                    onFocus={(event) => { this.setState({ onError: false }); }}
                                                    onChange={(event) => { this.setState({ age: event.target.value }); }}
                                                    type="number" maxLength="3" min="10" max="110" placeholder="Age" />
                                                {(this.state.onError && (isNaN(this.state.age) || Number(this.state.age) <= 0)) ? <div className="invalid-tooltip" >Please provide a valid Age.</div> : null}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="input-group has-validation">
                                                <input className="form-control form-control-sm" value={this.state.career}
                                                    onFocus={(event) => { this.setState({ onError: false }); }}
                                                    onChange={(event) => { this.setState({ career: event.target.value }); }}
                                                    type="text" placeholder="Career" maxLength="50" />
                                                {(this.state.onError && (this.state.career.length == 0)) ? <div className="invalid-tooltip" >Please provide a Career.</div> : null}
                                            </div>
                                        </td>
                                        <td className="actions">
                                            <i className="bi bi-check2 btn-icon" title="Send" onClick={(event) => { this.SubmitStudent(); }}></i>
                                            <i className="bi bi-x-square btn-icon" title="Cancel" onClick={(event) => { this.CancelEdit(); }}></i>
                                        </td>
                                    </tr>
                                    :
                                    null
                                }
                                {this.state.students.map(student =>
                                    <tr key={student.id}>
                                        <td>{student.username}</td>
                                        <td>{student.firstName}</td>
                                        <td>{student.lastName}</td>
                                        <td>{student.age}</td>
                                        <td>{student.career}</td>
                                        <td className="actions">
                                            <i className="bi bi-pencil btn-icon" title="Modify" onClick={(event) => { this.UpdateStudent(student); }} ></i>
                                            <i className="bi bi-x-lg btn-icon" title="Remove" onClick={(event) => { this.RemoveStudent(student); }} ></i>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    }
                    {this.state.showAlert ?
                        <div className="alert alert-secondary" role="alert">
                            {this.state.message}
                        </div>
                        : null
                    }
                </div>
            </>
        );
    };
}
