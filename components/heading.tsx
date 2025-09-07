interface HeadingProps {
  title: string;
}

const Heading = ({ title }: HeadingProps) => {
  return <h2 className="text-xl font-semibold">{title}</h2>;
};

export default Heading;
