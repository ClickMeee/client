import styled from 'styled-components';

export const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 500px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  text-align: center;
  font-size: 1.5rem;
  color: #333;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    font-size: 1rem;
    color: #555;
  }

  input,
  select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
  }
`;

export const GameTypeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  h3 {
    font-size: 1.2rem;
    color: #333;
  }
`;

export const RadioButton = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  input {
    accent-color: #007bff;
  }

  label {
    font-size: 1rem;
    color: #555;
  }
`;

export const SettingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    font-size: 1rem;
    color: #555;
  }

  input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
  }
`;

export const CreateRoomButton = styled.button`
  padding: 15px;
  font-size: 1.2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #0056b3;
  }
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;
