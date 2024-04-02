import styled from 'styled-components';

export const InputField = ({
  label,
  type,
  value,
  setValue,
  enabled = true,
  max = 9e99,
  min = -9e99,
  step = 1,
}: {
  max?: number;
  step?: number;
  min?: number;
  label: string;
  type: string;
  value?: string | number;
  setValue: Function;
  enabled: boolean;
}) => {
  return (
    <div className='flex flex-col w-full max-w-[400px]'>
      <div className='mb-[10px] flex justify-start font-normal text-[18px] text-white [text-shadow:4px_4px_0.5px_rgb(0_0_0_/_40%)]'>
        {label}
      </div>
      <InputValue
        min={min}
        max={max}
        step={step}
        placeholder={label}
        type={type}
        disabled={!enabled}
        defaultValue={value}
        onBlur={(e: any) => {
          setValue(e.target.value);
        }}
        onChange={(e: any) => {
          setValue(e.target.value);
        }}
      ></InputValue>
    </div>
  );
};

const InputValue = styled.input`
  display: flex;
  width: 100%;
  height: 50px;
  border-radius: 8px;
  padding: 0px 15px;
  box-sizing: border-box;
  font-size: 1.3rem;
  color: #ffffff;
  background-color: transparent;
  border: 1px solid #444;
  outline: none;
`;
