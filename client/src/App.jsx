import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
      <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<h1 className="text-3xl font-bold p-8">Home Page</h1>} />
          <Route path="/auth/login" element={<div className="p-8">Login Page</div>} />
          <Route path="/auth/register" element={<div className="p-8">Register Page</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
