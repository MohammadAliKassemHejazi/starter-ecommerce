import React from 'react';
import Layout from '@/components/Layouts/Layout';

const StyleTest: React.FC = () => {
  return (
    <Layout>
      <div className="container mt-5">
        <h1 className="text-center mb-5">Style Test Page</h1>
        
        {/* Bootstrap Components Test */}
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Bootstrap Card Test</h5>
              </div>
              <div className="card-body">
                <p className="card-text">This is a test card to verify Bootstrap styles are working.</p>
                <button className="btn btn-primary me-2">Primary Button</button>
                <button className="btn btn-secondary me-2">Secondary Button</button>
                <button className="btn btn-success">Success Button</button>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">SCSS Theme Test</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Testing custom SCSS theme variables.</p>
                <div className="alert alert-primary" role="alert">
                  Primary alert with custom theme colors
                </div>
                <div className="alert alert-success" role="alert">
                  Success alert with custom theme colors
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Custom SCSS Classes Test */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Custom SCSS Classes Test</h5>
              </div>
              <div className="card-body">
                <div className="modern-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Test Column 1</th>
                        <th>Test Column 2</th>
                        <th>Test Column 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Test Data 1</td>
                        <td>Test Data 2</td>
                        <td>Test Data 3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Theme Switcher Test */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Theme Switcher Test</h5>
              </div>
              <div className="card-body">
                <p className="card-text">The theme switcher should be visible in the top-right corner.</p>
                <p className="card-text">Try switching between Normal, Black Friday, and Christmas themes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StyleTest;
