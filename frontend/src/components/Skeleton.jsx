const Skeleton = ({ className, style }) => {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}
      style={style}
    ></div>
  );
};

export default Skeleton;
