import styles from './Button.module.scss';

interface IButtonProps {
  label: string;
  onClick: any;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<IButtonProps> = ({
  label,
  onClick,
  className,
  disabled
}): JSX.Element => {
  return (
    <div className={className}>
      <button onClick={onClick} className={styles.btn} disabled={disabled}>
        {label}
      </button>
    </div>
  )
}