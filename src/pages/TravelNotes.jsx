import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTrip } from '../contexts/TripContext'

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const TripSelector = styled.div`
  margin-bottom: 1rem;
`

const NoteCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
`

const NoteForm = styled.form`
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

const TravelNotes = () => {
  const { trips, selectedTripId, setSelectedTripId } = useTrip();
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('travelNotes');
    return savedNotes ? JSON.parse(savedNotes) : {};
  });
  
  const [newNote, setNewNote] = useState({
    id: '',
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    location: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    localStorage.setItem('travelNotes', JSON.stringify(notes));
  }, [notes]);
  
  const handleTripChange = (e) => {
    const tripId = e.target.value;
    setSelectedTripId(tripId);
    
    // 確保選定行程的旅遊筆記存在
    if (tripId && !notes[tripId]) {
      setNotes(prev => ({
        ...prev,
        [tripId]: []
      }));
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNote(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedTripId) return;
    
    const tripNotes = notes[selectedTripId] || [];
    
    if (isEditing) {
      const updatedNotes = tripNotes.map(note => 
        note.id === newNote.id ? newNote : note
      );
      
      setNotes({
        ...notes,
        [selectedTripId]: updatedNotes
      });
      
      setIsEditing(false);
    } else {
      const id = Date.now().toString();
      
      setNotes({
        ...notes,
        [selectedTripId]: [...tripNotes, { ...newNote, id }]
      });
    }
    
    setNewNote({
      id: '',
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      location: ''
    });
  };
  
  const handleEdit = (note) => {
    setNewNote(note);
    setIsEditing(true);
  };
  
  const handleDelete = (noteId) => {
    const tripNotes = notes[selectedTripId] || [];
    
    const updatedNotes = tripNotes.filter(note => note.id !== noteId);
    
    setNotes({
      ...notes,
      [selectedTripId]: updatedNotes
    });
  };
  
  // 獲取選定行程的旅遊筆記
  const selectedTripNotes = selectedTripId ? (notes[selectedTripId] || []) : [];
  
  // 按日期排序筆記（最新的在前面）
  const sortedNotes = [...selectedTripNotes].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  return (
    <Container>
      <h2>旅遊筆記</h2>
      
      <TripSelector>
        <label htmlFor="trip">選擇行程:</label>
        <select
          id="trip"
          value={selectedTripId || ''}
          onChange={handleTripChange}
        >
          <option value="">-- 請選擇行程 --</option>
          {trips.map(trip => (
            <option key={trip.id} value={trip.id}>
              {trip.name} ({trip.startDate} 至 {trip.endDate})
            </option>
          ))}
        </select>
      </TripSelector>
      
      {selectedTripId ? (
        <>
          <NoteForm onSubmit={handleSubmit}>
            <h3>{isEditing ? '編輯筆記' : '新增筆記'}</h3>
            
            <div>
              <label htmlFor="title">標題</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newNote.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="date">日期</label>
              <input
                type="date"
                id="date"
                name="date"
                value={newNote.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="location">地點</label>
              <input
                type="text"
                id="location"
                name="location"
                value={newNote.location}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="content">內容</label>
              <textarea
                id="content"
                name="content"
                value={newNote.content}
                onChange={handleInputChange}
                rows="6"
                required
              ></textarea>
            </div>
            
            <ButtonGroup>
              <Button primary type="submit">
                {isEditing ? '更新筆記' : '新增筆記'}
              </Button>
              {isEditing && (
                <Button type="button" onClick={() => {
                  setIsEditing(false);
                  setNewNote({
                    id: '',
                    title: '',
                    content: '',
                    date: new Date().toISOString().split('T')[0],
                    location: ''
                  });
                }}>
                  取消
                </Button>
              )}
            </ButtonGroup>
          </NoteForm>
          
          <div>
            <h3>我的旅遊筆記</h3>
            {sortedNotes.length === 0 ? (
              <p>尚未添加任何旅遊筆記</p>
            ) : (
              sortedNotes.map(note => (
                <NoteCard key={note.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>{note.title}</h4>
                    <span style={{ color: '#777', fontSize: '0.9rem' }}>
                      {new Date(note.date).toLocaleDateString()}
                    </span>
                  </div>
                  {note.location && (
                    <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                      <strong>地點:</strong> {note.location}
                    </p>
                  )}
                  <p style={{ whiteSpace: 'pre-line', marginTop: '0.5rem' }}>{note.content}</p>
                  <ButtonGroup>
                    <Button primary onClick={() => handleEdit(note)}>編輯</Button>
                    <Button onClick={() => handleDelete(note.id)}>刪除</Button>
                  </ButtonGroup>
                </NoteCard>
              ))
            )}
          </div>
        </>
      ) : (
        <p>請先選擇一個行程</p>
      )}
    </Container>
  );
};

export default TravelNotes;