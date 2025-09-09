import styled, { css } from 'styled-components';

const colors = {
  background: '#e0e5ec',
  lightShadow: '#ffffff',
  darkShadow: '#a3b1c6',
  textColor: '#505050',
  accent: '#2979ff',
};

// Common styles defined using the `css` helper for reusability
const commonStyles = css`
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

export const NeuromorphicInput = styled.input`
  ${commonStyles}
  border: none;
  outline: none;
  padding: 10px 15px;
  font-size: 1rem;
  color: ${colors.textColor};
  width: 150px;
  box-shadow: inset 4px 4px 8px ${colors.darkShadow}, inset -4px -4px 8px ${colors.lightShadow};

  &::placeholder {
    color: #999;
  }
`;

export const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const StyledSlider = styled.input.attrs({ type: 'range' })`
  -webkit-appearance: none;
  appearance: none;
  width: 120px;
  height: 10px;
  background: ${colors.background};
  outline: none;
  border-radius: 5px;
  box-shadow: inset 2px 2px 4px ${colors.darkShadow}, inset -2px -2px 4px ${colors.lightShadow};

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${colors.background};
    cursor: pointer;
    box-shadow: 3px 3px 6px ${colors.darkShadow}, -3px -3px 6px ${colors.lightShadow};
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${colors.background};
    cursor: pointer;
    box-shadow: 3px 3px 6px ${colors.darkShadow}, -3px -3px 6px ${colors.lightShadow};
  }
`;

export const SliderValue = styled.span`
  font-weight: 500;
  min-width: 40px;
  text-align: right;
`;
