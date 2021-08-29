
import React, { Component, InputHTMLAttributes } from 'react';
import { Student, Response } from '../types';
import { ApiConnectionAgent } from '../services/ApiConnectionAgent';

export type StudentDataProps = {
    displayName: string;
};

type StudentDataState = {
    clientToken: string;
    students: Array<any>;
    loading: boolean;
    showAlert: boolean;
    message: string,
    isEdit: boolean;
    id: number,
    username: string;
    firstName: string;
    lastName: string;
    age: number;
    career: string;
    onError: boolean;
};

export class StudentData extends Component<StudentDataProps, StudentDataState> {
    private apiAgent: ApiConnectionAgent;
    constructor(props) {
        super(props);
        this.apiAgent = new ApiConnectionAgent();
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
            onError: false            
        };
    };

    componentDidMount = () => {
        this.apiAgent.init();
        this.Init();
    };

    UpdateStudent = async (student: Student) => {
        if (student) {
            this.setState({ id: student.id, username: student.username, firstName: student.firstName, lastName: student.lastName, age: student.age, career: student.career, onError: false });
            this.setState({ isEdit: true });
        }
    };

    AddStudent = async () => {
        this.resetAddView();
        this.setState({ isEdit: true });
    };

    CancelEdit = async () => {
        this.resetAddView();
        this.setState({ isEdit: false });
    };

    SubmitStudent = async () => {
        if (this.isValid()) {
            this.setState({ onError: false });
            const student: Student = {
                id: this.state.id,
                username: this.state.username,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                age: Number(this.state.age),
                career: this.state.career
            };
            let response: Response = null;
            if (student.id > 0) {
                response = await this.apiAgent.modifyStudentData(student);
            }
            else {
                response = await this.apiAgent.addStudentsData(student);
            }
            let operationMessage : string = '';
            if (response) {
                if (response.data && response.statusCode === 'OK') { this.resetAddView(); this.setState({ isEdit: false }); }
                this.loadStudentsData();
                operationMessage = response.message;
            }
            else {
                operationMessage = 'Service unavailable';
            }
            this.showAlert(operationMessage);
            setTimeout(() => { this.hideAlert(); }, 5000);
        }
        else {
            this.setState({ onError: true });
        }
    };

    resetAddView = () => {
        this.setState({ id: 0, username: '', firstName: '', lastName: '', age: 10, career: '', onError: false });
    };

    RemoveStudent = async (student: Student) => {
        if (!student || student.id <= 0) return false;           
        const response = await this.apiAgent.removeStudentsData(student.id);
        let operationMessage : string = '';
        if (response) {
            operationMessage = response.message;
            this.loadStudentsData();
        }
        else {
            operationMessage = 'Service unavailable';
        }
        this.showAlert(operationMessage);
        setTimeout(() => { this.hideAlert(); }, 5000);        
    };

    showAlert = async (message: string) => {
        if (message) {
            this.setState({ showAlert: true, message: message });
        }
    };

    hideAlert = () => {
        this.setState({ showAlert: false, message: '' });
    };

    isValid = () => {
        if (!this.state.username || this.state.username.length == 0) return false;
        if (!this.state.firstName || this.state.firstName.length == 0) return false;
        if (!this.state.lastName || this.state.lastName.length == 0) return false;
        if (!this.state.age || isNaN(this.state.age) || Number(this.state.age) <= 0) return false;
        if (!this.state.career || this.state.career.length == 0) return false;
        return true;
    };

    Init = async () => {
        if (this.state.loading) {
            const result: boolean = await this.apiAgent.tokenAgent();
            if (result) this.loadStudentsData();
            else setTimeout(() => { this.loadStudentsData(); }, 2000);
        } 
    };

    loadStudentsData = async () => {
        const response: Response = await this.apiAgent.loadStudentsData();
        if (response && response.data) {
            if (response.data.length > 1) response.data.sort((a, b) => a.username > b.username ? 1 : -1);
            this.setState({ students: response.data, loading: false });
        }       
    };

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
                        <>
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
                                                            onFocus={(event) => { if (this.state.onError) this.setState({ onError: false }); }}
                                                            onChange={(event) => { this.setState({ username: event.target.value }); }}
                                                            type="text" placeholder="Username" maxLength={20} />
                                                        {(this.state.onError && (this.state.username.length == 0)) ? <div className="invalid-tooltip" >Please provide a Username.</div> : null}
                                                    </div>
                                                }
                                            </td>
                                            <td>
                                                <div className="input-group has-validation">
                                                    <input className="form-control form-control-sm" value={this.state.firstName}
                                                        onFocus={(event) => { if (this.state.onError) this.setState({ onError: false }); }}
                                                        onChange={(event) => { this.setState({ firstName: event.target.value }); }}
                                                        type="text" placeholder="Firstname" maxLength={20} />
                                                    {(this.state.onError && (this.state.firstName.length == 0)) ? <div className="invalid-tooltip" >Please provide a Firstname.</div> : null}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="input-group has-validation">
                                                    <input className="form-control form-control-sm" value={this.state.lastName}
                                                        onFocus={(event) => { if (this.state.onError) this.setState({ onError: false }); }}
                                                        onChange={(event) => { this.setState({ lastName: event.target.value }); }}
                                                        type="text" placeholder="LastName" maxLength={20} />
                                                    {(this.state.onError && (this.state.lastName.length == 0)) ? <div className="invalid-tooltip" >Please provide a LastName.</div> : null}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="input-group has-validation">
                                                    <input className="form-control form-control-sm" value={this.state.age}
                                                        onFocus={(event) => { if (this.state.onError) this.setState({ onError: false }); }}
                                                        onChange={(event) => { this.setState({ age: (event.target.value) ? Number(event.target.value) : 0 }); }}
                                                        type="number" maxLength={3} min="10" max="110" placeholder="Age" />
                                                    {(this.state.onError && (isNaN(this.state.age) || Number(this.state.age) <= 0)) ? <div className="invalid-tooltip" >Please provide a valid Age.</div> : null}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="input-group has-validation">
                                                    <input className="form-control form-control-sm" value={this.state.career}
                                                        onFocus={(event) => { if (this.state.onError) this.setState({ onError: false }); }}
                                                        onChange={(event) => { this.setState({ career: event.target.value }); }}
                                                        type="text" placeholder="Career" maxLength={50}/>
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
                        </>
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
