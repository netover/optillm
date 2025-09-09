import styled from 'styled-components';

const colors = {
  background: '#e0e5ec',
  lightShadow: '#ffffff',
  darkShadow: '#a3b1c6',
  textColor: '#505050',
  accent: '#2979ff',
};

const commonStyles = `
  border-radius: 20px;
  background: ${colors.background};
  transition: box-shadow 0.3s ease-in-out;
`;

// "Flat" or "Pushed out" style, suitable for cards and containers
export const NeuromorphicCard = styled.div`
  ${commonStyles}
  padding: 20px;
  box-shadow: 9px 9px 16px ${colors.darkShadow}, -9px -9px 16px ${colors.lightShadow};
`;

// "Pressed in" or "Concave" style, suitable for input fields or pressed states
export const NeuromorphicInset = styled.div`
  ${commonStyles}
  padding: 20px;
  box-shadow: inset 7px 7px 15px ${colors.darkShadow}, inset -7px -7px 15px ${colors.lightShadow};
`;

export const NeuromorphicButton = styled.button`
  ${commonStyles}
  border: none;
  outline: none;
  padding: 15px 25px;
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.textColor};
  cursor: pointer;
  box-shadow: 6px 6px 12px ${colors.darkShadow}, -6px -6px 12px ${colors.lightShadow};

  &:hover {
    color: ${colors.accent};
  }

  &:active {
    box-shadow: inset 4px 4px 8px ${colors.darkShadow}, inset -4px -4px 8px ${colors.lightShadow};
  }
`;

// This is a styled div that looks like a switch, not a real input
const SwitchContainer = styled.div`
  ${commonStyles}
  cursor: pointer;
  width: 70px;
  height: 30px;
  position: relative;
  box-shadow: inset 3px 3px 6px ${colors.darkShadow}, inset -3px -3px 6px ${colors.lightShadow};
`;

const SwitchHandle = styled.div`
  ${commonStyles}
  position: absolute;
  top: 4px;
  left: 5px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 3px 3px 6px ${colors.darkShadow}, -3px -3px 6px ${colors.lightShadow};
  transform: ${props => props.checked ? 'translateX(35px)' : 'translateX(0)'};
`;

// A composite component for a toggle switch
export const NeuromorphicSwitch = ({ checked, ...props }) => {
  return (
    <SwitchContainer {...props}>
      <SwitchHandle checked={checked} />
    </SwitchContainer>
  );
};
