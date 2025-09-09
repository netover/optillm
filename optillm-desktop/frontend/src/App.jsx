import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import axios from 'axios';
import { motion } from 'framer-motion';
import { NeuromorphicCard, NeuromorphicSwitch } from './components/Neuromorphic';

// Setup Socket.IO client
// It will connect to the server that serves the page
const socket = io();

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  color: #505050;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const ConfigSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #6d6d6d;
  margin-bottom: 1rem;
  border-bottom: 1px solid #c8d0e7;
  padding-bottom: 0.5rem;
`;

const SettingRow = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e0e5ec;
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.span`
  font-weight: 500;
`;

const StatusBar = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  padding: 8px 15px;
  border-radius: 10px;
  background-color: ${props => (props.connected ? '#4caf50' : '#f44336')};
  color: white;
  font-size: 0.9rem;
  box-shadow: 3px 3px 8px #a3b1c6, -3px -3px 8px #ffffff;
  transition: background-color 0.5s;
`;

// A helper function to deeply update nested state
const deepSet = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const lastObj = keys.reduce((o, key) => o[key] = o[key] || {}, obj);
  lastObj[lastKey] = value;
  return { ...obj };
};

function App() {
  const [config, setConfig] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);

  // Effect for initial data load and socket connection status
  useEffect(() => {
    // Fetch initial config
    axios.get('/api/config')
      .then(response => setConfig(response.data))
      .catch(error => console.error("Error fetching config:", error));

    // Socket connection events
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // Clean up listeners on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  // Effect for handling real-time config updates from server
  useEffect(() => {
    const handleConfigUpdate = (update) => {
      console.log('Received config update:', update);
      setConfig(prevConfig => {
        // This assumes the update is a partial nested object like { features: { caching_enabled: true } }
        // A more robust solution might need a deep merge utility
        return { ...prevConfig, ...update };
      });
    };

    socket.on('config_updated', handleConfigUpdate);

    return () => {
      socket.off('config_updated', handleConfigUpdate);
    };
  }, []);

  const handleSettingChange = (category, setting, value) => {
    const partialUpdate = { [category]: { [setting]: value } };

    // Optimistically update local state
    setConfig(prevConfig => ({
      ...prevConfig,
      [category]: {
        ...prevConfig[category],
        [setting]: value,
      }
    }));

    // Send update to server
    axios.post('/api/config', partialUpdate)
      .catch(error => {
        console.error("Error updating config:", error);
        // Optionally revert optimistic update here
      });
  };

  if (!config) {
    return <AppContainer><h1>Loading Configuration...</h1></AppContainer>;
  }

  return (
    <AppContainer>
      <NeuromorphicCard style={{ width: '100%', maxWidth: '600px' }}>
        <Title>OptiLLM Real-time Configurator</Title>
        {Object.entries(config).map(([category, settings]) => (
          <ConfigSection key={category}>
            <SectionTitle>{category.replace('_', ' ')}</SectionTitle>
            {Object.entries(settings).map(([setting, value]) => (
              <SettingRow key={setting} layout>
                <SettingLabel>{setting.replace(/_/g, ' ')}</SettingLabel>
                {typeof value === 'boolean' ? (
                  <NeuromorphicSwitch
                    checked={value}
                    onClick={() => handleSettingChange(category, setting, !value)}
                  />
                ) : (
                  <span>{String(value)}</span> // Placeholder for other input types
                )}
              </SettingRow>
            ))}
          </ConfigSection>
        ))}
      </NeuromorphicCard>
      <StatusBar connected={isConnected}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </StatusBar>
    </AppContainer>
  );
}

export default App;
