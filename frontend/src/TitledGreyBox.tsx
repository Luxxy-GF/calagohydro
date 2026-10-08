/* Port of Hydrodactyl elements/TitledGreyBox with Calagopus title-card slots. */
import type { TitleCardProps } from '@/elements/data-display/TitleCard.tsx';

export default function TitledGreyBox({
  title,
  children,
  className,
  icon,
  leftSection,
  rightSection,
  wrapperClassName,
  titleClassName,
  iconClassName,
}: TitleCardProps) {
  return (
    <div className={`hydro-titled-grey-box ${className ?? ''}`}>
      <div className={`hydro-grey-box-title ${titleClassName ?? ''}`}>
        {leftSection}
        {icon && (
          <span className={`hydro-grey-box-icon ${iconClassName ?? ''}`} aria-hidden='true'>
            {icon}
          </span>
        )}
        <h3>{title}</h3>
        {rightSection}
      </div>
      <div className={`w-full h-full ${wrapperClassName ?? ''}`}>{children}</div>
    </div>
  );
}
