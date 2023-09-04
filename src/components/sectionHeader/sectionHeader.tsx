import classes from "./sectionHeader.module.css";

export default function SectionHeader(props: any) {
  const { text } = props;

  return <h1 className={classes.header}>{text}</h1>;
}
