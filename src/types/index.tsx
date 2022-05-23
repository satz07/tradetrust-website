import { HostActions } from "@govtechsg/decentralized-renderer-react-components";
export interface TemplateProps {
  id: string;
  label: string;
  type: string;
}

export type TradeTrustErc721EventType = "Transfer" | "Transfer to Wallet" | "Surrender" | "Burnt";

export interface TradeTrustErc721Event {
  eventType: TradeTrustErc721EventType;
  documentOwner: string;
  eventTimestamp?: number;
}

export interface TitleEscrowEvent extends TradeTrustErc721Event {
  beneficiary: string;
  holderChangeEvents: {
    blockNumber: number;
    holder: string;
    timestamp: number;
  }[];
}

export type EndorsementChain = (TradeTrustErc721Event | TitleEscrowEvent)[];

export type Resource = {
  title: string;
  url: string;
  date?: string;
};

export interface PersonaProps {
  personaIndex: number;
  details: Persona;
}

export interface DocumentTypeContentProps {
  documentTypeContent: DocumentTypeContent;
}

export type Persona = {
  image: string;
  jobTitle: string;
  description: string;
  learnMore: {
    title: string;
    startMessage?: string;
    thenSteps?: {
      stepTitle: string;
      icon?: string;
      description: string;
    }[];
    nowSteps?: {
      stepTitle: string;
      icon?: string;
      description: string;
    }[];
    benefits?: { benefitTitle: string; icon: string; description: string }[];
    endMessage: string;
  };
};

export type DocumentTypeContent = {
  type: string;
  description: string;
  examples: string;
  message: string;
  users: Persona[];
};

export enum ContentType {
  BENEFIT = "BENEFIT",
  THEN = "THEN",
  NOW = "NOW",
}

export type Dispatch = (action: HostActions) => void;

export enum GaAction {
  MAGIC_START = "magic_demo_start",
  MAGIC_ISSUE = "magic_demo_issue",
  MAGIC_DOWNLOADED = "magic_demo_downloaded",
  MAGIC_FILE_DROP = "magic_demo_file_drop",
  MAGIC_DROP_OFF = "magic_demo_drop_off",
}

export enum GaCategory {
  MAGIC_DEMO = "magic_demo",
}
