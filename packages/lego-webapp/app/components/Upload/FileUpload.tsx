import { Flex, Icon } from '@webkom/lego-bricks';
import { UploadIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { uploadFile } from 'app/actions/FileActions';
import { useAppDispatch } from 'app/store/hooks';
import styles from './FileUpload.module.css';

type Props = {
  onChange: (fileToken: string) => void;
};

const FileUpload = ({ onChange }: Props) => {
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
      dispatch(uploadFile({ file }))
        .then(({ meta }) => {
          setPending(false);
          onChange(meta.fileToken);
        })
        .catch((error) => {
          setPending(false);
          throw error;
        });
    }
  };

  return (
    <Flex justifyContent="center">
      <Icon
        disabled={pending}
        name="upload"
        onPress={handleClick}
        iconNode={<UploadIcon />}
        size={20}
      />
      <input
        ref={inputRef}
        className={styles.input}
        onChange={handleChange}
        type="file"
        accept="application/pdf"
      />
    </Flex>
  );
};

export default FileUpload;
