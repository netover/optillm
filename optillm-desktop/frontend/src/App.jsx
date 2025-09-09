import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  NeuromorphicCard,
  NeuromorphicSwitch,
  NeuromorphicInput,
  StyledSlider,
  SliderContainer,
  SliderValue
} from './components/Neuromorphic';

// --- Helper Hook for Debouncing ---
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const socket = io();

// --- Styled Components ---
const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  color: #505050;
  font-weight: 600;
  margin-bottom: 2rem;
  font-size: 1.8rem;
`;

const ConfigSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #6d6d6d;
  margin-bottom: 1rem;
  border-bottom: 1px solid #c8d0e7;
  padding-bottom: 0.5rem;
  text-transform: capitalize;
`;

const SettingRow = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  min-height: 70px;
`;

const SettingLabel = styled.span`
  font-weight: 500;
  text-transform: capitalize;
`;

const StatusBar = styled.div`
  position: fixed;
  bottom: 15px;
  right: 15px;
  padding: 8px 15px;
  border-radius: 10px;
  background-color: ${props => (props.connected ? '#4caf50' : '#f44336')};
  color: white;
  font-size: 0.9rem;
  box-shadow: 3px 3px 8px #a3b1c6, -3px -3px 8px #ffffff;
  transition: background-color 0.5s;
`;

// --- Main App Component ---
function App() {
  const [config, setConfig] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);

  // Effect for initial data load and socket connection status
  useEffect(() => {
    axios.get('/api/config')
      .then(response => setConfig(response.data))
      .catch(error => console.error("Error fetching config:", error));

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onConfigUpdate = (fullConfig) => {
      console.log('Received full config update from server');
      setConfig(full_config);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('config_updated', onConfigUpdate);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('config_updated', onConfigUpdate);
    };
  }, []);

  const handleSettingChange = useCallback((category, setting, value) => {
    // Optimistically update local state for instant UI feedback
    setConfig(prevConfig => {
      const newConfig = JSON.parse(JSON.stringify(prevConfig)); // Deep copy
      newConfig[category][setting] = value;
      return newConfig;
    });

    // The actual update is sent by the debounced effect in the ConfigInput component
  }, []);

  if (!config) {
    return <AppContainer><h1>Loading Configuration...</h1></AppContainer>;
  }

  return (
    <AppContainer>
      <NeuromorphicCard style={{ width: '100%', maxWidth: '700px' }}>
        <Title>OptiLLM Real-time Configurator</Title>
        {Object.entries(config).map(([category, settings]) => (
          <ConfigSection key={category}>
            <SectionTitle>{category.replace(/_/g, ' ')}</SectionTitle>
            {Object.entries(settings).map(([setting, value]) => (
              <SettingRow key={`${category}-${setting}`} layout>
                <SettingLabel>{setting.replace(/_/g, ' ')}</SettingLabel>
                <ConfigInput
                  category={category}
                  setting={setting}
                  value={value}
                  onChange={handleSettingChange}
                />
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

// --- Helper Component for Inputs ---
function ConfigInput({ category, setting, value, onChange }) {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, 500);

  // Effect to push debounced changes to the server
  useEffect(() => {
    // Only send update if the debounced value is different from the original prop value
    if (debouncedValue !== value) {
      const isNumeric = typeof value === 'number';
      const valueToSend = isNumeric ? Number(debouncedValue) : debouncedValue;

      const partialUpdate = { [category]: { [setting]: valueToSend } };
      axios.post('/api/config', partialUpdate)
        .catch(error => console.error("Error updating config:", error));
    }
  }, [debouncedValue, category, setting, value]);

  // Update local state when the global config changes from WebSocket
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    // Optimistic update in parent
    const isNumeric = typeof value === 'number';
    onChange(category, setting, isNumeric ? Number(newValue) : newValue);
  };

  if (typeof value === 'boolean') {
    return (
      <NeuromorphicSwitch
        checked={value}
        onClick={() => {
          const newValue = !value;
          setInputValue(newValue);
          onChange(category, setting, newValue);
        }}
      />
    );
  }

  // Example of using a slider for a specific numeric setting
  if (setting === 'temperature' || setting === 'timeout_seconds') {
    const max = setting === 'temperature' ? 2 : 300;
    const step = setting === 'temperature' ? 0.1 : 1;
    return (
      <SliderContainer>
        <StyledSlider
          min="0"
          max={max}
          step={step}
          value={inputValue}
          onChange={handleChange}
        />
        <SliderValue>{Number(inputValue).toFixed(setting === 'temperature' ? 2 : 0)}</SliderValue>
      </SliderContainer>
    );
  }

  if (typeof value === 'number') {
    return <NeuromorphicInput type="number" value={inputValue} onChange={handleChange} />;
  }

  return <NeuromorphicInput type="text" value={inputValue} onChange={handleChange} />;
}

export default App;
