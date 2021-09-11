import styles from './Button.module.scss';

interface IButtonProps {
  label: string;
  onClick: any;
  className?: string;
}

export const Button: React.FC<IButtonProps> = ({
  label,
  onClick,
  className
}): JSX.Element => {
  return (
    <div className={className}>
      <button onClick={onClick} className={styles.btn}>
        {label}
      </button>
    </div>
  )
}