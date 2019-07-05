import React from 'react';

export class Home extends React.Component {
  render() {
    return (
          <div className="container">
            <h1>Hi!</h1>
            <p className="lead">
              I hope you're enjoying ITGG
            </p>
            <p>
              This project was developed by{" "}
              <a href="https://twitter.com/murribu">Cory Martin</a>.<br />
              It uses ReactJS and a serverless backend, powered by AWS.
            </p>
            <p>
              You can view the source code and submit issues by visiting{" "}
              <a href="https://github.com/murribu/isthisguygood">
                the github page
              </a>{" "}
              for this project
            </p>
            <p>
              This system does not collect any user data.
            </p>
            <p>
              If you are in the market for some help with a software need, please
              consider reaching out to{" "}
              <a href="https://dozensoft.com/contact" target="_new">
                Dozen Software
              </a>{" "}
              (my employer) and tell us your software dreams.
            </p>
          </div>)
  }
}

export default Home;