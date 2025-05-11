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

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`

const Button = styled.button`
  background-color: ${props => props.primary ? '#3498db' : '#e74c3c'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`

const TripManagement = () => {
  const { trips, setTrips, setSelectedTripId } = useTrip();
  
  const [newTrip, setNewTrip] = useState({
    id: '',
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTrip(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
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
      description: ''
    });
  };
  
  const handleEdit = (trip) => {
    setNewTrip(trip);
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
        
        <ButtonGroup>
          <Button primary type="submit">
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
                description: ''
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
              <ButtonGroup>
                <Button primary onClick={() => handleEdit(trip)}>編輯</Button>
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