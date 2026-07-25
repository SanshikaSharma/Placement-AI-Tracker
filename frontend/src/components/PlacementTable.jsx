import "../styles/PlacementTable.css";

function PlacementTable({
  currentPlacements,
  filteredPlacements,
  editingId,
  editingCompany,
  setEditingCompany,
  editingRole,
  setEditingRole,
  editingStatus,
  setEditingStatus,
  handleUpdate,
  handleEdit,
  handleDelete,
  setEditingId,
}) {
  return (
    <>
      {filteredPlacements.length === 0 ? (
        <h3>No Placements Found</h3>
      ) : (
        <table className="placement-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Date Applied</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentPlacements.map((placement) => (
              <tr key={placement._id}>
                {editingId === placement._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editingCompany}
                        onChange={(e) =>
                          setEditingCompany(e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={editingRole}
                        onChange={(e) =>
                          setEditingRole(e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <select
                        value={editingStatus}
                        onChange={(e) =>
                          setEditingStatus(e.target.value)
                        }
                      >
                        <option value="Applied">Applied</option>
                        <option value="OA">OA</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td>
                      {new Date(
                        placement.dateApplied
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={handleUpdate}
                      >
                        Save
                      </button>

                      <button
                        className="action-btn delete-btn"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{placement.company}</td>

                    <td>{placement.role}</td>

                    <td>
                      <span
                        className={`status ${placement.status.toLowerCase()}`}
                      >
                        {placement.status}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        placement.dateApplied
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={() =>
                          handleEdit(placement)
                        }
                      >
                        ✏ Edit
                      </button>

                      <button
                        className="action-btn delete-btn"
                        onClick={() =>
                          handleDelete(placement._id)
                        }
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default PlacementTable;