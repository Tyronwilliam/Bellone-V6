// components/Spinner.tsx

const Spinner = ({
  size = "h-6 w-6",
  color = "text-primary",
}: {
  size?: string;
  color?: string;
}) => {
  return (
    <svg
      className={`animate-spin ${size} ${color}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      fill="none"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
      />
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="6"
        className="opacity-25"
      />
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="opacity-80"
        strokeDasharray="126"
        strokeDashoffset="31.5"
      />
    </svg>
  );
};

export default Spinner;
