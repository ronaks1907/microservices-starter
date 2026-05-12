import { useEffect, useState } from 'react';

const services = [
  { name: 'User Service', id: 'user-service', port: 3001 },
  { name: 'Product Service', id: 'product-service', port: 3002 },
  { name: 'Order Service', id: 'order-service', port: 3003 },
  { name: 'Payment Service', id: 'payment-service', port: 3004 },
  { name: 'Notification Service', id: 'notification-service', port: 3005 }
];

const buildUrl = (port, path) => `http://localhost:${port}${path}`;

function App() {
  const [statusMap, setStatusMap] = useState({});
  const [responseMap, setResponseMap] = useState({});
  const [communication, setCommunication] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    services.forEach((service) => {
      fetch(buildUrl(service.port, '/health'))
        .then((res) => res.json())
        .then((json) => {
          setStatusMap((prev) => ({ ...prev, [service.id]: 'UP' }));
          setResponseMap((prev) => ({ ...prev, [service.id]: json }));
        })
        .catch(() => {
          setStatusMap((prev) => ({ ...prev, [service.id]: 'DOWN' }));
        });
    });
    fetchCommunicationResponses();
  }, []);

  const pingService = async (service) => {
    try {
      const response = await fetch(buildUrl(service.port, '/ping'));
      const data = await response.json();
      setStatusMap((prev) => ({ ...prev, [service.id]: 'UP' }));
      setResponseMap((prev) => ({ ...prev, [service.id]: data }));
    } catch (error) {
      setStatusMap((prev) => ({ ...prev, [service.id]: 'DOWN' }));
      setResponseMap((prev) => ({ ...prev, [service.id]: { error: error.message } }));
    }
  };

  const fetchCommunicationResponses = async () => {
    setLoading(true);
    try {
      const orderResp = await fetch(buildUrl(3003, '/internal')).then((res) => res.json());
      const paymentResp = await fetch(buildUrl(3004, '/internal')).then((res) => res.json());
      setCommunication([
        { title: 'Order Service Communication', data: orderResp },
        { title: 'Payment Service Communication', data: paymentResp }
      ]);
    } catch (error) {
      setCommunication([{ title: 'Communication Error', data: { message: error.message } }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Microservices Dashboard</h1>
        <p>Click a service card to ping that service. The dashboard also shows inter-service communication responses.</p>
      </header>

      <section className="cards-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-header">
              <strong>{service.name}</strong>
              <span className={`status-pill ${statusMap[service.id] === 'UP' ? 'up' : 'down'}`}>
                {statusMap[service.id] || 'UNKNOWN'}
              </span>
            </div>
            <div className="service-body">
              <button onClick={() => pingService(service)}>Ping Service</button>
              <pre>{JSON.stringify(responseMap[service.id] || { message: 'No response yet' }, null, 2)}</pre>
            </div>
          </div>
        ))}
      </section>

      <section className="communication-panel">
        <div className="panel-header">
          <h2>Inter-service Communication</h2>
          <button onClick={fetchCommunicationResponses} disabled={loading}>
            Refresh Communication
          </button>
        </div>
        {communication.map((comm) => (
          <div key={comm.title} className="communication-card">
            <h3>{comm.title}</h3>
            <pre>{JSON.stringify(comm.data, null, 2)}</pre>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
