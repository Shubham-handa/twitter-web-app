import React ,{useEffect}from 'react'
import './SidebarOption.css';
import {useNavigate} from 'react-router-dom';


const SidebarOption = ({active, Icon, text}) => {

  // useEffect(() => {
  //   console.log(Icon)
  //   console.log(text);
  //   console.log(active)
  // },[]);

  const navigate = useNavigate();


  const goTo = () =>{
    if(text==='Profile'){
      navigate('/profile',{ replace: true });
    }
  }



  return (
    <div className={`sidebarOption ${active && 'sidebarOption--active'}`}   onClick={()=>goTo()}>
        <Icon sx={{ fontSize: 60 }} />
        <h2>{text}</h2>
        
    </div>
    
  )
}

export default SidebarOption