import { Button, Icon } from '@webkom/lego-bricks';
import { UploadIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { uploadFile } from 'app/actions/FileActions';
import styles from './FileUpload.css';

type FileUploadProps = {
  uploadFile: (arg0: { file: File }) => Promise<{
    meta: { fileKey: string; fileToken: string };
  }>;
  onChange: (arg0: string, arg1: string) => void;
  className?: string;
};

const FileUpload = ({ uploadFile, onChange, className }: FileUploadProps) => {
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current && inputRef.current.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPending(true);
      uploadFile({ file })
        .then(({ meta }) => {
          setPending(false);
          onChange(meta.fileKey, meta.fileToken);
        })
        .catch((error) => {
          setPending(false);
          throw error;
        });
    }
  };

  return (
    <div>
      <Button isPending={pending} onPress={handleClick} className={className}>
        <Icon name="upload" iconNode={<UploadIcon size={24} />} />
      </Button>
      <input
        ref={inputRef}
        className={styles.input}
        onChange={handleChange}
        type="file"
        accept="application/pdf"
      />
    </div>
  );
};

export default connect(null, { uploadFile })(FileUpload);
