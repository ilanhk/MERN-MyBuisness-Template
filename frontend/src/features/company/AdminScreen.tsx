import { useState } from 'react';

const AdminScreen = () => {
  const [webTraffic, setWebTraffic] = useState('day');
  const [productAnalytics, setProductAnalytics] = useState('day');
  return (
    <div>
      <h2>Admin Page</h2>
      <div>
        <h3>Web Traffic</h3>
        <p>per: {webTraffic}</p>
      </div>
      <div>
        <h3>Product Analytics</h3>
        <p>per: {productAnalytics}</p>
      </div>
    </div>
  );
};

export default AdminScreen;
