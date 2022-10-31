import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/login/Login';
import Home from './components/home/Home';
import Profile from './components/profile/Profile';
import AlertTemplate from 'react-alert-template-basic';
import {positions, Provider} from 'react-alert'

const options = {
  timeout: 4000,
  position: positions.BOTTOM_CENTER
}



function App() {
  return (
    <div className="app">

      {/* <Home/> */}
      <Provider template={AlertTemplate} {...options}>
      <Router>
        {/* <Link to="/"/> */}
        <Routes>
          <Route exact path="/" element={<Login/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </Router>
      </Provider>
    </div>
  );
}

export default App;
