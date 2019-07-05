import React from 'react';
import { BrowserRouter} from 'react-router-dom'
import Routes from './Components/Routes';
import TopNav from './Components/TopNav';

export class App extends React.Component {
  render() {
    return <div className="App"><TopNav></TopNav><Routes></Routes></div>
  }
}

const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default () => <AppWithRouter></AppWithRouter>