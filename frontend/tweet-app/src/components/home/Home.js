import React from 'react'
import './Home.css'
import Sidebar from '../sidebar/Sidebar'
import Feed from '../feed/Feed'
import Widgets from '../widgets/Widgets'



const Home = () => {



  return (
    <div className="home">
     <Sidebar/>
     <Feed/>
     <Widgets/>
    </div>
  )
}

export default Home