import { Helmet } from "react-helmet-async";
import { LendableObjectEditor } from "../LendableObjectEditor";
import { Page } from "@webkom/lego-bricks";

export default function LendingRequestCreate() {
  const title = 'Nytt lån';

  return (
    <Page title={title} back={{ href: `/lending/` }}>
      <Helmet title={title} />
      <LendableObjectEditor
        initialValues={{
          ...objectPermissionsInitialValues,
        }}
      />
    </Page>
  );
}
