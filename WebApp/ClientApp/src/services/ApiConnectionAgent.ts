import axios, { CancelTokenSource, AxiosRequestConfig, AxiosResponse } from "axios";
import { TryAgain, APICredentials, Student, Response } from '../types';

export class ApiConnectionAgent {
    private tokenAPI: string = null;
    private tokenAPIExp: Date;
    private tokenExpSeconds: number = 10;
    private tokenRefreshSeconds: number = 5;
    private maxTimeOutResponse: number = 10000;
    private tokenLoaded: boolean = false;
    private forceAbortRequest: boolean = false;
    private tryAgain: TryAgain = new TryAgain();
    private source: CancelTokenSource;
    private apiCredentials: APICredentials = {
        username: 'WebApp',
        password: 'L!#CsVT3Bc$=dtxh'
    };

    constructor() {
        this.source = axios.CancelToken.source();
        this.init();
    };

    init = (): void => {
        this.tryAgain.Seconds = 1;
        this.tokenAgent();
    };

    PreloadAppData = async (): Promise<boolean> => {
        let isPending = true;
        if (!this.tokenLoaded && !this.forceAbortRequest) {
            setTimeout(this.PreloadAppData, this.tryAgain.Seconds * 1000);
            this.tryAgain.Attempts -= 1;
            return isPending;
        }
        let lstStudents = await this.loadStudentsData();
        console.log(JSON.stringify(lstStudents));
        isPending = (lstStudents) ? false : true;
        return isPending;
    };

    tokenAgent = async (): Promise<boolean> => {
        const result : string = await this.checkToken();
        this.tokenLoaded = (result) ? true : false;
        return this.tokenLoaded;
    };

    checkToken = async (): Promise<string> => {
        console.log('---------------------------------------------');
        console.log(`Checking current app token`);
        console.log('---------------------------------------------');
        let requireNewToken = false;
        if (!this.tokenAPI) {
            requireNewToken = true;
        }
        if (this.tokenAPIExp) {
            let dateTokenExp = new Date(this.tokenAPIExp);
            let dateNow = new Date();
            dateNow.setSeconds(dateNow.getSeconds() - this.tokenRefreshSeconds);
            if (dateNow <= dateTokenExp) {
                requireNewToken = true;
            }
        }
        else {
            requireNewToken = true;
        }
        if (requireNewToken === true) {
            console.log('---------------------------------------------');
            console.log(`Getting a new app token`);
            console.log('---------------------------------------------');
            let tokenAPI = await this.getTokenApp();
            if (tokenAPI) {
                this.tokenAPI = tokenAPI;
                let dateNow: Date = new Date();
                let exp : number = dateNow.setMinutes(5);
                this.tokenAPIExp = new Date(exp);
                const dateToken: Date = new Date(this.tokenAPIExp);
                const diffTime = Math.abs(dateToken.getTime() - dateNow.getTime());
                let diffSeconds = Math.ceil(diffTime / (1000));
                this.tokenRefreshSeconds = 120;
                this.tokenExpSeconds = diffSeconds;
                this.tokenExpSeconds = (this.tokenExpSeconds <= 0) ? 600 : this.tokenExpSeconds;
                console.log('---------------------------------------------');
                console.log(`Token API expiration in ${this.tokenExpSeconds} seconds`);
                console.log('---------------------------------------------');
                this.tokenLoaded = true;
                if (!this.forceAbortRequest) {
                    setTimeout(this.tokenAgent, (this.tokenExpSeconds - this.tokenRefreshSeconds) * 1000);
                }
            }
            else {
                if (!this.forceAbortRequest) {
                    setTimeout(this.tokenAgent, (this.tokenRefreshSeconds) * 1000);
                }
            }
        }
        return this.tokenAPI || null;
    };

    getTokenApp = async (): Promise<string> => {
        const axiosConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };
        const token: string = await axios.post(`api/v1/HealthCheck`, this.apiCredentials, axiosConfig)
            .then((resp: AxiosResponse<any>) => {
                const { data = null } = resp.data;
                return data;
            })
            .catch((error) => {
                if (!this.forceAbortRequest) {
                    setTimeout(this.tokenAgent, (this.tokenRefreshSeconds) * 1000);
                }
                return null;
            });
        return token;
    };

    public loadStudentsData = async (): Promise<Response> => {
        let response: Response = null;
        if (!this.tokenAPI) return response;
        const axiosConfig: AxiosRequestConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
                'Authorization': 'Bearer ' + this.tokenAPI,
            }
        };
        response = await axios.get(`api/v1/Student`, axiosConfig)
            .then((resp: AxiosResponse<Response>) => {
                return resp.data;
            })
            .catch((error) => {
                return null;
            });
        return response;
    };

    public addStudentsData = async (student: Student): Promise<Response> => {
        let response: Response = null;
        if (!this.tokenAPI) return response;
        if (student) {
            const axiosConfig: AxiosRequestConfig = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "*",
                    'Authorization': 'Bearer ' + this.tokenAPI,
                }
            };
            response = await axios.post(`api/v1/Student`, student, axiosConfig)
            .then((resp: AxiosResponse<Response>) => {
                return resp.data;
            })
            .catch((error) => {
                return null;
            });
        }
        return response;
    };

    public modifyStudentData = async (student: Student): Promise<Response> => {
        let response: Response = null;
        if (!this.tokenAPI) return response;
        if (student && student.id > 0) {
            const axiosConfig: AxiosRequestConfig = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "*",
                    'Authorization': 'Bearer ' + this.tokenAPI,
                }
            };
            response = await axios.put(`api/v1/Student/${student.id}`, student, axiosConfig)
                .then((resp: AxiosResponse<Response>) => {
                    return resp.data;
                })
                .catch((error) => {
                    return null;
                });
        }
        return response;
    };

    public removeStudentsData = async (id: number): Promise<Response> => {
        let response: Response = null;
        if (!this.tokenAPI) return response;
        if (id > 0) {
            const axiosConfig: AxiosRequestConfig = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "*",
                    'Authorization': 'Bearer ' + this.tokenAPI,
                }
            };
            response = await axios.delete(`api/v1/Student/${id}`, axiosConfig)
                .then((resp: AxiosResponse<Response>) => {
                    return resp.data;
                })
                .catch((error) => {
                    return null;
                });
        }
        return response;
    };

    Close = (): void => {
        if (this.source) {
            this.source.cancel();
        }
    };
}