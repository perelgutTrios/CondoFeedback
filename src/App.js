import React, { useState } from 'react';
import './App.css';

function App() {
  const [copyPM, setCopyPM] = useState(false);

  return (
    <div className="container">
      <header className="header">🏢 Condo Feedback Portal</header>
      <form className="form">
        <label>Family Name</label>
        <input type="text" maxLength="100" />

        <label>Unit Number</label>
        <input type="text" maxLength="10" />

        <label>Topic</label>
        <select>
          <option>Plumbing</option>
          <option>HVAC</option>
          <option>Hallway</option>
          <option>In-Unit</option>
          <option>Lobby</option>
          <option>Garage</option>
          <option>Recreation Facilities</option>
          <option>Party Room</option>
          <option>Meeting Rooms</option>
          <option>Golf Room</option>
          <option>Fitness Room</option>
          <option>Pool and Hot Tub</option>
          <option>Pool Tables</option>
          <option>Lockers</option>
          <option>Other</option>
        </select>

        <label>Urgency</label>
        <select>
          <option>Urgent (Must report to concierge as well as here)</option>
          <option>Important</option>
          <option>Troublesome</option>
          <option>Compliments</option>
          <option>Other</option>
        </select>

        <label>Subject</label>
        <input type="text" maxLength="150" />

        <label>Comment</label>
        <textarea maxLength="2500"></textarea>

        <div className="actions">
          <button type="button" className="cancel">Cancel</button>
          <button type="button" className="send">Send to Assistant PM</button>
          <button type="button" className="send">Send to PM & aPM</button>
        </div>

        <div className="alternative">
          <button type="button" className="cancel">Cancel</button>
          <button type="button" className="send">Send</button>
          <label>
            <input
              type="checkbox"
              checked={copyPM}
              onChange={() => setCopyPM(!copyPM)}
            />
            Copy Property Manager
          </label>
        </div>
      </form>
    </div>
  );
}

export default App;