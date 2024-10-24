type Props = {
  content: string;
};

/**
 * Takes a string of items than containts \n and splits on that element. Then makes a div which containts a div for each sub string after split.
 * Made to be used with the content of tooltip to display users
 *
 * @param {string} content - A newline-separated string of content. The line to split and make into divzs
 * @returns {JSX.Element} A JSX element containing a div containg divs with each element.
 */
export const ContentList = ({ content }: Props) => {
  const finalContent = content
    .split('\n')
    .map((str) => <div key={str}>{str}</div>);
  return <div>{finalContent}</div>;
};
