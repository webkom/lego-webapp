function ReadmeLogo() {
  return (
    <span
      style={{
        fontFamily: 'OCR A Extended',
        fontWeight: '400',
        textTransform: 'lowercase',
      }}
    >
      readme
    </span>
  );
}

export const readmeIfy = (text: string | null | undefined) =>
  text && (
    <span>
      {text
        .split(/readme/)
        .reduce(
          (prev, current, i) =>
            i ? prev.concat(<ReadmeLogo key={current} />, current) : [current],
          []
        )}
    </span>
  );
export default ReadmeLogo;
