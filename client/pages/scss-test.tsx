import React from 'react';

const SCSSTest: React.FC = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">SCSS Test Page</h1>
      
      {/* Test Bootstrap Classes */}
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Bootstrap Test</h5>
            </div>
            <div className="card-body">
              <p className="card-text">Testing Bootstrap classes</p>
              <button className="btn btn-primary me-2">Primary</button>
              <button className="btn btn-secondary me-2">Secondary</button>
              <button className="btn btn-success">Success</button>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Custom SCSS Test</h5>
            </div>
            <div className="card-body">
              <p className="card-text">Testing custom SCSS variables</p>
              <div className="alert alert-primary">Primary Alert</div>
              <div className="alert alert-success">Success Alert</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Test Custom SCSS Classes */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="modern-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Column 1</th>
                  <th>Column 2</th>
                  <th>Column 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Data 1</td>
                  <td>Data 2</td>
                  <td>Data 3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Test CSS Loading */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">CSS Loading Test</h5>
            </div>
            <div className="card-body">
              <div className="test-css">
                This should have a red background if CSS is loading
              </div>
              <div className="test-bootstrap">
                This should have a blue background if Bootstrap is loading
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Test Theme Variables */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Theme Variables Test</h5>
            </div>
            <div className="card-body">
              <div style={{ 
                backgroundColor: 'var(--theme-primary)', 
                color: 'white', 
                padding: '1rem', 
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}>
                Primary Theme Color
              </div>
              <div style={{ 
                backgroundColor: 'var(--theme-secondary)', 
                color: 'white', 
                padding: '1rem', 
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}>
                Secondary Theme Color
              </div>
              <div style={{ 
                backgroundColor: 'var(--theme-success)', 
                color: 'white', 
                padding: '1rem', 
                borderRadius: '0.5rem'
              }}>
                Success Theme Color
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SCSSTest;
