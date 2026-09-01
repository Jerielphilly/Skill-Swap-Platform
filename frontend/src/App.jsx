import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      // Fetch all public profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_public', true)
      
      if (error) {
        console.error("Error fetching users:", error)
      } else {
        setUsers(data)
      }
      setLoading(false)
    }

    fetchUsers()
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔄 Skill Swap Platform</h1>
      <p>Welcome to the basic frontend! Once you paste your Supabase URL and Key into <code>src/supabaseClient.js</code>, the dummy users will appear below.</p>
      
      <hr style={{ margin: '2rem 0' }} />

      <h2>Users on the Platform:</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found. Did you add your API keys to supabaseClient.js?</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {users.map(user => (
            <div key={user.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              <h3>{user.full_name} {user.is_admin ? '(Admin)' : ''}</h3>
              <p>📍 {user.location}</p>
              
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                  <strong>Offering:</strong>
                  <ul>
                    {user.skills_offered?.map(skill => <li key={skill}>{skill}</li>) || <li>None</li>}
                  </ul>
                </div>
                <div>
                  <strong>Looking for:</strong>
                  <ul>
                    {user.skills_wanted?.map(skill => <li key={skill}>{skill}</li>) || <li>None</li>}
                  </ul>
                </div>
              </div>
              
              <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                Request Swap
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
