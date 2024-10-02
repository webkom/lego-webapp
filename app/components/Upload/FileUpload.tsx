import { Flex, Icon } from '@webkom/lego-bricks';
import { UploadIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import styles from './FileUpload.css';
import { useAppDispatch } from 'app/store/hooks';

type FileUploadProps = {
  uploadFile: (arg0: { file: File }) => Promise<{
    meta: { fileKey: string; fileToken: string };
  }>;
  onChange: (arg0: string, arg1: string) => void;
  className?: string;
};

const FileUpload = ({ uploadFile, onChange }: FileUploadProps) => {
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current && inputRef.current.click();
  };

  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPending(true);
      dispatch(
        uploadFile({ file })
          .then(({ meta }) => {
            setPending(false);
            onChange(meta.fileKey, meta.fileToken);
          })
          .catch((error) => {
            setPending(false);
            throw error;
          }),
      );
    }
  };

  return (
    <Flex justifyContent="center">
      <Icon
        disabled={pending}
        name="upload"
        iconNode={<UploadIcon size={20} />}
        onClick={handleClick}
      />
      <input
        className={styles.input}
        onChange={handleChange}
        type="file"
        accept="application/pdf"
      />
    </Flex>
  );
};

export default FileUpload;
