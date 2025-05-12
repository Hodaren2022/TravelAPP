import { useState } from 'react'
import styled from 'styled-components'
import { useTrip } from '../contexts/TripContext'

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const TripCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
`

const TripForm = styled.form`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
`

const FormSection = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
`

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`

const FormGroup = styled.div`
  flex: 1;
  margin-bottom: 0.5rem;
`

const FlightTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`

const Button = styled.button`
  background-color: ${props => props.$primary ? '#3498db' : '#e74c3c'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`

// 台灣航空公司列表
const taiwanAirlines = [
  '中華航空',
  '長榮航空',
  '立榮航空',
  '華信航空',
  '台灣虎航',
  '星宇航空',
  '遠東航空',
  '其他'
];

const TripManagement = () => {
  const { trips, setTrips, setSelectedTripId } = useTrip();
  
  const [newTrip, setNewTrip] = useState({
    id: '',
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
    flights: []
  });
  
  const [newFlight, setNewFlight] = useState({
    date: '',
    airline: '',
    flightNumber: '',
    departureCity: '',
    arrivalCity: '',
    departureTime: '',
    arrivalTime: '',
    customAirline: '',
    duration: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Create a temporary object with the updated value
    const updatedTrip = { ...newTrip, [name]: value };

    setNewTrip(updatedTrip);

    // Validate dates immediately if either date changed
    if (name === 'startDate' || name === 'endDate') {
      const startDate = new Date(updatedTrip.startDate);
      const endDate = new Date(updatedTrip.endDate);

      // Check if both dates are selected and endDate is before startDate
      if (updatedTrip.startDate && updatedTrip.endDate && endDate < startDate) {
        alert("結束日期不能早於開始日期，請檢查您的日期輸入。\n\n請注意：日期輸入錯誤可能導致每日行程頁面無法正常顯示與編輯。");
      }
    }
  };
  
  const handleFlightInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFlight = { ...newFlight, [name]: value };
    
    // 當起飛時間或降落時間變更時，計算飛行時間
    if (name === 'departureTime' || name === 'arrivalTime') {
      if (updatedFlight.departureTime && updatedFlight.arrivalTime) {
        updatedFlight.duration = calculateFlightDuration(
          updatedFlight.departureTime,
          updatedFlight.arrivalTime
        );
      }
    }
    
    setNewFlight(updatedFlight);
  };
  
  // 計算飛行時間函數
  const calculateFlightDuration = (departureTime, arrivalTime) => {
    // 創建日期對象用於計算時間差
    const departureDate = new Date(`2000-01-01T${departureTime}:00`);
    const arrivalDate = new Date(`2000-01-01T${arrivalTime}:00`);
    
    // 處理跨日航班（如果降落時間早於起飛時間，表示跨日）
    if (arrivalDate < departureDate) {
      arrivalDate.setDate(arrivalDate.getDate() + 1);
    }
    
    // 計算時間差（毫秒）
    const durationMs = arrivalDate - departureDate;
    
    // 轉換為小時和分鐘
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    // 格式化為 小時小時分鐘分 的格式
    return `${hours}小時${minutes}分`;
  };
  
  // 排序航班函數 - 按日期和時間排序，日期時間較近的排在上方
  const sortFlights = (flights) => {
    return [...flights].sort((a, b) => {
      // 先比較日期
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB; // 日期較早的排前面
      }
      
      // 如果日期相同，比較時間
      const timeA = a.departureTime || '';
      const timeB = b.departureTime || '';
      
      return timeA.localeCompare(timeB);
    });
  };
  
  const addFlight = () => {
    // 處理自定義航空公司
    let airlineName = newFlight.airline;
    if (airlineName === '其他' && newFlight.customAirline) {
      airlineName = newFlight.customAirline;
    }
    
    // 確保飛行時間已計算
    let flightDuration = newFlight.duration;
    if (!flightDuration && newFlight.departureTime && newFlight.arrivalTime) {
      flightDuration = calculateFlightDuration(
        newFlight.departureTime,
        newFlight.arrivalTime
      );
    }
    
    const flight = {
      ...newFlight,
      airline: airlineName,
      duration: flightDuration,
      id: Date.now().toString()
    };
    
    setNewTrip(prev => {
      // 添加新航班並排序
      const updatedFlights = sortFlights([...(prev.flights || []), flight]);
      
      return {
        ...prev,
        flights: updatedFlights
      };
    });
    
    // 重置航班表單
    setNewFlight({
      date: '',
      airline: '',
      flightNumber: '',
      departureCity: '',
      arrivalCity: '',
      departureTime: '',
      arrivalTime: '',
      customAirline: '',
      duration: ''
    });
  };
  
  const removeFlight = (flightId) => {
    setNewTrip(prev => ({
      ...prev,
      flights: prev.flights.filter(flight => flight.id !== flightId)
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Re-validate dates on submit just in case
    const startDate = new Date(newTrip.startDate);
    const endDate = new Date(newTrip.endDate);

    if (endDate < startDate) {
      alert("結束日期不能早於開始日期，請檢查您的日期輸入。\n\n請注意：日期輸入錯誤可能導致每日行程頁面無法正常顯示與編輯。");
      return; // Prevent form submission
    }

    if (isEditing) {
      setTrips(trips.map(trip => trip.id === newTrip.id ? newTrip : trip));
      setIsEditing(false);
      setSelectedTripId(newTrip.id); // 設置編輯後的行程為當前選定行程
    } else {
      const id = Date.now().toString();
      setTrips([...trips, { ...newTrip, id }]);
      setSelectedTripId(id); // 設置新創建的行程為當前選定行程
    }
    
    setNewTrip({
      id: '',
      name: '',
      destination: '',
      startDate: '',
      endDate: '',
      description: '',
      flights: []
    });
    
    setNewFlight({
      date: '',
      airline: '',
      flightNumber: '',
      departureCity: '',
      arrivalCity: '',
      departureTime: '',
      arrivalTime: '',
      customAirline: ''
    });
  };
  
  const handleEdit = (trip) => {
    // 檢查並計算所有航班的飛行時間
    if (trip.flights && trip.flights.length > 0) {
      const updatedFlights = trip.flights.map(flight => {
        // 如果航班已有飛行時間或缺少起飛/降落時間，則保持不變
        if (flight.duration || !flight.departureTime || !flight.arrivalTime) {
          return flight;
        }
        
        // 計算並添加飛行時間
        const duration = calculateFlightDuration(
          flight.departureTime,
          flight.arrivalTime
        );
        
        return {
          ...flight,
          duration
        };
      });
      
      setNewTrip({
        ...trip,
        flights: updatedFlights
      });
    } else {
      setNewTrip(trip);
    }
    
    setIsEditing(true);
  };
  
  const handleDelete = (id) => {
    setTrips(trips.filter(trip => trip.id !== id));
  };
  
  return (
    <Container>
      <h2>行程管理</h2>
      
      <TripForm onSubmit={handleSubmit}>
        <h3>{isEditing ? '編輯行程' : '新增行程'}</h3>
        
        <div>
          <label htmlFor="name">行程名稱</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newTrip.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="destination">目的地</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={newTrip.destination}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="startDate">開始日期</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={newTrip.startDate}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="endDate">結束日期</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={newTrip.endDate}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="description">行程描述</label>
          <textarea
            id="description"
            name="description"
            value={newTrip.description}
            onChange={handleInputChange}
            rows="4"
          ></textarea>
        </div>
        
        <FormSection>
          <h4>航班資訊（選填）</h4>
          
          <FormRow>
            <FormGroup>
              <label htmlFor="flightDate">日期</label>
              <input
                type="date"
                id="flightDate"
                name="date"
                value={newFlight.date}
                onChange={handleFlightInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="airline">航空公司</label>
              <select
                id="airline"
                name="airline"
                value={newFlight.airline}
                onChange={handleFlightInputChange}
              >
                <option value="">-- 請選擇航空公司 --</option>
                {taiwanAirlines.map(airline => (
                  <option key={airline} value={airline}>{airline}</option>
                ))}
              </select>
            </FormGroup>
            
            {newFlight.airline === '其他' && (
              <FormGroup>
                <label htmlFor="customAirline">自定義航空公司</label>
                <input
                  type="text"
                  id="customAirline"
                  name="customAirline"
                  value={newFlight.customAirline}
                  onChange={handleFlightInputChange}
                />
              </FormGroup>
            )}
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <label htmlFor="flightNumber">航班編號</label>
              <input
                type="text"
                id="flightNumber"
                name="flightNumber"
                value={newFlight.flightNumber}
                onChange={handleFlightInputChange}
                placeholder="例如: BR182"
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <label htmlFor="departureCity">起飛城市</label>
              <input
                type="text"
                id="departureCity"
                name="departureCity"
                value={newFlight.departureCity}
                onChange={handleFlightInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="arrivalCity">降落城市</label>
              <input
                type="text"
                id="arrivalCity"
                name="arrivalCity"
                value={newFlight.arrivalCity}
                onChange={handleFlightInputChange}
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <label htmlFor="departureTime">起飛時間</label>
              <input
                type="time"
                id="departureTime"
                name="departureTime"
                value={newFlight.departureTime}
                onChange={handleFlightInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="arrivalTime">降落時間</label>
              <input
                type="time"
                id="arrivalTime"
                name="arrivalTime"
                value={newFlight.arrivalTime}
                onChange={handleFlightInputChange}
              />
            </FormGroup>
          </FormRow>
          
          <Button 
            type="button" 
            $primary 
            onClick={addFlight}
            style={{ marginTop: '0.5rem' }}
          >
            新增航班
          </Button>
          
          {newTrip.flights && newTrip.flights.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h5>已新增航班</h5>
              <FlightTable>
                <thead>
                  <tr>
                    <th>日期</th>
                    <th>航空公司</th>
                    <th>航班編號</th>
                    <th>起飛/降落城市</th>
                    <th>起飛/降落時間</th>
                    <th>飛行時間</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {sortFlights(newTrip.flights).map(flight => (
                    <tr key={flight.id}>
                      <td>{flight.date}</td>
                      <td>{flight.airline}</td>
                      <td>{flight.flightNumber}</td>
                      <td>{flight.departureCity}/{flight.arrivalCity}</td>
                      <td>{flight.departureTime}/{flight.arrivalTime}</td>
                      <td>{flight.duration || '-'}</td>
                      <td>
                        <Button onClick={() => removeFlight(flight.id)}>刪除</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </FlightTable>
            </div>
          )}
        </FormSection>
        
        <ButtonGroup>
          <Button $primary type="submit">
            {isEditing ? '更新行程' : '新增行程'}
          </Button>
          {isEditing && (
            <Button type="button" onClick={() => {
              setIsEditing(false);
              setNewTrip({
                id: '',
                name: '',
                destination: '',
                startDate: '',
                endDate: '',
                description: '',
                flights: [] // Reset flights as well when cancelling edit
              });
              setNewFlight({ // Reset new flight form as well
                date: '',
                airline: '',
                flightNumber: '',
                departureCity: '',
                arrivalCity: '',
                departureTime: '',
                arrivalTime: '',
                customAirline: '',
                duration: ''
              });
            }}>
              取消
            </Button>
          )}
        </ButtonGroup>
      </TripForm>
      
      <div>
        <h3>我的行程</h3>
        {trips.length === 0 ? (
          <p>尚未建立任何行程</p>
        ) : (
          trips.map(trip => (
            <TripCard key={trip.id}>
              <h4>{trip.name}</h4>
              <p><strong>目的地:</strong> {trip.destination}</p>
              <p><strong>日期:</strong> {trip.startDate} 至 {trip.endDate}</p>
              <p>{trip.description}</p>
              
              {trip.flights && trip.flights.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h5>航班資訊</h5>
                  <FlightTable>
                    <thead>
                      <tr>
                        <th>日期</th>
                        <th>航空公司</th>
                        <th>航班編號</th>
                        <th>起飛/降落城市</th>
                        <th>起飛/降落時間</th>
                        <th>飛行時間</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortFlights(trip.flights).map(flight => (
                        <tr key={flight.id}>
                          <td>{flight.date}</td>
                          <td>{flight.airline}</td>
                          <td>{flight.flightNumber}</td>
                          <td>{flight.departureCity}/{flight.arrivalCity}</td>
                          <td>{flight.departureTime}/{flight.arrivalTime}</td>
                          <td>{flight.duration || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </FlightTable>
                </div>
              )}
              
              <ButtonGroup>
                <Button $primary onClick={() => handleEdit(trip)}>編輯</Button>
                <Button onClick={() => handleDelete(trip.id)}>刪除</Button>
              </ButtonGroup>
            </TripCard>
          ))
        )}
      </div>
    </Container>
  );
};

export default TripManagement;