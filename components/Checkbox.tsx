import CheckboxIcon from './icons/CheckboxIcon';

type CheckboxProps = {
  checked: boolean;
  onToggle: () => void;
};

export default function Checkbox({ checked, onToggle }: CheckboxProps) {
  return (
    <div
      className={`checkbox${checked ? ' checked' : ''}`}
      data-action="toggle"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-pressed={checked}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggle();
        }
      }}
    >
      <CheckboxIcon />
    </div>
  );
}
