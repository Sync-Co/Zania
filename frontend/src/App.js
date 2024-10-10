import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from './components/Card';
import ImageOverlay from './components/ImageOverlay';
import Spinner from './components/Spinner'; // Assuming you have this component
import './App.css';

const App = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [previousPositions, setPreviousPositions] = useState([]); // Store previous positions
  const [elapsedTime, setElapsedTime] = useState('Never'); // State for elapsed time

  const intervalRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:8000/documents');
      const data = await response.json();
      setDocuments(data);
      setPreviousPositions(data.map(doc => doc.type)); // Initialize previous positions
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedDocs = Array.from(documents);
    const [movedDoc] = reorderedDocs.splice(result.source.index, 1);
    reorderedDocs.splice(result.destination.index, 0, movedDoc);
    
    setDocuments(reorderedDocs);
  };

  const saveDocuments = useCallback(async () => {
    const currentPositions = documents.map(doc => doc.type); // Get current positions
    
    // Compare current positions with previous positions
    if (JSON.stringify(currentPositions) !== JSON.stringify(previousPositions)) {
      setIsSaving(true); // Show loading spinner
      try {
        await fetch('http://localhost:8000/documents', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(documents.map((doc, index) => ({ ...doc, position: index }))),
        });
        setLastSaved(new Date());
        setPreviousPositions(currentPositions); // Update previous positions after saving
      } catch (error) {
        console.error('Error saving documents:', error);
      } finally {
        setIsSaving(false); // Hide loading spinner
      }
    }
  }, [documents, previousPositions]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      saveDocuments(); // Call saveDocuments every 5 seconds
    }, 5000);

    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, [saveDocuments]);

  useEffect(() => {
    const updateElapsedTime = () => {
      if (lastSaved) {
        const now = new Date();
        const elapsed = Math.floor((now - lastSaved) / 1000); // time in seconds

        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;

        setElapsedTime(`${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''} ago`);
      }
    };

    const elapsedInterval = setInterval(updateElapsedTime, 1000);

    return () => clearInterval(elapsedInterval); // Cleanup on unmount
  }, [lastSaved]); // Depend on lastSaved to update elapsed time

  return (
    <div className="App">
      <div className="header-container">
        <h1>Document Dashboard</h1>
        <div className="save-status">
          {isSaving ? (
            <Spinner />
          ) : (
            <span>
              Last saved: {lastSaved ? lastSaved.toLocaleTimeString() : 'Never'} ({elapsedTime})
            </span>
          )}
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="documents" direction="horizontal">
          {(provided) => (
            <div
              className="card-grid"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {documents.map((doc, index) => (
                <Draggable key={doc.type} draggableId={doc.type} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card document={doc} index={index} onClick={setSelectedDoc} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {selectedDoc && (
        <ImageOverlay document={selectedDoc} onClose={() => setSelectedDoc(null)} />
      )}
    </div>
  );
};

export default App;