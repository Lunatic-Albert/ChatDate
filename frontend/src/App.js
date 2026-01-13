import React, { useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import SelectionPage from './pages/SelectionPage';
import ChatPage from './pages/ChatPage';
import ChatList from './pages/ChatList';
import ChatPlayground from './pages/ChatPlayground';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import ProtectionRoute from './components/ProtectedRoute';
import SearchFriendPage from './pages/SearchFriendPage';
import MyFriendPage from './pages/MyFriendPage';
import MyCalendar from './pages/MyCalendar';
import ScheduleList from './pages/ScheduleList';


function App() {

const [isLoggedIn, setIsLoggedIn] = useState(!localStorage.getItem('token'));

  return (
    <Router>
<div className='App'>
<Routes>

<Route
path = "/chat/:friendId"
element = {<ChatPlayground/>}/>

<Route
path = "/chat-list"
element = {<ChatList/>}/>

<Route
path = "/mycalendar"
element = {<MyCalendar/>}/>

<Route
path = "/schedule-list"
element = {<ScheduleList/>}/>

 <Route
 path = "/login"
 element = {<LoginPage onLogin={()=> setIsLoggedIn(true)}/>}/> 

<Route
path = "/select"
element ={ <ProtectionRoute>  <SelectionPage setIsLoggedIn={setIsLoggedIn}/> </ProtectionRoute>}
/>

<Route
path ="/chat"
element = {<ProtectionRoute>  <ChatPage/> </ProtectionRoute> }
/>

<Route
path ="/search-friend"
element = {<ProtectionRoute>  <SearchFriendPage/> </ProtectionRoute> }
/>


<Route
path = "/mypage"
element = {<MyPage/>}
/>

<Route
path = "/friend-list"
element = {<MyFriendPage/>}
/>

<Route
path="/"
element = {<Navigate to = {isLoggedIn ? "/select" : "/login"}/>}
/>

<Route
path ="/signup"
element = {<SignupPage/>}/>

</Routes>

</div>

    </Router>
  )
}

export default App;