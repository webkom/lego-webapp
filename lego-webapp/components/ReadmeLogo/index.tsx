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
        .flatMap((substring, index, splits) =>
          index < splits.length - 1
            ? [substring, <ReadmeLogo key={substring} />]
            : substring,
        )}
    </span>
  );
export default ReadmeLogo;
