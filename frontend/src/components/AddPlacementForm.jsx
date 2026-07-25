function AddPlacementForm({
  company,
  setCompany,
  role,
  setRole,
  status,
  setStatus,
  interviewDate,
  setInterviewDate,
  interviewRound,
  setInterviewRound,
  notes,
  setNotes,
  handleAddPlacement,
}) {
  return (
    <div className="form-section">
      <h2>Add Placement</h2>

      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <br />
      <br />
<input
  type="date"
  value={interviewDate}
  onChange={(e) => setInterviewDate(e.target.value)}
/>

<br />
<br />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="Applied">Applied</option>
        <option value="OA">OA</option>
        <option value="Interview">Interview</option>
        <option value="Selected">Selected</option>
        <option value="Rejected">Rejected</option>
      </select>

      <br />
      <br />
<input
  type="text"
  placeholder="Interview Round"
  value={interviewRound}
  onChange={(e) => setInterviewRound(e.target.value)}
/>

<br />
<br />

<textarea
  placeholder="Notes"
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
/>

<br />
<br />
      <button
        className="update-btn"
        onClick={handleAddPlacement}
      >
        Add Placement
      </button>
    </div>
  );
}

export default AddPlacementForm;