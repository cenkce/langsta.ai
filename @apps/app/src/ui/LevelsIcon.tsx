export function LevelsIcon({ level = 1 }: { level?: number; }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#FFEDD5" />
      <path
        d="M24 11L35.2583 17.5V30.5L24 37L12.7417 30.5V17.5L24 11Z"
        stroke={level == 3 ? "#FB923C" : "#FDBA74"}
        strokeWidth="2" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.7417 19.8094V28.1906L24 32.3812L31.2584 28.1906V19.8094L24 15.6188L16.7417 19.8094Z"
        stroke={level == 2 ? "#FB923C" : "#FDBA74"}
        strokeWidth="2" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.7417 22.1196V25.882L24 27.7632L27.2584 25.882V22.1196L24 20.2384L20.7417 22.1196Z"
        stroke={level == 1 ? "#FB923C" : "#FDBA74"}
        strokeWidth="2" />
    </svg>
  );
}
export function IconLevelMid() {
  return <LevelsIcon level={2}></LevelsIcon>;
}
export function IconLevelHigh() {
  return <LevelsIcon level={3}></LevelsIcon>;
}
