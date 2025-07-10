export interface Tag {
  ID:   string;
  Name: string;
}

export interface HackingInfo {
  ID:         string;
  Protocol:   string;
  Network:    string;
  Amount:     string;
  TxHash:     string;
  ReportTime: string;
  Tags:       Tag[] | null;
}

export interface TransferInfo {
  ID:         string;
	Token:      string;
	Amount:     string;
	From:		    string;
  To:         string;
  ReportTime: string;
  Tags:       Tag[] | null;
}