import { Modal } from "@webkom/lego-bricks"
import FindTheLogo from "~/components/FindTheLogo"
import styles from "./FindTheLogo.module.css"

const FindTheLogoPage = () => {
  return (
      <Modal isOpen={true} title="Luke 29" contentClassName={styles.modal}><FindTheLogo/></Modal>
  )
}

export default FindTheLogoPage