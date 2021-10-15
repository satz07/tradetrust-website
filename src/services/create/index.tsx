import { Signer, ContractTransaction, ContractReceipt } from "ethers";
import { DocumentStoreFactory } from "@govtechsg/document-store";
import { getLogger } from "../../utils/logger";
import { isDevelopment } from "../../config";
import { WrappedDocument } from "@govtechsg/open-attestation/dist/types/2.0/types";
import { wrapDocument } from "@govtechsg/open-attestation";
import {
  IdentityProofType,
  Issuer,
  TemplateType,
} from "@govtechsg/open-attestation/dist/types/__generated__/schema.2.0";

const { error } = getLogger("services:create");

export const publishDocument = async (
  documentStoreAddress: string,
  wrappedDocument: WrappedDocument<any>,
  signer: Signer
): Promise<void> => {
  const {
    signature: { targetHash },
  } = wrappedDocument;
  const documentStore = DocumentStoreFactory.connect(documentStoreAddress, signer);
  const contractTransaction: ContractTransaction = await documentStore.issue(`0x${targetHash}`);
  const contractReceipt: ContractReceipt = await contractTransaction.wait();

  if (!contractReceipt.transactionHash)
    throw new Error(`contractReceipt hash not available: ${JSON.stringify(contractReceipt)}`);
};

export const deployDocumentStore = async (signer: Signer, documentStoreName: string): Promise<string> => {
  try {
    const factory = new DocumentStoreFactory(signer);
    const documentStore = await factory.deploy(documentStoreName);
    await documentStore.deployTransaction.wait();

    return documentStore.address;
  } catch (e: any) {
    error(e.message);
    throw new Error(e.message);
  }
};

export const getWrappedDocument = async (
  documentStoreAddress: string,
  formValues: Record<string, any>,
  identityLocation: string
): Promise<WrappedDocument<any>> => {
  const issuers: Issuer[] = [
    {
      name: "Demo Issuer",
      documentStore: documentStoreAddress,
      identityProof: {
        type: "DNS-TXT" as IdentityProofType,
        location: identityLocation,
      },
    },
  ];

  const wrappedDocument = await wrapDocument({
    $template: {
      type: "EMBEDDED_RENDERER" as TemplateType,
      name: "SIMPLE_COO",
      url: "https://generic-templates.tradetrust.io",
    },
    issuers,
    ...formValues,
  });

  return wrappedDocument;
};

export const createTempDns = async (documentStoreAddress: string): Promise<string> => {
  const sandboxEndpoint = `https://sandbox.fyntech.io`;

  try {
    const postRes = await fetch(sandboxEndpoint, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: documentStoreAddress,
        networkId: 3,
      }),
    });

    const { executionId } = await postRes.json();

    let identityLocation;

    /**
     * dns-sandbox only allows requests from dev.tradetrust.io,
     * so we just mock the identity location when testing from localhost
     */
    if (isDevelopment) {
      // wont work for verification
      identityLocation = "random-blue-cat";
    } else {
      const getRes = await fetch(`${sandboxEndpoint}/execution/${executionId}`);
      const { name } = await getRes.json();

      identityLocation = name;
    }

    return identityLocation;
  } catch (e: any) {
    error(e.message);
    throw new Error(e.message);
  }
};

export const getFunds = async (address: string): Promise<void> => {
  await fetch(`https://faucet.openattestation.com/donate/${address}`);
};