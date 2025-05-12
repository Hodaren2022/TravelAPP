import { Routes, Route, NavLink } from 'react-router-dom'
import styled from 'styled-components'

// 頁面組件
import TripManagement from './pages/TripManagement'
import DailyItinerary from './pages/DailyItinerary'
import HotelInfo from './pages/HotelInfo'
import TravelTips from './pages/TravelTips'
import PackingList from './pages/PackingList'
import TravelNotes from './pages/TravelNotes'
import DataManagement from './pages/DataManagement'
import ExpenseTracker from './pages/ExpenseTracker'

// 上下文提供者
import { TripProvider } from './contexts/TripContext'

// 樣式組件
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Header = styled.header`
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;
`

const MainContent = styled.main`
  flex: 1;
  padding: 1rem;
  background-color: #f5f5f5;
`

const Navigation = styled.nav`
  background-color: #34495e;
  padding: 0.5rem;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`

const NavItem = styled(NavLink)`
  color: white;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 4px;
  
  &.active {
    background-color: #1abc9c;
  }
  
  &:hover {
    background-color: #3498db;
  }
`

const Footer = styled.footer`
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1rem;
`

function App() {
  return (
    <TripProvider>
      <AppContainer>
        <Header>
          <h1>旅遊應用程序</h1>
        </Header>
        
        <Navigation>
          <NavItem to="/" end>行程管理</NavItem>
          <NavItem to="/daily">每日行程</NavItem>
          <NavItem to="/hotel">旅館資訊</NavItem>
          <NavItem to="/tips">旅遊須知</NavItem>
          <NavItem to="/packing">物品清單</NavItem>
          <NavItem to="/notes">旅遊筆記</NavItem>
          <NavItem to="/expenses">消費追蹤</NavItem>
          <NavItem to="/data">數據管理</NavItem>
        </Navigation>
        
        <MainContent>
          <Routes>
            <Route path="/" element={<TripManagement />} />
            <Route path="/daily" element={<DailyItinerary />} />
            <Route path="/hotel" element={<HotelInfo />} />
            <Route path="/tips" element={<TravelTips />} />
            <Route path="/packing" element={<PackingList />} />
            <Route path="/notes" element={<TravelNotes />} />
            <Route path="/expenses" element={<ExpenseTracker />} />
            <Route path="/data" element={<DataManagement />} />
          </Routes>
        </MainContent>
        
        <Footer>
          <p>&copy; {new Date().getFullYear()} 旅遊應用程序</p>
        </Footer>
      </AppContainer>
    </TripProvider>
  )
}

export default App