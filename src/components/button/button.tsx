import classNames from "classnames";

export const Button = (props: {
  children: any;
  onClick?: any;
  primary?: boolean;
  outline?: boolean;
  small?: boolean;
  type?: "button" | "submit" | "reset";
  ghost?: boolean;
  disabled?: boolean;
  className?: string;
}) => {
  const {
    children,
    onClick,
    primary,
    outline,
    small,
    ghost,
    type = "button",
    className,
    ...rest
  } = props;

  const classes = classNames(
    "btn min-w-fit flex-nowrap whitespace-nowrap flex flex-row",
    {
      "btn-primary": primary,
      "btn-outline": outline,
      "btn-sm": small,
      "btn-ghost": ghost,
      "gap-2": children.length > 1,
    },
    className
  );

  return (
    <button className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};
