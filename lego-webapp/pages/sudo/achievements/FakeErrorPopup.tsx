import { AlertTriangle } from 'lucide-react';
import win95 from './win95.module.css';

// Real Windows 95/98-era error dialog text, verbatim (or near-verbatim,
// where the exact hex addresses were always machine-specific anyway) -
// not made-up jokes. The title bar is reproduced alongside each one, since
// real GPF/exception dialogs mostly just said "Windows" or named the
// crashing program rather than "Error".
export const FAKE_ERRORS: { title: string; message: string }[] = [
  {
    title: 'Windows',
    message:
      'This program has performed an illegal operation and will be shut down.\n\nIf the problem persists, contact the program vendor.',
  },
  {
    title: 'Windows',
    message:
      'A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36. The current application will be terminated.\n\n* Press any key to terminate the current application.\n* Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.',
  },
  {
    title: 'System Error',
    message: 'Windows Protection Error. You need to restart your computer.',
  },
  {
    title: 'Program Manager',
    message:
      'General Protection Fault: The system has detected that this application has performed an illegal operation. It will now be closed.',
  },
  {
    title: 'Windows',
    message:
      'Not enough memory to complete this operation. Quit one or more programs, and then try again.',
  },
  {
    title: 'Microsoft Word',
    message:
      'Insufficient memory to run this application. Quit one or more applications to increase available memory, and then try again.',
  },
  {
    title: 'Explorer',
    message:
      'Explorer has caused an error in EXPLORER.EXE. Explorer will now close.\n\nIf you continue to experience problems, try restarting your computer.',
  },
  {
    title: 'Dial-Up Networking',
    message:
      'Error 691: Access was denied because the username and/or password was invalid on the domain.',
  },
  {
    title: 'C:\\WINDOWS',
    message: 'Abort, Retry, Fail?',
  },
  {
    title: 'End Program',
    message:
      'This program is not responding.\n\nTo return to Windows and check the status of the program, choose Cancel.\n\nTo close the program that is not responding, choose End Task.',
  },
];

export const FAKE_ERROR_CHANCE = 0.1;

export const FakeErrorPopup = ({
  title,
  message,
  onDismiss,
}: {
  title: string;
  message: string;
  onDismiss: () => void;
}) => (
  <div className={win95.fakeErrorOverlay}>
    <div className={win95.fakeErrorWindow}>
      <div className={win95.titleBar}>
        <span>{title}</span>
        <div className={win95.titleBarButtons}>
          <button className={win95.titleBarButton} onClick={onDismiss}>
            ✕
          </button>
        </div>
      </div>
      <div className={win95.fakeErrorBody}>
        <AlertTriangle size={28} className={win95.fakeErrorIcon} />
        <p className={win95.fakeErrorMessage}>{message}</p>
      </div>
      <div className={win95.fakeErrorFooter}>
        <button className={win95.winButton} onClick={onDismiss}>
          OK
        </button>
      </div>
    </div>
  </div>
);
