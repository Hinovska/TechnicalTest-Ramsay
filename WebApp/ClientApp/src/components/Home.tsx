import React, { Component } from 'react';

export type HomeProps = {
    displayName: string;
};

type HomeState = {
    Loaded: boolean;
};

export default class Home extends Component<HomeProps, HomeState> {

    constructor(props: HomeProps) {
        super(props);        
    };

    render ()  {
        return (
            <div>
                <h1>Hello, Ramsay Innovations!</h1>        
                <div className="card">
                    <div className="card-body">
                        <p>Welcome to the result of my technical test based on the following guidelines:</p>
                        <ul>
                            <li>The design and use of the best practices will be evaluated</li>
                            <li>Send us the link of the repository with your source code (GitHub, Bitbucket). </li>
                            <li>The application should be able to run in Visual Studio 2017/Java Eclipse and/or Visual Studio Code. </li>
                        </ul>
                        <p>Create a simple web application with the next requirements:</p>
                        <ul>
                            <li>Build a WebApp that performs the maintenance of the table Student within the SQLite database attached.</li>
                            <li>The back-end part of the WebApp must be made an API in .Net Core/Java SDK.</li>
                            <li>The front-end part can be made in Angular or React.</li>
                            <li>The WebApp must contain Create, Read, Update and Delete.</li>
                            <li>Authentication is not required.</li>
                        </ul>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <p>I have used the following tools and concepts to build the required solution:</p>
                        <ul>
                            <li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> for cross-platform server-side code.</li>
                            <li><a href='https://facebook.github.io/react/'>React</a> for client-side code.</li>
                            <li><a href='http://getbootstrap.com/'>Bootstrap</a> for layout and styling.</li>
                            <li>Backend with "N-Layer" architecture.</li>
                            <li>API Autentification with JSON Web Token Claims.</li>
                        </ul>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <p>To help you get started, we have also set up:</p>
                        <ul>
                            <li><strong>Client-side navigation</strong>. For example, click <em>Students</em> then <em>Back</em> to return here.</li>
                            <li><strong>Development server integration</strong>. In development mode, the development server from <code>create-react-app</code> runs in the background automatically, so your client-side resources are dynamically built on demand and the page refreshes when you modify any file.</li>
                            <li><strong>Efficient production builds</strong>. In production mode, development-time features are disabled, and your <code>dotnet publish</code> configuration produces minified, efficiently bundled JavaScript files.</li>
                        </ul>
                        <p>The <code>ClientApp</code> subdirectory is a standard React application based on the <code>create-react-app</code> template. If you open a command prompt in that directory, you can run <code>npm</code> commands such as <code>npm test</code> or <code>npm install</code>.</p>
                    </div>
                </div>
            </div>
        );
    }
}